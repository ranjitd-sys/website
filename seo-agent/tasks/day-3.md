# Today — P4 LLM Brain + P5 PR + Reviewer Hardening + Measure

---

## Non-negotiable (same as Day 1 & Day 2)

- Every service is an Effect `Context.Tag` + `Layer`.
- Errors are **typed**. No try/catch anywhere.
- Validation uses **Effect `Schema`** — not Zod — inside `seo-agent/`.
- Database / HTTP / CLI all run through Effect (`Effect.runPromise`).
- State machine stays XState v5, but each transition runs an Effect program.
- Verification happens after every task. No "I think it works".

---

## Decisions locked for today

- **AI for meaning. Code for facts.** LLM is used ONLY where meaning/interpretation/judgment/language is involved (spec §14): PLAN diagnose, ACT write, REVISE fix, REVIEWER judge, Measure learnings. Everything else (GSC/SERP calls, DB writes, scoring, filtering, char counting, JSON validation, build, git, PR, delta) stays deterministic code (spec §15).
- **Models:** Driver + REVISE = `openai/gpt-oss-120b` (Groq, free-tier friendly); Reviewer + learnings = same model (or override via `GROQ_MODEL` / `GROQ_REVIEWER_MODEL`). Provider chosen: **Groq** (OpenAI-compatible chat completions endpoint).
- **Groq via raw `fetch`** to `https://api.groq.com/openai/v1/chat/completions` wrapped in `Effect.tryPromise` (JSON mode `response_format: { type: "json_object" }`), decoded with Effect `Schema`; NEVER raw `try/catch`.
- **PR = draft** — human reviews and merges. No automatic merge.
- **Reviewer rules:** fabrication, product scope, positioning (accounting layer, NOT ERP replacement), tone, technical accuracy (GST/TCS/TDS/accounting).
- **SERP (T17) = SerpApi — signed up, real swap today.** `SERPAPI_KEY` goes in `.env`; `SerpServiceLive.fetchResults` calls SerpApi via raw `fetch` (no SDK dep). Fallback to mock when key absent so the run stays green.
- **GSC (T18) = PENDING — stays stubbed today.** GSC access has NOT been granted yet. Keep the stub in `GscServiceLive`; document the exact swap path as a TODO. When GSC is approved, replace the stub body with Search Console `searchanalytics.query` (JWT via `google-auth-library`) — interface unchanged. The run must stay green on the stub meanwhile.
- `bun run check` must stay green after every task.

---

## Task log (each completed item = checkbox + one line of what was verified)

### P4 — LLM Brain

- [x] **T12 — prompts.ts**
  - [x] `seo-agent/src/agent/prompts.ts` — 3 system prompts as typed consts:
    - `driverPrompt` (PLAN + ACT): DeepEcom SEO agent; given research + SERP competitors + crawl + keyword, diagnose the ranking gap (spec §Step 4 table: intent mismatch / technical / CTR / depth / coverage), then produce title ≤60 / description 120–160 / valid JSON-LD; never fabricate stats; never present future features as launched; positioning = accounting layer.
    - `revisePrompt` (REVISE): build/validate failed; here's the error; make the minimal fix; do not rewrite what works.
    - `reviewerPrompt` (REVIEWER): check fabrication, scope, positioning, tone, technical accuracy (spec §13 Step 8); return `pass` or `fail`.
  - [x] Prompts as plain exported consts consumed by brain.ts (decided: plain consts, not a Context.Service — prompts are pure data).
  - [x] **Verify:** prompts compile (`bun run check` green); contain spec §14/§15 constraints (no fabrication, ERP-replacement prohibition, product scope) in `POSITIONING_RULES` / `METADATA_RULES`.
  - [x] **Done:** `src/agent/prompts.ts` written; `POSITIONING_RULES` embeds "DeepEcom does NOT replace the ERP" + future-product scope guard; `METADATA_RULES` embeds title/desc/length bounds + "JSON ONLY".

