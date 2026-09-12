import { Context, Data, Effect, Layer } from "effect"
import type { GscMetrics, GscWindow } from "../types/market.js"

export type { GscMetrics, GscWindow }

export class GscError extends Data.TaggedError("GscError")<{
  readonly query: string
  readonly window: GscWindow
  readonly reason: string
}> {}

export interface GscShape {
  readonly fetchMetrics: (query: string, window: GscWindow) => Effect.Effect<GscMetrics, GscError>
}

export class GscService extends Context.Service<GscService, GscShape>()("Gsc") {}

// ============================================================================
// TODO (GSC swap — pending approval)
// ----------------------------------------------------------------------------
// GSC access has NOT been granted yet, so this service stays on the stub.
// When GSC is approved, replace ONLY the `fetchMetrics` implementation with a
// Search Console `searchanalytics.query` call (interface unchanged):
//
//   1. Install `google-auth-library` (deferred — only when the swap ships).
//   2. Build a JWT client:
//        const auth = new JWT({
//          email: <GSC_CLIENT_EMAIL>,
//          key:   <GSC_PRIVATE_KEY>.replace(/\\n/g, "\n"),
//          scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
//        })
//   3. GET https://www.googleapis.com/webmasters/v3/sites/<URL>/searchAnalytics/query
//      with body { startDate, endDate, dimensions: ["query"], rowLimit }
//      for the given query + window. Map the response rows to GscMetrics.
//   4. trend = 4 weekly snapshot queries (day 1/7/14/28) or one query grouped
//      by week; store position snapshots in order so momentum math stays intact.
//   5. Use GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY + GSC_SITE_URL from SeoConfig.
//
// Optional add once approved: `fetchAllQueries(siteUrl, window)` →
// { query, page, position, clicks, impressions } for keyword discovery
// (upsert into `keywords` with `target_url = page`).
//
// Fallback to stub when credentials are absent so the run stays green.
// ============================================================================

// Stub metrics for the 5 seed keywords. trend = position snapshots at day 1/7/14/28.
// Falling numbers = ranking improving; rising = worsening; flat = stable.
const STUB: Readonly<Record<string, GscMetrics>> = {
  "ecommerce accounting software india": {
    clicks: 45,
    impressions: 1200,
    position: 7.2,
    ctr: 0.0375,
    trend: [8.0, 7.5, 7.2, 7.2],
  },
  "amazon seller gst accounting": {
    clicks: 120,
    impressions: 5000,
    position: 4.1,
    ctr: 0.024,
    trend: [6.0, 5.0, 4.5, 4.1],
  },
  "flipkart payment reconciliation": {
    clicks: 15,
    impressions: 800,
    position: 12.3,
    ctr: 0.01875,
    trend: [14.0, 13.0, 12.5, 12.3],
  },
  "ecommerce accounting tally": {
    clicks: 30,
    impressions: 900,
    position: 9.8,
    ctr: 0.033,
    trend: [10.0, 10.0, 9.8, 9.8],
  },
  "d2c brand accounting": {
    clicks: 8,
    impressions: 400,
    position: 15.1,
    ctr: 0.02,
    trend: [16.0, 15.5, 15.2, 15.1],
  },
}

const fallbackMetrics = (query: string): GscMetrics => ({
  clicks: 20,
  impressions: 600,
  position: 11.0,
  ctr: 0.033,
  trend: [12.0, 11.5, 11.0, 11.0],
})

export const GscServiceLive: Layer.Layer<GscService> = Layer.succeed(GscService, {
  fetchMetrics: (query, window) =>
    Effect.log(`gsc: fetching metrics "${query}" (${window}, stub)`).pipe(
      Effect.andThen(
        Effect.sync((): GscMetrics => STUB[query] ?? fallbackMetrics(query)),
      ),
      Effect.tap((m) =>
        Effect.log(`gsc: position=${m.position} clicks=${m.clicks} impressions=${m.impressions} ctr=${m.ctr}`),
      ),
      Effect.catchCause((cause) =>
        Effect.fail(new GscError({ query, window, reason: String(cause) })),
      ),
    ),
})
