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

- [ ] **T9 — Build tool**
  - [ ] `seo-agent/src/tools/build.ts` — Effect `Context.Service` `BuildService` + `BuildServiceLive`
  - [ ] Method `runBuild()` → `{ ok: boolean, errors: [{ file, message }] }` matching `BuildOutput` in registry
  - [ ] Runs `astro build` as child process in the repo root (`bun run build`, cwd = parent of `seo-agent/`), captures exit code + stderr
  - [ ] Parse stderr into `errors: [{ file, message }]` where possible; empty `errors` + `ok: true` when exit 0
  - [ ] Typed error `BuildError { reason }` (missing astro, spawn failure)
  - [ ] **Verify:** build passes → `{ ok: true, errors: [] }`; break a file → `{ ok: false, errors: [...] }` captures the failing file

- [ ] **T10 — Validate tool**
  - [ ] `seo-agent/src/tools/validate.ts` — Effect `Context.Service` `ValidateService` + `ValidateServiceLive`
  - [ ] Method `validateChange(change)` → `{ pass: boolean, findings: [{ field, message }] }` matching `ValidateOutput` in registry
  - [ ] Checks (pure code, spec §6): title ≤60 chars; description 120–160 chars inclusive; JSON-LD string parses via `JSON.parse` when present
  - [ ] **Verify:** valid change (50-char title, 140-char desc, valid JSON-LD) → `pass: true`; 70-char title → `findings[0].field === "title"`; 80-char desc → `field === "description"`; malformed JSON-LD → `field === "jsonLd"`

- [ ] **T11 — Wire tools into Driver**
  - [ ] `seo-agent/src/agent/Driver.ts` — `step()` calls real tools per state; services added to the Optimize service's requirements
  - [ ] RESEARCH → `yield* SerpService.fetchResults` + `yield* GscService.fetchMetrics` + `yield* CrawlService.crawlPage`, log data, emit `RESEARCHED`
  - [ ] SCOPE → compute `score = volume × position × intent × momentum`, apply filters (already-completed / open PR / stable top-3 / missing-data), emit `OPPORTUNITY_SELECTED` with `opportunityId`
  - [ ] VALIDATE → `yield* BuildService.runBuild` + `yield* ValidateService.validateChange`; fail → `VALIDATION_FAILED { reason }` (triggers REVISE/retry cap), pass → `VALIDATION_PASSED`
  - [ ] Keep PLAN/ACT/CREATE_PR as stubs (LLM + PR on Day 3); REVIEWER unchanged
  - [ ] Wire `keywords`/`targetUrl` into driver input (read target from seeded DB via `Database` service where available)
  - [ ] Provide new Layers in `seo-agent/src/cli.ts` (`SerpServiceLive`, `GscServiceLive`, `CrawlServiceLive`, `BuildServiceLive`, `ValidateServiceLive`)
  - [ ] **Verify:** `bun run src/cli.ts optimize --dry-run` walks `IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED` end-to-end with real tool calls, exits 0

---

## New packages

| Package | Purpose | Notes |
|---|---|---|
| `node-html-parser` | Lightweight HTML parsing for crawl tool | `bun add node-html-parser` (runtime dep) |

No package needed for SERP/GSC (mocked/stubbed), build (`node:child_process`), or validate (pure code). Node's built-in `fetch` covers HTTP.

---

## Deliverables (end of day)

- [ ] `src/tools/serp.ts` — mock SERP data for 5 seed keywords
- [ ] `src/tools/gsc.ts` — stub GSC metrics + 28-day trend for 5 seed keywords
- [ ] `src/tools/crawl.ts` — real crawl (fetch + `node-html-parser`) over a target URL
- [ ] `src/tools/build.ts` — real `astro build` execution with parsed errors
- [ ] `src/tools/validate.ts` — deterministic title/description/JSON-LD checks
- [ ] `src/agent/Driver.ts` — `step()` calls real tools at RESEARCH, SCOPE, VALIDATE
- [ ] `src/cli.ts` — provides all five new tool Layers
- [ ] `bun run check` passes; `bun run src/cli.ts optimize --dry-run` walks the machine with live tool calls and exits 0
- [ ] Every tool is `Context.Service` + `Layer`; zero try/catch in new code

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