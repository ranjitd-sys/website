# Today — P3 Deterministic Tools + Wire Into Driver

> DeepRank work session. CTO decision: **build the agent on Effect** (`effect` + `@effect/platform-node`), not plain async/await.
> Spec: `docs/deeprank-seo-agent.md` · Execution plan: `docs/deeprank-execution-plan.md`
> Date: 2026-09-12

---

## Non-negotiable (same as Day 1)

- Every service is an Effect `Context.Tag` + `Layer`.
- Errors are **typed**. No try/catch anywhere.
- Validation uses **Effect `Schema`** — not Zod — inside `seo-agent/`.
- Database / HTTP / CLI all run through Effect (`Effect.runPromise`).
- State machine stays XState v5 (already in root deps), but each transition runs an Effect program.
- Verification happens after every task. No "I think it works".

---

## Decisions locked for today

- **SERP** → mock data (hardcoded for the 5 seed keywords). Interface matches real schema; real Serper.dev swap later is a one-file change.
- **GSC** → stub (plausible mock metrics per keyword, returns `clicks/impressions/position/ctr` + 28-day trend for momentum).
- **Crawl** → `undici`/Node built-in `fetch` + lightweight HTML parser (`node-html-parser`), NOT Playwright.
- **Build** → `node:child_process` runs `astro build` against the repo root, captures exit code + stderr.
- **Validate** → pure code (title ≤60, description 120–160, JSON-LD parses).
- **github.ts (PR), LLM brain, prompts.ts** → NOT today (Day 3).

---

## Task log (each completed item = checkbox + one line of what was verified)

- [x] **T6 — SERP tool (mock)**
  - [x] `seo-agent/src/tools/serp.ts` — Effect `Context.Service` `SerpService` + `SerpServiceLive`
  - [x] Method `fetchResults(keyword, source)` → `{ results: [{ rank, url, title, snippet }] }` matching `SerpOutput` in registry
  - [x] Hardcoded top-10 competitor results for the 5 seed keywords (`ecommerce accounting software india`, `amazon seller gst accounting`, `flipkart payment reconciliation`, `ecommerce accounting tally`, `d2c brand accounting`)
  - [x] Typed error `SerpError { keyword, source, reason }`
  - [x] **Verify:** seed keyword returns 10 results, ranks sequential 1–10; `SerpOutput` decodes both seeded and fallback output
  - [x] **Done:** `SerpServiceLive` implemented via `Layer.succeed`; 50 curated `.example`-domain entries (10 per seed keyword), deterministic fallback generator for unknown keywords; `fetchResults` logs each call and returns typed `SerpResults`. Notes: uses `.example` (RFC 2606 reserved) domains for unambiguous mock data; future Serper.dev swap changes only `fetchResults` body.

- [x] **T7 — GSC tool (stub)**
  - [x] `seo-agent/src/tools/gsc.ts` — Effect `Context.Service` `GscService` + `GscServiceLive`
  - [x] Method `fetchMetrics(query, window)` → `{ clicks, impressions, position, ctr, trend: number[] }` matching `GscOutput` + 28-day trend for momentum
  - [x] Stub map: one plausible metrics set per seed keyword (position 4–15, clicks 8–120, impressions 400–5000, ctr 0.018–0.037, 4-point trend array)
  - [x] Typed error `GscError { query, window, reason }`
  - [x] **Verify:** seeded keyword returns `pos=7.2 clicks=45 trend=[8,7.5,7.2,7.2]`; fallback returns 4-point trend; `GscOutput` (now including `trend` array) decodes both
  - [x] **Done:** `GscServiceLive` via `Layer.succeed`; stub map covers all 5 seed keywords with plausible metrics + momentum trend; deterministic fallback for unknown queries. Notes: updated `GscOutput` schema in `registry.ts` to include `trend: Schema.Array(Schema.Number)`; real GSC swap changes only `fetchMetrics` body (adds `googleapis` service account auth).

