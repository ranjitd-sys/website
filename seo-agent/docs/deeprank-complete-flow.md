# DeepRank — Complete Flow

> The end-to-end flow of the DeepRank SEO agent: every state transition, every DB query, every tool call, every LLM invocation, from `bun run src/cli.ts` to the final PR or learning persisted.
> Last updated: 2026-09-14

---

# Part 1: OPTIMIZE (weekly)

## 1.1 Entry point — `src/cli.ts`

```
bun run src/cli.ts optimize [--dry-run]
```

**What happens:**

1. **`cli.ts:16-17`** — reads `process.argv[2]` = `"optimize"` and checks for `--dry-run` flag.
2. **`cli.ts:32-37`** — defines the `optimize` Effect program:
   - `loadConfig` — reads env vars via Effect `Config`, logs them.
   - Gets `OptimizeMachineService` from the Effect context (provided by `OptimizeLive` layer).
   - Calls `optimizer.run({ dryRun })` — this is `Driver.ts:504-512`.
   - Logs the final result (visited states + PR URL).
3. **`cli.ts:56-71`** — stacks 11 Effect layers and runs the program via `runProgram`:
   ```
   ValidateServiceLive → BuildServiceLive → CrawlServiceLive → GscServiceLive →
   SerpServiceLive → DatabaseLive → BrainServiceLive → ContentServiceLive →
   GithubServiceLive → OptimizeLive → SeoConfigLayer
   ```
4. **`edge.ts:4-17`** — `runProgram` converts the Effect to a Promise via `Effect.runPromise(Effect.result(program))`. On success: exits 0. On failure: prints error, exits 1.

---

## 1.2 Machine initialization — `Driver.ts:504-512`

```ts
const impl: Optimize = {
  run: (options) =>
    Effect.gen(function* () {
      const initial = getInitialSnapshot(optimizeMachine)  // Machine.ts:31 → IDLE state
      const nextCarry = { ...EMPTY_CARRY, maxRetries: initial.context.maxRetries }  // maxRetries=3
      const [started] = transition(optimizeMachine, initial, { type: "START" })  // IDLE → RESEARCH
      return yield* walk(started, 0, nextCarry, null, ["IDLE"], options)
    }),
}
```

**`RunCarry`** is the data bus that flows through the entire run:

```ts
{
  research: [],          // filled in RESEARCH step
  selected: null,        // filled in SCOPE step
  plan: null,            // filled in PLAN step
  change: null,          // filled in ACT step
  maxRetries: 3,         // from machine context
}
```

---

## 1.3 The walk loop — `Driver.ts:437-501`

`walk()` is a **recursive function** that drives the state machine forward. Each call:

1. Checks if current state is `FINISHED` → return result.
2. Checks if current state is `ABORTED` → return error.
3. If state is `REVISE` → special path (see §1.10 retry logic below).
4. Otherwise → calls `step(snapshot, carry, options)` to execute the state's work.
5. Gets back an `{ event, carry }` result.
6. Feeds the event into the XState machine: `transition(optimizeMachine, snapshot, event)` → gets next snapshot.
7. Logs the transition: `optimize: RESEARCH -> SCOPE (RESEARCHED)`.
8. Recursively calls `walk(nextSnapshot, ...)`.

This loop continues until `FINISHED` or `ABORTED`.

---

## 1.4 RESEARCH — `Driver.ts:119-158`

**State:** `RESEARCH`

**What it does:** For each active keyword in the DB, collect 3 data points.

**Step-by-step:**

1. **`Driver.ts:127-129`** — queries DB:
   ```sql
   SELECT id, term, intent, target_url FROM keywords WHERE status = 'active' ORDER BY id
   ```
2. **`Driver.ts:131-132`** — loops through each keyword row.
3. **`Driver.ts:133`** — skips keywords with no `target_url`.
4. **`Driver.ts:134`** — constructs the full URL: `new URL(keyword.target_url, config.gscSiteUrl).href`
5. **`Driver.ts:135`** — calls `SerpService.fetchResults(keyword.term, "google")`:
   - `serp.ts` → if `SERPAPI_KEY` set: real SerpApi call.
   - If no key: returns mock data from `SEED_SERP` (seeded competitor results for the 5 seed keywords).
