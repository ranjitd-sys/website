import { Context, Data, Effect, Layer } from "effect"
import type { ReviewInput, ReviewVerdict } from "../types/agent.js"

export type { ReviewInput, ReviewVerdict }

export class ReviewerError extends Data.TaggedError("ReviewerError")<{
  readonly reason: string
}> {}

export interface ReviewerShape {
  readonly review: (change: ReviewInput) => Effect.Effect<ReviewVerdict, ReviewerError>
}

export class Reviewer extends Context.Service<Reviewer, ReviewerShape>()("Reviewer") {}

export const ReviewerLive: Layer.Layer<Reviewer> = Layer.succeed(Reviewer, {
  review: (change: ReviewInput) =>
    Effect.log(`reviewer: reviewing "${change.title}" (${change.diffSummary.split("\n").length} diff lines)`).pipe(
      Effect.andThen(Effect.succeed("pass" as ReviewVerdict)),
    ),
})