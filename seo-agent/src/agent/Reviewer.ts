import { Context, Data, Effect, Layer } from "effect"

export class ReviewerError extends Data.TaggedError("ReviewerError")<{
  readonly reason: string
}> {}

export type ReviewVerdict = "pass" | "fail"

export interface ChangeSummary {
  readonly title: string
  readonly description: string
  readonly diffSummary: string
}

export interface ReviewerShape {
  readonly review: (change: ChangeSummary) => Effect.Effect<ReviewVerdict, ReviewerError>
}

export class Reviewer extends Context.Service<Reviewer, ReviewerShape>()("Reviewer") {}

export const ReviewerLive: Layer.Layer<Reviewer> = Layer.succeed(Reviewer, {
  review: (change: ChangeSummary) =>
    Effect.log(`reviewer: reviewing "${change.title}" (${change.diffSummary.split("\n").length} diff lines)`).pipe(
      Effect.andThen(Effect.succeed("pass" as ReviewVerdict)),
    ),
})