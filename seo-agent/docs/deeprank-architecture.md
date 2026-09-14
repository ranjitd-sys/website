# DeepRank — Architecture & File Reference

The authoritative map of how the DeepRank SEO agent is built: every architectural decision, every file, and who owns what. Read this to understand *why the code is shaped the way it is* and *which file does what*.

Companion docs:
- `deeprank-seo-agent.md` — the design spec (mission, formula, steps, content rules)
- `deeprank-walkthrough.md` — a line-by-line walkthrough of one optimize run
- `deeprank-dryrun.md` — a full dry-run trace with the layer stack explained
- `deeprank-database.md` — the Postgres schema and who reads/writes each table
- `state-machine-runtime.md` — why we chose "Interpreter + Strategy" over XState actors
- `why-not-a-full-agent.md` — why DeepRank is a bounded, trigger-driven agent, not an autonomous one

---

# 1. System at a Glance

DeepRank is a **scheduled task runner with an LLM in the loop**. It runs two jobs:

| Job | Cadence | Command | What it does |
|---|---|---|---|
| **Optimize** | Weekly (Mon 9:00 UTC) | `bun run src/cli.ts optimize` | Picks the highest-value keyword/page, has the LLM write better metadata, validates it, and opens a **draft PR** for a human to review |
| **Measure** | Monthly (1st, 9:00 UTC) | `bun run src/cli.ts measure` | Detects merged PRs that are 3+ weeks old, pulls current rankings, computes before/after deltas, and has the LLM write transferable "learnings" for the next optimize run |

```
 marketplaces + GSC + SERP + crawl
              │
              ▼
┌─────────────────────────┐      ┌──────────────────────────┐
│   OPTIMIZE (weekly)     │      │   MEASURE (monthly)      │
│  Machine.ts → Driver.ts │      │  measure.ts              │
└─────────────────────────┘      └──────────────────────────┘
              │                                │
              ▼                                ▼
      draft PR on GitHub              learnings → Postgres
      (human reviews/merges)          (read by next optimize PLAN)
```

Both jobs are Effect programs. There is no server, no queue, no webhook receiver. DeepRank wakes on a cron (or `workflow_dispatch`), runs a deterministic pipeline with LLM calls at specific steps, records its work, and stops.

---

# 2. Architecture Decisions

Each decision is recorded as *Decision / Why / Tradeoff*. These are the load-bearing choices — everything else follows from them.

## AD-1 — Effect as the runtime

- **Decision:** Every service is an Effect `Context.Tag` + `Layer`. All I/O runs through `Effect.runPromise`. Errors are **typed tagged errors** (`Data.TaggedError`). There is no `try/catch` on async flows anywhere.
- **Why:** The agent's pipeline has many failure points (DB down, API 500, model output invalid, git conflict). Effect gives a single, composable error model (`Effect<A, E, R>`) with dependency injection via layers, so the CLI can stack "which services this run uses" declaratively.
- **Tradeoff:** Effect 4 is a beta — some APIs differ from docs (e.g. no `catchAll`; `catchCause`/`result`/`mapError` instead). Steeper learning curve than plain async/await.
- **Where:** every file in `src/`; wired centrally in `src/cli.ts`.

## AD-2 — XState for the workflow

- **Decision:** The optimize flow is an explicit XState v5 state machine (`Machine.ts`): `IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE ⇄ REVISE → REVIEWER ⇄ REVISE → CREATE_PR → FINISHED|ABORTED`.
- **Why:** The retry loop (VALIDATE/REVIEWER failure → REVISE → back, max 3 retries) is exactly what a state machine expresses clearly. State names show up in every log line, making runs auditable.
- **Tradeoff:** The machine describes *what* transitions are allowed; it does **not** run the work. Work lives in the Driver (see AD-3).
- **Where:** `src/agent/Machine.ts`.

## AD-3 — Interpreter + Strategy (not XState actors)

