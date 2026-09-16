import { Effect, Redacted } from "effect"
import { OptimizeLive, OptimizeMachineService } from "./agent/Driver.js"
import { BrainServiceLive } from "./agent/brain.js"
import { SeoConfig, SeoConfigLayer, type SeoConfigShape } from "./Config.js"
import { DatabaseLive } from "./services/Database.js"
import { SerpServiceLive } from "./tools/serp.js"
import { GscServiceLive } from "./tools/gsc.js"
import { CrawlServiceLive } from "./tools/crawl.js"
import { BuildServiceLive } from "./tools/build.js"
import { ValidateServiceLive } from "./tools/validate.js"
import { ContentServiceLive } from "./tools/content.js"
import { GithubServiceLive } from "./tools/github.js"
import { KeywordPlannerServiceLive } from "./tools/keywordPlanner.js"
import { MeasureService, MeasureLive } from "./measurement/measure.js"
import { runProgram } from "./edge.js"

const command = process.argv[2] ?? "optimize"
const dryRun = process.argv.includes("--dry-run")

// Never print credentials — mask the DB password and use shapes/lengths for
// every other secret so a mis-parse can't leak them into logs again.
const maskDatabaseUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (parsed.password !== "") parsed.password = "***"
    return parsed.toString()
  } catch {
    return url
  }
}

const redactConfig = (config: SeoConfigShape) => ({
  databaseUrl: maskDatabaseUrl(config.databaseUrl),
  gscClientEmail: config.gscClientEmail,
  gscSiteUrl: config.gscSiteUrl,
  gscPrivateKey: `pem:${Redacted.value(config.gscPrivateKey).length}b`,
  groqApiKey: `set:${Redacted.value(config.groqApiKey).length > 0}`,
  githubToken: `set:${Redacted.value(config.githubToken).length > 0}`,
  serpApiKey: `set:${Redacted.value(config.serpApiKey).length > 0}`,
})

const loadConfig = Effect.gen(function* () {
  const config = yield* SeoConfig
  yield* Effect.log("config loaded", redactConfig(config))
})

const optimize = Effect.gen(function* () {
  yield* loadConfig
  const optimizer = yield* OptimizeMachineService
  const result = yield* optimizer.run({ dryRun })
  yield* Effect.log(`optimize finished: visited ${result.visited.join(" -> ")} (pr: ${result.prUrl})`)
})

const measure = Effect.gen(function* () {
  yield* loadConfig
  const measurer = yield* MeasureService
  const result = yield* measurer.run()
  yield* Effect.log(`measure finished: ${result.measured} change(s) measured, ${result.learnings.length} learning(s) persisted`)
})

if (command === "measure") {
  await runProgram(
    measure.pipe(
      Effect.provide(GscServiceLive),
      Effect.provide(DatabaseLive),
      Effect.provide(BrainServiceLive),
      Effect.provide(MeasureLive),
      Effect.provide(SeoConfigLayer),
    ),
  )
} else if (command === "optimize") {
  await runProgram(
    optimize.pipe(
      Effect.provide(ValidateServiceLive),
      Effect.provide(BuildServiceLive),
      Effect.provide(CrawlServiceLive),
      Effect.provide(GscServiceLive),
      Effect.provide(SerpServiceLive),
      Effect.provide(KeywordPlannerServiceLive),
      Effect.provide(DatabaseLive),
      Effect.provide(BrainServiceLive),
      Effect.provide(ContentServiceLive),
      Effect.provide(GithubServiceLive),
      Effect.provide(OptimizeLive),
      Effect.provide(SeoConfigLayer),
    ),
  )
} else {
  console.error(`fatal: unknown command '${command}' (expected optimize|measure)`)
  process.exit(1)
}