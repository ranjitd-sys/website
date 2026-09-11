# DeepRank SEO Agent — Complete Walkthrough

> End-to-end tour of the DeepRank SEO agent as of P3 (Day 2): how a single command
> turns five marketing keywords into a scoped, scored, built, validated, reviewed
> optimization run — with the exact files, functions, and log lines.
>
> Companion docs: `deeprank-seo-agent.md` (spec) · `deeprank-execution-plan.md` (plan)
> · `deeprank-budget.md` (budget) · `deeprank-dryrun.md` (annotated raw trace).
> Last updated: 2026-09-11

---

## 1. What the walkthrough covers

The agent is an **optimization loop**:

```
   seed keywords (DB)
        │
        ▼
   RESEARCH   →  SERP + GSC metrics + live crawl per keyword
        │
        ▼
   SCOPE      →  score every keyword, filter, pick ONE winner
        │
        ▼
   PLAN       →  decide the change             [stub today]
        │
        ▼
   ACT        →  produce the change (title/desc/JSON-LD)   [stub today]
        │
        ▼
   VALIDATE   →  astro build gate + metadata rules         [REAL]
        │
        ▼
   REVIEWER   →  approve or reject the change              [stub today]
        │
        ▼
   CREATE_PR  →  open the pull request                     [stub today]
        │
        ▼
   FINISHED
```

Everything runs inside **Effect** (typed errors, dependency injection, no `try/catch`),
orchestrated by an **XState v5** machine. This document walks that stack end to end.

---

## 2. Entry point — `src/cli.ts`

```ts
const command = process.argv[2] ?? "optimize"
const dryRun = process.argv.includes("--dry-run")
```

| Command | Behavior |
|---|---|
| `bun run src/cli.ts optimize` | Full optimization run (dry-run flag optional) |
| `bun run src/cli.ts optimize --dry-run` | Same loop, placeholder PR URL, no files written |
| `bun run src/cli.ts measure` | Stub: logs `measure: not implemented (landing in P9)` |
| anything else | `fatal: unknown command ...`, exit 1 |

### 2.1 Config is loaded and validated first

The `optimize` program starts by reading `SeoConfig` (the Effect Config service). All six
variables must be present or the run **fails fast** with the missing names:

```ts
const config = Config.all({
  databaseUrl:  Config.nonEmptyString("SEO_DATABASE_URL"),
  gscClientEmail: Config.nonEmptyString("GSC_CLIENT_EMAIL"),
  gscSiteUrl:   Config.nonEmptyString("GSC_SITE_URL"),
  gscPrivateKey: Config.redacted("GSC_PRIVATE_KEY"),
  openaiApiKey: Config.redacted("OPENAI_API_KEY"),
  githubToken:  Config.redacted("GITHUB_TOKEN"),
})
```

`redacted()` values are logged as `<redacted>` (secrets never hit the console). A missing
key produces a typed `ConfigLoadError` and a human-readable hint:

```
Configuration is incomplete — set the missing variables in seo-agent/.env:
  - SEO_DATABASE_URL: missing or invalid in the environment
```

### 2.2 Dependency injection — the layer stack

`src/cli.ts:43-55` composes the program by wrapping layers **inside out**. Inner layers win:

```ts
optimize.pipe(                                                             // program to run
  Effect.provide(ValidateServiceLive),   // innermost — wins on name conflicts
  Effect.provide(BuildServiceLive),
  Effect.provide(CrawlServiceLive),      // real fetch + node-html-parser
  Effect.provide(GscServiceLive),        // stub metrics
  Effect.provide(SerpServiceLive),       // mock SERP
  Effect.provide(DatabaseLive),          // needs SeoConfig (resolved from outer layer)
  Effect.provide(ReviewerLive),
  Effect.provide(OptimizeLive),          // the Driver implementation itself
  Effect.provide(SeoConfigLayer),        // outermost — environment
)
```

`runProgram` (`src/edge.ts`) runs the whole thing, turns any failure into a typed error,
and exits 1 instead of crashing.