- **Decision:** We do **not** run the machine as an XState actor with its own event loop. Instead the Driver (`Driver.ts`) interprets snapshots: read the current state, run the matching Effect program, send the resulting event, transition, repeat. See `state-machine-runtime.md`.
- **Why:** Keeps all side effects inside Effect (typed errors, DI, logging) while XState only supplies the transition table. Avoids two competing runtimes owning the control flow.
- **Tradeoff:** Less "reactive" than actors; the Driver's `walk()` loop is the real controller.
- **Where:** `src/agent/Driver.ts` — `step()` maps state → Effect, `walk()` drives transitions.

## AD-4 — LLM for meaning, code for facts

- **Decision:** The LLM is used **only** where judgment/language is required: PLAN (diagnose the gap), ACT (write metadata), REVISE (fix a failure), REVIEWER (judge a change), learnings (generalize). Everything else — SERP/GSC/crawl fetching, scoring, filtering, char counting, JSON parsing, build, git, DB — is deterministic code.
- **Why:** Facts must be reproducible; claims must be verifiable. If the LLM decided *what* to fetch or *how* to score, results would be non-deterministic and un-auditable.
- **Tradeoff:** The LLM never chooses strategy; it only fills in content within a fixed structure.
- **Where:** the boundary is enforced by service shape (`brain.ts` is the only LLM caller).

## AD-5 — Groq via raw `fetch` + Effect `Schema` decoding

- **Decision:** LLM calls go straight to Groq's OpenAI-compatible chat completions endpoint over raw `fetch` with `response_format: { type: "json_object" }`. The response is decoded with Effect `Schema` (`Schema.decodeUnknownOption`) — invalid model output is a typed `BrainError`, not a crash.
- **Why:** No SDK dependency; JSON mode + schema decoding makes the LLM contract as strict as an API contract.
- **Tradeoff:** Prompt drift matters — the prompt must ask for the exact JSON shape the schema expects.
- **Where:** `src/agent/brain.ts` (`chatJson`, `decodeJson`, `complete`).

## AD-6 — Draft PR only, never auto-merge

- **Decision:** Optimize ends by opening a **draft** PR. Merging is always a human decision.
- **Why:** Metadata is customer-facing; a fabricated claim or out-of-scope product ("AI-powered inventory management") in a `<title>` goes live to Google. The reviewer gate catches most issues; a human must sign off on the rest.
- **Where:** `src/tools/github.ts` (`pulls.create({ draft: true })`).

## AD-7 — Stub/mock fallbacks keep runs green with blank creds

- **Decision:** Every external dependency degrades gracefully when its credential is absent:
  - no `GROQ_API_KEY` → brain runs in **stub mode** (deterministic outputs)
  - no `SERPAPI_KEY` → seeded **mock SERP** results
  - no GSC creds → **stub metrics**
  - no `GITHUB_TOKEN` → `GithubServiceLive` dies with a clear message (only reached on non-dry-run)
- **Why:** Development and CI stay runnable without secrets. Verified this end-to-end with all-but-DB blank.
- **Where:** `brain.ts` (stub branch), `serp.ts` (mock), `gsc.ts` (stub), `github.ts` (empty-token guard).

## AD-8 — GitHub Actions as the runtime

- **Decision:** The agent ships as two GitHub Actions workflows (`optimize.yml`, `measure.yml`) with `schedule` cron + `workflow_dispatch`. No server.
- **Why:** It's a weekly batch job — an always-on VM is waste. Actions gives free scheduling, secrets management, an audit trail, native repo access (checkout + PR permission), and versioning alongside the site.
- **Tradeoff:** Needs a **cloud-reachable** Postgres (see AD-9) — a local `localhost` DB is invisible to Actions.
- **Where:** `.github/workflows/optimize.yml`, `.github/workflows/measure.yml`.

## AD-9 — Postgres as the single state store

