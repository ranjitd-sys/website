import { Effect } from "effect"
import { BuildService, BuildServiceLive } from "./src/tools/build.ts"

const run = (cwd: string) =>
  Effect.runPromise(
    BuildService.runBuild({ cwd }).pipe(
      Effect.provide(BuildServiceLive),
    ),
  )

const cwd = new URL("..", import.meta.url).pathname
const result = await run(cwd)
console.log("real build:", JSON.stringify(result, null, 2))
if (result.ok !== true || result.errors.length !== 0) {
  console.error("EXIT: expected ok build")
  process.exit(1)
}
console.log("EXIT: ok")