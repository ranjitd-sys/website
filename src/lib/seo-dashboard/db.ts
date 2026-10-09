import { Pool, type QueryResultRow } from "pg"
import {
  type DashboardData,
  type KeywordIntent,
  type KeywordMover,
  type KeywordStat,
  type KeywordStatus,
  type Learning,
  type OpportunityStatus,
  type PipelineStage,
  type RankingBucket,
  type Verdict,
  type DailyVisibility,
  type ChangeRow,
} from "./data"

const CONNECTION_STRING = import.meta.env.SEO_DATABASE_URL ?? process.env.SEO_DATABASE_URL

let pool: Pool | null = null

const getPool = (): Pool | null => {
  if (!CONNECTION_STRING) return null
  if (!pool) {
    pool = new Pool({
      connectionString: CONNECTION_STRING,
      max: 2,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    })
    pool.on("error", () => {})
  }
  return pool
}

const query = async <T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T[]> => {
  const p = getPool()
  if (!p) return []
  const result = await p.query<T>(sql, params)
  return result.rows
}

const safe = async <T extends QueryResultRow>(sql: string, fallback: T[] = [], params?: unknown[]): Promise<T[]> => {
  try {
    return await query<T>(sql, params)
  } catch (error) {
    console.error("[seo-dashboard] query failed:", error instanceof Error ? error.message : error)
    return fallback
  }
}

const iso = (value: unknown): string =>
  value instanceof Date ? value.toISOString() : new Date(String(value)).toISOString()

const num = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value)

const EMPTY_DASHBOARD: DashboardData = {
  dataFreshness: null,
  keywords: [],
  daily: [],
  buckets: [],
  movers: [],
  pipeline: [],
  changes: { branchesCreated: 0, deployed: 0, measured: 0, avgDelta: null, verdicts: [] },
  recentChanges: [],
  learnings: [],
}

const KEYWORD_STATUSES: KeywordStatus[] = ["active", "paused", "retired"]
const OPPORTUNITY_STATUSES: OpportunityStatus[] = [
  "proposed",
  "optimizing",
  "approved",
  "done",
  "measured",
  "rejected",
]
const BUCKET_ORDER = ["Top 3", "4–10", "11–20", "21–50", "50+", "No data"]
const VERDICTS: Verdict[] = ["won", "stuck", "falling"]

