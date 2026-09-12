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
  OptimizeResult,
  PlanOutput,
  RunOptions,
  SelectedOpportunity,
} from "../types/agent.js"
import type { CrawlResult, GscMetrics, SerpResults } from "../types/market.js"
import { opportunityScore } from "../shared/scoring.js"
import { describeFinding, slugify } from "../shared/text.js"

export class DriverError extends Data.TaggedError("DriverError")<{
  readonly state: string
  readonly reason: string
}> {}

interface KeywordRow {
  readonly id: number
  readonly term: string
  readonly intent: string
  readonly target_url: string | null
}

interface ResearchRow {
  readonly keywordId: number
  readonly term: string
  readonly intent: string
  readonly targetUrl: string
  readonly serp: SerpResults | null
  readonly gsc: GscMetrics | null
  readonly crawl: CrawlResult | null
}

interface RunCarry {
  readonly research: ReadonlyArray<ResearchRow>
  readonly selected: SelectedOpportunity | null
  readonly plan: PlanOutput | null
  readonly change: Change | null
  readonly maxRetries: number
}

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

const EMPTY_CARRY: RunCarry = { research: [], selected: null, plan: null, change: null, maxRetries: 0 }

export type OptimizeEnv =
  | BrainService
  | Database
  | SeoConfig
  | SerpService
  | GscService
  | CrawlService
  | BuildService
  | ValidateService
  | ContentService
  | GithubService

type Snapshot = SnapshotFrom<typeof optimizeMachine>

const stateName = (snapshot: Snapshot): string => String(snapshot.value)

const logTransition = (from: string, event: OptimizeEvent, to: string): Effect.Effect<void> =>
  Effect.log(`optimize: ${from} -> ${to} (${event.type})`)

interface StepResult {
  readonly event: OptimizeEvent
  readonly carry: RunCarry
}