6. **`Driver.ts:136`** — calls `GscService.fetchMetrics(keyword.term, "28d")`:
   - `gsc.ts` → stub mode: returns hardcoded GSC metrics (position, clicks, impressions, ctr, 4-point trend).
7. **`Driver.ts:137-143`** — calls `CrawlService.crawlPage(base)`:
   - `crawl.ts` → HTTP fetch the actual page, parse with `node-html-parser`, extract: title, description, H1, JSON-LD block count, internal links, broken links.
   - If crawl fails: logs warning, returns `null` (graceful degradation).
8. **`Driver.ts:144-156`** — pushes a `ResearchRow` with all 3 data points, logs the result.

**Output:** `{ event: "RESEARCHED", carry: { research: [ResearchRow, ...] } }`

**DB reads:** `keywords` (active rows)
**DB writes:** none
**External calls:** SERP API (or mock), GSC API (stub), live HTTP crawl per keyword

---

## 1.5 SCOPE — `Driver.ts:160-230`

**State:** `SCOPE`

**What it does:** Filter eligible keywords, rank by `opportunityScore`, pick the winner, insert an opportunity row.

**Step-by-step:**

1. **`Driver.ts:164-167`** — query DB for **done keywords**:
   ```sql
   SELECT DISTINCT keyword_id FROM opportunities WHERE status IN ('done', 'measured', 'optimizing')
   ```
   Creates a `Set` of keyword IDs to skip.

2. **`Driver.ts:168-174`** — query DB for **pages with open PRs**:
   ```sql
   SELECT DISTINCT o.page_id
     FROM opportunities o
     JOIN changes c ON c.opportunity_id = o.id
    WHERE c.pr_url IS NOT NULL AND c.deployed_at IS NULL
   ```
   Creates a `Set` of page IDs to skip.

3. **`Driver.ts:175`** — query DB for all pages:
   ```sql
   SELECT id, url FROM pages
   ```

4. **`Driver.ts:177-184`** — filter `carry.research` to get `eligible`:
   - Skip if keyword is in `doneKeywords` (already processed).
   - Skip if page has an open PR (in `openPrPages`).
   - Skip if GSC data is null.
   - Skip if position ≤ 3 AND CTR ≥ 3% (already ranking well — "stable top-3" filter).
   - Skip if SERP has no results.

5. **`Driver.ts:186-192`** — if no eligible keywords: log "no eligible opportunity", emit `ABORT` event.

6. **`Driver.ts:194`** — **rank** eligible keywords by `opportunityScore(intent, gsc)` (from `shared/scoring.ts`):
   ```
   score = impressions × position × INTENT_WEIGHT[intent] × momentumMultiplier(trend)
   ```
   - `INTENT_WEIGHT`: commercial=1.0, transactional=0.9, informational=0.5
   - `momentumMultiplier`: 1.6 if trend improving ≥30%, 1.3 if ≥10%, 0.6 if declining ≥5%, else 1.0

7. **`Driver.ts:195-196`** — pick `ranked[0]` as the winner, compute score.

8. **`Driver.ts:197`** — find the page ID for the winner's target URL.

9. **`Driver.ts:200-210`** — if page exists: **insert opportunity row** into DB:
   ```sql
   INSERT INTO opportunities (keyword_id, page_id, action, justification, score, status)
   VALUES ($1, $2, 'optimize metadata', 'highest priority score X', X, 'proposed')
   RETURNING id
   ```

10. **`Driver.ts:212-214`** — log: `optimize: selected "keyword" (score=X) -> /path (opportunity=Y)`

**Output:** `{ event: "OPPORTUNITY_SELECTED", carry: { selected: { keywordId, opportunityId, term, targetUrl, score, intent } } }`

**DB reads:** `opportunities`, `changes`, `pages`
**DB writes:** `opportunities` (insert proposed)

---

## 1.6 PLAN — `Driver.ts:232-266`

**State:** `PLAN`

