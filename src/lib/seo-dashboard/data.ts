export type KeywordIntent = "commercial" | "transactional" | "informational"
export type KeywordStatus = "active" | "paused" | "retired"
export type SeoMetric = "traffic" | "position"
export type OpportunityStatus =
  | "proposed"
  | "optimizing"
  | "approved"
  | "done"
  | "measured"
  | "rejected"
export type Verdict = "won" | "stuck" | "falling"

export interface DailyVisibility {
  sample_date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface KeywordStat {
  status: KeywordStatus
  count: number
  volume: number
}

export interface RankingBucket {
  label: string
  count: number
}

export interface KeywordMover {
  term: string
  intent: KeywordIntent
  volume: number
  position: number | null
  position30: number | null
  delta: number | null
  clicks: number
  impressions: number
}

export interface PipelineStage {
  status: OpportunityStatus
  count: number
  avgScore: number | null
}

export interface ChangeRow {
  id: number
  term: string
  branch: string
  pr_url: string | null
  deployed: boolean
  measured: boolean
  position_before: number | null
  position_after: number | null
  delta: number | null
  verdict: Verdict | null
  created_at: string
}

export interface Learning {
  id: number
  content: string
  created_at: string
}

export interface DashboardData {
  dataFreshness: string | null
  keywords: KeywordStat[]
  daily: DailyVisibility[]
  buckets: RankingBucket[]
  movers: KeywordMover[]
  pipeline: PipelineStage[]
  changes: {
    branchesCreated: number
    deployed: number
    measured: number
    avgDelta: number | null
    verdicts: Array<{ verdict: Verdict; count: number }>
  }
  recentChanges: ChangeRow[]
  learnings: Learning[]
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)
const day = (offset: number) => {
  const d = new Date(Date.UTC(2026, 8, 15) - offset * 86_400_000)
  return d.toISOString().slice(0, 10)
}

export const SAMPLE_DASHBOARD: DashboardData = {
  dataFreshness: day(0),
  keywords: [
    { status: "active", count: 64, volume: 182_400 },
    { status: "paused", count: 9, volume: 14_200 },
    { status: "retired", count: 5, volume: 3_800 },
  ],
  daily: range(56).map((i) => {
    const pos = 14 - i * 0.09 - Math.cos(i / 6) * 1.6 - (i >= 42 ? 1.4 : 0)
    const base = 480 + i * 26 + Math.sin(i / 3) * 60 + (i % 7) * 12
    const clicksBase = base * 0.035
    return {
      sample_date: day(55 - i),
      position: Math.max(3, Number(pos.toFixed(1))),
      impressions: Math.round(base),
      clicks: Math.round(clicksBase + Math.max(0, Math.sin(i / 4) * 18)),
      ctr: Number((clicksBase / base).toFixed(4)),
    }
  }),
  buckets: [
    { label: "Top 3", count: 6 },
    { label: "4–10", count: 13 },
    { label: "11–20", count: 17 },
    { label: "21–50", count: 18 },
    { label: "50+", count: 8 },
    { label: "No data", count: 2 },
  ],
  movers: [
    { term: "ecommerce accounting software", intent: "commercial", volume: 6_600, position: 11, position30: 24, delta: -13, clicks: 214, impressions: 3_890 },
    { term: "flipkart payment reconciliation", intent: "commercial", volume: 320, position: 7, position30: 18, delta: -11, clicks: 96, impressions: 2_140 },
    { term: "amazon seller gst accounting", intent: "commercial", volume: 1_900, position: 9, position30: 17, delta: -8, clicks: 178, impressions: 4_420 },
    { term: "d2c bookkeeping", intent: "informational", volume: 480, position: 14, position30: 19, delta: -5, clicks: 61, impressions: 1_780 },
    { term: "tally ecommerce integration", intent: "transactional", volume: 2_400, position: 22, position30: 26, delta: -4, clicks: 83, impressions: 2_960 },
    { term: "meesho label printing", intent: "transactional", volume: 1_300, position: 6, position30: 9, delta: -3, clicks: 142, impressions: 3_150 },
    { term: "marketplace reconciliation", intent: "commercial", volume: 880, position: 28, position30: 25, delta: 3, clicks: 34, impressions: 1_240 },
  ],
  pipeline: [
    { status: "proposed", count: 12, avgScore: 68 },
    { status: "optimizing", count: 3, avgScore: 71 },
    { status: "approved", count: 2, avgScore: 74 },
    { status: "done", count: 5, avgScore: null },
    { status: "measured", count: 4, avgScore: null },
    { status: "rejected", count: 7, avgScore: null },
  ],
  changes: {
    branchesCreated: 5,
    deployed: 3,
    measured: 2,
    avgDelta: -4.5,
    verdicts: [
      { verdict: "won", count: 1 },
      { verdict: "stuck", count: 1 },
      { verdict: "falling", count: 0 },
    ],
  },
  recentChanges: [
    { id: 5, term: "d2c platforms", branch: "seo/solutions-d2c-brands-d2c-platforms", pr_url: "https://github.com/org/deepecom/pull/15", deployed: true, measured: false, position_before: 41, position_after: 29, delta: -12, verdict: null, created_at: "2026-09-14T10:20:00.000Z" },
    { id: 4, term: "amazon seller gst accounting", branch: "seo/solutions-amazon-sellers-amazon-seller-gst-accounting", pr_url: "https://github.com/org/deepecom/pull/14", deployed: true, measured: false, position_before: 17, position_after: 9, delta: -8, verdict: null, created_at: "2026-09-07T09:05:00.000Z" },
    { id: 3, term: "flipkart payment reconciliation", branch: "seo/resources-reconciliation-flipkart-payment-reconciliation", pr_url: "https://github.com/org/deepecom/pull/13", deployed: true, measured: true, position_before: 18, position_after: 7, delta: -11, verdict: "won", created_at: "2026-08-31T08:40:00.000Z" },
    { id: 2, term: "ecommerce accounting software", branch: "seo/resources-ecommerce-accounting-ecommerce-accounting-software-india", pr_url: "https://github.com/org/deepecom/pull/11", deployed: true, measured: true, position_before: 24, position_after: 11, delta: -13, verdict: "won", created_at: "2026-08-24T07:15:00.000Z" },
    { id: 1, term: "tally ecommerce integration", branch: "seo/erp-connector-accounting-ecommerce-accounting-tally", pr_url: "https://github.com/org/deepecom/pull/9", deployed: false, measured: false, position_before: null, position_after: null, delta: null, verdict: null, created_at: "2026-08-17T06:00:00.000Z" },
  ],
  learnings: [
    { id: 3, content: "Long-tail marketplace + vertical keyword pairs (e.g. flipkart payment reconciliation) move faster than broad SaaS terms — prioritize low-volume, high-intent queries first.", created_at: "2026-09-01T10:00:00.000Z" },
    { id: 2, content: "Metadata-only changes to pages ranking 15–25 shift position fastest; pages outside top 50 need content changes, not just titles.", created_at: "2026-09-01T10:05:00.000Z" },
    { id: 1, content: "Deployed PRs without measurement were re-detected next cycle — keep the deploy → measure window to ~1 month.", created_at: "2026-08-02T09:30:00.000Z" },
  ],
}

