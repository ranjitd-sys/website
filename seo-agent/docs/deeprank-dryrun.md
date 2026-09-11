# DeepRank — Dry-Run Walkthrough

> Annotated trace of `bun run src/cli.ts optimize --dry-run`.
> Companion to `deeprank-seo-agent.md` (spec), `deeprank-execution-plan.md` (plan) and `deeprank-budget.md` (budget).
> Last updated: 2026-09-11 · status: matches current code (P3, Day 2)

---

## 1. The Three Layers

```
┌──────────────────────────────────────────────────────────────┐
│  CLI (cli.ts)                                                │
│  Entry point. Reads env config, provides all service layers, │
│  calls optimizer.run({ dryRun }).                            │
└───────────────────────────┬──────────────────────────────────┘
                            │  run({ dryRun: true })
┌───────────────────────────▼──────────────────────────────────┐
│  MACHINE (Machine.ts)                                        │
│  Pure state-transition table. No logic, no side effects.     │
│  "In state X, on event Y → go to state Z (and update ctx)"  │
└───────────────────────────┬──────────────────────────────────┘
                            │  transition(machine, snapshot, event)
┌───────────────────────────▼──────────────────────────────────┐
│  DRIVER (Driver.ts)                                          │
│  Interpreter. At each state, calls tools, produces the next  │
│  event, feeds it back to the machine, recurses.              │
│  Data between states travels via the `RunCarry` payload.     │
└───────────────────────────┬──────────────────────────────────┘
                            │  yield* ServiceTag.method()
┌───────────────────────────▼──────────────────────────────────┐
│  TOOLS (serp / gsc / crawl / build / validate)               │
│  Effect services resolved from the provided layers.          │
│  The only places that touch the outside world.               │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Dependency Injection (Layer Stack)

`cli.ts` builds the program by stacking layers. **Inner layers win.** The Driver itself is a layer too.

```ts
optimize.pipe(
  Effect.provide(ValidateServiceLive), // innermost — wins on conflict
  Effect.provide(BuildServiceLive),
  Effect.provide(CrawlServiceLive),    // real HTTP fetch
  Effect.provide(GscServiceLive),      // stub metrics
  Effect.provide(SerpServiceLive),     // mock SERP
  Effect.provide(DatabaseLive),        // pg pool, needs SeoConfig
  Effect.provide(ReviewerLive),
  Effect.provide(OptimizeLive),        // the Driver implementation
  Effect.provide(SeoConfigLayer),      // outermost — env vars
)
```

How a tool is resolved during a run:

```
Driver: yield* Database        → runtime looks up "Database" in the layers
                                 → finds DatabaseLive → returns the object
Driver: db.query("SELECT …")   → Effect runs the SQL, returns the rows
```

Tools never construct each other. Each one is a `Context.Service` tag plus a `Layer.succeed(...)`
implementation (see §3 of this doc for each tool's contract).

---

## 3. The Tools

| Tool | File | Role | Real / Stub | Contract |
|---|---|---|---|---|
| `SerpService` | `src/tools/serp.ts` | Top-10 competitor results per keyword | mock table (`.example` domains) | `fetchResults(keyword, "google") → { results: [{rank, url, title, snippet}] }` |
| `GscService` | `src/tools/gsc.ts` | Position / clicks / impressions / ctr + 4-point trend | stub table for the 5 seed keywords | `fetchMetrics(query, "28d") → { clicks, impressions, position, ctr, trend[] }` |
| `CrawlService` | `src/tools/crawl.ts` | Live page audit | real `fetch` + `node-html-parser` | `crawlPage(url) → { title, description, h1, jsonLdBlocks, internalLinks, brokenLinks }` |
| `BuildService` | `src/tools/build.ts` | Compiler safety gate | real child process | `runBuild({ cwd }) → { ok, errors: [{file, message}] }` (spawns `astro build`) |
| `ValidateService` | `src/tools/validate.ts` | Metadata quality gate | pure code | `validateChange(change) → { pass, findings: [{field, message}] }` (title ≤60, desc 120–160, JSON-LD parses) |

All five return `Effect<Output, ToolError>`. The stub/mock SERP and GSC bodies are placeholders —
the real Serper.dev / GSC-API wiring only replaces the method body; the contracts stay fixed.

---

## 4. The State Machine

States (from `Machine.ts`):

```
IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED
                                          ↑  │                ↑
                                          └──┴──── REVISE ────┘      ABORTED (final)
