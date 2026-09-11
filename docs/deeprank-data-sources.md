# DeepRank — Data Sources

> Where every piece of data in the agent comes from. Source: `seo-agent/src/tools/*`, `src/store/*`.
> Last updated: 2026-09-11

## The 5 data sources

| Source | Where it lives | What it provides | Status |
|---|---|---|---|
| **DB → keywords** | `store/seed.sql` | Terms to track, intent, target page | Real (seed) |
| **DB → pages** | `store/seed.sql` | Pages that can be optimized | Real (seed) |
| **DB → opportunities/changes** | `store/schema.sql` | Done keywords, open PRs (SCOPE filters) | Real (written by agent) |
| **SERP** | `tools/serp.ts` | Top-10 competitor `{rank,url,title,snippet}` | Mock → Serper.dev/SerpApi/Serpstack |
| **GSC** | `tools/gsc.ts` | `{impressions, position, ctr, trend[]}` for scoring | Stub → Search Console API |
| **Crawl** | `tools/crawl.ts` | Page title, description, h1, JSON-LD, links | Real (live fetch) |

## What feeds the scoring formula (SCOPE)

```
score = impressions × position × intentWeight × momentumMultiplier
            │              │            │                │
            └── GSC        └── GSC      └── DB keywords  └── GSC trend
```

- **GSC** → impressions, position, ctr, 28-day trend (momentum).
- **DB keywords** → intent weight (commercial 1.0 / transactional 0.9 / informational 0.5).
- **SERP** → not in the formula; only the "has results" filter + future LLM content context.

## What feeds content decisions (ACT/LLM, Day 3)

- **Crawl** → current title/description/h1 so the LLM knows what to change.
- **SERP** → competitor titles/snippets so the LLM knows what angle to take.

## Placeholders (by design)

- `keywords.volume` / `keywords.difficulty` → NULL until real GSC/serp data.
- GSC/SERP stubs → swapped live on Day 3 (one function body per tool; contract unchanged).
- `keyword_positions`, `changes` tables → filled by real GSC + GitHub after Day 3.