- [x] **T8 — Crawl tool (undici/Node fetch + HTML parser)**
  - [x] `seo-agent/src/tools/crawl.ts` — Effect `Context.Service` `CrawlService` + `CrawlServiceLive`
  - [x] Method `crawlPage(url)` → `{ title, description, h1, jsonLdBlocks, internalLinks, brokenLinks }` matching `CrawlOutput` in registry
  - [x] Fetch page HTML via Node built-in `fetch`; parse with `node-html-parser` (title, `meta[name=description]`, first `h1`, `<script type="application/ld+json">` count, internal `<a href>` count)
  - [x] Broken-link check: HEAD/GET sibling pages, count non-2xx → `brokenLinks` (bounded, e.g. first 10 internal links)
  - [x] Typed error `CrawlError { url, reason }` (timeout, non-2xx status, parse failure)
  - [x] New dep: `node-html-parser`
  - [x] **Verify:** local fixture page (Node `http` server) — title/desc/h1 extracted, `jsonLdBlocks=1`, `internalLinks=2`, `brokenLinks=1` (404 via HEAD→GET fallback); `CrawlOutput` decodes
  - [x] **Done:** `CrawlServiceLive` via `Layer.succeed`; `Effect.tryPromise` with external-received `AbortSignal` (thrown errors mapped to typed `CrawlError`). Notes: link checks bounded to first 10 internal links, with `HEAD` → `GET` fallback on 405/501; `#anchor` and external links excluded from count; async crawl must run via `Effect.runPromise` (not `runSync`).

- [x] **T9 — Build tool**
  - [x] `seo-agent/src/tools/build.ts` — Effect `Context.Service` `BuildService` + `BuildServiceLive`
  - [x] Methods `runBuild({ cwd })` → `{ ok: boolean, errors: [{ file, message }] }` matching `BuildOutput` in registry
  - [x] Runs `astro build` as child process in the repo root (spawns `node_modules/.bin/astro`, cwd = parent of `seo-agent/`), captures exit code + stderr (bounded to 200KB)
  - [x] Parse stderr into `errors: [{ file, message }]` (Astro `error  <msg>` + `File:` blocks); empty `errors` + `ok: true` when exit 0
  - [x] Typed error `BuildError { reason }` (missing astro binary, spawn failure)
  - [x] **Verify:** real repo build → `{ ok: true, errors: [] }` (took ~11s); fixture dir with failing fake `astro` binary → `{ ok: false, errors: [{file: probe.astro, message: "Failed to resolve import..."}, {file: Broken.tsx, message: "Build failed..."}] }`; abort signal kills child
  - [x] **Done:** `BuildServiceLive` via `Layer.succeed`; service accessed via `yield* BuildService` inside `Effect.gen`. Notes: uses `Effect.tryPromise` around a `spawn` wrapper; `astro` binary path resolved from `cwd/node_modules/.bin` (no shell, dependency-free); updated `BuildInput` registry schema to `{ cwd }` (build always targets repo root, LLM-facing input has no free parameters); REPO_ROOT constant = parent of `seo-agent/`.

- [x] **T10 — Validate tool**
  - [x] `seo-agent/src/tools/validate.ts` — Effect `Context.Service` `ValidateService` + `ValidateServiceLive`
  - [x] Method `validateChange(change)` → `{ pass: boolean, findings: [{ field, message }] }` matching `ValidateOutput` in registry
  - [x] Checks (pure code, spec §6): title ≤60 chars (`Array.from` codepoint count); description 120–160 chars inclusive; JSON-LD parses via `Effect.try` + `Effect.option` (no raw try/catch) when `jsonLd` non-empty
  - [x] **Verify:** valid change (49-char title, 137-char desc, valid JSON-LD) → `pass: true, findings: []`; 61-char title → `field === "title"`; 80-char desc → `field === "description"`; 180-char desc → `field === "description"`; `{not valid json` → `field === "jsonLd"`
  - [x] **Done:** `ValidateServiceLive` via `Layer.succeed`; updated `ValidateInput` registry schema to `{ filePath, title, description, jsonLd }` matching the change shape the agent will validate.

