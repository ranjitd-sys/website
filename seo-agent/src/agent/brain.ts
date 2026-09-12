import { Context, Data, Effect, Layer, Option, Redacted, Schema } from "effect"
import { SeoConfig, type SeoConfigShape } from "../Config.js"
import {
  actPrompt,
  driverPrompt,
  learnPrompt,
  revisePrompt,
  reviewerPrompt,
  type LearnedDelta,
  type PromptCrawl,
  type PromptGsc,
  type PromptSerpEntry,
} from "./prompts.js"

export class BrainError extends Data.TaggedError("BrainError")<{
  readonly step: string
  readonly reason: string
}> {}

export interface Change {
  readonly filePath: string
  readonly title: string
  readonly description: string
  readonly jsonLd: string
}

export interface PlanOutput {
  readonly diagnosis: string
  readonly action: string
  readonly rationale: string
}

export type ReviewVerdict = "pass" | "fail"

export interface ReviewOutput {
  readonly verdict: ReviewVerdict
  readonly reason: string
}

export interface PlanInput {
  readonly keyword: string
  readonly intent: string
  readonly crawl: PromptCrawl | null
  readonly serp: { readonly results: ReadonlyArray<PromptSerpEntry> } | null
  readonly gsc: PromptGsc | null
  readonly learnings: ReadonlyArray<string>
}

export interface ActInput {
  readonly keyword: string
  readonly targetUrl: string
  readonly crawl: PromptCrawl | null
  readonly diagnosis: string
  readonly action: string
  readonly rationale: string
}

export interface ReviseInput {
  readonly change: Change
  readonly lastReason: string
}

export interface ReviewInput {
  readonly title: string
  readonly description: string
  readonly diffSummary: string
}

export interface LearnInput {
  readonly deltas: ReadonlyArray<{
    readonly keyword: string
    readonly before: number
    readonly after: number
    readonly delta: number
    readonly verdict: "won" | "stuck" | "falling"
  }>
}

export interface BrainShape {
  readonly plan: (input: PlanInput) => Effect.Effect<PlanOutput, BrainError, SeoConfig>
  readonly act: (input: ActInput) => Effect.Effect<Change, BrainError, SeoConfig>
  readonly revise: (input: ReviseInput) => Effect.Effect<Change, BrainError, SeoConfig>
  readonly review: (input: ReviewInput) => Effect.Effect<ReviewOutput, BrainError, SeoConfig>
  readonly learn: (input: LearnInput) => Effect.Effect<ReadonlyArray<string>, BrainError, SeoConfig>
}

export class BrainService extends Context.Service<BrainService, BrainShape>()("BrainService") {}

const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions"

const PlanOutputSchema = Schema.Struct({
  diagnosis: Schema.String,
  action: Schema.String,
  rationale: Schema.String,
})

const ChangeSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  jsonLd: Schema.String,
})

const ReviewSchema = Schema.Struct({
  verdict: Schema.Literals(["pass", "fail"]),
  reason: Schema.String,
})

const LearningsSchema = Schema.Struct({
  learnings: Schema.Array(Schema.String),
})

const decodeJson = <S extends Schema.Schema<any>>(
  schema: S,
  input: unknown,
  step: string,
): Effect.Effect<S["Type"], BrainError, never> =>
  Effect.try({
    try: () => Schema.decodeUnknownOption(schema as never)(input),
    catch: (cause) => new BrainError({ step, reason: `model output decode threw: ${String(cause)}` }),
  }).pipe(
    Effect.flatMap((option) =>
      Option.isSome(option)
        ? Effect.succeed(option.value)
        : Effect.fail(new BrainError({ step, reason: "model output did not match expected JSON schema" })),
    ),
  )

