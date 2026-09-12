import { Context, Data, Effect, Layer } from "effect"
import { BrainService } from "../agent/brain.js"
import { Database } from "../services/Database.js"
import { SeoConfig } from "../Config.js"
import { GscService } from "../tools/gsc.js"
import type { Verdict } from "../types/agent.js"
import type { GscMetrics } from "../types/market.js"

export type { Verdict }

export class MeasureError extends Data.TaggedError("MeasureError")<{
  readonly step: string
  readonly reason: string
}> {}

interface ChangeRow {
  readonly id: number
  readonly opportunity_id: number
  readonly keyword_id: number
  readonly term: string
}

interface PositionRow {
  readonly position: number
}

export interface MeasureResult {
  readonly measured: number
  readonly learnings: ReadonlyArray<string>
}

export type MeasureShape = {
  readonly run: () => Effect.Effect<MeasureResult, MeasureError, MeasureEnv>
}

export class MeasureService extends Context.Service<MeasureService, MeasureShape>()("Measure") {}

export type MeasureEnv =
  | Database
  | BrainService
  | GscService
  | SeoConfig

const verdictOf = (before: number, after: number): Verdict => {
  const delta = after - before
  if (delta < -0.5) return "won"
  if (delta > 0.5) return "falling"
  return "stuck"
}

const asMeasure = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  step: string,
): Effect.Effect<A, MeasureError, R> =>
  effect.pipe(
    Effect.mapError((error) =>
      error instanceof MeasureError
        ? error
        : new MeasureError({ step, reason: String(error) }),
    ),
  )

// DETECT_MERGES — find merged changes (deployed_at set) older than 3 weeks
// that have no measurement yet.
const detectMerged: Effect.Effect<ReadonlyArray<ChangeRow>, MeasureError, Database> = asMeasure(
  Effect.gen(function* () {
    const db = yield* Database
    const rows = yield* db.query<ChangeRow>(
      `SELECT c.id, c.opportunity_id, o.keyword_id, k.term
         FROM changes c
         JOIN opportunities o ON o.id = c.opportunity_id
         JOIN keywords k ON k.id = o.keyword_id
        WHERE c.deployed_at IS NOT NULL
          AND c.measurement IS NULL
          AND c.deployed_at < now() - interval '3 weeks'
        ORDER BY c.deployed_at`,
    )
    yield* Effect.log(`measure: detected ${rows.length} merged change(s) awaiting measurement`)
    return rows
  }),
  "detect",
)

// GSC_PULL — pull fresh current metrics per keyword (28-day window).
const pullCurrent = (rows: ReadonlyArray<ChangeRow>): Effect.Effect<Map<number, GscMetrics>, MeasureError, GscService> =>
  Effect.gen(function* () {
    const gsc = yield* GscService
    const map = new Map<number, GscMetrics>()
    for (const row of rows) {
      const metrics = yield* gsc.fetchMetrics(row.term, "28d").pipe(
        Effect.catchCause((cause) =>
          Effect.log(`measure: gsc unavailable for "${row.term}" (${String(cause)}); skipping`).pipe(
            Effect.andThen(Effect.succeed(null)),
          ),
        ),
      )
      if (metrics) map.set(row.keyword_id, metrics)
    }
    return map
  })

// Baseline — the position recorded at PR creation time, if we logged a snapshot.
const fetchBaseline = (
  keywordId: number,
): Effect.Effect<number | null, MeasureError, Database> =>
  asMeasure(
    Effect.gen(function* () {
      const db = yield* Database
      const rows = yield* db.query<PositionRow>(
        `SELECT position FROM keyword_positions
          WHERE keyword_id = $1
          ORDER BY sample_date DESC
          LIMIT 1`,
        [keywordId],
      )
      return rows[0]?.position !== undefined ? Number(rows[0].position) : null
    }),
    "baseline",
  )

interface PendingMeasurement {
  readonly changeId: number
  readonly term: string
  readonly before: number | null
  readonly after: number
  readonly delta: number | null
  readonly verdict: Verdict
}

// WRITE_DELTAS — compute before/after/delta/verdict and persist into
// `changes.measurement` JSONB. Marks the opportunity measured.
const writeDeltas = (
  rows: ReadonlyArray<ChangeRow>,
  current: Map<number, GscMetrics>,
): Effect.Effect<ReadonlyArray<PendingMeasurement>, MeasureError, Database> =>
  asMeasure(
    Effect.gen(function* () {
    const db = yield* Database
    const measurements: Array<PendingMeasurement> = []
    for (const row of rows) {
      const fresh = current.get(row.keyword_id)
      if (!fresh) continue
      const before = yield* fetchBaseline(row.keyword_id).pipe(
        Effect.catchCause(() => Effect.succeed(null)),
      )
      const after = fresh.position
      const delta = before === null ? null : Number((after - before).toFixed(2))
      const verdict = before === null ? ("stuck" as Verdict) : verdictOf(before, after)
      const payload = {
        position_before: before,
        position_after: after,
        clicks_after: fresh.clicks,
        impressions_after: fresh.impressions,
        delta,
        verdict,
        measured_at: new Date().toISOString(),
      }
      yield* db.query(
        `UPDATE changes SET measurement = $1::jsonb WHERE id = $2`,
        [JSON.stringify(payload), row.id],
      )
      yield* db.query(
        `UPDATE opportunities SET status = 'measured' WHERE id = $1`,
        [row.opportunity_id],
      )
      yield* Effect.log(
        `measure: change ${row.id} ("${row.term}") — before=${before ?? "?"} after=${after} verdict=${verdict}`,
      )
      measurements.push({ changeId: row.id, term: row.term, before, after, delta, verdict })
    }
    return measurements
  }),
    "write",
  )

// LEARNINGS + FEED_RESEARCH — one LLM pass across the batch, persisted as
// learnings rows so the next weekly optimize run reads them as context.
const learnRun = (
  measured: ReadonlyArray<PendingMeasurement>,
): Effect.Effect<ReadonlyArray<string>, MeasureError, BrainService | Database | SeoConfig> =>
  asMeasure(
    Effect.gen(function* () {
    if (measured.length === 0) {
      yield* Effect.log("measure: nothing measured — no learnings generated")
      return []
    }
    const brain = yield* BrainService
    const learnings = yield* brain.learn({
      deltas: measured.map((m) => ({
        keyword: m.term,
        before: m.before ?? m.after,
        after: m.after,
        delta: m.delta ?? 0,
        verdict: m.verdict,
      })),
    }).pipe(
      Effect.catchCause((cause) =>
        Effect.log(`measure: learnings unavailable (${String(cause)})`).pipe(
          Effect.andThen(Effect.succeed([])),
        ),
      ),
    )
    const db = yield* Database
    for (const item of learnings) {
      yield* db.query(
        `INSERT INTO learnings (content) VALUES ($1)`,
        [item],
      )
    }
    yield* Effect.log(`measure: persisted ${learnings.length} learning(s)`)
    return learnings
  }),
    "learn",
  )

const impl: MeasureShape = {
  run: () =>
    Effect.gen(function* () {
      yield* Effect.log("measure run (detect merges -> gsc pull -> deltas -> learnings -> feed research)")
      const rows = yield* detectMerged
      const current = yield* pullCurrent(rows)
      const measured = yield* writeDeltas(rows, current)
      const learnings = yield* learnRun(measured)
      return { measured: measured.length, learnings }
    }),
}

export const MeasureLive: Layer.Layer<MeasureService> = Layer.succeed(MeasureService, impl)