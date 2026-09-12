import { Context, Effect, Layer, Option } from "effect"
import type { Change } from "../types/agent.js"

export type ValidateChangeInput = Change

export interface ValidateFinding {
  readonly field: string
  readonly message: string
}

export interface ValidateResult {
  readonly pass: boolean
  readonly findings: ReadonlyArray<ValidateFinding>
}

export interface ValidateShape {
  readonly validateChange: (change: ValidateChangeInput) => Effect.Effect<ValidateResult, never>
}

export class ValidateService extends Context.Service<ValidateService, ValidateShape>()("Validate") {}

const MAX_TITLE_LEN = 60
const MIN_DESCRIPTION_LEN = 120
const MAX_DESCRIPTION_LEN = 160

const countChars = (value: string): number => Array.from(value).length

export const ValidateServiceLive: Layer.Layer<ValidateService> = Layer.succeed(ValidateService, {
  validateChange: (change) =>
    Effect.log(`validate: ${change.filePath}`).pipe(
      Effect.andThen(
        Effect.gen(function* () {
          const findings: Array<ValidateFinding> = []

          const titleLen = countChars(change.title)
          if (titleLen > MAX_TITLE_LEN) {
            findings.push({
              field: "title",
              message: `Title is ${titleLen} characters; must be at most ${MAX_TITLE_LEN}.`,
            })
          }

          const descriptionLen = countChars(change.description)
          if (descriptionLen < MIN_DESCRIPTION_LEN || descriptionLen > MAX_DESCRIPTION_LEN) {
            findings.push({
              field: "description",
              message: `Description is ${descriptionLen} characters; must be between ${MIN_DESCRIPTION_LEN} and ${MAX_DESCRIPTION_LEN}.`,
            })
          }

          if (change.jsonLd.trim() !== "") {
            const parsed = yield* Effect.try({
              try: () => JSON.parse(change.jsonLd) as unknown,
              catch: (cause) => `${cause}`,
            }).pipe(Effect.option)
            if (Option.isNone(parsed)) {
              findings.push({
                field: "jsonLd",
                message: "JSON-LD is not valid JSON.",
              })
            }
          }

          return { pass: findings.length === 0, findings }
        }),
      ),
      Effect.tap((r) => Effect.log(`validate: pass=${r.pass} findings=${r.findings.length}`)),
    ),
})