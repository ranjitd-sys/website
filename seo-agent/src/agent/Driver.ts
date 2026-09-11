import { Context, Data, Effect, Layer } from "effect"
import { getInitialSnapshot, transition, type SnapshotFrom } from "xstate"
import type { OptimizeContext, OptimizeEvent } from "./Machine.js"
import { optimizeMachine } from "./Machine.js"
import { Reviewer, type ReviewVerdict } from "./Reviewer.js"

export class DriverError extends Data.TaggedError("DriverError")<{
  readonly state: string
  readonly reason: string
}> {}

export interface OptimizeResult {
  readonly status: "finished"
  readonly prUrl: string
  readonly visited: ReadonlyArray<string>
}

export interface RunOptions {
  readonly dryRun: boolean
}

export interface Optimize {
  readonly run: (options: RunOptions) => Effect.Effect<OptimizeResult, DriverError, Reviewer>
}

export class OptimizeMachineService extends Context.Service<OptimizeMachineService, Optimize>()("Optimize") {}

type Snapshot = SnapshotFrom<typeof optimizeMachine>

const stateName = (snapshot: Snapshot): string => String(snapshot.value)

const logTransition = (from: string, event: OptimizeEvent, to: string): Effect.Effect<void> =>
  Effect.log(`optimize: ${from} -> ${to} (${event.type})`)

const step = (snapshot: Snapshot) => {
  switch (stateName(snapshot)) {
    case "RESEARCH":
      return Effect.succeed({ type: "RESEARCHED" } as OptimizeEvent)
    case "SCOPE":
      return Effect.succeed({ type: "OPPORTUNITY_SELECTED" } as OptimizeEvent)
    case "PLAN":
      return Effect.succeed({ type: "PLANNED", action: "retitle + rewrite intro (dry-run stub)" } as OptimizeEvent)
    case "ACT":
      return Effect.succeed({ type: "EDITED" } as OptimizeEvent)
    case "VALIDATE":
      return Effect.succeed({ type: "VALIDATION_PASSED" } as OptimizeEvent)
    case "REVIEWER":
      return Effect.gen(function* () {
        const reviewer = yield* Reviewer
        const change = {
          title: "GST Software for Amazon Sellers in India — DeepEcom",
          description: "Dry-run change for the selected opportunity",
          diffSummary: "title: old -> new\ndescription: old -> new",
        }
        const verdict: ReviewVerdict = yield* reviewer.review(change).pipe(
          Effect.catchCause(() => Effect.succeed("fail" as ReviewVerdict)),
        )
        return (verdict === "pass"
          ? { type: "REVIEW_PASSED" }
          : { type: "REVIEW_FAILED", reason: "reviewer rejected the change" }) as OptimizeEvent
      })
    case "CREATE_PR":
      return Effect.succeed({ type: "PR_CREATED", prUrl: "https://github.com/placeholder/dry-run" } as OptimizeEvent)
    default:
      return Effect.fail(new DriverError({ state: stateName(snapshot), reason: "no step registered" }))
  }
}

const walk = (
  snapshot: Snapshot,
  retries: number,
  maxRetries: number,
  prUrl: string | null,
  visited: ReadonlyArray<string>,
): Effect.Effect<OptimizeResult, DriverError, Reviewer> => {
  const state = stateName(snapshot)
  if (state === "FINISHED") {
    return Effect.succeed({ status: "finished", prUrl: prUrl ?? "none", visited })
  }
  if (state === "ABORTED") {
    return Effect.fail(new DriverError({ state, reason: prUrl ?? "aborted" }))
  }optimizeMachine
  return Effect.gen(function* () {
    let event: OptimizeEvent
    let nextRetries = retries
    let nextPrUrl = prUrl
    if (state === "REVISE") {
      if (retries >= maxRetries) {
        nextPrUrl = "max retries exceeded"
        event = { type: "ABORT", reason: "max retries exceeded" }
      } else {
        nextRetries = retries + 1
        event = { type: "REVISED" }
      }
    } else {
      const result = yield* step(snapshot)
      if (result instanceof DriverError) {
        nextPrUrl = result.reason
        event = { type: "ABORT", reason: result.reason }
      } else {
        event = result as OptimizeEvent
        if (event.type === "PR_CREATED") {
          nextPrUrl = event.prUrl
        }
      }
    }
    const [nextSnapshot] = transition(optimizeMachine, snapshot, event)
    const nextState = stateName(nextSnapshot)
    yield* logTransition(state, event, nextState)
    return yield* walk(nextSnapshot, nextRetries, maxRetries, nextPrUrl, [...visited, state])
  })
}

const impl: Optimize = {
  run: (options) =>
    Effect.gen(function* () {
      yield* Effect.log(`optimize run${options.dryRun ? " (dry-run)" : ""}`)
      const initial = getInitialSnapshot(optimizeMachine)
      const maxRetries = initial.context.maxRetries
      const [started] = transition(optimizeMachine, initial, { type: "START" })
      return yield* walk(started, 0, maxRetries, null, [stateName(initial)])
    }),
}

export const OptimizeLive: Layer.Layer<OptimizeMachineService> = Layer.succeed(
  OptimizeMachineService,
  impl,
)