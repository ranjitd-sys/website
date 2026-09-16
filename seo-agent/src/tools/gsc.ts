import { Context, Data, Effect, Layer, Redacted, Result } from "effect"
import { createSign } from "node:crypto"
import { SeoConfig } from "../Config.js"
import type { GscMetrics, GscQueryRow, GscWindow } from "../types/market.js"

export type { GscMetrics, GscWindow, GscQueryRow }

export class GscError extends Data.TaggedError("GscError")<{
  readonly query: string
  readonly window: GscWindow
  readonly reason: string
}> {}

export interface GscShape {
  readonly fetchMetrics: (query: string, window: GscWindow) => Effect.Effect<GscMetrics, GscError>
  readonly fetchAllQueries: (window: GscWindow, rowLimit?: number) => Effect.Effect<ReadonlyArray<GscQueryRow>, GscError>
}

export class GscService extends Context.Service<GscService, GscShape>()("Gsc") {}

// ============================================================================
// REAL GSC (Search Console API) — JWT service-account auth via node:crypto.
// No external dependency (raw RSA-SHA256 signing + fetch).
//
//   GSC_CLIENT_EMAIL  → service account email ("iss")
//   GSC_PRIVATE_KEY   → service account private key (PEM)
//   GSC_SITE_URL      → property verified in Search Console
//
// Falls back to stub metrics when creds are absent OR the call fails (e.g. the
// service account has not been added as a Search Console user yet → 403).
// ============================================================================

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const SCOPES = "https://www.googleapis.com/auth/webmasters.readonly"

