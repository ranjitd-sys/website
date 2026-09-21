import { Context, Data, Effect, Layer, Result } from "effect"
import { getInitialSnapshot, transition, type SnapshotFrom } from "xstate"
import type { OptimizeEvent } from "./Machine.js"
import { optimizeMachine } from "./Machine.js"
import { BrainService } from "./brain.js"
import { Database } from "../services/Database.js"
import { SeoConfig } from "../Config.js"
import { SerpService } from "../tools/serp.js"
import { GscService } from "../tools/gsc.js"
import { CrawlService } from "../tools/crawl.js"
import { BuildService, REPO_ROOT } from "../tools/build.js"
import { ValidateService } from "../tools/validate.js"
import { ContentService } from "../tools/content.js"
import { GithubService } from "../tools/github.js"
import type {
  Change,
  DiscoveredKeyword,
  OptimizeResult,
  PlanOutput,
  ResearchRow,
  RunOptions,
  SelectedOpportunity,
} from "../types/agent.js"
import { opportunityScore } from "../shared/scoring.js"
import { describeFinding, isRelevantQuery, slugify } from "../shared/text.js"
import { classifySerpIntent } from "../shared/intent.js"
import { KeywordPlannerService, difficultyOf, stubMonthlySearches } from "../tools/keywordPlanner.js"

export class DriverError extends Data.TaggedError("DriverError")<{
  readonly state: string
  readonly reason: string
}> {}

const DISCOVERY_ROW_LIMIT = 25

const buildPrBody = (selected: SelectedOpportunity, change: Change, plan: PlanOutput | null): string =>
  [
    `## SEO Optimization — ${selected.term}`,
    "",
    `**Target:** ${selected.targetUrl}`,
    `**Opportunity score:** ${selected.score.toFixed(1)}`,
    `**Intent:** ${selected.intent}`,
    "",
    "### Change summary",
    "",
    `- **Title:** ${change.title}`,
    `- **Description:** ${change.description}`,
    `- **JSON-LD:** present`,
    "",
    "### Diagnosis",
    "",
    `> ${plan?.diagnosis ?? "n/a"}`,
    "",
    "### Action",
    "",
    `> ${plan?.action ?? "n/a"}`,
    "",
    "Human review required before merge. DeepRank never merges automatically.",
  ].join("\n")

export interface Optimize {
  readonly run: (options: RunOptions) => Effect.Effect<OptimizeResult, DriverError, OptimizeEnv>
}

export class OptimizeMachineService extends Context.Service<OptimizeMachineService, Optimize>()("Optimize") {}

export type OptimizeEnv =
  | BrainService
  | Database
  | SeoConfig
  | SerpService
  | GscService
  | KeywordPlannerService
  | CrawlService
  | BuildService
  | ValidateService
  | ContentService
  | GithubService

type Snapshot = SnapshotFrom<typeof optimizeMachine>

const stateName = (snapshot: Snapshot): string => String(snapshot.value)

const logTransition = (from: string, event: OptimizeEvent, to: string): Effect.Effect<void> =>
  Effect.log(`optimize: ${from} -> ${to} (${event.type})`)

// GSC returns the "page" dimension as a full URL. Reduce it to the internal URL
// path (must match the `pages.url` rows) so discovery can map queries to pages.
const normalizePagePath = (raw: string): string | null => {
  const value = raw.trim()
  if (value === "") return null
  let path = value
  try {
    if (/^https?:\/\//i.test(value)) path = new URL(value).pathname
  } catch {
    return null
  }
  if (!path.startsWith("/")) path = `/${path}`
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1)
  return path
}

interface StepResult {
  readonly event: OptimizeEvent
}