---

## 3. The state machine — `src/agent/Machine.ts`

The machine is a **pure transition table**: no logic, no side effects. It answers one
question — *"in state X, on event Y, where do we go?"*

States:

```
IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED
                                          ↑│                ↑
                                          │└── REVISE ─────┘│
                                          └──────────────────┘
FINISHED (final)                     ABORTED (final)
```

Core transitions (full table in `deeprank-dryrun.md §4`):

| From | Event | To | Context side-effect |
|---|---|---|---|
| SCOPE | `OPPORTUNITY_SELECTED { opportunityId }` | PLAN | `assign` → `context.opportunityId` |
| VALIDATE | `VALIDATION_FAILED { reason }` | REVISE | `assign` → `context.lastReason` |
| REVIEWER | `REVIEW_FAILED { reason }` | REVISE | `assign` → `context.lastReason` |
| REVISE | `REVISED` | VALIDATE | — |
| any | `ABORT { reason }` | FINISHED / ABORTED | — |

Context is **audit-only** (retries, maxRetries=3, opportunityId, lastReason); all business
data travels in the Driver's carry payload instead.

---

## 4. The Driver — `src/agent/Driver.ts`

The Driver is the **interpreter**. `step(snapshot, carry)` executes the work for the
current state and returns `{ event, carry }`; `walk(...)` feeds the event back to the
machine, gets the next state, and recurses. `getInitialSnapshot + START` kick it off.

```ts
const initial = getInitialSnapshot(optimizeMachine)                 // IDLE
const [started] = transition(optimizeMachine, initial, { type: "START" })  // RESEARCH
return yield* walk(started, 0, nextCarry, null, [stateName(initial)])
```

### The RunCarry — data bus between states

```ts
interface RunCarry {
  research: ResearchRow[]                  // written in RESEARCH, read in SCOPE
  selected: SelectedOpportunity | null     // written in SCOPE,  read in ACT/VALIDATE/REVIEWER
  change: Change | null                    // written in ACT,    read in VALIDATE/REVIEWER
  maxRetries: number                       // copied from machine context
}
```

### Failure containment

`step` returns `Effect<StepResult, unknown, OptimizeEnv>`. `walk` wraps the call in
`Effect.result`, converts any failure to an `ABORT` event, and terminates cleanly at a
final state — a crash in any state never leaves the machine hanging.

---

## 5. RESEARCH — data collection

`src/agent/Driver.ts:141-180`. Three services are read from the environment plus the DB:

```ts
const db    = yield* Database
const serp  = yield* SerpService
const gsc   = yield* GscService
const crawl = yield* CrawlService
const config = yield* SeoConfig
```

1. Read all **active keywords** from the DB (`status = 'active' ORDER BY id` — the 5 seed
   rows inserted by `seed.sql`).
2. For each keyword, resolve the page to crawl:
   `new URL(keyword.target_url, config.gscSiteUrl)` → e.g.
   `/solutions/amazon-sellers` becomes `https://deepecom.com/solutions/amazon-sellers`.
3. Run three tools per keyword:
   - `serp.fetchResults(keyword.term, "google")`
   - `gsc.fetchMetrics(keyword.term, "28d")`
   - `crawl.crawlPage(url)` — failures are **tolerated** (`catchCause` → `null`) so a
     transient site outage doesn't kill the run.

Each row becomes a `ResearchRow { keywordId, term, intent, targetUrl, serp, gsc, crawl }`.

### What each tool really does

**SERP** (`src/tools/serp.ts`) — mock table of 10 competitors per seed keyword
(`.example` RFC-2606 placeholder domains so the data is provably fake). Deterministic
fallback generator for unknown keywords. The real Serper.dev swap changes only the
`fetchResults` body.

**GSC** (`src/tools/gsc.ts`) — stub metrics per keyword:

