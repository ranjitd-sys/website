# SEO Agent KPI Dashboard — Implementation Plan

**Route:** `/admin/seo` · **Status:** Planned (not yet implemented)
**Decisions locked:** password gate · full KPI scope · path `/admin/seo`

---

## 1. What already exists

- **DeepRank** (`seo-agent/`) already writes real KPI data to Neon Postgres
  (schema: `seo-agent/src/store/schema.sql`):
  - `keywords` — term, intent, volume, status (active/paused/retired)
  - `keyword_positions` — per-day `position`, `clicks`, `impressions`, `ctr`
  - `opportunities` — pipeline: `proposed → optimizing → approved → done → measured` / `rejected`
  - `changes` — one per opportunity: `branch`, `pr_url`, `deployed_at`, `measurement` JSONB
    (`{ position_before, position_after, clicks_after, impressions_after, delta, verdict, measured_at }`)
  - `learnings` — text entries produced by the monthly `measure` run
- **Site** is Astro 7, `output: "server"` (SSR) on Vercel — no prerender config
  change needed for a dynamic page.
- **Auth primitive exists:** AES-256-GCM signed cookies in `src/lib/session.ts`
  (used by the careers area). Reused for a lighter admin cookie.
- **Gap:** `pg` is only a dependency of `seo-agent/` — it must be added to the
  site's `package.json`.
- **No dashboard UI exists anywhere** today.

## 2. Architecture

### Route
`src/pages/admin/seo.astro` — single SSR page:
- Unauthenticated → inline password form.
- Authenticated → full dashboard, rendered server-side.

### Auth (password gate)
- `src/lib/admin-auth.ts` — reuses the `session.ts` cipher with a minimal
  `AdminSession` schema (`{ role: "admin" }`); cookie `admin_session`
  (httpOnly, secure, sameSite=lax).
- `src/pages/api/admin/login.ts` — POST password → sets cookie.
- `src/pages/api/admin/logout.ts` — clears cookie.
- Password from `SEO_DASHBOARD_PASSWORD` env var; compared with
  `crypto.timingSafeEqual`; generic error message on failure.
- Page emits `noindex`; `public/robots.txt` gains `Disallow: /admin`.

### Data layer
- `src/lib/seo-dashboard/db.ts` — module-level `pg` Pool (TLS to Neon) reading
  `SEO_DATABASE_URL`. **SELECT-only**, parameterized queries.
- All rendering server-side; no client JS beyond links (AGENTS.md §42).
- Graceful empty states when the DB is unreachable — no crash, "no data yet".

### UI
- Astro components + hand-rolled SVG charts (AGENTS.md §39/§42: SVG over chart
  libs, no heavy frontend libraries).
- Design tokens from `src/styles/tokens.css`; buttons via `buttonVariants`.

## 3. KPI sections (top → bottom)

1. **Freshness strip** — last `sample_date`, keyword counts by status, tracked volume.
2. **Visibility trend** — SVG area/line: daily clicks, impressions, avg position.
   Range toggle `?range=7|28|90` (default 28). KPI cards: clicks / impressions /
   CTR / avg position, each with delta vs the prior equal-length period.
3. **Ranking distribution** — SVG bars from latest position per keyword:
   top 3 / 4–10 / 11–20 / 21–50 / 50+ / no data.
4. **Keyword movers table** — term, intent, volume, position now vs ~30d ago,
   delta chip, clicks, impressions; top 15 by |delta|.
5. **Opportunities pipeline** — counts + avg score per status as a horizontal flow.
6. **Agent output** — PRs created / deployed / measured; verdict breakdown
   (improved / stable / regressed / stuck) + avg position delta from
   `changes.measurement`; recent changes table with `pr_url` links.
7. **Learnings** — count + latest 5 entries with timestamps.

## 4. SQL queries (all parameterized, SELECT-only)

| Query | Shape |
|---|---|
| `visibilityDaily` | `SELECT sample_date, SUM(clicks), SUM(impressions), AVG(position), AVG(ctr) FROM keyword_positions WHERE sample_date >= now() - interval '84 days' GROUP BY 1 ORDER BY 1` (over-fetch to cover any range + prior-period comparison) |
| `keywordStats` | `SELECT status, COUNT(*), SUM(volume) FROM keywords GROUP BY status` |
| `rankingBuckets` | latest position per keyword → `CASE` buckets (top 3 / 4–10 / 11–20 / 21–50 / 50+) |
| `keywordMovers` | latest vs ~30d-old position per keyword + `clicks`, `impressions`, `|delta|` sort, `LIMIT 15` |
| `opportunitiesByStatus` | `GROUP BY status` with `COUNT(*)`, `AVG(score)` |
| `changesSummary` | counts by branch/deployed/measured; aggregate `measurement->>'delta'` and `verdict` breakdown |
| `recentChanges` | join `changes` + `opportunities` + `keywords`, `ORDER BY created_at DESC LIMIT 10` |
| `recentLearnings` | `ORDER BY created_at DESC LIMIT 5` |
| `freshness` | `MAX(sample_date)` |

## 5. Files

| Action | Path |
|---|---|
| add | `src/pages/admin/seo.astro` (login form + dashboard) |
| add | `src/pages/api/admin/login.ts`, `src/pages/api/admin/logout.ts` |
| add | `src/lib/admin-auth.ts` |
| add | `src/lib/seo-dashboard/db.ts` (pool + typed queries + row types) |
| add | `src/components/admin/seo/KpiCard.astro` |
| add | `src/components/admin/seo/VisibilityChart.astro` (SVG line/area) |
| add | `src/components/admin/seo/RankingBars.astro` (SVG bars) |
| add | `src/components/admin/seo/KeywordTable.astro` |
| add | `src/components/admin/seo/Pipeline.astro` |
| add | `src/components/admin/seo/ChangesTable.astro` |
| add | `src/components/admin/seo/LearningsList.astro` |
| edit | `package.json` — add `pg`, devDep `@types/pg` |
| edit | `public/robots.txt` — `Disallow: /admin` |
| env | `SEO_DATABASE_URL`, `SEO_DASHBOARD_PASSWORD` (+ existing `SESSION_SECRET`) on Vercel |

## 6. Security & correctness

- Constant-time password comparison; generic failure message; httpOnly+secure cookie.
- Parameterized, SELECT-only SQL; long-term: dedicated **read-only** DB role for
  the dashboard (DeepRank keeps its own write role).
- Dashboard pages carry `noindex`; robots disallow `/admin`.
- Empty/unreachable DB degrades to placeholders, never throws.

## 7. Verification checklist

1. `npm run check` · `npm run lint` · `npm run build` all pass.
2. Seed a dev DB with `seo-agent`'s `migrate/seed` (or point at Neon) so real
   rows exist.
3. `npm run dev` → `/admin/seo`:
   - Wrong password → rejected, no cookie set.
   - Correct password → cookie set, full dashboard renders with seeded data.
   - Logout clears the cookie.
   - View source: `noindex` present; `chart SVGs` have labels (`role="img"` +
     `aria-label` per AGENTS.md §43).
4. Simulate DB down (bad `SEO_DATABASE_URL`) → page shows "no data yet" states.

## 8. Out of scope (follow-ups)

- GA4 traffic metrics (`docs/google-analytics.md` — still unimplemented).
- GitHub Actions run status (last optimize/measure run, success/failure) via API.
- Write actions from the UI (approve/reject opportunities, trigger runs).
- Per-page URL breakdown view and CSV export of dashboard data.
