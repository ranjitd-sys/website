import { Context, Data, Effect, Layer, Redacted, Result } from "effect"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { SeoConfig } from "../Config.js"
import type { KeywordMetrics } from "../types/market.js"

export type { KeywordMetrics }

export class KeywordPlannerError extends Data.TaggedError("KeywordPlannerError")<{
  readonly reason: string
}> {}

export interface KeywordPlannerShape {
  readonly fetchMetrics: (keywords: ReadonlyArray<string>) => Effect.Effect<ReadonlyArray<KeywordMetrics>, KeywordPlannerError>
}

export class KeywordPlannerService extends Context.Service<KeywordPlannerService, KeywordPlannerShape>()("KeywordPlanner") {}

// ============================================================================
// REAL Google Ads API Keyword Planner (GenerateKeywordHistoricalMetrics) via raw
// REST — no external dependency (OAuth2 refresh grant + fetch).
//
//   GOOGLE_ADS_DEVELOPER_TOKEN  → token from MCC → API Center (required header)
//   GOOGLE_ADS_CLIENT_ID        → OAuth client id
//   GOOGLE_ADS_CLIENT_SECRET    → OAuth client secret
//   GOOGLE_ADS_REFRESH_TOKEN    → OAuth refresh token (scope adwords)
//   GOOGLE_ADS_CUSTOMER_ID      → Ads account id (digits), target of the request
//   GOOGLE_ADS_LOGIN_CUSTOMER_ID→ MCC id, only when calling through a manager
//   GOOGLE_ADS_API_VERSION      → e.g. v25 (default)
//
// Falls back to parsing data/Keyword Stats*.csv when creds absent or the token
// is not approved for production (DEVELOPER_TOKEN_NOT_APPROVED) — runs stay
// green, exactly like the serp/gsc mock fallback pattern.
// ============================================================================

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
const ADWORDS_SCOPE = "https://www.googleapis.com/auth/adwords"

// Geo target constants: India = 2356, language English = 1000.
const GEO_TARGET = "geoTargetConstants/2356"
const LANGUAGE = "languageConstants/1000"
const NETWORK = "GOOGLE_SEARCH"

const DATA_DIR = join(process.cwd(), "data")

// ---------------------------------------------------------------------------
// Real API helpers
// ---------------------------------------------------------------------------

const fetchAccessToken = async (clientId: string, clientSecret: string, refreshToken: string): Promise<string> => {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: ADWORDS_SCOPE,
  })
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!res.ok) throw new Error(`oauth token HTTP ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) throw new Error("oauth token response missing access_token")
  return data.access_token
}

interface HistoricalMetricsRow {
  readonly text?: string
  readonly keywordMetrics?: {
    readonly avgMonthlySearches?: number | string
    readonly competition?: string
    readonly competitionIndex?: number | string
    readonly lowTopOfPageBidMicros?: number | string
    readonly highTopOfPageBidMicros?: number | string
    readonly averageCpcMicros?: number | string
  }
}

interface HistoricalMetricsResponse {
  readonly results?: ReadonlyArray<HistoricalMetricsRow>
}

const num = (value: number | string | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const fetchLiveMetrics = async (
  keywords: ReadonlyArray<string>,
  accessToken: string,
  developerToken: string,
  customerId: string,
  loginCustomerId: string,
  apiVersion: string,
): Promise<ReadonlyArray<KeywordMetrics>> => {
  const body = {
    keywords: [...keywords],
    geo_target_constants: [GEO_TARGET],
    language: LANGUAGE,
    keyword_plan_network: NETWORK,
  }
  const headers: Record<string, string> = {
    authorization: `Bearer ${accessToken}`,
    "developer-token": developerToken,
    "content-type": "application/json",
  }
  if (loginCustomerId.trim() !== "") headers["login-customer-id"] = loginCustomerId.trim()
  const url = `https://googleads.googleapis.com/${apiVersion}/customers/${customerId}:generateKeywordHistoricalMetrics`
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const text = await res.text()
    let message = `googleads HTTP ${res.status}: ${res.statusText}`
    if (text.includes("DEVELOPER_TOKEN_NOT_APPROVED")) {
      message = "developer token not approved for production use (test-access token) — falling back to CSV"
    }
    throw new Error(message)
  }
  const data = (await res.json()) as HistoricalMetricsResponse
  return (data.results ?? []).map((row) => ({
    keyword: row.text ?? "",
    avgMonthlySearches: num(row.keywordMetrics?.avgMonthlySearches),
    competition: row.keywordMetrics?.competition ?? "",
    competitionIndex: num(row.keywordMetrics?.competitionIndex),
    lowTopOfPageBidMicros: num(row.keywordMetrics?.lowTopOfPageBidMicros),
    highTopOfPageBidMicros: num(row.keywordMetrics?.highTopOfPageBidMicros),
    averageCpcMicros: num(row.keywordMetrics?.averageCpcMicros),
  }))
}