| keyword | impressions | position | ctr | trend (day 1/7/14/28) |
|---|---|---|---|---|
| ecommerce accounting software india | 1200 | 7.2 | 0.0375 | [8.0, 7.5, 7.2, 7.2] |
| amazon seller gst accounting | 5000 | 4.1 | 0.024 | [6.0, 5.0, 4.5, 4.1] |
| flipkart payment reconciliation | 800 | 12.3 | 0.01875 | [14.0, 13.0, 12.5, 12.3] |
| ecommerce accounting tally | 900 | 9.8 | 0.033 | [10.0, 10.0, 9.8, 9.8] |
| d2c brand accounting | 400 | 15.1 | 0.02 | [16.0, 15.5, 15.2, 15.1] |

**Crawl** (`src/tools/crawl.ts`) — *real*. Fetches the page (10s timeout, abort-signal
aware), parses with `node-html-parser`, extracts `title`, `meta[name=description]`, first
`h1`, counts `application/ld+json` blocks and internal links, then checks up to 10 internal
links (HEAD with GET fallback on 405/501) for broken status.

Real output from the dry-run for keyword 2:

```
crawl: title="Amazon Sellers — Profitability, Reconciliation & Accounting | DeepEcom"
       h1="Run your Amazon business with clarity." jsonLd=0 internal=46 broken=0
```

---

## 6. SCOPE — scoring, filtering, and picking the winner

`src/agent/Driver.ts:182-252`.

### 6.1 The four filters (spec §11)

```ts
const eligible = carry.research.filter((row) => {
  if (doneKeywords.has(row.keywordId)) return false            // already done/measured/optimizing
  const page = pageId.find((p) => p.url === row.targetUrl)
  if (page && openPrPages.has(page.id)) return false            // open PR already exists
  if (row.gsc === null) return false                            // missing data
  if (row.gsc.position <= 3 && row.gsc.ctr >= 0.03) return false // stable top-3 — protect it
  return row.serp !== null && row.serp.results.length > 0       // needs competitor data
})
```

The "done" and "open PR" checks hit the DB:

```sql
SELECT DISTINCT keyword_id FROM opportunities WHERE status IN ('done','measured','optimizing');

SELECT DISTINCT o.page_id
  FROM opportunities o
  JOIN changes c ON c.opportunity_id = o.id
 WHERE c.pr_url IS NOT NULL AND c.deployed_at IS NULL;
```

### 6.2 The scoring formula (spec §6)

Code at `src/agent/Driver.ts:83-105`:

```ts
const INTENT_WEIGHT = { commercial: 1.0, transactional: 0.9, informational: 0.5 }

const momentumMultiplier = (trend) => {
  const improvement = (trend[0] - trend[last]) / trend[0]    // position drop over 28 days
  if (improvement >= 0.3) return 1.6    // rising fast
  if (improvement >= 0.1) return 1.3    // rising
  if (improvement <= -0.05) return 0.6  // falling
  return 1.0                            // flat
}

const score = (row) =>
  row.gsc.impressions * position * INTENT_WEIGHT[row.intent] * momentumMultiplier(row.gsc.trend)
```

Applied to the research:

| keyword | impressions | position | intent w | momentum | score |
|---|---|---|---|---|---|
| ecommerce accounting software india | 1200 | 7.2 | 1.0 | 1.3 | **11,232** |
| amazon seller gst accounting | 5000 | 4.1 | 1.0 | 1.6 | **32,800** |
| flipkart payment reconciliation | 800 | 12.3 | 1.0 | 1.3 | **12,792** |
| ecommerce accounting tally | 900 | 9.8 | 1.0 | 1.0 | **8,820** |
| d2c brand accounting | 400 | 15.1 | 0.9 | 1.0 | **5,436** |

Winner: **amazon seller gst accounting (32,800)** — matches spec Example A exactly.

### 6.3 Persist the opportunity

The Driver inserts an `opportunities` row and threads the selection forward:

```sql
INSERT INTO opportunities (keyword_id, page_id, action, justification, score, status)
VALUES ($1, $2, 'optimize metadata', 'highest priority score 32800.0', 32800, 'proposed')
RETURNING id;
```