export const loadDashboard = async (): Promise<DashboardData> => {
  if (!getPool()) return EMPTY_DASHBOARD

  const [
    keywordRows,
    dailyRows,
    bucketRows,
    moverRows,
    pipelineRows,
    summaryRows,
    verdictRows,
    changeRows,
    learningRows,
    freshnessRows,
  ] = await Promise.all([
    safe<{ status: KeywordStatus; count: number; volume: number }>(
      `SELECT status, COUNT(*)::int AS count, COALESCE(SUM(volume), 0)::int AS volume
       FROM keywords GROUP BY status`,
    ),
    safe<{ sample_date: string; clicks: number; impressions: number; ctr: number; position: number }>(
      `SELECT to_char(sample_date, 'YYYY-MM-DD') AS sample_date,
              COALESCE(SUM(clicks), 0)::int AS clicks,
              COALESCE(SUM(impressions), 0)::int AS impressions,
              COALESCE(AVG(ctr), 0)::float AS ctr,
              COALESCE(AVG(position), 0)::float AS position
       FROM keyword_positions
       GROUP BY sample_date
       ORDER BY sample_date ASC`,
    ),
    safe<{ bucket: string; count: number }>(
      `WITH latest AS (
         SELECT DISTINCT ON (keyword_id) keyword_id, position
         FROM keyword_positions
         ORDER BY keyword_id, sample_date DESC
       )
       SELECT CASE
                WHEN l.position IS NULL THEN 'No data'
                WHEN l.position <= 3 THEN 'Top 3'
                WHEN l.position <= 10 THEN '4–10'
                WHEN l.position <= 20 THEN '11–20'
                WHEN l.position <= 50 THEN '21–50'
                ELSE '50+'
              END AS bucket,
              COUNT(*)::int AS count
       FROM keywords k
       LEFT JOIN latest l ON l.keyword_id = k.id
       WHERE k.status <> 'retired'
       GROUP BY bucket`,
    ),
    safe<{
      term: string
      intent: KeywordIntent
      volume: number
      position: number | null
      position30: number | null
      delta: number | null
      clicks: number
      impressions: number
    }>(
      `WITH latest AS (
         SELECT DISTINCT ON (keyword_id) keyword_id, position, clicks, impressions
         FROM keyword_positions
         ORDER BY keyword_id, sample_date DESC
       ),
       past AS (
         SELECT DISTINCT ON (keyword_id) keyword_id, position
         FROM keyword_positions
         WHERE sample_date < now() - interval '27 days'
         ORDER BY keyword_id, sample_date DESC
       )
       SELECT k.term,
              k.intent,
              COALESCE(k.volume, 0)::int AS volume,
              l.position::float AS position,
              p.position::float AS position30,
              CASE WHEN p.position IS NULL THEN NULL ELSE (l.position - p.position)::float END AS delta,
              COALESCE(l.clicks, 0)::int AS clicks,
              COALESCE(l.impressions, 0)::int AS impressions
       FROM latest l
       JOIN keywords k ON k.id = l.keyword_id
       LEFT JOIN past p ON p.keyword_id = l.keyword_id
       WHERE l.position IS NOT NULL
       ORDER BY ABS(COALESCE(l.position - p.position, 0)) DESC
       LIMIT 15`,
    ),
    safe<{ status: OpportunityStatus; count: number; avg_score: number | null }>(
      `SELECT status, COUNT(*)::int AS count, AVG(score)::float AS avg_score
       FROM opportunities GROUP BY status`,
    ),
    safe<{ branches_created: number; deployed: number; measured: number; avg_delta: number | null }>(
      `SELECT COUNT(*)::int AS branches_created,
              COUNT(*) FILTER (WHERE deployed_at IS NOT NULL)::int AS deployed,
              COUNT(*) FILTER (WHERE measurement IS NOT NULL)::int AS measured,
              AVG((measurement->>'delta')::numeric)::float AS avg_delta
       FROM changes`,
    ),
    safe<{ verdict: Verdict; count: number }>(
      `SELECT measurement->>'verdict' AS verdict, COUNT(*)::int AS count
       FROM changes
       WHERE measurement IS NOT NULL AND measurement->>'verdict' IS NOT NULL
       GROUP BY 1`,
    ),
    safe<{
      id: number
      term: string
      branch: string | null
      pr_url: string | null
      deployed: boolean
      measured: boolean
      position_before: number | null
      position_after: number | null
      delta: number | null
      verdict: string | null
      created_at: Date
    }>(
      `SELECT c.id,
              k.term,
              c.branch,
              c.pr_url,
              (c.deployed_at IS NOT NULL) AS deployed,
              (c.measurement IS NOT NULL) AS measured,
              (c.measurement->>'position_before')::float AS position_before,
              (c.measurement->>'position_after')::float AS position_after,
              (c.measurement->>'delta')::float AS delta,
              c.measurement->>'verdict' AS verdict,
              o.created_at
       FROM changes c
       JOIN opportunities o ON o.id = c.opportunity_id
       JOIN keywords k ON k.id = o.keyword_id
       ORDER BY o.created_at DESC
       LIMIT 12`,
    ),
    safe<{ id: number; content: string; created_at: Date }>(
      `SELECT id, content, created_at FROM learnings ORDER BY created_at DESC LIMIT 5`,
    ),
    safe<{ d: string | null }>(
      `SELECT to_char(MAX(sample_date), 'YYYY-MM-DD') AS d FROM keyword_positions`,
    ),
  ])

  const keywordMap = new Map(keywordRows.map((r) => [r.status, r]))
  const keywords: KeywordStat[] = KEYWORD_STATUSES.map((status) => ({
    status,
    count: keywordMap.get(status)?.count ?? 0,
    volume: keywordMap.get(status)?.volume ?? 0,
  }))

  const daily: DailyVisibility[] = dailyRows.map((r) => ({
    sample_date: r.sample_date,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }))

  const bucketMap = new Map(bucketRows.map((r) => [r.bucket, r.count]))
  const buckets: RankingBucket[] = BUCKET_ORDER.map((label) => ({
    label,
    count: bucketMap.get(label) ?? 0,
  }))

  const movers: KeywordMover[] = moverRows.map((r) => ({
    term: r.term,
    intent: r.intent,
    volume: r.volume,
    position: num(r.position),
    position30: num(r.position30),
    delta: num(r.delta),
    clicks: r.clicks,
    impressions: r.impressions,
  }))

  const pipelineMap = new Map(pipelineRows.map((r) => [r.status, r]))
  const pipeline: PipelineStage[] = OPPORTUNITY_STATUSES.map((status) => ({
    status,
    count: pipelineMap.get(status)?.count ?? 0,
    avgScore: num(pipelineMap.get(status)?.avg_score),
  }))

  const summary = summaryRows[0]
  const verdictMap = new Map(verdictRows.map((r) => [r.verdict, r.count]))
  const recentChanges: ChangeRow[] = changeRows.map((r) => ({
    id: r.id,
    term: r.term,
    branch: r.branch ?? "",
    pr_url: r.pr_url,
    deployed: r.deployed,
    measured: r.measured,
    position_before: num(r.position_before),
    position_after: num(r.position_after),
    delta: num(r.delta),
    verdict: (r.verdict as Verdict | null) ?? null,
    created_at: iso(r.created_at),
  }))

  const learnings: Learning[] = learningRows.map((r) => ({
    id: r.id,
    content: r.content,
    created_at: iso(r.created_at),
  }))

  return {
    dataFreshness: freshnessRows[0]?.d ?? null,
    keywords,
    daily,
    buckets,
    movers,
    pipeline,
    changes: {
      branchesCreated: summary?.branches_created ?? 0,
      deployed: summary?.deployed ?? 0,
      measured: summary?.measured ?? 0,
      avgDelta: num(summary?.avg_delta),
      verdicts: VERDICTS.filter((v) => verdictMap.has(v)).map((v) => ({
        verdict: v,
        count: verdictMap.get(v) ?? 0,
      })),
    },
    recentChanges,
    learnings,
  }
}