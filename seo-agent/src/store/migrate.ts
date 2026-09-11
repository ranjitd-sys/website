import { Effect } from "effect"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { SeoConfigLayer } from "../Config.js"
import { runProgram } from "../edge.js"
import { Database, DatabaseLive } from "../services/Database.js"

const readSqlFile = (name: string): Effect.Effect<string> =>
  Effect.tryPromise(() => readFile(fileURLToPath(new URL(`./${name}`, import.meta.url)), "utf8"))

const migrate = Effect.gen(function* () {
  const db = yield* Database
  const sql = yield* readSqlFile("schema.sql")
  yield* db.query(sql)
  yield* Effect.log("schema applied")
})

const program = migrate.pipe(
  Effect.provide(DatabaseLive),
  Effect.provide(SeoConfigLayer),
)

await runProgram(program)