```

Transition table:

| From | Event | To | Context assign |
|---|---|---|---|
| IDLE | `START` | RESEARCH | — |
| RESEARCH | `RESEARCHED` | SCOPE | — |
| SCOPE | `OPPORTUNITY_SELECTED { opportunityId }` | PLAN | `opportunityId` |
| PLAN | `PLANNED { action }` | ACT | — |
| ACT | `EDITED` | VALIDATE | — |
| VALIDATE | `VALIDATION_PASSED` | REVIEWER | — |
| VALIDATE | `VALIDATION_FAILED { reason }` | REVISE | `lastReason` |
| REVISE | `REVISED` | VALIDATE | — |
| REVIEWER | `REVIEW_PASSED` | CREATE_PR | — |
| REVIEWER | `REVIEW_FAILED { reason }` | REVISE | `lastReason` |
| CREATE_PR | `PR_CREATED { prUrl }` | FINISHED | — |
| any | `ABORT { reason }` | FINISHED / ABORTED | — |

Machine context (audit-only; all business data rides in the carry):

```ts
{ retries: 0, maxRetries: 3, opportunityId: null, lastReason: null }
```

The REVISE loop is bounded: `walk()` watches the retry counter and emits `ABORT` at
`maxRetries` instead of looping forever. This is the retry path Day 3 wires to the LLM —
today VALIDATE passes on the stub change, so it is never exercised.

---

## 5. The RunCarry (Data Bus)

```ts
interface RunCarry {
  research: ResearchRow[]                       // written in RESEARCH, read in SCOPE
  selected: SelectedOpportunity | null          // written in SCOPE, read in ACT/VALIDATE/REVIEWER
  change: Change | null                         // written in ACT,  read in VALIDATE/REVIEWER
  maxRetries: number                            // from machine context
}
```

Each state hands back `{ event, carry }`. `walk()` threads the new carry into the next
state. The machine context only tracks `opportunityId` + `lastReason`; everything else
moves through the carry.

---

## 6. The Complete Trace

Real log output, annotated. Command:

```bash
cd seo-agent
bun run src/cli.ts optimize --dry-run
```

```
[14:09:04.869] INFO config loaded { databaseUrl, gscSiteUrl, … }
[14:09:04.870] INFO optimize run (dry-run)
```

### 6.1 IDLE → RESEARCH

`getInitialSnapshot(machine)` → IDLE → `transition(…, START)` → RESEARCH. `walk` begins.
`visited = ["IDLE"]`.

### 6.2 RESEARCH → (tools) → SCOPE

Driver reads all active keywords from the DB, then for each keyword runs SERP + GSC + Crawl.
Crawl failures are tolerated (`catchCause` → `null`); the row is still kept.

Seed keywords and their live crawl results:

| # | keyword | intent | target_url (→ resolved URL) | crawl title | h1 | jsonLd |
|---|---|---|---|---|---|---|
| 1 | ecommerce accounting software india | commercial | /resources/ecommerce-accounting | "Ecommerce Accounting — From one order to ERP-ready entries" | "Ecommerce accounting, in full." | 0 |
| 2 | amazon seller gst accounting | commercial | /solutions/amazon-sellers | "Amazon Sellers — Profitability, Reconciliation & Accounting" | "Run your Amazon business with clarity." | 0 |
| 3 | flipkart payment reconciliation | commercial | /resources/reconciliation | "Payment Reconciliation — Expected, settled and received" | "Payment reconciliation, demystified." | 0 |
| 4 | ecommerce accounting tally | commercial | /erp-connector/accounting | "Ecommerce Accounting & ERP Automation" | "Every ecommerce transaction. Accounted for." | 1 |
| 5 | d2c brand accounting | transactional | /solutions/d2c-brands | "D2C Brands — Run Every Channel From One Platform" | "All your ecommerce channels. One platform." | 0 |

GSC stub metrics per keyword (falling position = improving rank):

| keyword | impressions | position | ctr | trend (d1/7/14/28) |
|---|---|---|---|---|
| ecommerce accounting software india | 1200 | 7.2 | 0.0375 | [8.0, 7.5, 7.2, 7.2] |
| amazon seller gst accounting | 5000 | 4.1 | 0.024 | [6.0, 5.0, 4.5, 4.1] |
| flipkart payment reconciliation | 800 | 12.3 | 0.01875 | [14.0, 13.0, 12.5, 12.3] |
| ecommerce accounting tally | 900 | 9.8 | 0.033 | [10.0, 10.0, 9.8, 9.8] |
| d2c brand accounting | 400 | 15.1 | 0.02 | [16.0, 15.5, 15.2, 15.1] |

SERP mock returns 10 competitor rows per keyword (elided here; they only gate the
"has competitor data" filter).

SCOPE then runs the four filters (spec §11) against every research row:

1. keyword already in `opportunities` with status done/measured/optimizing → skip
2. page has an open PR (`changes.pr_url IS NOT NULL AND deployed_at IS NULL`) → skip
3. stable top-3 (`position ≤ 3 && ctr ≥ 0.03`) → protect, skip
4. missing data (`gsc === null` or empty SERP) → skip

All 5 rows pass → ranked by `score()` → winner emitted as `OPPORTUNITY_SELECTED`.

### 6.3 The Scoring Formula

Driver.ts lines 83–105:

```ts
const INTENT_WEIGHT = { commercial: 1.0, transactional: 0.9, informational: 0.5 }