- [x] **T11 — Wire tools into Driver**
  - [x] `seo-agent/src/agent/Driver.ts` — `step()` calls real tools per state; services added to the Optimize service's requirements
  - [x] RESEARCH → reads active keywords from DB, then `yield* SerpService.fetchResults` + `yield* GscService.fetchMetrics(…, "28d")` + `yield* CrawlService.crawlPage(siteOrigin + target_url)` per keyword, logs data, emits `RESEARCHED`; crawl failures are logged and tolerated (crawl row = null) so the run stays robust against transient site outages
  - [x] SCOPE → computes `score = impressions × position × intent × momentum`, applies filters (already-completed via `opportunities.status IN (done,measured,optimizing)`; open-PR via `changes.pr_url IS NOT NULL AND deployed_at IS NULL`; stable top-3 via `position <= 3 && ctr >= 0.03`; missing-data via `serp/gsc == null`), sorts desc, picks the winner, inserts an `opportunities` row (status `proposed`), emits `OPPORTUNITY_SELECTED { opportunityId }`; no eligible → `ABORT` "no eligible opportunity after filters"
  - [x] VALIDATE → `yield* BuildService.runBuild({ cwd: REPO_ROOT })` then `yield* ValidateService.validateChange(change)`; build error or findings → `VALIDATION_FAILED { reason }` (triggers REVISE/retry cap), else `VALIDATION_PASSED`; ACT stub builds a deterministic metadata change (title truncated to 60, description padded to 120–160, valid JSON-LD) so the pipeline reaches REVIEWER
  - [x] Keep PLAN/ACT/CREATE_PR as stubs (LLM + PR on Day 3); REVIEWER unchanged (reviews the threaded change)
  - [x] `keywords`/`targetUrl` read from seeded DB via `Database` service; `new URL(target_url, config.gscSiteUrl)` builds the crawl URL
  - [x] `cli.ts` provides `SerpServiceLive`, `GscServiceLive`, `CrawlServiceLive`, `BuildServiceLive`, `ValidateServiceLive`, `DatabaseLive` + existing layers
  - [x] Machine.ts: `OPPORTUNITY_SELECTED` now carries `opportunityId`; `assign` actions update `context.opportunityId` (SCOPE) and `context.lastReason` (VALIDATION_FAILED/REVIEW_FAILED)
  - [x] **Verify:** `bun run src/cli.ts optimize --dry-run` walks `IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED` end-to-end with real tool calls, exits 0; winner `amazon seller gst accounting` score 32800 (5000 impressions × 4.1 pos × 1.0 commercial × 1.6 rising momentum) matches spec Example A; an `opportunities` row (proposed) is written per run; real crawls pull live titles/H1s/jsonLd counts from deepecom.com
  - [x] **Done:** tools are wired and the machine is fully deterministic — the same seed data always picks keyword 2 (`amazon seller gst accounting`) and validates its page successfully. Notes: dry-run writes an `opportunities` row (intended — mirror of a real weekly run); crawl uses the live site origin from config.

---

## New packages

| Package | Purpose | Notes |
|---|---|---|
| `node-html-parser` | Lightweight HTML parsing for crawl tool | `bun add node-html-parser` (runtime dep) |

No package needed for SERP/GSC (mocked/stubbed), build (`node:child_process`), or validate (pure code). Node's built-in `fetch` covers HTTP.

---

## Deliverables (end of day)

- [x] `src/tools/serp.ts` — mock SERP data for 5 seed keywords
- [x] `src/tools/gsc.ts` — stub GSC metrics + 28-day trend for 5 seed keywords
- [x] `src/tools/crawl.ts` — real crawl (fetch + `node-html-parser`) over a target URL
- [x] `src/tools/build.ts` — real `astro build` execution with parsed errors
- [x] `src/tools/validate.ts` — deterministic title/description/JSON-LD checks
- [x] `src/agent/Driver.ts` — `step()` calls real tools at RESEARCH, SCOPE, VALIDATE
- [x] `src/cli.ts` — provides all five new tool Layers + `DatabaseLive`
- [x] `bun run check` passes; `bun run src/cli.ts optimize --dry-run` walks the machine with live tool calls and exits 0
- [x] Every tool is `Context.Service` + `Layer`; zero try/catch in new code

---

## What's NOT in today (Day 3)

- OpenAI / LLM driver (`prompts.ts`, AI interpretation in RESEARCH/PLAN/ACT, AI REVISE)
- `src/tools/github.ts` (branch, commit, draft PR)
- Real Serper.dev SERP API swap
- Real Google Search Console API swap (`googleapis` + service account)
- Measure job (`src/measurement/measure.ts`)

---

## Definition of done for today

The optimize machine walks RESEARCH → SCOPE → VALIDATE with **real tool calls** (SERP mocked, GSC stubbed, crawl/build/validate real). `bun run check` is green. `--dry-run` exits 0 with structured tool data logged at each state. That's P3 done (except the pieces explicitly deferred to Day 3).