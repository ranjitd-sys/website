import { Context, Data, Effect, Layer, Result } from "effect"
import { Database } from "../services/Database.js"
import { SeoConfig } from "../Config.js"
import { KeywordPlannerService } from "../tools/keywordPlanner.js"
import type { KeywordMetrics } from "../types/market.js"

export type { KeywordMetrics }

export class KeywordsSyncError extends Data.TaggedError("KeywordsSyncError")<{
  readonly step: string
  readonly reason: string
}> {}

interface KeywordRow {
  readonly id: number
  readonly term: string
}


export interface KeywordsSyncResult {
  readonly fetched: number
  readonly updated: number
  readonly missingVolume: number
}

export type KeywordsSyncShape = {
  readonly run: () => Effect.Effect<KeywordsSyncResult, KeywordsSyncError, KeywordsSyncEnv>
}

export class KeywordsSyncService extends Context.Service<KeywordsSyncService, KeywordsSyncShape>()("KeywordsSync") {}

export type KeywordsSyncEnv = Database | KeywordPlannerService | SeoConfig

const asSync = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  step: string,
): Effect.Effect<A, KeywordsSyncError, R> =>
  effect.pipe(
    Effect.mapError((error) =>
      error instanceof KeywordsSyncError
        ? error
        : new KeywordsSyncError({ step, reason: String(error) }),
    ),
  )

// LOAD — every active keyword from the DB.
const loadKeywords: Effect.Effect<ReadonlyArray<KeywordRow>, KeywordsSyncError, Database> = asSync(
  Effect.gen(function* () {
    const db = yield* Database
    const rows = yield* db.query<KeywordRow>(
      `SELECT id, term FROM keywords WHERE status = 'active' ORDER BY term`,
    )
    yield* Effect.log(`keywordsSync: loaded ${rows.length} active keyword(s)`)
    return rows
  }),
  "load",
)

// Difficulty → 0-100 scale from competitionIndex (0-100) as a direct pass-through,
// clamped; when only the competition *level* string is available, map
// LOW→20 / MEDIUM→50 / HIGH→80 (best effort; column stays NULL otherwise).
const difficultyOf = (metrics: KeywordMetrics): number | null => {
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

// UPSERT — persist volume / difficulty / competition / cpc per keyword.
const upsertMetrics = (
  rows: ReadonlyArray<KeywordRow>,
  metrics: ReadonlyArray<KeywordMetrics>,
): Effect.Effect<{ updated: number; missingVolume: number }, KeywordsSyncError, Database> =>
  asSync(
    Effect.gen(function* () {
      const db = yield* Database
      const byTerm = new Map(metrics.map((m) => [m.keyword, m]))
      let updated = 0
      let missingVolume = 0
      for (const row of rows) {
        const m = byTerm.get(row.term)
        if (!m) {
          yield* Effect.log(`keywordsSync: no metrics for "${row.term}" — leaving row untouched`)
          continue
        }
        const difficulty = difficultyOf(m)
        const cpcMicros = m.averageCpcMicros ?? m.lowTopOfPageBidMicros
        yield* db.query(
          `UPDATE keywords
              SET volume = $2,
                  difficulty = $3,
                  competition = $4,
                  cpc_micros = $5
            WHERE id = $1`,
          [
            row.id,
            m.avgMonthlySearches,
            difficulty,
            m.competition !== "" ? m.competition : null,
            cpcMicros,
          ],
        )
        updated += 1
        if (m.avgMonthlySearches === null) missingVolume += 1
        yield* Effect.log(
          `keywordsSync: "${row.term}" — volume=${m.avgMonthlySearches ?? "?"} difficulty=${difficulty ?? "?"} competition=${m.competition || "?"}`,
        )
      }
      return { updated, missingVolume }
    }),
    "upsert",
  )

const impl: KeywordsSyncShape = {
  run: () =>
    Effect.gen(function* () {
      yield* Effect.log("keywordsSync run (load keywords -> keyword planner metrics -> upsert)")
      const rows = yield* loadKeywords
      const planner = yield* KeywordPlannerService
      const outcome = yield* Effect.result(
        planner.fetchMetrics(rows.map((row) => row.term)),
      )
      const metrics = Result.isSuccess(outcome)
        ? outcome.success
        : yield* Effect.log(`keywordsSync: planner unavailable (${outcome.failure.reason})`).pipe(
            Effect.andThen(Effect.succeed<ReadonlyArray<KeywordMetrics>>([])),
          )
      const { updated, missingVolume } = yield* upsertMetrics(rows, metrics)
      return { fetched: metrics.length, updated, missingVolume }
    }),
}

export const KeywordsSyncLive: Layer.Layer<KeywordsSyncService> = Layer.succeed(KeywordsSyncService, impl)