const chatJson = (step: string) =>
  (
    shape: SeoConfigShape,
    system: string,
    user: string,
    reviewer: boolean,
  ): Effect.Effect<unknown, BrainError, never> =>
    Effect.tryPromise({
      try: async (signal) => {
        const res = await fetch(GROQ_BASE, {
          method: "POST",
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Redacted.value(shape.groqApiKey)}`,
          },
          body: JSON.stringify({
            model: reviewer ? shape.groqReviewerModel : shape.groqModel,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.2,
            response_format: { type: "json_object" },
          }),
        })
        if (!res.ok) {
          throw new Error(`Groq HTTP ${res.status}: ${res.statusText}`)
        }
        const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
        const content = data.choices?.[0]?.message?.content
        if (typeof content !== "string" || content.trim() === "") {
          throw new Error("empty completion from Groq")
        }
        return JSON.parse(content) as unknown
      },
      catch: (error) =>
        new BrainError({ step, reason: error instanceof Error ? error.message : String(error) }),
    })

const SHORT_TRACK = "Track marketplace orders, fees, GST, TCS/TDS, returns and settlements for online sellers."
const FALLBACK_JSONLD =
  '{"@context":"https://schema.org","@type":"Article","headline":"Ecommerce Accounting with DeepEcom","author":{"@type":"Organization","name":"DeepEcom"}}'

const clamp = (raw: { title: string; description: string; jsonLd: string }, filePath: string): Change => {
  const title = Array.from(raw.title).slice(0, 60).join("")
  let description = raw.description
  while (Array.from(description).length < 120) {
    description += " Reconcile payments and get ERP-ready accounting automatically."
  }
  if (Array.from(description).length > 160) {
    description = Array.from(description).slice(0, 160).join("")
  }
  let jsonLd = raw.jsonLd.trim()
  const parsed = Effect.runSync(
    Effect.try({
      try: () => JSON.parse(jsonLd) as unknown,
      catch: () => null,
    }),
  )
  if (parsed === null) {
    jsonLd = FALLBACK_JSONLD
  }
  return { filePath, title, description, jsonLd }
}

const complete = <S extends Schema.Schema<any>>(
  step: string,
  schema: S,
  system: string,
  user: string,
  reviewer: boolean,
): Effect.Effect<S["Type"], BrainError, SeoConfig> =>
  Effect.gen(function* () {
    const shape = yield* SeoConfig
    const raw = yield* chatJson(step)(shape, system, user, reviewer)
    return yield* decodeJson(schema, raw, step)
  })

const stubPlan = (input: PlanInput): PlanOutput => ({
  diagnosis: `Under-optimized metadata for "${input.keyword}" (stub; no GROQ_API_KEY configured).`,
  action: "optimize metadata (stub)",
  rationale: "No LLM credential configured — using deterministic fallback.",
})

const stubAct = (input: ActInput): Change => {
  const filePath = `src/pages${input.targetUrl}.astro`
  return clamp(
    {
      title: `Optimize ${input.keyword}`,
      description: SHORT_TRACK,
      jsonLd: FALLBACK_JSONLD,
    },
    filePath,
  )
}

const stubRevise = (input: ReviseInput): Change => input.change;

const stubLearn = (input: LearnInput): ReadonlyArray<string> =>
  input.deltas.map(
    (d) =>
      `"${d.keyword}" moved ${d.before} → ${d.after} (${d.verdict}); metadata changes can shift ranking. (stub; no GROQ_API_KEY configured)`,
  )

const BrainServiceLive: Layer.Layer<BrainService, never, SeoConfig> = Layer.effect(
  BrainService,
  Effect.gen(function* () {
    const config = yield* SeoConfig
    const stub = Redacted.value(config.groqApiKey).trim() === ""
    return {
      plan: (input) =>
        stub
          ? Effect.succeed(stubPlan(input))
          : complete("plan", PlanOutputSchema, driverPrompt(input), "Diagnose the ranking gap.", false),
      act: (input) =>
        stub
          ? Effect.succeed(stubAct(input))
          : complete("act", ChangeSchema, actPrompt(input), "Write the optimized metadata.", false).pipe(
              Effect.map((raw) => clamp(raw, `src/pages${input.targetUrl}.astro`)),
            ),
      revise: (input) =>
        stub
          ? Effect.succeed(stubRevise(input))
          : complete(
              "revise",
              ChangeSchema,
              revisePrompt({
                title: input.change.title,
                description: input.change.description,
                jsonLd: input.change.jsonLd,
                lastReason: input.lastReason,
              }),
              "Fix the failing change minimally.",
              false,
            ).pipe(Effect.map((raw) => clamp(raw, input.change.filePath))),
      review: (input) =>
        stub
          ? Effect.succeed({
              verdict: "pass" as ReviewVerdict,
              reason: "stub reviewer (no GROQ_API_KEY configured)",
            })
          : complete("review", ReviewSchema, reviewerPrompt(input), "Return your verdict.", true),
      learn: (input) =>
        stub
          ? Effect.succeed(stubLearn(input))
          : complete(
              "learn",
              LearningsSchema,
              learnPrompt(
                input.deltas as ReadonlyArray<LearnedDelta>,
              ),
              "Generalize the measured results into learnings.",
              false,
            ).pipe(Effect.map((out) => out.learnings)),
    }
  }),
)

export { BrainServiceLive }