**What it does:** LLM diagnoses why the selected keyword is underperforming.

**Step-by-step:**

1. **`Driver.ts:234`** — get `BrainService` from Effect context.
2. **`Driver.ts:236-237`** — get `selected` from carry and the matching `research` row.
3. **`Driver.ts:238-240`** — if no selection or research: ABORT.
4. **`Driver.ts:241-249`** — extract the relevant data from the research row: crawl (title, description), SERP (competitor results), GSC (impressions, position, ctr). Maps to plain objects.
5. **`Driver.ts:250-252`** — **query DB for recent learnings**:
   ```sql
   SELECT content FROM learnings ORDER BY created_at DESC LIMIT 5
   ```
6. **`Driver.ts:253-260`** — **call `brain.plan()`**:
   - `brain.ts:191-193` — if stub mode (no `GROQ_API_KEY`): returns `stubPlan()` with canned diagnosis.
   - If real: calls `complete("plan", PlanOutputSchema, driverPrompt(input), "Diagnose the ranking gap.", false)`:
     - **`prompts.ts:driverPrompt`** builds the system prompt with:
       - `POSITIONING_RULES` (DeepEcom positioning constraints)
       - Keyword, intent, crawl data, SERP data, GSC data
       - Last 5 learnings
     - **`brain.ts:145-156` `complete`**:
       - Gets `SeoConfig` from context.
       - Calls `chatJson("plan")` → raw `fetch` to `api.groq.com/openai/v1/chat/completions` with `response_format: { type: "json_object" }`, `temperature: 0.2`.
       - Parses the JSON response.
       - Decodes via `PlanOutputSchema` (Effect Schema: `{ diagnosis, action, rationale }`).
7. **`Driver.ts:261`** — log: `optimize: plan -> {action}`

**Output:** `{ event: "PLANNED", carry: { plan: { diagnosis, action, rationale } } }`

**DB reads:** `learnings` (last 5)
**DB writes:** none
**External calls:** Groq API (or stub)

---

## 1.7 ACT — `Driver.ts:268-291`

**State:** `ACT`

**What it does:** LLM writes the actual metadata (title, description, JSON-LD).

**Step-by-step:**

1. **`Driver.ts:270`** — get `BrainService`.
2. **`Driver.ts:271-274`** — get `selected` and `plan` from carry. If either is missing: ABORT.
3. **`Driver.ts:276-280`** — extract crawl data from research row (for current page title/description).
4. **`Driver.ts:281-288`** — **call `brain.act()`**:
   - `brain.ts:195-199` — if stub mode: returns `stubAct()` (canned "Optimize {keyword}" title + fallback description + fallback JSON-LD).
   - If real: calls `complete("act", ChangeSchema, actPrompt(input), "Write the optimized metadata.", false)`:
     - **`prompts.ts:actPrompt`** builds prompt with: keyword, target URL, diagnosis, action, rationale, current crawl data, `METADATA_RULES` (title ≤60 chars, description 120–160 chars, valid JSON-LD, no fabrication).
     - **`brain.ts:145-156` `complete`** → Groq fetch → JSON decode → `Schema` validate → returns `{ title, description, jsonLd }`.
   - **`brain.ts:198`** → `Effect.map((raw) => clamp(raw, ...))` — the **clamp function** (`brain.ts:123-143`):
     - Title: truncated to 60 characters max (code-point safe via `Array.from`).
     - Description: if < 120 chars, appends " Reconcile payments and get ERP-ready accounting automatically." repeatedly until ≥ 120. If > 160 chars: truncated to 160.
     - JSON-LD: parsed via `JSON.parse`. If invalid: falls back to `FALLBACK_JSONLD` (a basic Article schema).
     - Returns a `Change` object: `{ filePath, title, description, jsonLd }`.
5. **`Driver.ts:289`** — log: `optimize: wrote change -> src/pages/path.astro (title="...")`

**Output:** `{ event: "EDITED", carry: { change: { filePath, title, description, jsonLd } } }`

**DB reads:** none
**DB writes:** none
**External calls:** Groq API (or stub)

---

## 1.8 VALIDATE — `Driver.ts:293-323`