const step = (
  snapshot: Snapshot,
  options: RunOptions,
): Effect.Effect<StepResult, unknown, OptimizeEnv> => {
  const carry = snapshot.context
  switch (stateName(snapshot)) {
    case "KEYWORD_DISCOVERY":
      return Effect.gen(function* () {
        const gsc = yield* GscService
        const serp = yield* SerpService
        const brain = yield* BrainService
        const planner = yield* KeywordPlannerService
        const db = yield* Database

        const queries = yield* gsc.fetchAllQueries("28d", DISCOVERY_ROW_LIMIT)
        if (queries.length === 0) {
          yield* Effect.log("optimize: gsc returned no query rows — aborting")
          return { event: { type: "ABORT", reason: "gsc returned no queries for keyword discovery" } }
        }

        const seen = new Set<string>()
        const candidates: Array<{ term: string; targetUrl: string; impressions: number; position: number }> = []
        const ranked = [...queries].sort((a, b) => b.impressions - a.impressions)

        for (const row of ranked) {
          const term = row.query.trim()
          if (term === "" || row.impressions <= 0 || seen.has(term)) continue

          // URL comes from GSC's page dimension — never from the DB.
          const targetUrl = normalizePagePath(row.page)
          if (!targetUrl) {
            yield* Effect.log(`optimize: skip discovery of "${term}" (no resolvable page)`)
            continue
          }
          seen.add(term)
          candidates.push({ term, targetUrl, impressions: row.impressions, position: row.position })
        }

        if (candidates.length === 0) {
          yield* Effect.log("optimize: no candidate queries with a resolvable page — aborting")
          return { event: { type: "ABORT", reason: "no candidate queries with a resolvable page" } }
        }

        // One batched LLM relevance gate: the brain reads the query texts and
        // drops vague/noisy/off-domain terms before any SERP/planner spend.
        // Live failure -> deterministic stub rules (never aborts the run).
        const filterOutcome = yield* Effect.result(brain.filterQueries(candidates.map((c) => c.term)))
        let relevantTerms: ReadonlySet<string>
        if (Result.isSuccess(filterOutcome)) {
          const verdicts = new Map(filterOutcome.success.map((r) => [r.term, r.relevant]))
          const missing = candidates.filter((c) => !verdicts.has(c.term))
          if (missing.length > 0) {
            yield* Effect.log(
              `optimize: brain filter omitted ${missing.length} term(s) — keeping them (fail-open)`,
            )
          }
          relevantTerms = new Set(candidates.filter((c) => verdicts.get(c.term) ?? true).map((c) => c.term))
        } else {
          yield* Effect.log(`optimize: brain filter failed (${String(filterOutcome.failure)}) — using deterministic fallback`)
          relevantTerms = new Set(candidates.filter((c) => isRelevantQuery(c.term)).map((c) => c.term))
        }
        const filtered = candidates.filter((c) => relevantTerms.has(c.term))
        for (const skipped of candidates.filter((c) => !relevantTerms.has(c.term))) {
          yield* Effect.log(`optimize: skip discovery of "${skipped.term}" (filtered as irrelevant)`)
        }
        if (filtered.length === 0) {
          yield* Effect.log("optimize: no relevant queries after LLM filter — aborting")
          return { event: { type: "ABORT", reason: "no relevant queries after LLM filter" } }
        }
        yield* Effect.log(`optimize: ${filtered.length}/${candidates.length} queries passed the relevance filter`)

        const plannerOutcome = yield* Effect.result(
          planner.fetchMetrics(filtered.map((c) => c.term), {
            impressionsOf: (term) => filtered.find((c) => c.term === term)?.impressions ?? null,
          }),
        )
        const metricsByTerm = new Map(
          (Result.isSuccess(plannerOutcome) ? plannerOutcome.success : []).map((m) => [m.keyword, m]),
        )
        if (Result.isFailure(plannerOutcome)) {
          yield* Effect.log(`optimize: keyword planner unavailable (${String(plannerOutcome.failure)}) — using stub volume`)
        }

        const discovered: Array<DiscoveredKeyword> = []
        for (const candidate of filtered) {
          const { term, targetUrl, impressions, position } = candidate

          
          const serpRes = yield* serp.fetchResults(term, "google").pipe(
            Effect.catchCause((cause) =>
              Effect.log(`optimize: serp unavailable for "${term}" (${String(cause)}) — classifying from keyword`).pipe(
                Effect.andThen(Effect.succeed(null as DiscoveredKeyword["serp"])),
              ),
            ),
          )
          const outcome = yield* Effect.result(brain.classifyIntent({ keyword: term, serp: serpRes }))
          const intent = Result.isSuccess(outcome) ? outcome.success : classifySerpIntent({ keyword: term, serp: serpRes })
          if (Result.isFailure(outcome)) {
            yield* Effect.log(`optimize: brain intent failed for "${term}" (${String(outcome.failure)}) — using deterministic fallback`)
          }
         

          const metrics = metricsByTerm.get(term)
          const volume = metrics?.avgMonthlySearches ?? stubMonthlySearches(impressions)
          const difficulty = metrics ? difficultyOf(metrics) : null
          const competition = metrics && metrics.competition !== "" ? metrics.competition : null
          const cpcMicros = metrics ? (metrics.averageCpcMicros ?? metrics.lowTopOfPageBidMicros) : null

          const found = yield* db.query<{ id: number }>(
            `INSERT INTO keywords (term, intent, target_url, volume, difficulty, competition, cpc_micros, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
             ON CONFLICT (term)
             DO UPDATE SET
               target_url = EXCLUDED.target_url,
               intent = EXCLUDED.intent,
               volume = COALESCE(EXCLUDED.volume, keywords.volume),
               difficulty = EXCLUDED.difficulty,
               competition = EXCLUDED.competition,
               cpc_micros = EXCLUDED.cpc_micros,
               status = 'active'
             RETURNING id`,
            [term, intent, targetUrl, volume, difficulty, competition, cpcMicros],
          )
          const keywordId = found[0]?.id ?? 0
          if (keywordId === 0) {
            yield* Effect.log(`optimize: skip discovery of "${term}" (keyword upsert returned no id)`)
            continue
          }

          yield* db.query(
            `INSERT INTO pages (url, intent, status) VALUES ($1, $2, 'active')
             ON CONFLICT (url) DO UPDATE SET status = 'active', intent = EXCLUDED.intent`,
            [targetUrl, intent],
          )

          discovered.push({ keywordId, term, intent, targetUrl, serp: serpRes })
          yield* Effect.log(
            `optimize: discovered "${term}" (impressions=${impressions}, pos=${position}) -> ${targetUrl} (intent=${intent}, from brain; volume=${volume ?? "?"})`,
          )
        }

        if (discovered.length === 0) {
          yield* Effect.log("optimize: no discoverable queries with a resolvable page — aborting")
          return { event: { type: "ABORT", reason: "no discoverable queries with a resolvable page" } }
        }

        yield* Effect.log(`optimize: discovered ${discovered.length} keyword(s) -> researching`)
        return { event: { type: "DISCOVERED", keywords: discovered } }
      })

    case "RESEARCH":
      return Effect.gen(function* () {
        const serp = yield* SerpService
        const gsc = yield* GscService
        const crawl = yield* CrawlService
        const config = yield* SeoConfig

        const research: Array<ResearchRow> = []
        for (const keyword of carry.keywords) {
          if (keyword.keywordId <= 0 || !keyword.targetUrl) continue
          // yield* Effect.log('Basee', keyword.targetUrl, config.gscSiteUrl)
          const base = new URL(keyword.targetUrl, config.siteOrigin).href
          const serpRes = keyword.serp ?? (yield* serp.fetchResults(keyword.term, "google"))
          const gscRes = yield* gsc.fetchMetrics(keyword.term, "28d")
          const crawlRes = yield* crawl.crawlPage(base).pipe(
            Effect.catchCause((cause) =>
              Effect.log(`optimize: crawl skipped for "${keyword.term}": ${String(cause)}`).pipe(
                Effect.andThen(Effect.succeed(null as ResearchRow["crawl"])),
              ),
            ),
          )
          research.push({
            keywordId: keyword.keywordId,
            term: keyword.term,
            intent: keyword.intent,
            targetUrl: keyword.targetUrl,
            serp: serpRes,
            gsc: gscRes,
            crawl: crawlRes,
          })
          yield* Effect.log(
            `optimize: researched "${keyword.term}" -> pos=${gscRes?.position ?? "?"} impressions=${gscRes?.impressions ?? "?"} crawlTitle="${crawlRes?.title ?? "n/a"}"`,
          )
        }
        return { event: { type: "RESEARCHED", research } }
      })

    case "SCOPE":
      return Effect.gen(function* () {
        const db = yield* Database

        const done = yield* db.query<{ keyword_id: number }>(
          "SELECT DISTINCT keyword_id FROM opportunities WHERE status IN ('done', 'measured', 'optimizing')",
        )
        const doneKeywords = new Set(done.map((row) => row.keyword_id))
        const openPr = yield* db.query<{ page_id: number }>(
          `SELECT DISTINCT o.page_id
             FROM opportunities o
             JOIN changes c ON c.opportunity_id = o.id
            WHERE c.pr_url IS NOT NULL AND c.deployed_at IS NULL`,
        )
        const openPrPages = new Set(openPr.map((row) => row.page_id))
        const pageId = yield* db.query<{ id: number; url: string }>("SELECT id, url FROM pages")

        const eligible = carry.research.filter((row) => {
          if (doneKeywords.has(row.keywordId)) return false
          const page = pageId.find((p) => p.url === row.targetUrl)
          if (page && openPrPages.has(page.id)) return false
          if (row.gsc === null) return false
          if (row.gsc.position <= 3 && row.gsc.ctr >= 0.03) return false
          return row.serp !== null && row.serp.results.length > 0
        })

        if (eligible.length === 0) {
          yield* Effect.log("optimize: no eligible opportunity after filters")
          return {
            event: { type: "ABORT", reason: "no eligible opportunity after filters" },
          }
        }

        const ranked = [...eligible].sort((a, b) => opportunityScore(b.intent, b.gsc) - opportunityScore(a.intent, a.gsc))
        const winner = ranked[0]!
        const winnerScore = opportunityScore(winner.intent, winner.gsc)
        const page = pageId.find((p) => p.url === winner.targetUrl)

        let opportunityId: number
        if (page) {
          const inserted = yield* db.query<{ id: number }>(
            `INSERT INTO opportunities (keyword_id, page_id, action, justification, score, status)
             VALUES ($1, $2, $3, $4, $5, 'proposed')
             RETURNING id`,
            [winner.keywordId, page.id, "optimize metadata", `highest priority score ${winnerScore.toFixed(1)}`, winnerScore],
          )
          opportunityId = inserted[0]?.id ?? 0
        } else {
          opportunityId = 0
        }

        yield* Effect.log(
          `optimize: selected "${winner.term}" (score=${winnerScore.toFixed(1)}) -> ${winner.targetUrl} (opportunity=${opportunityId})`,
        )

        return {
          event: {
            type: "OPPORTUNITY_SELECTED",
            opportunityId,
            selected: {
              keywordId: winner.keywordId,
              opportunityId,
              term: winner.term,
              targetUrl: winner.targetUrl,
              score: winnerScore,
              intent: winner.intent,
            },
          },
        }
      })

    case "PLAN":
      return Effect.gen(function* () {
        const brain = yield* BrainService
        const db = yield* Database
        const selected = carry.selected
        const research = carry.research.find((row) => row.keywordId === selected?.keywordId)
        if (!selected || !research) {
          return { event: { type: "ABORT", reason: "no selection to plan" } }
        }
        const crawl =
          research.crawl === null
            ? null
            : { title: research.crawl.title, description: research.crawl.description }
        const serp = research.serp && research.serp.results.length > 0 ? research.serp : null
        const gsc =
          research.gsc === null
            ? null
            : { impressions: research.gsc.impressions, position: research.gsc.position, ctr: research.gsc.ctr }
        const recentLearnings = yield* db.query<{ content: string }>(
          `SELECT content FROM learnings ORDER BY created_at DESC LIMIT 5`,
        )
        const plan = yield* brain.plan({
          keyword: selected.term,
          intent: selected.intent,
          crawl,
          serp,
          gsc,
          learnings: recentLearnings.map((row) => row.content),
        })
        yield* Effect.log(`optimize: plan -> ${plan.action}`)
        return {
          event: { type: "PLANNED", action: plan.action, plan },
        }
      })

    case "ACT":
      return Effect.gen(function* () {
        const brain = yield* BrainService
        const selected = carry.selected
        const plan = carry.plan
        if (!selected || !plan) {
          return { event: { type: "ABORT", reason: "missing selection or plan for ACT" } }
        }
        const research = carry.research.find((row) => row.keywordId === selected.keywordId)
        const crawl =
          research?.crawl === null || research?.crawl === undefined
            ? null
            : { title: research.crawl.title, description: research.crawl.description }
        const change = yield* brain.act({
          keyword: selected.term,
          targetUrl: selected.targetUrl,
          crawl,
          diagnosis: plan.diagnosis,
          action: plan.action,
          rationale: plan.rationale,
        })
        yield* Effect.log(`optimize: wrote change -> ${change.filePath} (title="${change.title}")`)
        return { event: { type: "EDITED", change } }
      })

    case "VALIDATE":
      return Effect.gen(function* () {
        const build = yield* BuildService
        const validate = yield* ValidateService
        const change = carry.change
        if (!change) {
          return { event: { type: "VALIDATION_FAILED", reason: "no change to validate" } }
        }

        const buildResult = yield* build.runBuild({ cwd: REPO_ROOT })
        if (!buildResult.ok) {
          const first = buildResult.errors[0]
          return {
            event: {
              type: "VALIDATION_FAILED",
              reason: first ? `${first.file}: ${first.message}` : "build failed",
            },
          }
        }

        const verdict = yield* validate.validateChange(change)
        if (!verdict.pass) {
          return {
            event: { type: "VALIDATION_FAILED", reason: verdict.findings.map(describeFinding).join("; ") },
          }
        }

        return { event: { type: "VALIDATION_PASSED" } }
      })

    case "REVIEWER":
      return Effect.gen(function* () {
        const brain = yield* BrainService
        const selected = carry.selected
        const change = carry.change
        const review = change
          ? {
              title: change.title,
              description: change.description,
              diffSummary: `metadata change for ${selected?.targetUrl ?? "unknown page"}`,
            }
          : {
              title: "no change",
              description: "dry-run",
              diffSummary: "no change (dry-run)",
            }
        const verdict = yield* brain.review(review).pipe(
          Effect.catchCause((cause) =>
            Effect.succeed({
              verdict: "fail" as const,
              reason: `reviewer unavailable: ${String(cause)}`,
            }),
          ),
        )
        return verdict.verdict === "pass"
          ? { event: { type: "REVIEW_PASSED" } }
          : { event: { type: "REVIEW_FAILED", reason: verdict.reason } }
      })

    case "CREATE_PR":
      return Effect.gen(function* () {
        const selected = carry.selected
        const change = carry.change
        if (!selected || !change) {
          return { event: { type: "ABORT", reason: "no selection or change for PR" } }
        }

        if (options.dryRun) {
          yield* Effect.log("optimize: dry-run — skipping branch/commit/PR")
          return {
            event: { type: "PR_CREATED", prUrl: "https://github.com/placeholder/dry-run" },
          }
        }

        const github = yield* GithubService
        const content = yield* ContentService
        const db = yield* Database

        const branch = `seo/${slugify(selected.targetUrl)}-${slugify(selected.term)}`
        const applied = yield* content.applyChange({
          filePath: change.filePath,
          title: change.title,
          description: change.description,
          jsonLd: change.jsonLd,
        })
        const result = yield* github.createBranch(branch)
        yield* github.commit({
          branch: result,
          filePath: applied.filePath,
          content: applied.content,
          message: `SEO: optimize metadata for "${selected.term}"`,
        })
        const prUrl = yield* github.createPR({
          branch: result,
          title: `SEO: better metadata for "${selected.term}"`,
          body: buildPrBody(selected, change, carry.plan),
        })

        if (selected.opportunityId > 0) {
          yield* db.query(
            `UPDATE opportunities SET status = 'optimizing' WHERE id = $1`,
            [selected.opportunityId],
          )
          yield* db.query(
            `INSERT INTO changes (opportunity_id, branch, pr_url, diff_summary)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (opportunity_id) DO UPDATE SET branch = EXCLUDED.branch, pr_url = EXCLUDED.pr_url, diff_summary = EXCLUDED.diff_summary`,
            [
              selected.opportunityId,
              result,
              prUrl,
              `metadata for "${selected.term}" -> ${selected.targetUrl} (title ${Array.from(change.title).length}c, desc ${Array.from(change.description).length}c, jsonLd ${Array.from(change.jsonLd).length}c)`,
            ],
          )
          const research = carry.research.find((row) => row.keywordId === selected.keywordId)
          if (research?.gsc) {
            yield* db.query(
              `INSERT INTO keyword_positions (keyword_id, sample_date, position, clicks, impressions, ctr)
               VALUES ($1, now(), $2, $3, $4, $5)`,
              [
                selected.keywordId,
                Math.max(research.gsc.position, 1),
                research.gsc.clicks ?? 0,
                research.gsc.impressions,
                research.gsc.ctr,
              ],
            )
          }
          yield* Effect.log(`optimize: recorded opportunity ${selected.opportunityId} + changes row + baseline`)
        } else {
          yield* Effect.log("optimize: no opportunity row to link (page not found); PR still opened")
        }

        return { event: { type: "PR_CREATED", prUrl } }
      })

    default:
      return Effect.fail(new DriverError({ state: stateName(snapshot), reason: "no step registered" }))
  }
}