// ---------------------------------------------------------------------------
// CSV fallback — parse the Google Keyword Planner export already in data/
// ---------------------------------------------------------------------------

const findKeywordCsv = async (): Promise<string> => {
  const entries = await readdir(DATA_DIR)
  const match = entries.find((name) => name.startsWith("Keyword Stats") && name.endsWith(".csv"))
  if (!match) throw new Error(`no "Keyword Stats*.csv" found in ${DATA_DIR}`)
  return join(DATA_DIR, match)
}

const parseKeywordCsv = async (): Promise<ReadonlyMap<string, KeywordMetrics>> => {
  const csvPath = await findKeywordCsv()
  const raw = await readFile(csvPath, "utf8")
  const lines = raw.split(/\r?\n/)
  const rows = new Map<string, KeywordMetrics>()
  // Row 0 = title, Row 1 = date range, Row 2 = header. Data starts at index 3.
  for (let i = 3; i < lines.length; i++) {
    const cols = lines[i]!.split(",")
    const keyword = (cols[0] ?? "").trim()
    if (keyword === "") continue
    const volume = Number((cols[2] ?? "").trim())
    const competition = (cols[5] ?? "").trim()
    const compIndex = Number((cols[6] ?? "").trim())
    const lowBid = Number((cols[7] ?? "").trim())
    const highBid = Number((cols[8] ?? "").trim())
    const toMicros = (value: number): number | null =>
      Number.isFinite(value) ? Math.round(value * 1_000_000) : null
    rows.set(keyword, {
      keyword,
      avgMonthlySearches: Number.isFinite(volume) ? volume : null,
      competition,
      competitionIndex: Number.isFinite(compIndex) ? compIndex : null,
      lowTopOfPageBidMicros: toMicros(lowBid),
      highTopOfPageBidMicros: toMicros(highBid),
      averageCpcMicros: null,
    })
  }
  return rows
}

const fetchCsvMetrics = (keywords: ReadonlyArray<string>): Effect.Effect<ReadonlyArray<KeywordMetrics>, KeywordPlannerError> =>
  Effect.tryPromise({
    try: async () => {
      const rows = await parseKeywordCsv()
      const result: KeywordMetrics[] = []
      for (const keyword of keywords) {
        const hit = rows.get(keyword)
        result.push(
          hit ?? {
            keyword,
            avgMonthlySearches: null,
            competition: "",
            competitionIndex: null,
            lowTopOfPageBidMicros: null,
            highTopOfPageBidMicros: null,
            averageCpcMicros: null,
          },
        )
      }
      return result
    },
    catch: (error) =>
      new KeywordPlannerError({ reason: error instanceof Error ? error.message : String(error) }),
  })

export const KeywordPlannerServiceLive: Layer.Layer<KeywordPlannerService, never, SeoConfig> = Layer.effect(
  KeywordPlannerService,
  Effect.gen(function* () {
    const config = yield* SeoConfig
    const developerToken = Redacted.value(config.googleAdsDeveloperToken).trim()
    const clientId = config.googleAdsClientId.trim()
    const clientSecret = Redacted.value(config.googleAdsClientSecret).trim()
    const refreshToken = Redacted.value(config.googleAdsRefreshToken).trim()
    const customerId = config.googleAdsCustomerId.trim()
    const loginCustomerId = config.googleAdsLoginCustomerId.trim()
    const apiVersion = config.googleAdsApiVersion.trim()
    const real =
      developerToken !== "" && clientId !== "" && clientSecret !== "" && refreshToken !== "" && customerId !== ""

    return {
      fetchMetrics: (keywords) =>
        Effect.gen(function* () {
          yield* Effect.log(`keywordPlanner: ${keywords.length} keywords (${real ? "live" : "csv fallback"})`)
          if (!real) return yield* fetchCsvMetrics(keywords)
          const outcome = yield* Effect.result(
            Effect.tryPromise({
              try: async () => {
                const accessToken = await fetchAccessToken(clientId, clientSecret, refreshToken)
                return fetchLiveMetrics(keywords, accessToken, developerToken, customerId, loginCustomerId, apiVersion)
              },
              catch: (error) =>
                new KeywordPlannerError({ reason: error instanceof Error ? error.message : String(error) }),
            }),
          )
          if (Result.isSuccess(outcome)) return outcome.success
          yield* Effect.log(`keywordPlanner: live failed (${outcome.failure.reason}) — using csv fallback`)
          return yield* fetchCsvMetrics(keywords)
        }),
    }
  }),
)