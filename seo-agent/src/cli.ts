import { Effect } from "effect"
import { OptimizeLive, OptimizeMachineService } from "./agent/Driver.js"
import { ReviewerLive } from "./agent/Reviewer.js"
import { SeoConfig, SeoConfigLayer } from "./Config.js"
import { runProgram } from "./edge.js"

const command = process.argv[2] ?? "optimize"
const dryRun = process.argv.includes("--dry-run")

const loadConfig = Effect.gen(function* () {
  const config = yield* SeoConfig
  yield* Effect.log("config loaded", {
    databaseUrl: config.databaseUrl,
    gscClientEmail: config.gscClientEmail,
    gscSiteUrl: config.gscSiteUrl,
    gscPrivateKey: config.gscPrivateKey,
    openaiApiKey: config.openaiApiKey,
    githubToken: config.githubToken,
  })
})

const optimize = Effect.gen(function* () {
  yield* loadConfig
  const optimizer = yield* OptimizeMachineService
  const result = yield* optimizer.run({ dryRun })
  yield* Effect.log(`optimize finished: visited ${result.visited.join(" -> ")} (pr: ${result.prUrl})`)
})

const measure = Effect.gen(function* () {
  yield* loadConfig
  yield* Effect.log("measure: not implemented (landing in P9)")
})

if (command === "measure") {
  await runProgram(measure.pipe(Effect.provide(SeoConfigLayer)))
} else if (command === "optimize") {
  await runProgram(
    optimize.pipe(
      Effect.provide(ReviewerLive),
      Effect.provide(OptimizeLive),
      Effect.provide(SeoConfigLayer),
    ),
  )
} else {
  console.error(`fatal: unknown command '${command}' (expected optimize|measure)`)
  process.exit(1)
}