**State:** `VALIDATE`

**What it does:** Two real gates — build the site, then check rules.

**Step-by-step:**

1. **`Driver.ts:295-296`** — get `BuildService` and `ValidateService`.
2. **`Driver.ts:297-299`** — if no change in carry: `VALIDATION_FAILED`.
3. **`Driver.ts:302`** — **Gate 1: Astro build**:
   - Calls `build.runBuild({ cwd: REPO_ROOT })` where `REPO_ROOT` = `path.resolve(import.meta.dirname, "..", "..", "..")` (the website repo root).
   - `build.ts` spawns `npx astro build` as a child process, captures stderr.
   - Parses stderr for Astro-style error entries.
4. **`Driver.ts:303-311`** — if build fails: `VALIDATION_FAILED` with first error message.
5. **`Driver.ts:314`** — **Gate 2: Rule checks**:
   - Calls `validate.validateChange(change)`.
   - `validate.ts` runs:
     - Title length ≤ 60 characters
     - Description length 120–160 characters
     - JSON-LD parses without error
   - Returns `{ pass: boolean, findings: ValidateFinding[] }`.
6. **`Driver.ts:315-319`** — if validation fails: `VALIDATION_FAILED` with findings joined by `"; "`.
7. **`Driver.ts:322`** — if both pass: `VALIDATION_PASSED`.

**Output:** `{ event: "VALIDATION_PASSED" }` or `{ event: "VALIDATION_FAILED", reason: "..." }`

**DB reads:** none
**DB writes:** none
**External calls:** `astro build` (local process)

---

## 1.9 REVIEWER — `Driver.ts:325-352`

**State:** `REVIEWER`

**What it does:** LLM judges the change against positioning, scope, and fabrication rules.

**Step-by-step:**

1. **`Driver.ts:327`** — get `BrainService`.
2. **`Driver.ts:328-340`** — build the review input from `change` (title, description, diff summary). If dry-run: passes "no change" as the review input.
3. **`Driver.ts:341`** — **call `brain.review()`**:
   - `brain.ts:215-221` — if stub mode: returns `{ verdict: "pass", reason: "stub reviewer" }`.
   - If real: calls `complete("review", ReviewSchema, reviewerPrompt(input), "Return your verdict.", true)`:
     - **Note the `reviewer: true` flag** — this makes `chatJson` use `shape.groqReviewerModel` instead of `shape.groqModel` (a separate, potentially stronger model).
     - **`prompts.ts:reviewerPrompt`** builds the review prompt with: title, description, diff summary, positioning rules, fabrication checklist, scope rules.
     - Returns `{ verdict: "pass" | "fail", reason: string }`.
   - If review call fails (network error etc.): gracefully falls back to `{ verdict: "fail", reason: "reviewer unavailable: ..." }`.
4. **`Driver.ts:349-351`** — pass → `REVIEW_PASSED`; fail → `REVIEW_FAILED` (which sends the state to REVISE).

**Output:** `{ event: "REVIEW_PASSED" }` or `{ event: "REVIEW_FAILED", reason: "..." }`

**DB reads:** none
**DB writes:** none
**External calls:** Groq API (or stub)

---

## 1.10 REVISE (retry loop) — `Driver.ts:459-480`

**State:** `REVISE`

This is the **special path in `walk()`**, not a normal `step()` call. This is where the retry logic lives.

**What happens when VALIDATE or REVIEWER fails:**

1. The machine transitions to `REVISE`.
2. `walk()` checks: `state === "REVISE"` (`Driver.ts:459`).
3. **`Driver.ts:460-461`** — if `retries >= maxRetries` (3): emit `ABORT`. The run is dead.
4. **`Driver.ts:464`** — increment `nextRetries`.
5. **`Driver.ts:465-466`** — get `BrainService`, get the failing `change` from carry.
6. **`Driver.ts:467`** — get `lastReason` from the machine context (set by `assign({ lastReason: event.reason })` when `VALIDATION_FAILED` or `REVIEW_FAILED` fired).
7. **`Driver.ts:469`** — **call `brain.revise()`**:
   - `brain.ts:200-214` — if stub mode: returns the input change unchanged (`stubRevise`).
   - If real: calls `complete("revise", ChangeSchema, revisePrompt({ ... }), "Fix the failing change minimally.", false)`:
     - **`prompts.ts:revisePrompt`** builds the prompt with: the original change (title, description, jsonLd) + the exact failure reason. The instruction is to fix minimally — change only what's needed.
     - Returns a new `{ title, description, jsonLd }`.
   - `brain.ts:214` → `Effect.map((raw) => clamp(raw, input.change.filePath))` — clamp again.
   - If revise call fails: logs, returns original change unchanged (graceful degradation).
