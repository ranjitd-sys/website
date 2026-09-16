# Website SEO Metadata Update — Decision Plan

## Goal

Align the DeepEcom website's SEO metadata (titles, descriptions, JSON-LD) with real search demand from Google Keyword Planner data — by rewriting the `.astro` source files, not by generating reports or seeding the DeepRank database.

## Data Source

`seo-agent/data/Keyword Stats 2026-09-15 at 17_24_18 - Keyword Stats 2026-09-15 at 17_24_18.csv`

- ~380 keywords exported from Google Keyword Planner
- Columns (after 2 header rows): Keyword, Currency, Avg. monthly searches, Three month change, YoY change, Competition, (bid ranges)
- Currency is INR

## Selection Method — step by step

### Step 1 — Pick the pages to touch

Only pages that can rank:

- Homepage `/`
- Solutions: amazon-sellers, d2c-brands, enterprise, cfos, accountants, business-owners
- Platform: index, dashboard, payment-reconciliation, profitability, reports
- ERP Connector: index, accounting, gst, inventory
- Integrations
- Pricing
- Customers
- Resources: index, ecommerce-accounting, reconciliation, gst, erp, guides, faqs

Skipped (utility / branded, no search intent to target):
`/login`, `/privacy`, `/terms`, `/contact`, `/partners`, `/security`

### Step 2 — Match a Keyword Planner term to each page

For each page, find the closest Planner keyword to the page's topic, preferring:

1. Exact match to what DeepEcom does on that page (e.g. `payment reconciliation` → Platform reconciliation page)
2. Highest searched phrase in the page's topic family
3. Any competible volume (more search volume wins over zero-volume)

### Step 3 — Rewrite the title

Format:

`{Primary Keyword from Planner} — {Benefit/Feature} | DeepEcom`

Rules:

- The Planner keyword leads the title (the searcher's words, not the brand's words)
- Front-loaded, so it reads naturally in a SERP snippet
- Length: aim 50–60 chars, allow up to 70
- Never keyword-stuffed

### Step 4 — Rewrite the description

Rules:

- Under ~150 chars
- Leads with the keyword / the page's core value
- Uses Planner terms where they fit (e.g. "payment reconciliation", "GST accounting")
- Removes marketing filler ("Go beyond...", "Stop manual...", "understand profitability")
- Keeps the DeepEcom positioning (accounting layer, ERP-ready)

### Step 5 — Add structured data

- `BreadcrumbList` — every edited page (helps Google understand hierarchy)
- `FAQPage` — any page that already has an `faqs` array in its frontmatter (can trigger rich snippets)
- Uses the existing `structuredData` prop pattern already in `PageLayout`

## Example — `/solutions/amazon-sellers`

### Before

- Title: `Amazon Sellers — Profitability, Reconciliation & Accounting | DeepEcom`
- Description: `DeepEcom helps Amazon sellers understand profitability, reconcile settlements and account every transaction with detailed GST and warehouse accounting — into Tally, SAP or Zoho.`

### Keyword Planner matches

| Keyword | Volume | Competition |
|---|---|---|
| `accounting for amazon sellers` | 50/mo | Low |
| `amazon seller accounting` | 50/mo | Low |
| `for amazon sellers` | 50/mo | Low |
| `amazon seller data` | 500/mo | Low |
| `amazon seller business` | 500/mo | Low |
| `amazon fees` | 5000/mo | Low |

### Decision

The existing title led with `Amazon Sellers` (a brand phrase, not a Planner keyword). `amazon seller accounting` / `accounting for amazon sellers` are exact-match, low-competition keywords (50/mo each) — real searches with little ranking competition. Led the new title with `Amazon Seller Accounting` (most specific match to what DeepEcom does for Amazon sellers).

### After

- Title: `Amazon Seller Accounting — Profitability & Reconciliation | DeepEcom` (68 chars)
- Description: `DeepEcom helps Amazon sellers with GST accounting, profitability tracking, payment reconciliation and detailed ERP accounting into Tally, SAP or Zoho.` — replaced vague "understand profitability" with Planner terms ("GST accounting", "payment reconciliation").
- structuredData: `FAQPage` + `BreadcrumbList` added (page has an existing `faqs` array).

## Result artifact

`seo-agent/data/seo-title-description-changes.csv` — one row per page:

| Column | Meaning |
|---|---|
| `page` | route, e.g. `/solutions/amazon-sellers` |
| `previous title` | value before the change |
| `previous description` | value before the change |
| `now title` | value after the change |
| `now description` | value after the change |
| `previous length` | title+description char count before |
| `now length` | title+description char count after |

25 pages changed, 27 title rows, 23 description rows, 20 structuredData additions (per breakdown CSV).