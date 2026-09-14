# DeepRank — Data Sources

> Where every piece of data in the agent comes from. Source: `seo-agent/src/tools/*`, `src/store/*`.
> Last updated: 2026-09-14

## Quick cheat-sheet

| Data point | Correct source |
|---|---|
| **Search volume** (market demand) | Google Ads Keyword Planner / Ads API (NOT GSC) |
| **Keyword list** (queries your site appears for) | GSC Queries API (`searchanalytics.query`, `dimensions: ["query"]`) |
| **Clicks, impressions, position, CTR** | GSC |
| **Momentum / trend** | GSC (4 weekly snapshots) |
| **Keyword difficulty** (0–100) | Ahrefs / SEMrush / Moz (paid, optional) |
| **Intent classification** | DB seed today (manual); **LLM/brain** in the planned design for discovered keywords |
| **Competitor SERP** | SerpApi / Serper.dev / Serpstack |
| **Page structure** | Live crawl |

## All data sources

| Source | Where it lives | What it provides | Status |
|---|---|---|---|
| **DB → keywords** | `store/seed.sql` | Terms to track, intent, target page | Real (seed) |
| **DB → pages** | `store/seed.sql` | Pages that can be optimized | Real (seed) |
| **DB → opportunities/changes** | `store/schema.sql` | Done keywords, open PRs (SCOPE filters) | Real (written by agent) |
| **SERP** | `tools/serp.ts` | Top-10 competitor `{rank,url,title,snippet}` | Mock → Serper.dev/SerpApi/Serpstack |
| **GSC** | `tools/gsc.ts` | Keyword list (queries), `{impressions, position, ctr, trend[]}` | Stub → Search Console API |
| **Crawl** | `tools/crawl.ts` | Page title, description, h1, JSON-LD, links | Real (live fetch) |
| **LLM (Groq)** | `agent/brain.ts` | Plan/act/revise/review/learn; **planned:** intent classification | Real (works) |
| **Google Ads Keyword Planner / API** | — (not wired) | **Search volume** (market demand) | ❌ Missing — needs Ads account |
| **Ahrefs / SEMrush / Moz** | — (not wired) | **Keyword difficulty** (0–100), competitor authority | ❌ Optional — paid |

## How to get the keyword list

The two sources are complementary:

- **GSC Queries API** → keywords your site *already gets impressions for* (real, proven demand). Implemented via `searchanalytics.query` with `dimensions: ["query"]`; the `fetchAllQueries()` TODO is already described in `src/tools/gsc.ts:39-41` (upsert into `keywords` with `target_url = page`).
- **Google Ads Keyword Planner / API** → market-wide keywords you *could* target, including terms you're not ranking for (expansion source).

**Important distinction:** GSC provides the keyword *list* and *your* performance, but **not search volume**. Volume = total market searches; impressions = how often *our* page appeared.

## What feeds the scoring formula (SCOPE)

```
score = impressions × position × intentWeight × momentumMultiplier
            │              │            │                │
            └── GSC        └── GSC      └── DB keywords  └── GSC trend
                                           (LLM/brain planned)
```

- **GSC** → impressions, position, ctr, 28-day trend (momentum). GSC is also the source of the **keyword list**.
- **DB keywords** → intent weight (commercial 1.0 / transactional 0.9 / informational 0.5). Seeded manually today; the design is for the **LLM/brain to classify intent** when new keywords are discovered from GSC.
- **SERP** → not in the formula; only the "has results" filter + future LLM content context.
- **Volume / difficulty** → *not in the code formula yet.* The spec formula (`Volume × Position × Intent × Momentum`) needs Volume from Keyword Planner and Difficulty from Ahrefs/SEMrush/Moz. The `keywords` table already has `volume` and `difficulty` columns, currently NULL.

## What feeds content decisions (ACT/LLM, Day 3)

- **Crawl** → current title/description/h1 so the LLM knows what to change.
- **SERP** → competitor titles/snippets so the LLM knows what angle to take.

## Placeholders (by design)

- `keywords.volume` → NULL until wired to Google Ads Keyword Planner / API.
- `keywords.difficulty` → NULL until wired to Ahrefs / SEMrush / Moz (optional).
- GSC/SERP stubs → swapped live on Day 3 (one function body per tool; contract unchanged).
- `keyword_positions`, `changes` tables → filled by real GSC + GitHub after Day 3.