8. **`Driver.ts:476`** — updates `nextCarry` with the revised change.
9. **`Driver.ts:479`** — emits `REVISED` event → machine goes back to `VALIDATE`.
10. The walk loop continues: VALIDATE → pass → REVIEWER → pass → CREATE_PR. Or fail again → REVISE again (up to 3 total).

**The retry loop:**

```
VALIDATE (fail) → REVISE → VALIDATE (fail) → REVISE → VALIDATE (fail) → REVISE → VALIDATE (fail) → ABORT
     attempt 1           attempt 2           attempt 3           attempt 4 = exceeded
```

---

## 1.11 CREATE_PR — `Driver.ts:354-430`

**State:** `CREATE_PR`

**What it does:** Apply the change to the file, create a git branch, commit, open a draft PR, record everything in the DB.

**Step-by-step:**

1. **`Driver.ts:356-359`** — if no selection or change: ABORT.
2. **`Driver.ts:362-368`** — **if dry-run**: log "skipping branch/commit/PR", return placeholder URL `"https://github.com/placeholder/dry-run"`. The machine transitions to FINISHED.
3. **`Driver.ts:370-372`** — get `GithubService`, `ContentService`, `Database`.
4. **`Driver.ts:374`** — construct branch name: `seo/${slugify(targetUrl)}-${slugify(term)}` (e.g., `seo/resources-ecommerce-accounting-ecommerce-accounting-software-india`).
5. **`Driver.ts:375-380`** — **apply change** via `content.applyChange()`:
   - `content.ts` reads the file at `REPO_ROOT/${filePath}`.
   - Parses the HTML with `node-html-parser`.
   - Replaces `<title>` text content.
   - Replaces `meta[name="description"]` content attribute.
   - Upserts a `<script type="application/ld+json">` block (creates if missing, replaces existing).
   - Returns `{ filePath, content }` (the modified file content).
6. **`Driver.ts:381`** — **create git branch**: `github.createBranch(branch)`:
   - `github.ts` resolves `owner/repo` from `git remote origin` or `GITHUB_REPO` env.
   - Gets the default branch name via Octokit `repos.get()`.
   - `baseSha()` resolves the commit SHA: calls `git.getRef("heads/main")` → `object.sha`.
   - Creates the new branch: `git.createRef({ ref: "refs/heads/...", sha: baseSha })`.
7. **`Driver.ts:382-387`** — **commit**: `github.commit({ branch, filePath, content, message })`:
   - Creates a blob: `git.createBlob({ content, encoding: "utf-8" })`.
   - Gets the tree of the new branch: `git.getTree({ tree_sha })`.
   - Creates a new tree with the modified file: `git.createTree({ tree: [{ path, mode, type: "blob", sha: blobSha }] })`.
   - Creates a commit: `git.createCommit({ message, tree: newTree.sha, parents: [branchSha] })`.
   - Updates the branch ref: `git.updateRef({ ref: "heads/branch", sha: commitSha })`.
8. **`Driver.ts:388-392`** — **open draft PR**: `github.createPR({ branch, title, body })`:
   - `git.createPullRequest({ title, body, head: branch, base: defaultBranch, draft: true })`.
9. **`Driver.ts:394-409`** — **record in DB** (if `opportunityId > 0`):
   - `UPDATE opportunities SET status = 'optimizing' WHERE id = $1`
   - `INSERT INTO changes (opportunity_id, branch, pr_url, diff_summary) VALUES (...) ON CONFLICT ...`