- **Decision:** All durable state lives in Postgres (`src/store/schema.sql`): `keywords`, `pages`, `opportunities`, `changes`, `keyword_positions`, `learnings`.
- **Why:** Optimize and Measure are different processes (and possibly different CI runs) that must share state — opportunities created in optimize must be measurable later, and learnings must feed the next optimize. A shared DB is the simplest way.
- **Tradeoff:** The DB is a required dependency (only config key that has no default).
- **Where:** `src/services/Database.ts` (pg Pool wrapper), `src/store/schema.sql`.

## AD-10 — Shared canonical types + shared helpers

- **Decision:** Domain types live once in `src/types/` (`market.ts`, `agent.ts`) and are imported/re-exported everywhere — no duplicated interfaces. Pure helpers live in `src/shared/` (`scoring.ts`, `text.ts`).
- **Why:** Before this refactor, `SerpResult`, `GscMetrics`, `CrawlResult`, `Change`, `Verdict` and the scoring formula were copy-pasted across tools, prompts, brain and Driver. One source of truth removes drift (e.g. two `ReviewVerdict`s that could diverge).
- **Tradeoff:** Type files are shared across layers; a change ripples everywhere (good — that's the point).
- **Where:** `src/types/*`, `src/shared/*`.

## AD-11 — Layered service architecture

- **Decision:** Layered as `cli → agent (brain, Driver, Machine) → tools (serp, gsc, crawl, …) → services (Database)`, with `types`/`shared` beneath everything.
- **Why:** Tools are dumb, testable I/O units. The brain is the only LLM client. The Driver orchestrates. The CLI only wires layers. Each layer has a single job.
- **Where:** see the dependency graph in §4 and the file map in §5.

## AD-12 — Effect Config with defaults; only DB required

- **Decision:** Config (`Config.ts`) is read via Effect `Config.all`. GSC, Groq, GitHub and SerpApi keys **default to empty**; `SEO_DATABASE_URL` is the only required (non-empty) value.
- **Why:** Makes the agent runnable with "blank" creds in dev/CI and lets each real credential be added independently.
- **Where:** `src/Config.ts`; template at `.env.example`.

## AD-13 — Dry-run mode

- **Decision:** `optimize --dry-run` runs the *entire* pipeline (research, score, plan, act, validate, review) but **skips** the git branch/commit/PR and any DB writes that mutate state.
- **Why:** Lets you exercise the full loop — including the real LLM — without creating branches/PRs or dirtying the DB. The machine still finishes in `CREATE_PR` with a placeholder URL.
- **Where:** `src/cli.ts` (flag), `src/agent/Driver.ts` (`case "CREATE_PR"`).

---

# 3. The Two Jobs in Detail

## 3.1 Optimize (weekly)

1. **RESEARCH** (`Driver.ts`): for each active keyword, fetch SERP (SerpService), GSC metrics (GscService), and crawl the target page (CrawlService). Collect facts into `ResearchRow`s.
2. **SCOPE** (`Driver.ts`): filter (skip done keywords, pages with open PRs, stable top-3, missing data) then rank survivors by `opportunityScore` (in `shared/scoring.ts`) and pick the winner.
3. **PLAN** (`Driver.ts` → `brain.ts` → `prompts.ts`): the LLM gets keyword, intent, crawl, SERP, GSC and the last 5 learnings; returns `{ diagnosis, action, rationale }`.
4. **ACT** (`Driver.ts` → `brain.ts`): the LLM writes `{ title, description, jsonLd }`; brain clamps lengths and validates JSON-LD.
5. **VALIDATE** (`Driver.ts`): run an Astro build (`build.ts`) + rule checks (`validate.ts`: title ≤60, desc 120–160, valid JSON-LD). Failure → REVISE.
6. **REVIEWER** (`Driver.ts` → `brain.ts`): the LLM judges the change against positioning/scope/fabrication rules. Failure → REVISE.
7. **REVISE** (`Driver.ts` → `brain.ts`): LLM fixes the change minimally; loop back to VALIDATE (≤3 retries).
8. **CREATE_PR** (`Driver.ts` → `content.ts` → `github.ts`): apply the change to the file, create a branch, commit, open a **draft PR**; record opportunity → `optimizing`, insert `changes` row, snapshot baseline into `keyword_positions`.

## 3.2 Measure (monthly)

1. **DETECT_MERGES** (`measure.ts`): find `changes` with `deployed_at` set, no `measurement`, and older than 3 weeks.
2. **GSC_PULL** (`measure.ts` → `gsc.ts`): fresh 28-day metrics per keyword.
3. **WRITE_DELTAS** (`measure.ts`): compute `before/after/delta/verdict` (`won|stuck|falling`) and store in `changes.measurement` JSONB; mark opportunity `measured`.
4. **LEARNINGS** (`measure.ts` → `brain.ts`): the LLM generalizes the batch of deltas into 1–3 transferable learnings.
5. **FEED_RESEARCH** (`measure.ts`): insert learnings rows — the next optimize PLAN reads the latest 5.

---

# 4. Module Dependency Graph

```
                        ┌─────────────────────┐
                        │      src/cli.ts      │   entry point, layer wiring
                        └──────────┬──────────┘
                                   │ provides Layers
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
       ┌─────────────────────┐             ┌──────────────────────┐
       │  src/agent/Driver   │             │ measurement/measure  │
       │  (state → Effect)   │             │  (monthly pipeline)  │
       └───────┬─────────────┘             └──────────┬───────────┘
               │ uses                                  │ uses
     ┌─────────┼──────────────┬───────────┐            │
     ▼         ▼              ▼           ▼            ▼
┌────────┐ ┌────────┐ ┌────────────┐ ┌─────────┐ ┌──────────┐
│ Machine│ │ brain  │ │  tools/*   │ │ services│ │ Database │
│ XState │ │ Groq   │ │ serp gsc   │ │ Database│ │ (pg Pool)│
│        │ │ LLM    │ │ crawl cont │ │         │ └────┬─────┘
└────────┘ └────┬───┘ │ validate   │ └─────────┘      │
               │      │ build github│                  ▼
               │      └─────┬───────┘            ┌───────────┐
               ▼            │                    │ Postgres  │
         ┌────────────┐     │                    │ (schema)  │
         │ prompts.ts │     │                    └───────────┘
         │ prompt     │     │
         │ builders   │     ▼
         └────────────┘  ┌────────────┐   ┌────────────┐
                         │ types/     │   │ shared/    │
                         │ market     │   │ scoring    │
                         │ agent      │   │ text       │
                         └────────────┘   └────────────┘
```

- `cli.ts` → `Driver.ts` → `Machine.ts`, `brain.ts`, `tools/*`, `Database`.
- `measure.ts` → `brain.ts`, `gsc.ts`, `Database`.
- `brain.ts` → `prompts.ts` (pure prompt builders) + `types/agent` + `Config`.
- `tools/*` → `types/market`/`types/agent`; `Driver` uses `shared/scoring` + `shared/text`.
- `Config.ts` → consumed by every service layer (via `SeoConfig` Context).

---

# 5. File-by-File Responsibility Map

## 5.1 Entry & config

| File | Responsibility | Key exports | Depends on |
|---|---|---|---|
| `src/cli.ts` | Entry point. Reads `argv[2]` (`optimize`/`measure`) and `--dry-run`; logs the loaded config; stacks the service **Layers** for each command and runs the program via `runProgram`. | — | everything |
| `src/Config.ts` | Reads env into typed `SeoConfigShape` via Effect `Config.all`; GSC/Groq/GitHub/SerpApi default empty, `SEO_DATABASE_URL` required. Turns config failures into a friendly `ConfigLoadError` list. | `SeoConfig`, `SeoConfigLayer`, `formatConfigFailure` | Effect |
| `src/edge.ts` | `runProgram` — runs any `Effect.Effect<A, unknown, never>`, prints a clean fatal error and `process.exit(1)` on failure. | `runProgram` | Effect |

## 5.2 Canonical types & shared helpers

| File | Responsibility | Key exports |
|---|---|---|
| `src/types/market.ts` | The market-data vocabulary used by every tool: SERP result shapes, GSC metric/window shapes, crawl result shape. | `SerpSource`, `SerpResult`, `SerpResults`, `GscWindow`, `GscMetrics`, `CrawlResult` |
| `src/types/agent.ts` | The agent/optimization vocabulary: the change to apply, brain I/O types, measurement verdict, driver run types. | `Change`, `PlanOutput`, `ReviewVerdict`, `ReviewOutput`, `PlanInput`, `ActInput`, `ReviseInput`, `ReviewInput`, `LearnInput`, `Verdict`, `LearnedDelta`, `SelectedOpportunity`, `RunOptions`, `OptimizeResult` |
| `src/types/index.ts` | Barrel re-exporting `market` + `agent`. | — |
| `src/shared/scoring.ts` | Pure scoring math used by Driver SCOPE: intent weights, momentum multiplier, the `opportunityScore` formula. | `INTENT_WEIGHT`, `momentumMultiplier`, `opportunityScore` |
| `src/shared/text.ts` | Pure string helpers. | `slugify`, `describeFinding` |
| `src/shared/index.ts` | Barrel. | — |

## 5.3 Agent core

| File | Responsibility | Key exports | Depends on |
|---|---|---|---|
| `src/agent/Machine.ts` | The XState v5 state machine. Declares the **states, events, transitions** for optimize, plus the retry context (`maxRetries: 3`). No side effects. | `optimizeMachine`, `OptimizeEvent`, `OptimizeContext`, `OptimizeMachine` | XState |
| `src/agent/Driver.ts` | **The orchestrator.** Interprets machine snapshots: `step()` maps each state to an Effect program; `walk()` drives transitions with retry handling; `impl.run` starts the machine and walks to a final state. Holds `RunCarry` (the data bus: research, selected, plan, change). Builds the PR body. | `OptimizeMachineService`, `OptimizeLive`, `OptimizeEnv`, `DriverError` | Machine, Brain, tools, Database, shared, types |
| `src/agent/brain.ts` | **The LLM client.** `plan`/`act`/`revise`/`review`/`learn` methods; raw Groq fetch, `Schema` decoding, deterministic `clamp` (title ≤60, desc 120–160, JSON-LD fallback), stub mode when no `GROQ_API_KEY`. | `BrainService`, `BrainServiceLive`, `BrainError` | prompts, Config, types |
| `src/agent/prompts.ts` | Pure prompt builders (no I/O): `driverPrompt`, `actPrompt`, `revisePrompt`, `reviewerPrompt`, `learnPrompt`, plus shared `POSITIONING_RULES` / `METADATA_RULES`. | the 5 prompt fns | types |
| `src/agent/Reviewer.ts` | **Legacy stub** — a placeholder `Reviewer` service. Superseded by `brain.review`; not wired into the CLI. Kept for reference. | `Reviewer`, `ReviewerLive` | Effect, types |
| `src/agent/reviewerProbe.ts` | Developer tool: runs 4 deterministic reviewer cases (fabrication / scope / positioning / clean pass) against the real LLM to verify the reviewer catches violations. Run with `bun run probe:reviewer`. | — | brain, Config, edge |

## 5.4 Tools

| File | Responsibility | Key exports | Notes |
|---|---|---|---|
| `src/tools/serp.ts` | Fetches top-10 SERP for a keyword. Real SerpApi call when `SERPAPI_KEY` set; seeded mock (`.example` domains) otherwise. | `SerpService`, `SerpServiceLive`, `SerpError` | `Effect.result`-based fallback |
| `src/tools/gsc.ts` | Pulls GSC metrics (`clicks, impressions, position, ctr, trend`). **Currently a stub** — GSC access pending; the real Search Console swap is documented as a TODO header. | `GscService`, `GscServiceLive`, `GscError` | stub returns seeded data |
| `src/tools/crawl.ts` | Crawls a page with `node-html-parser`: title, description, H1, JSON-LD block count, internal link count, broken link checks (HEAD→GET fallback, timeout). | `CrawlService`, `CrawlServiceLive`, `CrawlError` | |
| `src/tools/content.ts` | Reads a site file and applies the change (replace title/description attrs, upsert JSON-LD `<script>`). | `ContentService`, `ContentServiceLive`, `ContentError`, `ApplyChangeInput` (alias of `Change`) | |
| `src/tools/validate.ts` | Deterministic rule checks: title ≤60 chars, description 120–160 chars, JSON-LD parses. Returns findings. | `ValidateService`, `ValidateServiceLive`, `ValidateChangeInput` (alias of `Change`), `ValidateFinding`, `ValidateResult` | |
| `src/tools/build.ts` | Runs `astro build` in the site repo, captures stderr, parses error entries. Exports `REPO_ROOT` (the website repo path). | `BuildService`, `BuildServiceLive`, `REPO_ROOT` | |
| `src/tools/github.ts` | Octokit wrapper: create branch (from default-branch **SHA**), commit (blob→tree→commit→update ref), open **draft** PR. Resolves `owner/repo` from `git remote origin` or `GITHUB_REPO`. Dies with a clear error if token empty. | `GithubService`, `GithubServiceLive`, `GithubError` | |
| `src/tools/registry.ts` | Effect `Schema` definitions + a `ToolRegistry` service describing each tool (input/output schemas). A seed for a future tool-calling agent — not used by the current Driver. | `ToolRegistry`, `ToolRegistryLive`, schemas | |

## 5.5 Services & store

| File | Responsibility | Key exports | Notes |
|---|---|---|---|
| `src/services/Database.ts` | Thin pg `Pool` wrapper exposing a typed `query` Effect. | `Database`, `DatabaseLive`, `DbError` | connection string from `SeoConfig` |
| `src/store/schema.sql` | Idempotent DDL: `keywords`, `keyword_positions`, `pages`, `opportunities`, `changes`, `learnings` + indexes. | — | |
| `src/store/seed.sql` | Idempotent seed: 5 pages + 5 keywords (`ON CONFLICT DO UPDATE`). | — | |
| `src/store/migrate.ts` | Applies `schema.sql` via the real Database layer. | — | run `bun run migrate` |
| `src/store/seed.ts` | Applies `seed.sql` and logs the tracked keywords. | — | run `bun run seed` |

## 5.6 Measurement

| File | Responsibility | Key exports |
|---|---|---|
| `src/measurement/measure.ts` | The monthly measure pipeline: detect merged changes → pull GSC → write deltas → LLM learnings → persist. Owns the `MeasureError` type and `MeasureLive`. | `MeasureService`, `MeasureLive`, `MeasureError`, `MeasureResult`, `Verdict` (re-exported) |

## 5.7 CI

| File | Responsibility | Notes |
|---|---|---|
| `.github/workflows/optimize.yml` | Weekly (Mon 09:00 UTC) + manual run of `optimize`. `contents: write` + `pull-requests: write`. Uses `DEEPRANK_GITHUB_TOKEN` or falls back to `github.token`. | env reads `SEO_DATABASE_URL`, GSC, Groq, GitHub, SERP secrets |
| `.github/workflows/measure.yml` | Monthly (1st 09:00 UTC) + manual run of `measure`. `contents: read`. | same env wiring |

---

# 6. Data Flow Reference

## Optimize — who writes/reads what

| Step | Reads | Writes | Owner |
|---|---|---|---|
| RESEARCH | `keywords` (active) | — | `Driver.ts` → serp/gsc/crawl |
| SCOPE | `opportunities` (done), `changes` (open PRs), `pages` | `opportunities` (proposed, with score) | `Driver.ts` |
| PLAN | `learnings` (last 5) | — | `brain.ts` |
| ACT | — | — | `brain.ts` (returns `Change`) |
| VALIDATE | — | — | `build.ts` + `validate.ts` |
| REVIEWER | — | — | `brain.ts` |
| CREATE_PR | — | `opportunities` → `optimizing`; `changes` (branch, pr_url); `keyword_positions` (baseline) | `content.ts` + `github.ts` + `Database` |

## Measure — who writes/reads what

| Step | Reads | Writes | Owner |
|---|---|---|---|
| DETECT_MERGES | `changes` (merged, unmeasured, 3+ wks), `opportunities`, `keywords` | — | `measure.ts` |
| GSC_PULL | — | — | `gsc.ts` |
| WRITE_DELTAS | `keyword_positions` (baseline) | `changes.measurement` (JSONB); `opportunities` → `measured` | `measure.ts` |
| LEARNINGS | deltas | — | `brain.ts` |
| FEED_RESEARCH | — | `learnings` | `measure.ts` |

---

# 7. Cross-Cutting Concerns

- **Error model:** every layer has a typed tagged error (`SerpError`, `GscError`, `CrawlError`, `ContentError`, `ValidateError`, `BuildError`, `GithubError`, `DbError`, `BrainError`, `DriverError`, `MeasureError`, `ConfigLoadError`). Failures map cleanly through the pipeline (`asMeasure`, `Effect.mapError`).
- **Logging:** Effect structured logs everywhere — each step logs state transitions, selected keyword, scores, build/validate results, branch/PR URLs. This is the audit trail.
- **Retry:** only the REVISE loop retries (machine `maxRetries: 3`). External calls use per-call fallbacks (mock/stub/skip) rather than retry storms.
- **Idempotency:** schema/seed SQL is `IF NOT EXISTS`/`ON CONFLICT` safe; `changes` upserts on `opportunity_id`.
- **Fallbacks:** blank-key paths keep every run green (AD-7). The only hard-fail is an empty `GITHUB_TOKEN` on a real (non-dry) PR run — by design, since that's a genuine misconfiguration.
- **Secrets:** live in `.env` locally (loaded by the app), in Actions **secrets** in CI. Only `SEO_DATABASE_URL` is truly required.

---

# 8. Running It

## Local

```bash
cd seo-agent
cp .env.example .env            # fill SEO_DATABASE_URL (+ optional keys)
bun install
bun run check                   # tsc --noEmit
bun run migrate                 # apply schema.sql
bun run seed                    # insert pages + keywords
bun run src/cli.ts optimize --dry-run   # full loop, no PR/DB writes
bun run src/cli.ts optimize             # opens a real draft PR
bun run src/cli.ts measure              # monthly job (no-op if nothing to measure)
```

## GitHub Actions

1. Ensure `SEO_DATABASE_URL` points to a **cloud-reachable** Postgres (not localhost).
2. Repo → Settings → Secrets → Actions: add `SEO_DATABASE_URL` (+ `GROQ_API_KEY`, `SERPAPI_KEY`, GSC keys, `DEEPRANK_GITHUB_TOKEN` as you obtain them). All except the DB URL are optional.
3. Push `.github/workflows/` to the repo.
4. Trigger via **Actions → DeepRank Weekly Optimize → Run workflow** (or wait for the Monday cron).

---

# 9. Constraints & Future

- **Not a full agent** — see `why-not-a-full-agent.md`. It's a bounded, trigger-driven agent: autonomous on a schedule, but never self-initiated and never auto-merging.
- **GSC is still stubbed** — real Search Console access is pending; the swap path is a documented TODO in `src/tools/gsc.ts`.
- **Future evolution** — `src/tools/registry.ts` already models each tool as schemas, the natural seed for a tool-calling (ReAct) variant if that direction is ever taken.
- **First production run:** verify the first draft PR, merge it, wait 3+ weeks, then run `measure` to confirm the closed loop (optimize → merge → measure → learnings → next optimize).