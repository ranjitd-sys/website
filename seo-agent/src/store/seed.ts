import { Effect } from "effect"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { SeoConfigLayer } from "../Config.js"
import { runProgram } from "../edge.js"
import { Database, DatabaseLive } from "../services/Database.js"

interface KeywordRow {
  readonly term: string
  readonly intent: string
  readonly target_url: string
  readonly status: string
}

const readSqlFile = (name: string): Effect.Effect<string> =>
  Effect.tryPromise(() => readFile(fileURLToPath(new URL(`./${name}`, import.meta.url)), "utf8"))

const seed = Effect.gen(function* () {
  const db = yield* Database
  const sql = yield* readSqlFile("seed.sql")
  yield* db.query(sql)
  const rows = yield* db.query<KeywordRow>("SELECT term, intent, target_url, status FROM keywords ORDER BY id")
  for (const row of rows) {
    yield* Effect.log(`tracked: ${row.term} -> ${row.target_url}`)
  }
  yield* Effect.log(`seeded ${rows.length} keywords`)
})

const program = seed.pipe(
  Effect.provide(DatabaseLive),
  Effect.provide(SeoConfigLayer),
)

await runProgram(program)