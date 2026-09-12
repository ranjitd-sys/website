import { Context, Data, Effect, Layer, Redacted, Result } from "effect"
import { SeoConfig } from "../Config.js"

export type SerpSource = "google" | "bing"

export interface SerpResult {
  readonly rank: number
  readonly url: string
  readonly title: string
  readonly snippet: string
}

export interface SerpResults {
  readonly results: ReadonlyArray<SerpResult>
}

export class SerpError extends Data.TaggedError("SerpError")<{
  readonly keyword: string
  readonly source: SerpSource
  readonly reason: string
}> {}

export interface SerpShape {
  readonly fetchResults: (keyword: string, source: SerpSource) => Effect.Effect<SerpResults, SerpError>
}

export class SerpService extends Context.Service<SerpService, SerpShape>()("Serp") {}

type Row = readonly [url: string, title: string, snippet: string]

const asResults = (rows: ReadonlyArray<Row>): ReadonlyArray<SerpResult> =>
  rows.map(([url, title, snippet], index) => ({ rank: index + 1, url, title, snippet }))

// Mock SERP data. Unambiguous placeholder domains (RFC 2606 `.example`).
// Real SerpApi wiring in `SerpServiceLive.fetchResults` (raw `fetch`); the
// contract stays. Falls back to mock when `SERPAPI_KEY` is absent or fails.
const SEED_SERP: Readonly<Record<string, ReadonlyArray<Row>>> = {
  "ecommerce accounting software india": [
    ["https://accounting-suite.example/india", "Ecommerce Accounting Software in India | AccountingSuite", "Track orders, fees and settlements with marketplace-ready accounting built for Indian sellers."],
    ["https://gst-books.example", "GST-Ready Accounting for Online Sellers | GSTBooks", "Automate GST entries for every marketplace order and reconcile payouts in one ledger."],
    ["https://seller-ledger.example", "Marketplace Accounting in One Place | SellerLedger", "Bring Amazon, Flipkart and Shopify transactions into a single accounting view."],
    ["https://booksync.example", "Automate Ecommerce Bookkeeping in India | BookSync", "Order-wise bookkeeping that maps fees, returns and TCS to your books automatically."],
    ["https://tally-cloud.example/accounting", "Ecommerce Accounting with Tally Integration | TallyCloud", "Post ecommerce invoices, credit notes and stock movements directly into Tally."],
    ["https://reconcile-india.example", "Marketplace Settlement Reconciliation Software India", "Match marketplace payouts to orders and surface every unreconciled difference."],
    ["https://commerce-books.example", "Accounting Software for Ecommerce Businesses | CommerceBooks", "See profitability by channel and keep your ERP current with daily postings."],
    ["https://fin-ledger.example", "Multi-Marketplace Accounting for Indian Sellers | FinLedger", "Consolidate sales, charges and refunds across marketplaces into one accounting layer."],
    ["https://order-account.example", "Order-wise Ecommerce Accounting | OrderAccount", "Turn every order into the correct set of accounting entries, automatically."],
    ["https://tax-recon.example", "GST & TCS Automation for Ecommerce | TaxRecon", "Generate GST summaries and TCS reports from your marketplace data."],
  ],
  "amazon seller gst accounting": [
    ["https://amazon-accounting.example", "Amazon Seller GST Accounting | AmazonAccounting", "Reconcile Amazon settlements and post GST-correct entries for every order."],
    ["https://gst-books.example/amazon", "Amazon GST Automation for Sellers | GSTBooks", "Automate GSTR-ready summaries from Amazon order and fee reports."],
    ["https://seller-ledger.example/amazon", "Amazon Seller Ledger & Settlement Matching | SellerLedger", "Match Amazon payouts to orders and track every marketplace charge."],
    ["https://tally-cloud.example/amazon", "Post Amazon Sales into Tally with GST | TallyCloud", "Create invoices, credit notes and GST entries from Amazon data."],
    ["https://tax-recon.example/amazon", "Amazon TCS & TDS Reporting | TaxRecon", "Track TCS and TDS deducted on Amazon sales and keep books aligned."],
    ["https://commerce-books.example/amazon", "Accounting for Amazon Sellers | CommerceBooks", "Understand fees, returns and reimbursements with clean books."],
    ["https://order-account.example/amazon", "Order-wise Accounting for Amazon Sellers | OrderAccount", "Map each Amazon order and return to the right accounting entry."],
    ["https://fin-ledger.example/amazon", "Amazon Marketplace Accounting India | FinLedger", "Bring Amazon finance reports into a structured accounting view."],
    ["https://booksync.example/amazon", "Automate Amazon Bookkeeping | BookSync", "Daily Amazon postings with GST and marketplace charges applied."],
    ["https://reconcile-india.example/amazon", "Amazon Settlement Reconciliation | ReconcileIndia", "Reconcile settlements, fees and refunds without spreadsheets."],
  ],
  "flipkart payment reconciliation": [
    ["https://reconcile-india.example/flipkart", "Flipkart Payment Reconciliation Software | ReconcileIndia", "Match Flipkart settlements to orders and flag every difference."],
    ["https://seller-ledger.example/flipkart", "Flipkart Settlement Matching | SellerLedger", "Reconcile Flipkart payouts, fees and returns in one ledger."],
    ["https://commerce-books.example/flipkart", "Flipkart Accounting & Reconciliation | CommerceBooks", "Turn Flipkart settlement files into reconciled accounting entries."],
    ["https://fin-ledger.example/flipkart", "Flipkart Marketplace Reconciliation India | FinLedger", "Track payouts, deductions and refunds across Flipkart cycles."],
    ["https://gst-books.example/flipkart", "Flipkart GST Entries & Reconciliation | GSTBooks", "Keep GST accurate while matching Flipkart settlements to orders."],
    ["https://order-account.example/flipkart", "Order-wise Flipkart Reconciliation | OrderAccount", "Connect each Flipkart order to its payout and accounting entry."],
    ["https://booksync.example/flipkart", "Automate Flipkart Bookkeeping | BookSync", "Reconcile Flipkart payments and post balanced entries automatically."],
    ["https://tax-recon.example/flipkart", "Flipkart TCS Reconciliation | TaxRecon", "Verify TCS on Flipkart sales against settlements and reports."],
    ["https://accounting-suite.example/flipkart", "Flipkart Reconciliation for Sellers | AccountingSuite", "See fee breakdowns and net payouts reconciled to the rupee."],
    ["https://tally-cloud.example/flipkart", "Flipkart to Tally Reconciliation | TallyCloud", "Post reconciled Flipkart settlements into Tally with correct ledgers."],
  ],
  "ecommerce accounting tally": [
    ["https://tally-cloud.example", "Ecommerce Accounting with Tally | TallyCloud", "Post marketplace sales, fees and returns into Tally automatically."],
    ["https://gst-books.example/tally", "Tally GST Accounting for Ecommerce | GSTBooks", "Generate GST-correct vouchers in Tally from ecommerce orders."],
    ["https://order-account.example/tally", "Order-wise Tally Posting for Ecommerce | OrderAccount", "Create Tally entries for each order, return and stock movement."],
    ["https://seller-ledger.example/tally", "Tally Integration for Marketplace Sellers | SellerLedger", "Sync settlements and charges into Tally ledgers."],
    ["https://commerce-books.example/tally", "Tally Ecommerce Connector | CommerceBooks", "Bridge ecommerce transactions and Tally with detailed postings."],
    ["https://fin-ledger.example/tally", "Multi-Marketplace to Tally Accounting | FinLedger", "Consolidate marketplace data and post to Tally with GST detail."],
    ["https://booksync.example/tally", "Automate Ecommerce Entries in Tally | BookSync", "Daily Tally postings from marketplace order and payment data."],
    ["https://accounting-suite.example/tally", "Tally-Ready Ecommerce Accounting | AccountingSuite", "Get Tally-ready vouchers for sales, returns and stock transfers."],
    ["https://tax-recon.example/tally", "GST & TCS to Tally | TaxRecon", "Post GST and TCS summaries into Tally from marketplace data."],
    ["https://reconcile-india.example/tally", "Marketplace Reconciliation to Tally | ReconcileIndia", "Reconcile payouts, then post the results into Tally."],
  ],
  "d2c brand accounting": [
    ["https://commerce-books.example/d2c", "Accounting for D2C Brands | CommerceBooks", "Bring website and marketplace finance data into one accounting view."],
    ["https://booksync.example/d2c", "D2C Bookkeeping Automation | BookSync", "Automate revenue, returns and charge postings for D2C brands."],
    ["https://fin-ledger.example/d2c", "D2C Brand Financial Visibility | FinLedger", "See contribution by channel across website and marketplaces."],
    ["https://order-account.example/d2c", "Order-wise Accounting for D2C Brands | OrderAccount", "Map every order to accurate accounting entries."],
    ["https://gst-books.example/d2c", "D2C GST Accounting | GSTBooks", "Keep GST accurate across direct and marketplace sales."],
    ["https://seller-ledger.example/d2c", "Unified D2C Ledger | SellerLedger", "Reconcile website payments and marketplace settlements together."],
    ["https://accounting-suite.example/d2c", "D2C Accounting Software | AccountingSuite", "Track profitability and costs across sales channels."],
    ["https://reconcile-india.example/d2c", "Payment Reconciliation for D2C | ReconcileIndia", "Match gateway settlements and marketplace payouts to orders."],
    ["https://tally-cloud.example/d2c", "D2C Accounting with ERP Posting | TallyCloud", "Post D2C sales and returns into your ERP with detail."],
    ["https://tax-recon.example/d2c", "D2C Tax & Compliance Reporting | TaxRecon", "Generate GST and TCS reports across D2C channels."],
  ],
}

