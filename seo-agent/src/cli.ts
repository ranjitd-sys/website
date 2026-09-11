import { Effect, Result } from "effect"
import {
  ConfigLoadError,
  SeoConfig,
  SeoConfigLayer,
  formatConfigFailure,
} from "./Config.js"

const main = Effect.gen(function* () {
  const config = yield* SeoConfig
  yield* Effect.log("deeprank-seo-agent: config loaded", {
    databaseUrl: config.databaseUrl,
    gscClientEmail: config.gscClientEmail,
    gscSiteUrl: config.gscSiteUrl,
    gscPrivateKey: config.gscPrivateKey,
    openaiApiKey: config.openaiApiKey,
    githubToken: config.githubToken,
  })
})

const program = main.pipe(Effect.provide(SeoConfigLayer))

const result = await Effect.runPromise(Effect.result(program))

if (Result.isFailure(result)) {
  const error = result.failure
  if (error instanceof ConfigLoadError) {
    console.error(formatConfigFailure(error))
  } else {
    console.error(`fatal: ${String(error)}`)
  }
  process.exit(1)
}