const step = (
  snapshot: Snapshot,
  carry: RunCarry,
  options: RunOptions,
): Effect.Effect<StepResult, unknown, OptimizeEnv> => {
  switch (stateName(snapshot)) {
    case "RESEARCH":
      return Effect.gen(function* () {
        const db = yield* Database
        const serp = yield* SerpService
        const gsc = yield* GscService
        const crawl = yield* CrawlService
        const config = yield* SeoConfig

        const keywords = yield* db.query<KeywordRow>(
          "SELECT id, term, intent, target_url FROM keywords WHERE status = 'active' ORDER BY id",
        )

        const research: Array<ResearchRow> = []
        for (const keyword of keywords) {
          if (!keyword.target_url) continue
          const base = new URL(keyword.target_url, config.gscSiteUrl).href
          const serpRes = yield* serp.fetchResults(keyword.term, "google")
          const gscRes = yield* gsc.fetchMetrics(keyword.term, "28d")
          const crawlRes = yield* crawl.crawlPage(base).pipe(
            Effect.catchCause((cause) =>
              Effect.log(`optimize: crawl skipped for "${keyword.term}": ${String(cause)}`).pipe(
                Effect.andThen(Effect.succeed(null as ResearchRow["crawl"])),
              ),
            ),
          )
          research.push({
            keywordId: keyword.id,
            term: keyword.term,
            intent: keyword.intent,
            targetUrl: keyword.target_url,
            serp: serpRes,
            gsc: gscRes,
            crawl: crawlRes,
          })
          yield* Effect.log(
            `optimize: researched "${keyword.term}" -> pos=${gscRes?.position ?? "?"} impressions=${gscRes?.impressions ?? "?"} crawlTitle="${crawlRes?.title ?? "n/a"}"`,
          )
        }
        return { event: { type: "RESEARCHED" }, carry: { ...carry, research } }
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
            carry,
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
          event: { type: "OPPORTUNITY_SELECTED", opportunityId },
          carry: {
            ...carry,
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
          return { event: { type: "ABORT", reason: "no selection to plan" }, carry }
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
          event: { type: "PLANNED", action: plan.action },
          carry: { ...carry, plan },
        }
      })

    case "ACT":
      return Effect.gen(function* () {
        const brain = yield* BrainService
        const selected = carry.selected
        const plan = carry.plan
        if (!selected || !plan) {
          return { event: { type: "ABORT", reason: "missing selection or plan for ACT" }, carry }
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
        return { event: { type: "EDITED" }, carry: { ...carry, change } }
      })

    case "VALIDATE":
      return Effect.gen(function* () {
        const build = yield* BuildService
        const validate = yield* ValidateService
        const change = carry.change
        if (!change) {
          return { event: { type: "VALIDATION_FAILED", reason: "no change to validate" }, carry }
        }

        const buildResult = yield* build.runBuild({ cwd: REPO_ROOT })
        if (!buildResult.ok) {
          const first = buildResult.errors[0]
          return {
            event: {
              type: "VALIDATION_FAILED",
              reason: first ? `${first.file}: ${first.message}` : "build failed",
            },
            carry,
          }
        }

        const verdict = yield* validate.validateChange(change)
        if (!verdict.pass) {
          return {
            event: { type: "VALIDATION_FAILED", reason: verdict.findings.map(describeFinding).join("; ") },
            carry,
          }
        }

        return { event: { type: "VALIDATION_PASSED" }, carry }
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
          ? { event: { type: "REVIEW_PASSED" }, carry }
          : { event: { type: "REVIEW_FAILED", reason: verdict.reason }, carry }
      })

    case "CREATE_PR":
      return Effect.gen(function* () {
        const selected = carry.selected
        const change = carry.change
        if (!selected || !change) {
          return { event: { type: "ABORT", reason: "no selection or change for PR" }, carry }
        }

        if (options.dryRun) {
          yield* Effect.log("optimize: dry-run — skipping branch/commit/PR")
          return {
            event: { type: "PR_CREATED", prUrl: "https://github.com/placeholder/dry-run" },
            carry,
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

        return { event: { type: "PR_CREATED", prUrl }, carry }
      })

    default:
      return Effect.fail(new DriverError({ state: stateName(snapshot), reason: "no step registered" }))
  }
}

const walk = (
  snapshot: Snapshot,
  retries: number,
  carry: RunCarry,
  prUrl: string | null,
  visited: ReadonlyArray<string>,
  options: RunOptions,
): Effect.Effect<OptimizeResult, DriverError, OptimizeEnv> => {
  const state = stateName(snapshot)
  if (state === "FINISHED") {
    return Effect.succeed({ status: "finished", prUrl: prUrl ?? "none", visited })
  }
  if (state === "ABORTED") {
    return Effect.fail(new DriverError({ state, reason: prUrl ?? "aborted" }))
  }

  return Effect.gen(function* () {
    let event: OptimizeEvent
    let nextRetries = retries
    let nextPrUrl = prUrl
    let nextCarry = carry

    if (state === "REVISE") {
      if (retries >= carry.maxRetries) {
        nextPrUrl = "max retries exceeded"
        event = { type: "ABORT", reason: "max retries exceeded" }
      } else {
        nextRetries = retries + 1
        const brain = yield* BrainService
        const change = carry.change
        const lastReason = snapshot.context.lastReason ?? "validation failed"
        if (change) {
          const revised = yield* brain.revise({ change, lastReason }).pipe(
            Effect.catchCause((cause) =>
              Effect.log(`optimize: revise failed (${String(cause)})`).pipe(
                Effect.andThen(Effect.succeed(change)),
              ),
            ),
          )
          nextCarry = { ...carry, change: revised }
          yield* Effect.log(`optimize: revised change (attempt ${nextRetries}/${carry.maxRetries})`)
        }
        event = { type: "REVISED" }
      }
    } else {
      const output = yield* Effect.result(step(snapshot, carry, options))
      if (Result.isSuccess(output)) {
        const result = output.success
        event = result.event
        nextCarry = result.carry
        if (event.type === "PR_CREATED") {
          nextPrUrl = event.prUrl
        }
      } else {
        const reason = output.failure instanceof DriverError ? output.failure.reason : String(output.failure)
        nextPrUrl = reason
        event = { type: "ABORT", reason }
      }
    }

    const [nextSnapshot] = transition(optimizeMachine, snapshot, event)
    const nextState = stateName(nextSnapshot)
    yield* logTransition(state, event, nextState)
    return yield* walk(nextSnapshot, nextRetries, nextCarry, nextPrUrl, [...visited, state], options)
  })
}

const impl: Optimize = {
  run: (options) =>
    Effect.gen(function* () {
      yield* Effect.log(`optimize run${options.dryRun ? " (dry-run)" : ""}`)
      const initial = getInitialSnapshot(optimizeMachine)
      const nextCarry: RunCarry = { ...EMPTY_CARRY, maxRetries: initial.context.maxRetries }
      const [started] = transition(optimizeMachine, initial, { type: "START" })
      return yield* walk(started, 0, nextCarry, null, [stateName(initial)], options)
    }),
}

export const OptimizeLive: Layer.Layer<OptimizeMachineService> = Layer.succeed(OptimizeMachineService, impl)