- [x] **T13 — brain.ts (Groq service)**
  - [x] `seo-agent/src/agent/brain.ts` — Effect `Context.Service` `BrainService` + `BrainServiceLive`.
  - [x] Methods (contract):
    - `plan(input: { keyword, intent, crawl, serp, gsc, learnings })` → `Effect<PlanOutput, BrainError, SeoConfig>` (diagnosis + action + rationale, decoded via Effect `Schema`)
    - `act(input: { keyword, targetUrl, crawl, diagnosis, action, rationale })` → `Effect<Change, BrainError, SeoConfig>` (`{ filePath, title, description, jsonLd }`)
    - `revise(input: { change, lastReason })` → `Effect<Change, BrainError, SeoConfig>` (fixed change; clamped)
    - `review(input: ChangeSummary)` → `Effect<ReviewVerdict, BrainError, SeoConfig>` (`"pass" | "fail"`)
  - [x] Typed `BrainError { step, reason }`; JSON schema decoding of model output via `Schema.decodeUnknownOption` (invalid model output is a typed error, not a crash).
  - [x] Raw `fetch` to Groq chat completions; `Effect.tryPromise` only; deterministic `clamp` (title ≤60, desc 120–160, JSON-LD parse fallback).
  - [x] Stub fallback: when `GROQ_API_KEY` absent (empty), returns deterministic output so runs stay green.
  - [x] Config `SeoConfig` reworked: `openaiApiKey` → `groqApiKey` (with default `""`), `groqModel` + `groqReviewerModel` (default `openai/gpt-oss-120b`).
  - [x] **Verify:** `bun run check` green; dry-run (no key) uses stub path end-to-end: PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR, exit 0.
  - [x] **Done:** implemented; real-LLM verification deferred until a `GROQ_API_KEY` is added to `.env`.

- [x] **T14 — Wire LLM into Driver (replace PLAN/ACT/REVIEWER stubs + add REVISE)**
  - [x] `seo-agent/src/agent/Driver.ts`:
    - PLAN: `yield* brain.plan(...)` → carry gains `plan` result; emit `PLANNED { action }`.
    - ACT: `yield* brain.act(...)` → produce real `Change` from the model (deterministic `clamp` retained as safety net).
    - REVISE: `VALIDATION_FAILED`/`REVIEW_FAILED` reason fed to `brain.revise(change, lastReason)`; the fix replaces `carry.change` before looping back to VALIDATE (≤3 retries via machine context, then `ABORT`).
    - REVIEWER: `yield* brain.review(changeSummary)` → `REVIEW_PASSED` on `"pass"`, `REVIEW_FAILED` on `"fail"`.
  - [x] Add `BrainService` to `OptimizeEnv` requirements (replaced `Reviewer`).
  - [x] `cli.ts`: `BrainServiceLive` provided in the layer stack (replaced `ReviewerLive`); config log shows `groqApiKey`.
  - [x] **Verify:** `bun run check` green; `bun run src/cli.ts optimize --dry-run` completes: RESEARCH → SCOPE → PLAN(brain) → ACT(brain) → VALIDATE → REVIEWER(brain) → CREATE_PR → FINISHED, exit 0.
  - [x] **Done:** stub-mode dry-run verified above; real-key run pending.

- [x] **T19 — Reviewer hardening (4 test cases)**
  - [x] 4 deterministic probes against the LLM reviewer (fixture-driven, runnable via a small script or test):
    | Case | Input change contains… | Expected |
    |---|---|---|
    | fabrication | "500+ businesses trust DeepEcom" (unverified) | `fail` |
    | scope | "AI-powered autonomous inventory management" (future feature) | `fail` |
    | positioning | "DeepEcom replaces your ERP" | `fail` |
    | clean pass | verified, accurate, scoped metadata | `pass` |
  - [x] **Verify:** all 4 return the expected verdict with a reason; runs against the real Groq key now in `.env`; `Bun test` (or `bun run` script) green.
  - [x] **Done:** `src/agent/reviewerProbe.ts` + `bun run probe:reviewer` green against real Groq.
    - [x] `brain.review` contract now returns `ReviewOutput { verdict, reason }` (reason fed into `REVIEW_FAILED` in Driver instead of a generic string).
    - [x] fabrication → `fail` ("over 500 businesses" = unverified customer count)
    - [x] scope → `fail` (AI-powered autonomous inventory/order mgmt = future product)
    - [x] positioning → `fail` ("DeepEcom replaces your ERP" violates accounting-layer positioning)
    - [x] clean pass → `pass` (title 48 chars, desc 152 chars, no violations)
    - [x] Full dry-run with real key: PLAN → ACT → VALIDATE → REVIEWER (passed) → CREATE_PR → FINISHED, exit 0.

### P5 — PR Creation + Measure + Workflows