Log output:

```
optimize: selected "amazon seller gst accounting" (score=32800.0) -> /solutions/amazon-sellers (opportunity=3)
```

> `opportunity=3` is a DB-assigned id — 1 and 2 were consumed by earlier dev runs.
> If nothing is eligible, the Driver emits `ABORT "no eligible opportunity after filters"`.

---

## 7. PLAN and ACT — producing the change (stubs)

Today both are deterministic injection points for the Day-3 LLM brain.

**PLAN** (`Driver.ts:254-258`) returns `PLANNED { action: "optimize metadata" }`.

**ACT** (`Driver.ts:260-281`) builds a `Change` for the winner:

```
filePath:    src/pages/solutions/amazon-sellers.astro
title:       "Optimize amazon seller gst accounting"           36 chars ≤ 60 ✓
description: shortTrack padded to the 120–160 band            146 chars ✓
jsonLd:      {"@context":"https://schema.org","@type":"Article","headline":…}  ✓
```

Title is truncated to 60 codepoints; description is padded (88 → 146 chars) and capped at
160; the JSON-LD string is valid. This guarantees the run reaches REVIEWER even though the
LLM isn't in the loop yet. On Day 3, `prompts.ts` + `brain.ts` replace this state.

```
optimize: wrote change -> src/pages/solutions/amazon-sellers.astro (title="Optimize amazon seller gst accounting")
```

---

## 8. VALIDATE — two real gates

`src/agent/Driver.ts:283-313`.

### Gate 1 — the compiler (`src/tools/build.ts`)

Spawns `astro build` in the repo root (binary resolved from `cwd/node_modules/.bin`,
no shell), captures exit code + bounded stderr (200KB), and parses Astro error blocks into
`errors: [{ file, message }]`. A non-zero exit or parsed errors ⇒ `VALIDATION_FAILED`.

```
build: astro build (cwd=/home/ranjit/Documents/deepecom/website_2)
build: ok=true errors=0
```

### Gate 2 — metadata rules (`src/tools/validate.ts`)

Pure code (spec §6) using `Array.from` codepoint counting and `Effect.try`+`Effect.option`
for JSON parsing (no raw `try/catch`):

| Rule | Bounds |
|---|---|
| `title` | ≤ 60 characters |
| `description` | 120–160 characters inclusive |
| `jsonLd` | must parse when non-empty |

```
validate: src/pages/solutions/amazon-sellers.astro
validate: pass=true findings=0
```

**Failure path:** either gate failing emits `VALIDATION_FAILED { reason }`, which maps to
`context.lastReason` and routes to **REVISE**. REVISE increments the retry counter and loops
back to VALIDATE; at 3 retries the Driver emits `ABORT` instead of looping forever.

---

## 9. REVIEWER → CREATE_PR → FINISHED

**REVIEWER** (`src/agent/Reviewer.ts`, stub) reviews the threaded change and approves:

```
reviewer: reviewing "Optimize amazon seller gst accounting" (1 diff lines)
REVIEWER -> CREATE_PR (REVIEW_PASSED)
```

**CREATE_PR** today returns a placeholder URL (`https://github.com/placeholder/dry-run`).
The machine reaches its `FINISHED` final state and `walk` returns:

```
optimize finished: visited IDLE -> RESEARCH -> SCOPE -> PLAN -> ACT -> VALIDATE -> REVIEWER -> CREATE_PR
                   (pr: https://github.com/placeholder/dry-run)
```

Exit code 0. Nothing on disk is touched during a dry-run — the change exists only in memory;
the sole write is the `opportunities` row (mirroring a real weekly run).

---

## 10. End-to-end timeline (one real dry-run)

