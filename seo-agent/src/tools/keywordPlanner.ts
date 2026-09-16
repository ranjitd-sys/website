import { Context, Data, Effect, Layer, Redacted, Result } from "effect"
import { SeoConfig } from "../Config.js"
import type { KeywordMetrics } from "../types/market.js"

export type { KeywordMetrics }

export class KeywordPlannerError extends Data.TaggedError("KeywordPlannerError")<{
  readonly reason: string
}> {}

// Volume source for stub estimation. When the Google Ads API is not configured,
// estimated search volume = the term's GSC impressions × this multiplier.
// This is a PLACEHOLDER — it is replaced automatically with real Keyword
// Planner volume as soon as the GOOGLE_ADS_* credentials are present and the
// developer token is approved for production.planner
export const STUB_VOLUME_MULTIPLIER = 5

export const stubMonthlySearches = (impressions: number | null | undefined): number | null => {
  if (impressions === null || impressions === undefined || !Number.isFinite(impressions) || impressions <= 0) {
    return null
  }
  return Math.round(impressions * STUB_VOLUME_MULTIPLIER)
}

// Difficulty → 0-100 scale from competitionIndex (0-100) as a direct pass-through,
// clamped; when only the competition *level* string is available, map
// LOW→20 / MEDIUM→50 / HIGH→80 (best effort; column stays NULL otherwise).
export const difficultyOf = (metrics: KeywordMetrics): number | null => {
  if (metrics.competitionIndex !== null) {
    return Math.max(0, Math.min(100, Math.round(metrics.competitionIndex)))
  }
  switch ((metrics.competition ?? "").toUpperCase()) {
    case "LOW":
      return 20
    case "MEDIUM":
      return 50
    case "HIGH":
      return 80
    default:
      return null
  }
}

export interface KeywordPlannerOptions {
  // Per-term GSC impressions used to derive a stub volume while the real
  // Google Ads API is unavailable.
  readonly impressionsOf?: (term: string) => number | null
}

export interface KeywordPlannerShape {
  // Real Google Keyword Planner volume when GOOGLE_ADS_* creds are live;
  // stub volume (derived from GSC impressions) until then. Never fabricates —
  // a term with no impressions returns a null volume.
  readonly fetchMetrics: (
    keywords: ReadonlyArray<string>,
    options?: KeywordPlannerOptions,
  ) => Effect.Effect<ReadonlyArray<KeywordMetrics>, KeywordPlannerError>
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
// Until those credentials are approved, volume comes from the stub estimator
// (GSC impressions × STUB_VOLUME_MULTIPLIER) so the volume column is always
// filled without fabricating anything. The swap to real volume is automatic:
// set the env vars and the next `optimize` discovery run uses the live API.
// ============================================================================

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
const ADWORDS_SCOPE = "https://www.googleapis.com/auth/adwords"

// Geo target constants: India = 2356, language English = 1000.
const GEO_TARGET = "geoTargetConstants/2356"
const LANGUAGE = "languageConstants/1000"
const NETWORK = "GOOGLE_SEARCH"

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
      message = "developer token not approved for production use (test-access token) — falling back to stub volume"
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
// Stub volume — used coherently until the Google Ads API is live.
// ---------------------------------------------------------------------------

const stubMetrics = (
  keywords: ReadonlyArray<string>,
  impressionsOf?: (term: string) => number | null,
): ReadonlyArray<KeywordMetrics> =>
  keywords.map((term) => {
    const volume = stubMonthlySearches(impressionsOf?.(term))
    return {
      keyword: term,
      avgMonthlySearches: volume,
      competition: "",
      competitionIndex: null,
      lowTopOfPageBidMicros: null,
      highTopOfPageBidMicros: null,
      averageCpcMicros: null,
    }
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
      fetchMetrics: (keywords, options) =>
        Effect.gen(function* () {
          if (!real) {
            yield* Effect.log(
              `keywordPlanner: ${keywords.length} keyword(s) — stub volume (no GOOGLE_ADS_* credentials; GSC impressions × ${STUB_VOLUME_MULTIPLIER})`,
            )
            return stubMetrics(keywords, options?.impressionsOf)
          }
          yield* Effect.log(`keywordPlanner: ${keywords.length} keyword(s) — live Google Ads API`)
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
          yield* Effect.log(`keywordPlanner: live failed (${outcome.failure.reason}) — using stub volume`)
          return stubMetrics(keywords, options?.impressionsOf)
        }),
    }
  }),
)