10. **`Driver.ts:410-423`** — **snapshot baseline** (if GSC data exists):
    - `INSERT INTO keyword_positions (keyword_id, sample_date, position, clicks, impressions, ctr) VALUES (..., now(), ...)`
    - This records the current ranking at the time of the PR — used later by `measure` to compute before/after deltas.

**Output:** `{ event: "PR_CREATED", prUrl: "https://github.com/..." }`

**DB reads:** none
**DB writes:** `opportunities` (status → optimizing), `changes` (insert), `keyword_positions` (insert baseline)
**External calls:** GitHub API (Octokit) — branch, blob, tree, commit, PR.

---

## 1.12 FINISHED / ABORTED

**State:** `FINISHED` (type: "final") or `ABORTED` (type: "final")

The `walk()` function detects these states and returns:
- `FINISHED`: `{ status: "finished", prUrl, visited }` — logged by `cli.ts:36`.
- `ABORTED`: throws `DriverError` — caught by `runProgram`, logged as `fatal: ...`.

The `visited` array contains every state the machine passed through, e.g.:

```
["IDLE", "RESEARCH", "SCOPE", "PLAN", "ACT", "VALIDATE", "REVIEWER", "CREATE_PR", "FINISHED"]
```

If retries happened:

```
["IDLE", "RESEARCH", "SCOPE", "PLAN", "ACT", "VALIDATE", "REVISE", "VALIDATE", "REVIEWER", "CREATE_PR", "FINISHED"]
```

---

# Part 2: MEASURE (monthly)

## 2.1 Entry point — `cli.ts:46-55`

```
bun run src/cli.ts measure
```

Stacks 5 layers (fewer than optimize — no crawl, build, validate, content, or github):

```
GscServiceLive → DatabaseLive → BrainServiceLive → MeasureLive → SeoConfigLayer
```

## 2.2 The measure pipeline — `src/measurement/measure.ts`

**`impl.run()`** (`measure.ts:210-216`) is a single Effect that chains 5 steps sequentially:

```
DETECT_MERGES → GSC_PULL → WRITE_DELTAS → LEARNINGS → FEED_RESEARCH
```

## 2.3 DETECT_MERGES — `measure.ts:60-76`

```sql
SELECT c.id, c.opportunity_id, o.keyword_id, k.term
  FROM changes c
  JOIN opportunities o ON o.id = c.opportunity_id
  JOIN keywords k ON k.id = o.keyword_id
 WHERE c.deployed_at IS NOT NULL
   AND c.measurement IS NULL
   AND c.deployed_at < now() - interval '3 weeks'
 ORDER BY c.deployed_at
```

Finds changes where:
- A PR was merged (`deployed_at IS NOT NULL`).
- No measurement yet (`measurement IS NULL`).
- At least 3 weeks old (enough time for rankings to shift).

Returns an array of `ChangeRow`s: `{ id, opportunity_id, keyword_id, term }`.

## 2.4 GSC_PULL — `measure.ts:79-102`

For each change row, calls `gsc.fetchMetrics(term, "28d")` to get current metrics.