const hash = (value: string): number => {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0
  return Math.abs(h)
}

const fallbackResults = (keyword: string): ReadonlyArray<SerpResult> => {
  const seed = hash(keyword)
  return Array.from({ length: 10 }, (_, i) => {
    const n = seed + i
    return {
      rank: i + 1,
      url: `https://competitor-${(n % 97) + 1}.example/${encodeURIComponent(keyword.replace(/\s+/g, "-"))}`,
      title: `${keyword} — Competitor ${i + 1}`,
      snippet: `Placeholder SERP result ${i + 1} for "${keyword}". Replace with live provider data.`,
    }
  })
}

const SERP_SEARCH_URL = "https://serpapi.com/search"

const fetchSerpApi = (
  keyword: string,
  source: SerpSource,
  apiKey: string,
  signal: AbortSignal,
): Promise<{ organic_results?: ReadonlyArray<{ position?: number; link?: string; title?: string; snippet?: string }> }> => {
  const params = new URLSearchParams({
    engine: "google",
    q: keyword,
    api_key: apiKey,
    gl: "in",
    hl: "en",
    num: "10",
  })
  const url = `${SERP_SEARCH_URL}?${params.toString()}`
  return fetch(url, { signal }).then((res) => {
    if (!res.ok) throw new Error(`SerpApi HTTP ${res.status}: ${res.statusText}`)
    return res.json() as Promise<{
      organic_results?: ReadonlyArray<{ position?: number; link?: string; title?: string; snippet?: string }>
    }>
  })
}