```
14:09:04.870  config loaded (all six vars, secrets redacted)
14:09:04.870  optimize run (dry-run)
14:09:04.897  serp: 10 results  …  gsc: pos=7.2 imp=1200  …  crawl /resources/ecommerce-accounting
14:09:13.209  crawl: title="Ecommerce Accounting — From one order to ERP-ready entries"  …  (keyword 1 done)
14:09:13.209  serp: 10 results  …  gsc: pos=4.1 imp=5000  …  crawl /solutions/amazon-sellers
14:09:18.739  crawl: title="Amazon Sellers — Profitability, Reconciliation & Accounting"  …  (keyword 2 done)
              … keywords 3–5 crawl the same way …
14:09:35.536  RESEARCH -> SCOPE (RESEARCHED)
14:09:35.557  selected "amazon seller gst accounting" (score=32800.0)  (opportunity=3)
14:09:35.557  SCOPE -> PLAN (OPPORTUNITY_SELECTED)
14:09:35.557  PLAN -> ACT (PLANNED)
14:09:35.558  wrote change -> src/pages/solutions/amazon-sellers.astro
14:09:35.558  ACT -> VALIDATE (EDITED)
14:09:35.558  build: astro build  (real, ~11 s)
14:09:47.689  build: ok=true  |  validate: pass=true
14:09:47.690  VALIDATE -> REVIEWER (VALIDATION_PASSED)
14:09:47.691  reviewer: reviewing … (REVIEW_PASSED)  →  CREATE_PR -> FINISHED
14:09:47.691  optimize finished: visited … pr: https://github.com/placeholder/dry-run
```

---

## 11. Real vs placeholder — the current state of each piece

| Piece | Today (Day 2) | Comes next |
|---|---|---|
| Keywords / pages (DB) | 5 seeded + 5 seeded | GSC-discovered keywords (upsert `target_url` from GSC page) |
| SERP | mock table (`.example`) | Serper.dev (`fetchResults` body swap only) |
| GSC metrics | stub table | Search Console API + service account |
| Crawl | real `fetch` + `node-html-parser` | unchanged |
| Build gate | real `astro build` | unchanged |
| Validate gate | real rules | unchanged |
| PLAN / ACT / REVISE | deterministic stubs | LLM (`prompts.ts`, `brain.ts`) |
| Reviewer | pass-through stub | rule-checked LLM reviewer (Day 3) |
| CREATE_PR | placeholder URL | `github.ts` via Octokit (Day 3) |
| measure | `not implemented` log | `measure.ts` + `optimize.yml`/`measure.yml` (Day 3) |

### How keywords will bootstrap themselves (Day 3+)

GSC returns both the **query** and the **page Google already ranks for it**. That means a
new method can discover keywords automatically:

```
GSC Search Analytics (28d, grouped by query + page)
  ├─ query: "tally gst integration"   page: /erp-connector/gst   ← NEW
  └─ query: "what is tcs in ecommerce" page: /resources/...       ← NEW

for each row:
  in keywords already?  → update volume/position
  else                  → INSERT (term, target_url = GSC page, status 'active')
```

The page GSC reports becomes `target_url`, so RESEARCH already knows where to crawl — and
SCOPE scores the new term automatically. Keyword coverage grows past the 5 seed terms with
no manual curation.

---

## 12. How to run it yourself

```bash
cd seo-agent
bun install                        # once
bun run check                      # typecheck
bun run src/cli.ts optimize --dry-run    # full loop, real tools, exit 0
```

Requirements: local Postgres on `localhost:54329` (schema+seed via
`bun run src/store/migrate.ts` / `seed.ts`, or the docker `postgres:16-alpine` setup),
and the six env vars in `.env`.

## 13. Where to go next

- **Consume**: `docs/deeprank-dryrun.md` has the same trace with the full raw log.
- **Extend**: Day 3 tasks live in `seo-agent/tasks/day-2.md` under "What's NOT in today";
  progress tracking (`tasks/deeprank-progress.xlsx`, `tasks/csv/*`, `SHEETS-SETUP.md`) is
  kept current in Google Sheets.
- **Spec**: `docs/deeprank-seo-agent.md` (§6 scoring, §11 filters, §17 schema, §21 config,
  §22 seed).