- If GSC is unavailable for a keyword: logs a warning, skips that keyword (doesn't fail the whole run).
- Builds a `Map<keyword_id, GscMetrics>` with fresh position/clicks/impressions/ctr.

## 2.5 WRITE_DELTAS — `measure.ts:104-164`

For each change with available current metrics:

1. **`measure.ts:110-111`** — **fetch baseline**:
   ```sql
   SELECT position FROM keyword_positions WHERE keyword_id = $1 ORDER BY sample_date DESC LIMIT 1
   ```
   This is the position snapshot taken at PR creation time (in `CREATE_PR` step).

2. **`measure.ts:134`** — get current metrics from the GSC map.

3. **`measure.ts:138-143`** — `before` = baseline position (or current if no baseline). `after` = current position.

4. **`measure.ts:145`** — `delta` = before - after (positive = ranking improved).

5. **`measure.ts:148-149`** — **`verdictOf()`** (`measure.ts:27-35`):
   - If `delta > 1.5` → `"won"` (meaningfully improved).
   - If `delta < -1.5` → `"falling"` (worse).
   - Otherwise → `"stuck"` (no meaningful change).

6. **`measure.ts:152-161`** — update the `changes` row:
   ```sql
   UPDATE changes
   SET measurement = jsonb_build_object(
     'before', $1, 'after', $2, 'delta', $3, 'verdict', $4
   )
   WHERE id = $5
   ```

7. **`measure.ts:163`** — update the opportunity: `UPDATE opportunities SET status = 'measured' WHERE id = $1`

## 2.6 LEARNINGS — `measure.ts:176-208`

If there are measured changes:

1. **`measure.ts:185-186`** — **call `brain.learn()`**:
   - `brain.ts:222-231` — if stub mode: returns `stubLearn()` (one string per delta summarizing the movement).
   - If real: calls `complete("learn", LearningsSchema, learnPrompt(deltas), "Generalize the measured results into learnings.", false)`:
     - **`prompts.ts:learnPrompt`** builds the prompt with: all deltas (`"keyword": before → after (verdict)`), instruction to produce 1-3 transferable learnings about what kinds of metadata interventions correlate with ranking movement.
     - Returns `{ learnings: string[] }`.

2. **`measure.ts:193-197`** — **persist each learning**:
   ```sql
   INSERT INTO learnings (content) VALUES ($1)
   ```
   Each learning string becomes a row in the `learnings` table.

3. Next week's optimize run will `SELECT ... FROM learnings ORDER BY created_at DESC LIMIT 5` in the **PLAN** step and feed them to the LLM as context.

## 2.7 The closed loop

```
Week 1:  OPTIMIZE → picks keyword → plans → writes metadata → opens draft PR
  ↓
Human reviews → merges PR → code goes live
  ↓ (3+ weeks pass)
Month 1: MEASURE → detects merged PR → pulls GSC → computes before/after
         → LLM writes learnings → persisted to DB
  ↓
Week 5:  OPTIMIZE → PLAN step reads last 5 learnings
         → LLM has context from past results → better diagnosis → better metadata
  ↓
Month 2: MEASURE → detects the new merged PR → measures again → new learnings
  ↓
(repeat forever)
```

---

# Part 3: STUB MODE (when no GROQ_API_KEY)

Every LLM call has a stub branch checked at runtime:

| Method | Stub behavior |
|---|---|
| `brain.plan()` | Returns canned: `"Under-optimized metadata for {keyword} (stub; no GROQ_API_KEY)."` |
| `brain.act()` | Returns: title=`"Optimize {keyword}"`, description=fixed track, jsonLd=fallback Article |
| `brain.revise()` | Returns the input change unchanged (no-op) |
| `brain.review()` | Returns `{ verdict: "pass", reason: "stub reviewer" }` |
| `brain.learn()` | Returns one string per delta: `"{keyword}" moved X → Y (verdict); metadata changes can shift ranking.` |

This means:
- With blank credentials: **full pipeline runs end-to-end**, state machine completes normally, PR is created (or dry-run placeholder).
- With real Groq key: the LLM actually reasons about the keyword, diagnosis, and content.

---

# Part 4: DATA FLOW SUMMARY

## Optimize — who reads/writes what

| Step | Reads | Writes | Calls |
|---|---|---|---|
| RESEARCH | `keywords` (active) | — | serp.ts, gsc.ts, crawl.ts |
| SCOPE | `opportunities`, `changes`, `pages` | `opportunities` (proposed) | shared/scoring.ts |
| PLAN | `learnings` (last 5) | — | brain.ts → prompts.ts → Groq |
| ACT | — | — | brain.ts → prompts.ts → Groq → brain.ts:clamp |
| VALIDATE | — | — | build.ts (astro build), validate.ts (rules) |
| REVIEWER | — | — | brain.ts → prompts.ts → Groq |
| REVISE | — | — | brain.ts → prompts.ts → Groq → brain.ts:clamp |
| CREATE_PR | — | `opportunities` (→optimizing), `changes` (insert), `keyword_positions` (baseline) | content.ts, github.ts |

## Measure — who reads/writes what

| Step | Reads | Writes | Calls |
|---|---|---|---|
| DETECT_MERGES | `changes`, `opportunities`, `keywords` | — | — |
| GSC_PULL | — | — | gsc.ts |
| WRITE_DELTAS | `keyword_positions` (baseline) | `changes.measurement` (JSONB), `opportunities` (→measured) | — |
| LEARNINGS | — | `learnings` (insert) | brain.ts → prompts.ts → Groq |

---

# Part 5: FILE RESPONSIBILITY MAP

## Entry & config

| File | Responsibility |
|---|---|
| `src/cli.ts` | Entry point. Reads `argv[2]` (`optimize`/`measure`) and `--dry-run`; logs the loaded config; stacks service Layers and runs the program. |
| `src/Config.ts` | Reads env into typed `SeoConfigShape` via Effect `Config.all`; GSC/Groq/GitHub/SerpApi default empty, `SEO_DATABASE_URL` required. |
| `src/edge.ts` | `runProgram` — runs any Effect, prints a clean fatal error and `process.exit(1)` on failure. |

## Types & shared helpers

| File | Responsibility |
|---|---|
| `src/types/market.ts` | Market-data vocabulary: SERP result shapes, GSC metric/window shapes, crawl result shape. |
| `src/types/agent.ts` | Agent vocabulary: the change to apply, brain I/O types, measurement verdict, driver run types. |
| `src/shared/scoring.ts` | Pure scoring math: intent weights, momentum multiplier, the `opportunityScore` formula. |
| `src/shared/text.ts` | Pure string helpers: `slugify`, `describeFinding`. |

## Agent core

| File | Responsibility |
|---|---|
| `src/agent/Machine.ts` | XState v5 state machine. Declares states, events, transitions, retry context. No side effects. |
| `src/agent/Driver.ts` | The orchestrator. `step()` maps each state to an Effect program; `walk()` drives transitions with retry handling; `impl.run` starts the machine and walks to a final state. |
| `src/agent/brain.ts` | The LLM client. `plan`/`act`/`revise`/`review`/`learn` methods; raw Groq fetch, Effect Schema decoding, deterministic `clamp`, stub mode. |
| `src/agent/prompts.ts` | Pure prompt builders: `driverPrompt`, `actPrompt`, `revisePrompt`, `reviewerPrompt`, `learnPrompt`, plus shared rules. |

## Tools

| File | Responsibility |
|---|---|
| `src/tools/serp.ts` | Fetches top-10 SERP for a keyword. Real SerpApi call or seeded mock. |
| `src/tools/gsc.ts` | Pulls GSC metrics. Currently a stub; real swap path documented in a TODO header. |
| `src/tools/crawl.ts` | Crawls a page: title, description, H1, JSON-LD block count, internal links, broken links. |
| `src/tools/content.ts` | Reads a site file and applies the change (replace title/description, upsert JSON-LD). |
| `src/tools/validate.ts` | Rule checks: title ≤60, description 120–160, JSON-LD parses. |
| `src/tools/build.ts` | Runs `astro build` in the site repo, captures and parses errors. |
| `src/tools/github.ts` | Octokit wrapper: create branch (from SHA), commit (blob→tree→commit→update ref), open draft PR. |

## Services & store

| File | Responsibility |
|---|---|
| `src/services/Database.ts` | Thin pg `Pool` wrapper exposing a typed `query` Effect. |
| `src/store/schema.sql` | Idempotent DDL: `keywords`, `keyword_positions`, `pages`, `opportunities`, `changes`, `learnings`. |
| `src/store/seed.sql` | Idempotent seed: 5 pages + 5 keywords. |

## Measurement & CI

| File | Responsibility |
|---|---|
| `src/measurement/measure.ts` | Monthly pipeline: detect merged changes → pull GSC → write deltas → LLM learnings → persist. |
| `.github/workflows/optimize.yml` | Weekly (Mon 09:00 UTC) + manual run of `optimize`. |
| `.github/workflows/measure.yml` | Monthly (1st 09:00 UTC) + manual run of `measure`. |