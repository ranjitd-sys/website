import { Context, Data, Effect, Layer, Redacted, Result } from "effect"
import { SeoConfig } from "../Config.js"
import { SEED_SERP, type Row, type SerpResult, type SerpResults, type SerpSource } from "../types/market.js"

export type { SerpResult, SerpResults, SerpSource }

export class SerpError extends Data.TaggedError("SerpError")<{
  readonly keyword: string
  readonly source: SerpSource
  readonly reason: string
}> {}

export interface SerpShape {
  readonly fetchResults: (keyword: string, source: SerpSource) => Effect.Effect<SerpResults, SerpError>
}

export class SerpService extends Context.Service<SerpService, SerpShape>()("Serp") {}


const asResults = (rows: ReadonlyArray<Row>): ReadonlyArray<SerpResult> =>
  rows.map(([url, title, snippet], index) => ({ rank: index + 1, url, title, snippet }))


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
