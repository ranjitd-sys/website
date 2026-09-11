import { Context, Data, Effect, Layer } from "effect"
import { Pool } from "pg"
import { SeoConfig } from "../Config.js"

export class DbError extends Data.TaggedError("DbError")<{
  readonly message: string
}> {}

export interface DatabaseShape {
  readonly query: <R = Record<string, unknown>>(
    sql: string,
    params?: ReadonlyArray<unknown>,
  ) => Effect.Effect<ReadonlyArray<R>, DbError>
}

export class Database extends Context.Service<Database, DatabaseShape>()("Database") {}

const toDbError = (error: unknown): DbError =>
  new DbError({ message: error instanceof Error ? error.message : String(error) })

export const DatabaseLive: Layer.Layer<Database, never, SeoConfig> = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* SeoConfig
    const pool = yield* Effect.acquireRelease(
      Effect.sync(() => new Pool({ connectionString: config.databaseUrl })),
      (pool) => Effect.promise(() => pool.end()),
    )
    return {
      query: <R = Record<string, unknown>>(
        sql: string,
        params?: ReadonlyArray<unknown>,
      ): Effect.Effect<ReadonlyArray<R>, DbError> =>
        Effect.tryPromise({
          try: () =>
            params === undefined
              ? pool.query(sql).then((result) => (result.rows as unknown) as ReadonlyArray<R>)
              : pool
                  .query(sql, params as ReadonlyArray<unknown> as never)
                  .then((result) => (result.rows as unknown) as ReadonlyArray<R>),
          catch: toDbError,
        }),
    }
  }),
)