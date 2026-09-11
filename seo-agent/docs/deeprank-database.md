# DeepRank — Database Schema & Data Flow

> What lives in the database, which part of the agent writes or reads each table, and why
> every table matters to the optimization loop.
> Source of truth: `seo-agent/src/store/schema.sql` (spec `docs/deeprank-seo-agent.md` §17).
> Last updated: 2026-09-11

---

## 1. The 5 Tables at a Glance

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  keywords    │────▶│  keyword_positions│     │   pages     │
│  (what to    │     │  (position history)│     │  (what to   │
│   track)     │     │  daily snapshot    │     │   optimize) │
└──────┬───────┘     └──────────────────┘     └──────┬───────┘
       │                                              │
       │            ┌──────────────────┐              │
       └───────────▶│  opportunities   │◀─────────────┘
                    │  (picked winner)  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │    changes       │
                    │  (PR + measure)  │
                    └──────────────────┘
```

- `keywords` ↔ `keyword_positions`: one keyword has many daily position snapshots.
- `keywords` → `opportunities`: one keyword may produce many opportunities (over time).
- `pages` → `opportunities`: one page may be targeted by many opportunities.
- `opportunities` → `changes`: one opportunity implements at most one change (UNIQUE).

---

## 2. `keywords` — the input list

**What it stores:** the search terms you want to rank for.

| Column | Type | Meaning | Where the data comes from |
|---|---|---|---|
| `id` | BIGSERIAL | Auto-increment PK | DB |
| `term` | TEXT UNIQUE | The search query | **seed.sql** (human-curated), **future: GSC discovery** |
| `intent` | TEXT | `commercial` / `transactional` / `informational` | **seed.sql**, future: GSC/GA4 |
| `volume` | INTEGER | Monthly search volume | **NULL today** → future: GSC impressions proxy |
| `difficulty` | INTEGER | Keyword difficulty | **NULL today** → future: Serper.dev / Ahrefs |
| `target_url` | TEXT | Which page should rank for this keyword | **seed.sql**, **future: GSC page** |
| `status` | TEXT | `active` / `paused` / `retired` | **seed.sql** (default `active`) |
| `created_at` | TIMESTAMPTZ | Row created time | DB (auto) |

Seed rows (`store/seed.sql`):

```sql
('ecommerce accounting software india', 'commercial', NULL, NULL, '/resources/ecommerce-accounting', 'active')
('amazon seller gst accounting',        'commercial', NULL, NULL, '/solutions/amazon-sellers',       'active')
('flipkart payment reconciliation',     'commercial', NULL, NULL, '/resources/reconciliation',       'active')
('ecommerce accounting tally',          'commercial', NULL, NULL, '/erp-connector/accounting',       'active')
('d2c brand accounting',                'transactional', NULL, NULL, '/solutions/d2c-brands',       'active')
```

> `volume`/`difficulty` stay NULL on purpose — no fabricated data. They're filled only when
> a real keyword tool is wired.

**Why it matters:** this is the **input** to the entire pipeline. Everything downstream
flows from these rows. `target_url` tells RESEARCH which page to crawl, `intent` tells
SCOPE how to weight the score.

**Reads:** RESEARCH (`SELECT id, term, intent, target_url FROM keywords WHERE status='active'`),
SCOPE (checks `keyword_id` against opportunities to skip done work).
**Writes:** `seed.sql`; **future** GSC keyword discovery upserts terms with
`target_url` = the page Google already ranks for the query.

---

## 3. `keyword_positions` — position history

**What it stores:** daily position/CTR snapshots per keyword — the history the 28-day trend
is built from.

| Column | Type | Meaning | Where the data comes from |
|---|---|---|---|
| `keyword_id` | BIGINT FK → keywords | Which keyword | DB |
| `sample_date` | DATE | Which day | GSC API (daily pull) |
| `position` | NUMERIC | Average SERP position that day | GSC API |
| `clicks` | INTEGER | Clicks that day | GSC API |
| `impressions` | INTEGER | Impressions that day | GSC API |
| `ctr` | NUMERIC | Click-through rate | GSC API (clicks/impressions) |

UNIQUE `(keyword_id, sample_date)` → one snapshot per keyword per day.

**Why it matters:** this table is the **memory** of the formula. When real GSC is wired in,
the trend array `[day1, day7, day14, day28]` is built from the last 28 rows here, and that
trend drives the **momentum multiplier** in `score()` (`Driver.ts:89-99`).

**Status today:** empty — the GSC stub returns hardcoded metrics directly from the tool
layer (`src/tools/gsc.ts`), not from this table.

**Reads (future):** `GscService.fetchMetrics` →
`SELECT position, clicks, impressions, ctr FROM keyword_positions WHERE keyword_id=$1 ORDER BY sample_date DESC LIMIT 28`.
**Writes (future):** a daily GSC cron pulls metrics and inserts one row per keyword.

---

## 4. `pages` — the optimization targets

**What it stores:** the website pages that can be optimized.

| Column | Type | Meaning | Where the data comes from |
|---|---|---|---|
| `id` | BIGSERIAL | PK | DB |
| `url` | TEXT UNIQUE | The page path | **seed.sql** |
| `intent` | TEXT | Page intent | **seed.sql** |
| `h1` | TEXT | Current H1 tag | **CrawlService** (real) |
| `title` | TEXT | Current `<title>` tag | **CrawlService** (real) |
| `description` | TEXT | Current meta description | **CrawlService** (real) |
| `last_crawled_at` | TIMESTAMPTZ | Last crawl timestamp | CrawlService |
| `status` | TEXT | `active` / other | **seed.sql** |

Seed rows:

```sql
('/resources/ecommerce-accounting', 'commercial', 'active')
('/solutions/amazon-sellers',       'commercial', 'active')
('/resources/reconciliation',       'commercial', 'active')
('/erp-connector/accounting',       'commercial', 'active')
('/solutions/d2c-brands',           'transactional', 'active')
```

**Why it matters:** pages are the **targets**. When SCOPE picks a winner it looks up the
`page_id` from `url = target_url` to insert the `opportunities` row. The crawl tool fetches
`new URL(keyword.target_url, config.gscSiteUrl)` and logs title/h1/description, but does
**not yet write them back** to this table — that caching is a future enhancement.

**Reads:** SCOPE (`SELECT id, url FROM pages` to map `target_url` → `page_id`).
**Writes:** `seed.sql`; **future** CrawlService writes `title`, `h1`, `description`,
`last_crawled_at` after each crawl.

---

## 5. `opportunities` — the audit trail

**What it stores:** every optimization the agent has proposed — one row per SCOPE winner.

| Column | Type | Meaning | Where the data comes from |
|---|---|---|---|
| `id` | BIGSERIAL | PK | DB |
| `keyword_id` | BIGINT FK → keywords | Picked keyword | **SCOPE** (the winner) |
| `page_id` | BIGINT FK → pages | Page to optimize | **SCOPE** (looked up from `target_url`) |
| `action` | TEXT | What action to take | **SCOPE** (today: `"optimize metadata"`) |
| `justification` | TEXT | Why picked | **SCOPE** (`"highest priority score 32800.0"`) |
| `score` | NUMERIC | Computed score | **SCOPE** (formula) |
| `status` | TEXT | Lifecycle state | **SCOPE** inserts `proposed`; later states from pipeline |
| `created_at` | TIMESTAMPTZ | Proposed time | DB (auto) |
| `decided_at` | TIMESTAMPTZ | Approved/rejected time | **Future:** REVIEWER |

Status lifecycle:

```
proposed → optimizing → approved → done → measured
                            (or rejected)