const walk = (
  snapshot: Snapshot,
  visited: ReadonlyArray<string>,
  options: RunOptions,
): Effect.Effect<OptimizeResult, DriverError, OptimizeEnv> => {
  const state = stateName(snapshot)
  if (state === "FINISHED") {
    return Effect.succeed({
      status: "finished",
      prUrl: snapshot.context.prUrl ?? "none",
      visited,
    })
  }
  if (state === "ABORTED") {
    return Effect.fail(new DriverError({ state, reason: snapshot.context.lastReason ?? "aborted" }))
  }

  return Effect.gen(function* () {
    let event: OptimizeEvent

    if (state === "REVISE") {
      if (snapshot.context.retries >= snapshot.context.maxRetries) {
        event = { type: "ABORT", reason: "max retries exceeded" }
      } else {
        const brain = yield* BrainService
        const change = snapshot.context.change
        const lastReason = snapshot.context.lastReason ?? "validation failed"
        if (change) {
          const revised = yield* brain.revise({ change, lastReason }).pipe(
            Effect.catchCause((cause) =>
              Effect.log(`optimize: revise failed (${String(cause)})`).pipe(
                Effect.andThen(Effect.succeed(change)),
              ),
            ),
          )
          event = { type: "REVISED", change: revised }
          yield* Effect.log(
            `optimize: revised change (attempt ${snapshot.context.retries + 1}/${snapshot.context.maxRetries})`,
          )
        } else {
          event = { type: "REVISED" }
        }
      }
    } else {
      const output = yield* Effect.result(step(snapshot, options))
      if (Result.isSuccess(output)) {
        event = output.success.event
      } else {
        const reason = output.failure instanceof DriverError ? output.failure.reason : String(output.failure)
        event = { type: "ABORT", reason }
      }
    }

    const [nextSnapshot] = transition(optimizeMachine, snapshot, event)
    const nextState = stateName(nextSnapshot)
    yield* logTransition(state, event, nextState)
    return yield* walk(nextSnapshot, [...visited, state], options)
  })
}

const impl: Optimize = {
  run: (options) =>
    Effect.gen(function* () {
      yield* Effect.log(`optimize run${options.dryRun ? " (dry-run)" : ""}`)
      const initial = getInitialSnapshot(optimizeMachine)
      const [started] = transition(optimizeMachine, initial, { type: "START" })
      return yield* walk(started, [stateName(initial)], options)
    }),
}

export const OptimizeLive: Layer.Layer<OptimizeMachineService> = Layer.succeed(OptimizeMachineService, impl)