const momentumMultiplier = (trend): number => {
  const improvement = (trend[0] - trend[last]) / trend[0]   // position delta over 28d
  if (improvement >= 0.3) return 1.6   // rising fast
  if (improvement >= 0.1) return 1.3   // rising
  if (improvement <= -0.05) return 0.6 // falling
  return 1.0                           // flat
}

const score = (row): number =>
  impressions × position × intentWeight × momentumMultiplier
```

Per keyword:

| keyword | impressions | position | intent weight | momentum | momentum math | score |
|---|---|---|---|---|---|---|
| ecommerce accounting software india | 1200 | 7.2 | 1.0 | 1.3 | (8.0−7.2)/8.0 = 0.10 | 11,232 |
| **amazon seller gst accounting** | **5000** | **4.1** | **1.0** | **1.6** | (6.0−4.1)/6.0 = 0.316 | **32,800** |
| flipkart payment reconciliation | 800 | 12.3 | 1.0 | 1.3 | (14.0−12.3)/14.0 = 0.121 | 12,792 |
| ecommerce accounting tally | 900 | 9.8 | 1.0 | 1.0 | (10.0−9.8)/10.0 = 0.02 | 8,820 |
| d2c brand accounting | 400 | 15.1 | 0.9 | 1.0 | (16.0−15.1)/16.0 = 0.056 | 5,436 |

Winner: **amazon seller gst accounting — 32,800**. The driver inserts an
`opportunities` row (`status 'proposed'`), assigns `context.opportunityId`, and carries
the selection forward.

```
[14:09:35.536] INFO RESEARCH -> SCOPE (RESEARCHED)
[14:09:35.557] INFO optimize: selected "amazon seller gst accounting" (score=32800.0) -> /solutions/amazon-sellers (opportunity=3)
[14:09:35.557] INFO SCOPE -> PLAN (OPPORTUNITY_SELECTED)
```

> `opportunity=3` is a DB-assigned id — ids 1–2 were consumed by earlier dev runs.

### 6.4 PLAN → ACT (stub change)

PLAN is a deterministic stub (`PLANNED { action: "optimize metadata" }`). ACT builds the
`Change` for the winner:

```
filePath:    src/pages/solutions/amazon-sellers.astro
title:       "Optimize amazon seller gst accounting"                    (36 chars ≤ 60 ✓)
description: shortTrack padded until within 120–160 chars              (146 chars ✓)
jsonLd:      {"@context":"https://schema.org","@type":"Article","headline":…}   (parses ✓)
```

Description assembly: start at 88 chars, append
`" Reconcile payments and get ERP-ready accounting automatically."` once → 146 chars,
206 stays under the 160 cap. On Day 3 this state is replaced by the LLM brain
(`prompts.ts` + `brain.ts`).

```
[14:09:35.557] INFO PLAN -> ACT (PLANNED)
[14:09:35.558] INFO optimize: wrote change -> src/pages/solutions/amazon-sellers.astro (title="Optimize amazon seller gst accounting")
[14:09:35.558] INFO ACT -> VALIDATE (EDITED)
```

### 6.5 VALIDATE (real tools)

Two independent gates, both real today:

1. **BuildService** — spawns `astro build` in the repo root: `ok=true errors=0`.
2. **ValidateService** — pure code: title ≤60 ✓, description 120–160 ✓, JSON-LD parses ✓.

```
[14:09:35.558] INFO build: astro build (cwd=/home/ranjit/Documents/deepecom/website_2)
[14:09:47.689] INFO build: ok=true errors=0
[14:09:47.689] INFO validate: src/pages/solutions/amazon-sellers.astro
[14:09:47.690] INFO validate: pass=true findings=0
[14:09:47.690] INFO VALIDATE -> REVIEWER (VALIDATION_PASSED)
```

### 6.6 REVIEWER → CREATE_PR → FINISHED

Reviewer (currently a pass-through stub) approves; CREATE_PR is a stub that returns a
placeholder URL; the machine reaches the `FINISHED` final state.

```
[14:09:47.690] INFO reviewer: reviewing "Optimize amazon seller gst accounting" (1 diff lines)
[14:09:47.691] INFO REVIEWER -> CREATE_PR (REVIEW_PASSED)
[14:09:47.691] INFO CREATE_PR -> FINISHED (PR_CREATED)
[14:09:47.691] INFO optimize finished: visited IDLE -> RESEARCH -> SCOPE -> PLAN -> ACT -> VALIDATE -> REVIEWER -> CREATE_PR (pr: https://github.com/placeholder/dry-run)
```

`walk()` returns `{ status: "finished", prUrl, visited }` → `runProgram` writes the final
log line → exit code 0. Dry-run semantics: **no files are modified** — the change is
synthesized in memory and only the `opportunities` row is persisted (mirrors a real run).

---

## 7. Failure Handling

Every `step()` returns `Effect<StepResult, unknown, OptimizeEnv>`. `walk()` wraps the call in
`Effect.result` and converts any failure into an `ABORT` event, so an exception in any state
never leaves the machine hanging — it terminates cleanly at a final state.

| Terminal state | Meaning |
|---|---|
| `FINISHED` | Server ran through PR creation |
| `ABORTED` | A step failed, REVISE exhausted retries, or `ABORT` emitted from any state |

REVISE is the retry loop: on `VALIDATION_FAILED` or `REVIEW_FAILED` the machine returns to
`VALIDATE` via `REVISE`, incrementing `context.retries`. At `maxRetries` (3) the driver
emits `ABORT` instead. Today the stub change always passes, so the loop is dormant until
the LLM author joins in Day 3.

---

## 8. What Is Real vs What Is a Placeholder

| Piece | Today (Day 2) | Day 3+ |
|---|---|---|
| DB keywords / pages | seeded 5 + 5 | GSC-discovered keywords (see below) |
| Keyword sourcing | DB only | DB + GSC Search Analytics queries |
| SERP | mock table (`.example`) | Serper.dev |
| GSC metrics | stub table | Search Console API |
| Crawl | real `fetch` + parse | same |
| Build | real `astro build` | same |
| Validate | real rules | same |
| PLAN / ACT / REVISE | deterministic stubs | LLM (`prompts.ts`, `brain.ts`) |
| Reviewer | pass-through stub | rule-checked LLM reviewer |
| CREATE_PR | placeholder URL | `github.ts` via Octokit |

### GSC keyword discovery (future)

GSC returns **both** the query and the page Google ranks for it. A keyword can therefore
bootstrap itself: `fetchAllQueries(siteUrl, "28d") → [{ query, page,mcz2FwyQ0wr6418MmI3IZH_A-ah6BQRNrrfv9g"/> position, clicks, impressions }]`,
then upsert new terms into `keywords` with `target_url = query.page` and let the existing
SCOPE scoring pick them up. The stub swap for the real GSC API is the natural home for this.

---

## 9. How to Run It

```bash
cd seo-agent
bun install                          # once
bun run check                        # typecheck
bun run src/cli.ts optimize --dry-run  # full loop, real tools, exit 0
```

Config comes from env (`SEO_DATABASE_URL`, `GSC_SITE_URL`, `GSC_CLIENT_EMAIL`,
`GSC_PRIVATE_KEY`, `OPENAI_API_KEY`, `GITHUB_TOKEN`). Database is a local `deeprank-pg`
Postgres (default `postgres://deeprank:deeprank@localhost:54329/deeprank`).