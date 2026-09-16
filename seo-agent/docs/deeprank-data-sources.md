# DeepRank — Data Sources

> Where every piece of data in the agent comes from. Source: `seo-agent/src/tools/*`, `src/store/*`.
> Last updated: 2026-09-16

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
| **SERP** | `tools/serp.ts` | Top-10 competitor `{rank,url,title,snippet}` | Real (SerpApi) — falls back to mock without a key |
| **GSC** | `tools/gsc.ts` | Keyword list (queries), `{impressions, position, ctr, trend[]}` | Real (Search Console API, JWT service account) — falls back to stub on 403/absent creds |
| **Crawl** | `tools/crawl.ts` | Page title, description, h1, JSON-LD, links | Real (live fetch) |
| **LLM (Groq)** | `agent/brain.ts` | Plan/act/revise/review/learn; **planned:** intent classification | Real (works) |
| **Google Ads Keyword Planner / API** | `tools/keywordPlanner.ts` | **Search volume** (market demand), competition, CPC | ✅ Wired (raw REST) — CSV fallback today; live API needs developer token + Basic/Explorer access |
| **Ahrefs / SEMrush / Moz** | — (not wired) | **Keyword difficulty** (0–100), competitor authority | ❌ Optional — paid |

## How to get the keyword list

The two sources are complementary:

- **GSC Queries API** → keywords your site *already gets impressions for* (real, proven demand). Implemented via `searchanalytics.query` with `dimensions: ["query"]`; the `fetchAllQueries()` TODO is already described in `src/tools/gsc.ts:39-41` (upsert into `keywords` with `target_url = page`).
- **Google Ads Keyword Planner / API** → market-wide keywords you *could* target, including terms you're not ranking for (expansion source). Wired in `tools/keywordPlanner.ts`; see the "Google Ads Keyword Planner" section below.

**Important distinction:** GSC provides the keyword *list* and *your* performance, but **not search volume**. Volume = total market searches; impressions = how often *our* page appeared.

## Google Ads Keyword Planner

`tools/keywordPlanner.ts` exposes `KeywordPlannerService.fetchMetrics(terms)`. Two paths:

- **CSV fallback (active today):** reads a Keyword Planner export from `data/Keyword Stats*.csv` and matches keywords case-insensitively. Returns `{ avgMonthlySearches, competition, lowTopOfPageBidMicros, highTopOfPageBidMicros }`. No developer token needed.
- **Live API (raw REST):** `POST https://googleads.googleapis.com/{version}/customers/{customerId}:generateKeywordHistoricalMetrics`. Used automatically once credentials are present.

The `keywords sync` CLI command (`bun run src/cli.ts keywords`) loads active keywords → planner metrics → upserts `volume`, `difficulty`, `competition`, `cpc_micros` on the `keywords` table. A keyword that is **not** in the CSV/API returns `null` volume (never fabricated).

### Getting the developer token

1. Sign in to Google Ads with an account that has an active campaign. From the account manager (MCC) menu, open **Tools → API Center** (`https://ads.google.com/aw/apicenter`).
2. Read and accept the API terms, then **Request access** / create a developer token. The token is a 22-character string.
3. Approval is tiered. **Test** access allows only test accounts; **Basic** access (production campaign data) is requested via a form in the API Center and is reviewed by Google (can take days).
4. Live `generateKeywordHistoricalMetrics` calls fail with `DEVELOPER_TOKEN_NOT_APPROVED` while the token is in test/not-approved status.
5. Also enable the **Google Ads API in Google Cloud** and create OAuth credentials (client id/secret) for the Cloud project linked to the Ads account. Set the scopes/permissions for the API service.

### Required environment variables

```
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=...        # optional if login customer set
GOOGLE_ADS_LOGIN_CUSTOMER_ID=...  # optional
GOOGLE_ADS_API_VERSION=v25
```

Get the client id/secret per step 5, and generate the refresh token with the `adwords` scope from the OAuth playground or a small script.

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

- `keywords.volume`, `competition`, `cpc_micros` → populated by `keywords sync` from Keyword Planner (CSV fallback today; live API once the developer token is approved).
- `keywords.difficulty` → derived from Keyword Planner competition where available; otherwise NULL until wired to Ahrefs / SEMrush / Moz (optional).
- GSC/SERP live-fallbacks → GSC returns stub when the service account has no Search Console access (403); SerpApi returns mock only when `SERPAPI_KEY` is absent.
- `keyword_positions`, `changes` tables → filled by real GSC + GitHub after Day 3.

### GSC live (Search Console API)

`tools/gsc.ts` signs a JWT (RS256, `node:crypto`, no dependency) with `GSC_PRIVATE_KEY`, exchanges it for an access token, then calls `webmasters/v3/sites/{site}/searchAnalytics/query` for either a single keyword's metrics (`fetchMetrics`, `dimensions:["date"]`, → 28-day trend) or the full query list (`fetchAllQueries`, `dimensions:["query","page"]`). A keyword that gets **0 clicks/impressions** returns zeros — real data, not manufacture.

- `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY` → a Google Cloud **service account** with the PEM key.
- `GSC_SITE_URL` → the Search Console property, e.g. `https://deepecom.com`.
- You must add the service account email as a **user** in Search Console (`https://search.google.com/search-console` → Settings → Users and permissions → `+` → the service account). Until then the API returns HTTP 403 and the tool falls back to stub.