const signJwt = (email: string, privateKeyPem: string): string => {
  const header = { alg: "RS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const payload = { iss: email, scope: SCOPES, aud: TOKEN_URL, iat: now, exp: now + 3600 }
  const encode = (obj: Record<string, unknown>): string =>
    Buffer.from(JSON.stringify(obj)).toString("base64url").replace(/=+$/, "")
  const unsigned = `${encode(header)}.${encode(payload)}`
  const signature = createSign("RSA-SHA256").update(unsigned).sign(privateKeyPem, "base64url")
  return `${unsigned}.${signature}`
}

const fetchAccessToken = async (email: string, privateKeyPem: string): Promise<string> => {
  const assertion = signJwt(email, privateKeyPem)
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  })
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!res.ok) throw new Error(`token endpoint HTTP ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) throw new Error("token endpoint returned no access_token")
  return data.access_token
}

interface QueryRow {
  readonly keys?: ReadonlyArray<string>
  readonly clicks?: number
  readonly impressions?: number
  readonly ctr?: number
  readonly position?: number
}

interface QueryResponse {
  readonly rows?: ReadonlyArray<QueryRow>
}

const runQuery = async (
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: ReadonlyArray<string>,
  filterQuery: string | null,
  rowLimit: number,
): Promise<QueryResponse> => {
  const encodedSite = encodeURIComponent(siteUrl)
  const body: Record<string, unknown> = { startDate, endDate, dimensions: [...dimensions], rowLimit }
  if (filterQuery !== null) {
    body["dimensionFilterGroups"] = [
      { filters: [{ dimension: "query", operator: "EQUALS", expression: filterQuery }] },
    ]
  }
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`searchAnalytics.query HTTP ${res.status}: ${res.statusText}`)
  return (await res.json()) as QueryResponse
}

const dayOffset = (days: number): string => {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

// Bucket daily rows (oldest → newest) into `bucketCount` buckets; average position
// per bucket. Matches the stub trend shape [old ... new].
const bucketTrend = (rows: ReadonlyArray<QueryRow>, bucketCount: number): ReadonlyArray<number> => {
  if (rows.length === 0) return []
  const size = Math.ceil(rows.length / bucketCount)
  const buckets: number[][] = Array.from({ length: bucketCount }, () => [])
  rows.forEach((row, index) => {
    const bucket = Math.min(Math.floor(index / size), bucketCount - 1)
    const position = row.position ?? 0
    if (position > 0) buckets[bucket]!.push(position)
  })
  return buckets.map((byBucket) =>
    byBucket.length > 0 ? byBucket.reduce((a, b) => a + b, 0) / byBucket.length : 0,
  )
}

// Stub metrics for the 5 seed keywords. trend = position snapshots at day 1/7/14/28.
// Falling numbers = ranking improving; rising = worsening; flat = stable.
const STUB: Readonly<Record<string, GscMetrics>> = {
  "ecommerce accounting software india": { clicks: 45, impressions: 1200, position: 7.2, ctr: 0.0375, trend: [8.0, 7.5, 7.2, 7.2] },
  "amazon seller gst accounting": { clicks: 120, impressions: 5000, position: 4.1, ctr: 0.024, trend: [6.0, 5.0, 4.5, 4.1] },
  "flipkart payment reconciliation": { clicks: 15, impressions: 800, position: 12.3, ctr: 0.01875, trend: [14.0, 13.0, 12.5, 12.3] },
  "ecommerce accounting tally": { clicks: 30, impressions: 900, position: 9.8, ctr: 0.033, trend: [10.0, 10.0, 9.8, 9.8] },
  "d2c brand accounting": { clicks: 8, impressions: 400, position: 15.1, ctr: 0.02, trend: [16.0, 15.5, 15.2, 15.1] },
}

// Stub rows map back to the seeded pages so discovery resolves a real page.
const STUB_PAGES: Readonly<Record<string, string>> = {
  "ecommerce accounting software india": "/resources/ecommerce-accounting",
  "amazon seller gst accounting": "/solutions/amazon-sellers",
  "flipkart payment reconciliation": "/resources/reconciliation",
  "ecommerce accounting tally": "/erp-connector/accounting",
  "d2c brand accounting": "/solutions/d2c-brands",
}

const fallbackMetrics = (query: string): GscMetrics => ({
  clicks: 20,
  impressions: 600,
  position: 11.0,
  ctr: 0.033,
  trend: [12.0, 11.5, 11.0, 11.0],
})

const DAYS: Readonly<Record<GscWindow, number>> = { "7d": 7, "28d": 28 }

export const GscServiceLive: Layer.Layer<GscService, never, SeoConfig> = Layer.effect(
  GscService,
  Effect.gen(function* () {
    const config = yield* SeoConfig
    const clientEmail = config.gscClientEmail.trim()
    const privateKey = Redacted.value(config.gscPrivateKey).trim()
    const siteUrl = config.gscSiteUrl.trim()
    const real = clientEmail !== "" && privateKey !== "" && siteUrl !== ""

    const liveMetrics = (query: string, window: GscWindow): Effect.Effect<GscMetrics, GscError, never> =>
      Effect.tryPromise({
        try: async () => {
          const accessToken = await fetchAccessToken(clientEmail, privateKey)
          const days = DAYS[window]
          const grouped = await runQuery(
            accessToken,
            siteUrl,
            dayOffset(days),
            dayOffset(1),
            ["date"],
            query,
            200,
          )
          const rows = [...(grouped.rows ?? [])].sort((a, b) =>
            (a.keys?.[0] ?? "").localeCompare(b.keys?.[0] ?? ""),
          )
          let clicks = 0
          let impressions = 0
          let positionSum = 0
          for (const row of rows) {
            clicks += row.clicks ?? 0
            impressions += row.impressions ?? 0
            positionSum += row.position ?? 0
          }
          const trend = bucketTrend(rows, 4)
          return {
            clicks,
            impressions,
            position: rows.length > 0 ? positionSum / rows.length : 0,
            ctr: impressions > 0 ? clicks / impressions : 0,
            trend,
          }
        },
        catch: (error) =>
          new GscError({ query, window, reason: error instanceof Error ? error.message : String(error) }),
      })

    const liveAllQueries = (
      window: GscWindow,
      rowLimit: number,
    ): Effect.Effect<ReadonlyArray<GscQueryRow>, GscError, never> =>
      Effect.tryPromise({
        try: async () => {
          const accessToken = await fetchAccessToken(clientEmail, privateKey)
          const days = DAYS[window]
          const data = await runQuery(
            accessToken,
            siteUrl,
            dayOffset(days),
            dayOffset(1),
            ["query", "page"],
            null,
            rowLimit,
          )
          return (data.rows ?? [])
            .filter((row) => (row.impressions ?? 0) > 0)
            .map((row) => {
              const keys = row.keys ?? ["", ""]
              return {
                query: keys[0] ?? "",
                page: keys[1] ?? "",
                clicks: row.clicks ?? 0,
                impressions: row.impressions ?? 0,
                position: row.position ?? 0,
                ctr: row.ctr ?? 0,
              }
            })
            .slice(0, rowLimit)
        },
        catch: (error) =>
          new GscError({ query: "*", window, reason: error instanceof Error ? error.message : String(error) }),
      })

    const stubAllQueries = (): ReadonlyArray<GscQueryRow> =>
      Object.entries(STUB).map(([query, m]) => ({
        query,
        page: STUB_PAGES[query] ?? "/",
        clicks: m.clicks,
        impressions: m.impressions,
        position: m.position,
        ctr: m.ctr,
      }))

    return {
      fetchMetrics: (query, window) =>
        Effect.gen(function* () {
          yield* Effect.log(`gsc: fetching metrics "${query}" (${window}${real ? ", live" : ", stub"})`)
          if (!real) {
            const metrics = STUB[query] ?? fallbackMetrics(query)
            yield* Effect.log(`gsc: position=${metrics.position} clicks=${metrics.clicks} impressions=${metrics.impressions} ctr=${metrics.ctr}`)
            return metrics
          }
          const outcome = yield* Effect.result(liveMetrics(query, window))
          if (Result.isSuccess(outcome)) {
            const metrics = outcome.success
            yield* Effect.log(`gsc: live position=${metrics.position} clicks=${metrics.clicks} impressions=${metrics.impressions} ctr=${metrics.ctr}`)
            return metrics
          }
          yield* Effect.log(`gsc: live call failed, falling back to stub: ${outcome.failure.reason}`)
          return STUB[query] ?? fallbackMetrics(query)
        }),
      fetchAllQueries: (window, rowLimit = 25) =>
        Effect.gen(function* () {
          if (!real) {
            const rows = stubAllQueries()
            yield* Effect.log(`gsc: fetchAllQueries stub (${rows.length} rows)`)
            return rows
          }
          const outcome = yield* Effect.result(liveAllQueries(window, rowLimit))
          if (Result.isSuccess(outcome)) return outcome.success
          yield* Effect.log(`gsc: fetchAllQueries live failed, using stub: ${outcome.failure.reason}`)
          return stubAllQueries()
        }),
    }
  }),
)