- [ ] **T15 — github.ts (branch, commit, draft PR via Octokit)**
  - [ ] `seo-agent/src/tools/github.ts` — Effect `Context.Service` `GithubService` + `GithubServiceLive`.
  - [ ] Methods: `createBranch(name)` → `Effect<string, GithubError>`; `commit(branch, filePath, content, message)` → `Effect<void, GithubError>`; `createPR(branch, title, body)` → `Effect<string, GithubError>` (returns PR URL).
  - [ ] Uses `GITHUB_TOKEN` (from Config); repo resolved from `git remote origin` (or env `GITHUB_REPO`).
  - [ ] Branch naming: `seo/<slug>-<keyword>` (e.g. `seo/amazon-sellers-amazon-seller-gst-accounting`).
  - [ ] Draft PR (`draft: true`) with body: keyword, score, justification, change summary.
  - [ ] Add dep `octokit` (typed errors wrapped, no `try/catch`).
  - [ ] **Verify:** real run creates branch → commit → draft PR on the repo; PR URL returned; clean up the test branch after.
  - [ ] **Done:** (fill in after verification)

- [ ] **T16 — Wire github.ts into Driver (replace CREATE_PR stub)**
  - [ ] `src/agent/Driver.ts` CREATE_PR: create branch, write the change file, commit, open draft PR, capture `prUrl`.
  - [ ] After PR: `UPDATE opportunities SET status = 'optimizing'` (spec §Step 3 / §Step 9) via Database; create the `changes` row (`branch`, `pr_url`, `diff_summary`).
  - [ ] `GithubService` added to `OptimizeEnv`.
  - [ ] **Verify:** `optimize --dry-run` (with `--no-dry-run` for real PR test) returns a real PR URL instead of the placeholder; `changes` row recorded.
  - [ ] **Done:** (fill in after verification)

- [ ] **T17 — Real SERP swap (SerpApi)**
  - [ ] Replace `SerpServiceLive.fetchResults` body with the SerpApi call; interface unchanged (`{ results: [{ rank, url, title, snippet }] }`).
  - [ ] Endpoint: `GET https://serpapi.com/search?engine=google&q=<keyword>&api_key=<key>&gl=in&hl=en` via raw `fetch` wrapped in `Effect.tryPromise`. Parse `organic_results[].{ position, link, title, snippet }` → `SerpResult[]`.
  - [ ] New Config: `SERPAPI_KEY` (redacted, default `""`); add to `.env.example` + Config service. Fallback to mock when key absent or request fails (run stays green).
  - [ ] **Verify:** with key in `.env` — real competitor titles/snippets for a seed keyword (spot-check against Google); without key — mock fallback, `bun run check` green.
  - [ ] **Done:** (fill in after verification)

- [ ] **T18 — Real GSC swap (PENDING — stays stubbed until GSC access is granted)**
  - [ ] **Status today: GSC creds are still PENDING.** Keep `GscServiceLive` on the stub. Add a TODO header comment in `src/tools/gsc.ts` documenting the exact swap path below.
  - [ ] **When GSC is approved, replace** `GscServiceLive.fetchMetrics` body with Search Console `searchanalytics.query` (raw REST + JWT via `google-auth-library`, or googleapis); interface unchanged (`{ clicks, impressions, position, ctr, trend[] }`).
  - [ ] Trend = 4 weekly snapshot queries (day 1/7/14/28) or one query grouped by week.
  - [ ] Use `GSC_CLIENT_EMAIL` + `GSC_PRIVATE_KEY` + `GSC_SITE_URL` from Config (already wired); install `google-auth-library` only when the swap ships.
  - [ ] Optional add when approved: `fetchAllQueries(siteUrl, window)` → `{ query, page, position, clicks, impressions }` for GSC keyword discovery (upsert into `keywords` with `target_url = page`).
  - [ ] Fallback to stub when credentials absent (run stays green).
  - [ ] **Verify (post-approval):** real position/impressions returned for a seed keyword; site must be verified in Search Console.
  - [ ] **Done:** (fill in after verification) — stub stays green meanwhile.