const toSerpResults = (data: {
  organic_results?: ReadonlyArray<{ position?: number; link?: string; title?: string; snippet?: string }>
}): ReadonlyArray<SerpResult> =>
  (data.organic_results ?? [])
    .map((entry) => ({
      rank: entry.position ?? 0,
      url: entry.link ?? "",
      title: entry.title ?? "",
      snippet: entry.snippet ?? "",
    }))
    .filter((entry) => entry.url !== "")
    .slice(0, 10)

export const SerpServiceLive: Layer.Layer<SerpService, never, SeoConfig> = Layer.effect(
  SerpService,
  Effect.gen(function* () {
    const config = yield* SeoConfig
    const apiKey = Redacted.value(config.serpApiKey)
    const real = apiKey.trim() !== ""

    const mockResults = (keyword: string): ReadonlyArray<SerpResult> => {
      const rows = SEED_SERP[keyword]
      return rows ? asResults(rows) : fallbackResults(keyword)
    }

    const realResults = (keyword: string, source: SerpSource): Effect.Effect<ReadonlyArray<SerpResult>, SerpError, never> =>
      Effect.tryPromise({
        try: async (signal) => {
          const data = await fetchSerpApi(keyword, source, apiKey, signal)
          return toSerpResults(data)
        },
        catch: (error) =>
          new SerpError({ keyword, source, reason: error instanceof Error ? error.message : String(error) }),
      })

    return {
      fetchResults: (keyword, source) =>
        Effect.gen(function* () {
          yield* Effect.log(`serp: fetching top 10 "${keyword}" (${source}${real ? ", serpapi" : ", mock"})`)
          const results = yield* (real
            ? Effect.result(realResults(keyword, source)).pipe(
                Effect.flatMap((result) =>
                  Result.isSuccess(result)
                    ? Effect.succeed(result.success)
                    : Effect.log(`serp: falling back to mock for "${keyword}": ${result.failure.reason}`).pipe(
                        Effect.andThen(Effect.succeed(mockResults(keyword))),
                      ),
                ),
              )
            : Effect.succeed(mockResults(keyword)))
          yield* Effect.log(`serp: ${results.length} results for "${keyword}"`)
          return { results }
        }),
    }
  }),
)
