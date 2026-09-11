import { Effect, Result } from "effect"
import { ConfigLoadError, formatConfigFailure } from "./Config.js"

export const runProgram = async <A>(program: Effect.Effect<A, unknown, never>): Promise<void> => {
  const result = await Effect.runPromise(Effect.result(program))
  if (Result.isFailure(result)) {
    const error = result.failure
    if (error instanceof ConfigLoadError) {
      console.error(formatConfigFailure(error))
    } else if (error instanceof Error) {
      console.error(`fatal: ${error.message}`)
    } else {
      console.error(`fatal: ${String(error)}`)
    }
    process.exit(1)
  }
}