- [ ] **T20 — measure.ts (monthly measure job)**
  - [ ] `seo-agent/src/measurement/measure.ts` — Effect `Context.Service` `MeasureService` + `MeasureServiceLive`; pipeline `DETECT_MERGES → GSC_PULL → WRITE_DELTAS → LEARNINGS → FEED_RESEARCH` (spec §13).
  - [ ] DETECT_MERGES: `SELECT … FROM changes WHERE deployed_at IS NOT NULL AND measurement IS NULL AND deployed_at < now() - interval '3 weeks'`.
  - [ ] GSC_PULL: current metrics per keyword via `BrainService`? No — via `GscService.fetchMetrics`.
  - [ ] WRITE_DELTAS: compute `{ before, after, delta, verdict }` (`won` / `stuck` / `falling`), write into `changes.measurement` JSONB.
  - [ ] LEARNINGS: LLM (`gpt-4.1-mini`) summarizes patterns across changes → typed JSON.
  - [ ] FEED_RESEARCH: persist learnings so the next optimize run receives them as context (extend schema? — confirm `learnings` storage location; flag if a new table is needed).
  - [ ] `cli.ts` `measure` branch calls `MeasureService.run()`.
  - [ ] **Verify:** with a seeded merged `change` (deployed_at 4 weeks ago, measurement NULL), the job writes `measurement` + a learning.
  - [ ] **Done:** (fill in after verification)

- [ ] **T21 — GitHub Actions workflows**
  - [ ] `.github/workflows/optimize.yml` — `schedule: cron(0 9 * * 1)` weekly; runs `bun install && bun run src/cli.ts optimize`; secrets `SEO_DATABASE_URL`, `GROQ_API_KEY`, `GITHUB_TOKEN`, `GSC_*`, SERP key.
  - [ ] `.github/workflows/measure.yml` — `schedule: cron(0 9 1 * *)` monthly; runs `bun run src/cli.ts measure`.
  - [ ] Both support `workflow_dispatch` for manual runs.
  - [ ] **Verify:** `workflow_dispatch` on the repo runs both clean.
  - [ ] **Done:** (fill in after verification)

- [ ] **T22 — cli.ts wiring (new Layers)**
  - [ ] Provide `BrainServiceLive`, `GithubServiceLive`, `MeasureServiceLive` (and real Serp/Gsc live layers) stacked under the existing `OptimizeLive`; `measure` command runs the real pipeline.
  - [ ] **Verify:** `bun run check` green; `optimize --dry-run` and `measure` both run through Effect and exit clean.
  - [ ] **Done:** (fill in after verification)

---

## New packages

| Package | Purpose | Notes |
|---|---|---|
| raw `fetch` | Groq chat completions (brain.ts) | `https://api.groq.com/openai/v1/chat/completions`; JSON mode; no new dep |
| `octokit` | GitHub branch/commit/PR | `bun add octokit` |
| SerpApi (raw `fetch` + key) | Real SERP results (T17) | `https://serpapi.com/search?...` — no SDK dep; account already signed up |
| `google-auth-library` | GSC JWT (T18) | **Deferred** — install only when GSC access is approved |

GSC is still **pending** — T18 stays stubbed with a documented TODO swap path; no blocker. SERP ships today via SerpApi.

---

## Deliverables (end of day)

- [ ] `src/agent/prompts.ts` — 3 typed system prompts (driver, revise, reviewer)
- [ ] `src/agent/brain.ts` — `BrainService` + `BrainServiceLive` (plan/act/revise/review)
- [ ] `src/tools/github.ts` — `GithubService` (branch, commit, draft PR)
- [ ] Driver PLAN/ACT/REVISE/REVIEWER/CREATE_PR calling real services
- [x] Reviewer hardened: 4 test cases pass
- [ ] Real SERP swap (or fallback-to-mock documented)
- [ ] Real GSC swap (or fallback-to-stub documented)
- [ ] `src/measurement/measure.ts` full pipeline
- [ ] `.github/workflows/optimize.yml` + `measure.yml`
- [ ] `cli.ts` wires everything; `bun run check` green
- [ ] Every service is `Context.Service` + `Layer`; zero try/catch

---

## What's NOT in today (Day 4)

- E2E test: optimize → PR → merge → measure → learnings → next optimize reads learnings
- First live run + first real PR merged + `runbook.md`
- Error handling hardening (GSC rate limits, OpenAI retry, DB pool, structured JSON logging with timing)
- Seeded keyword run `ecommerce accounting software india` → `/resources/ecommerce-accounting`

---

## Definition of done for today

`bun run src/cli.ts optimize` creates a **real draft PR** with LLM-written metadata; the reviewer catches fabrication/scope/positioning violations; `bun run src/cli.ts measure` detects merged PRs and writes deltas + learnings. `bun run check` is green. That's P4 + P5 done (except Runbook/Day-4 items).