```

Legal values: `proposed, optimizing, rejected, approved, done, measured`.

**Why it matters:** the **central link** between keywords/pages and changes, and the
**filter gate** against duplicate work. SCOPE skips any keyword whose opportunity is in
`done/measured/optimizing`, so a term isn't re-optimized every run.

**Reads:** SCOPE —
`SELECT DISTINCT keyword_id FROM opportunities WHERE status IN ('done','measured','optimizing')`
(already-completed filter), and a `JOIN changes` query to find pages with open PRs.
**Writes:** SCOPE inserts `proposed` rows (`Driver.ts:223-229`); **future** REVIEWER →
`approved`/`rejected`, GitHub merge → `optimizing`, measure job → `measured`.

---

## 6. `changes` — the PR + measurement record

**What it stores:** the concrete change (branch, PR, deploy) and its measured impact.

| Column | Type | Meaning | Where the data comes from |
|---|---|---|---|
| `id` | BIGSERIAL | PK | DB |
| `opportunity_id` | BIGINT FK → opportunities (UNIQUE) | Which opportunity this implements | **CREATE_PR** (future: `github.ts`) |
| `branch` | TEXT | Git branch name | **CREATE_PR** (future: `github.ts`) |
| `pr_url` | TEXT | GitHub PR URL | **CREATE_PR** (future: `github.ts`) |
| `diff_summary` | TEXT | Human-readable change summary | **CREATE_PR** (future: brain.ts) |
| `deployed_at` | TIMESTAMPTZ | When merged/deployed | **Future:** measure job detects merge |
| `measurement` | JSONB | Before/after metrics | **Future:** measure job writes `{position_before, position_after, ctr_before, ctr_after, …}` |

UNIQUE on `opportunity_id` → one change per opportunity.

**Why it matters:** the **output** table. When wired, it is the record of every PR the
agent opened, and `measurement` JSONB is the link between the action and its measured
result — the **closed loop** (spec §19). The partial index
`WHERE deployed_at IS NOT NULL AND measurement IS NULL` finds merged PRs that still need
measuring.

**Status today:** empty (`CREATE_PR` is a stub returning a placeholder URL).
**Reads:** SCOPE —
`SELECT DISTINCT o.page_id FROM opportunities o JOIN changes c ON c.opportunity_id = o.id WHERE c.pr_url IS NOT NULL AND c.deployed_at IS NULL`
(open-PR filter). **Future:** measure job reads `WHERE deployed_at IS NOT NULL AND measurement IS NULL`.
**Writes:** **future** `github.ts` (branch, pr_url), measure job (`deployed_at`, `measurement`).

---

## 7. Data Flow — who reads and writes what

```
┌────────────────────────────────────────────────────────────────────┐
│  HUMAN (seed.sql)                                                  │
│  ┌─────────────┐   ┌─────────────┐                                │
│  │  keywords    │   │  pages       │     volume/difficulty → NULL │
│  │  term        │   │  url         │     (filled by real APIs)    │
│  │  intent      │   │  intent      │                               │
│  │  target_url  │   │  status      │                               │
│  │  status      │   │              │                               │
│  └──────┬───────┘   └──────┬───────┘                               │
└─────────┼──────────────────┼───────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌────────────────────────────────────────────────────────────────────┐
│  RESEARCH (Driver.ts:141-180)                                      │
│  Reads DB: keywords (active rows)                                  │
│  Runs:     SerpService.fetchResults(term)        → mock table      │
│            GscService.fetchMetrics(term, "28d")  → stub metrics    │
│            CrawlService.crawlPage(url)           → real HTTP+parse │
│  Produces: ResearchRow[] { keywordId, term, intent, targetUrl,     │
│                            serp, gsc, crawl }   (carry, in memory) │
│  Writes DB: nothing                                                │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  SCOPE (Driver.ts:182-252)                                         │
│  Reads DB:  done set  (opportunities.status IN done/measured/optimizing) │
│             page map  (pages: target_url → id)                     │
│             open PRs  (opportunities JOIN changes: pr_url set,     │
│                        deployed_at IS NULL)                        │
│  Computes:  score() for each eligible row (4 filters + formula)    │
│  Writes DB: INSERT INTO opportunities (keyword_id, page_id, action,│
│             justification, score, status) VALUES (…,'proposed')    │
│  Carry:     reads research, writes selected                        │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  PLAN / ACT (stubs)                                                │
│  Reads DB: nothing · Reads carry: selected · Writes carry: change  │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  VALIDATE (Driver.ts:283-313)                                      │
│  Reads DB: nothing · Reads carry: change                           │
│  Runs:     BuildService.runBuild({cwd: REPO_ROOT})  → real astro  │
│            ValidateService.validateChange(change)  → real rules    │
│  Writes DB: nothing (failure → REVISE retry loop ≤3)               │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  REVIEWER / CREATE_PR (stubs)                                      │
│  Reads DB: nothing · Writes DB: nothing today                      │
│  Future: github.ts writes changes (branch, pr_url, diff_summary)   │
└────────────────────────────────────────────────────────────────────┘
```

In short: only **two states touch the database** today — RESEARCH **reads** `keywords`,
and SCOPE **reads** `keywords`/`pages`/`opportunities`/`changes` then **writes** one
`opportunities` row. VALIDATE, the tools' outputs, PLAN, ACT, REVIEWER and CREATE_PR are
pure functions over the carry.

---

## 8. Why every table matters

| Table | Importance | Without it … |
|---|---|---|
| `keywords` | Input — what to track | the agent has nothing to research |
| `keyword_positions` | Position history (28d trend) | the momentum multiplier can't work; scoring loses accuracy |
| `pages` | Keyword↔page mapping | SCOPE can't resolve `page_id`, so no opportunity row |
| `opportunities` | Audit trail + dedup gate | the agent re-optimizes the same keyword every run |
| `changes` | PR tracking + measurement | open-PR filter breaks; no closed-loop learning |

**Empty today by design:** `keyword_positions` and `changes`. They are the two pieces that
complete the loop — position history feeds the formula with real trend data, and changes
record what happened after a PR merged. Both are filled by real APIs (GSC + GitHub)
deferred to Day 3.

---

## 9. Queries in the code

| Purpose | Query | Location |
|---|---|---|
| Research input | `SELECT id, term, intent, target_url FROM keywords WHERE status='active' ORDER BY id` | `Driver.ts:149-151` |
| Already-completed filter | `SELECT DISTINCT keyword_id FROM opportunities WHERE status IN ('done','measured','optimizing')` | `Driver.ts:186-188` |
| Open-PR filter | `SELECT DISTINCT o.page_id FROM opportunities o JOIN changes c ON c.opportunity_id = o.id WHERE c.pr_url IS NOT NULL AND c.deployed_at IS NULL` | `Driver.ts:190-195` |
| Page id map | `SELECT id, url FROM pages` | `Driver.ts:197` |
| Winner insert | `INSERT INTO opportunities (keyword_id, page_id, action, justification, score, status) VALUES ($1,$2,$3,$4,$5,'proposed') RETURNING id` | `Driver.ts:223-229` |
| Idempotent seed | `INSERT … ON CONFLICT (term) DO NOTHING` | `seed.sql` |