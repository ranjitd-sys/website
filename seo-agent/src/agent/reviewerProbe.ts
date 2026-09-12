import { Effect, Redacted } from "effect"
import { SeoConfig, SeoConfigLayer } from "../Config.js"
import { BrainService, BrainServiceLive, type ReviewInput } from "./brain.js"
import { runProgram } from "../edge.js"

interface Case {
  readonly name: string
  readonly expected: "pass" | "fail"
  readonly input: ReviewInput
}

const CASES: ReadonlyArray<Case> = [
  {
    name: "fabrication",
    expected: "fail",
    input: {
      title: "Trusted by over 500 businesses worldwide",
      description: "Over 500 ecommerce businesses trust DeepEcom to reconcile marketplace payments, track GST and TCS/TDS, and automate complete ERP accounting for online sellers.",
      diffSummary: "New title and meta description claiming 500+ businesses use DeepEcom.",
    },
  },
  {
    name: "scope",
    expected: "fail",
    input: {
      title: "AI-Powered Autonomous Inventory Management",
      description: "DeepEcom now ships AI-powered autonomous inventory management and order management that run your warehouse operations without any manual intervention.",
      diffSummary: "Presents autonomous inventory management as a launched DeepEcom capability.",
    },
  },
  {
    name: "positioning",
    expected: "fail",
    input: {
      title: "Replace Your ERP with DeepEcom",
      description: "Retire your existing ERP today — DeepEcom replaces your ERP with marketplace-native accounting, reconciliation, and GST reporting for online sellers.",
      diffSummary: "Metadata claiming DeepEcom replaces the ERP.",
    },
  },
  {
    name: "clean pass",
    expected: "pass",
    input: {
      title: "Ecommerce Accounting Software for Online Sellers",
      description: "DeepEcom connects ecommerce marketplaces to payment reconciliation and detailed ERP accounting, with order-wise and GST-wise entries for online sellers.",
      diffSummary: "Refreshes title and meta description for the ecommerce accounting page; no capabilities or stats added.",
    },
  },
]

const probe = Effect.gen(function* () {
  const config = yield* SeoConfig
  const brain = yield* BrainService

  const stubMode = Redacted.value(config.groqApiKey).trim() === ""
  if (stubMode) {
    yield* Effect.log("reviewer probe: SKIPPED — no GROQ_API_KEY (reviewer runs in stub mode)")
    return
  }

  const results: Array<{ name: string; expected: string; actual: string; reason: string; ok: boolean }> = []
  for (const c of CASES) {
    const output = yield* brain.review(c.input)
    results.push({
      name: c.name,
      expected: c.expected,
      actual: output.verdict,
      reason: output.reason,
      ok: output.verdict === c.expected,
    })
    yield* Effect.log(
      `reviewer probe: [${c.name}] expected=${c.expected} actual=${output.verdict} -> ${output.verdict === c.expected ? "OK" : "FAIL"}`,
    )
    yield* Effect.log(`reviewer probe:   reason: ${output.reason}`)
  }

  const failed = results.filter((r) => !r.ok)
  if (failed.length > 0) {
    for (const f of failed) {
      yield* Effect.log(`reviewer probe: MISMATCH [${f.name}] expected=${f.expected} actual=${f.actual}`)
    }
    yield* Effect.fail(new Error(`reviewer probe: ${failed.length} of ${results.length} cases failed`))
  }
})

await runProgram(probe.pipe(Effect.provide(BrainServiceLive), Effect.provide(SeoConfigLayer)))