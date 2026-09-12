// Canonical agent/optimization types shared across brain, prompts, driver and measure.

import type { GscMetrics, SerpResults } from "./market.js"

// The change a tool can apply to the content repository.
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

// Prompt-facing views (what the LLM sees), derived from the canonical types.

export interface PromptCrawl {
  readonly title: string
  readonly description: string
}

export type PromptGsc = Pick<GscMetrics, "impressions" | "position" | "ctr">

export interface PlanInput {
  readonly keyword: string
  readonly intent: string
  readonly crawl: PromptCrawl | null
  readonly serp: SerpResults | null
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

// Measurement domain.

export type Verdict = "won" | "stuck" | "falling"

export interface LearnedDelta {
  readonly keyword: string
  readonly before: number
  readonly after: number
  readonly delta: number
  readonly verdict: Verdict
}

export interface LearnInput {
  readonly deltas: ReadonlyArray<LearnedDelta>
}

// Driver run domain.

export interface SelectedOpportunity {
  readonly keywordId: number
  readonly opportunityId: number
  readonly term: string
  readonly targetUrl: string
  readonly score: number
  readonly intent: string
}

export interface RunOptions {
  readonly dryRun: boolean
}

export interface OptimizeResult {
  readonly status: "finished"
  readonly prUrl: string
  readonly visited: ReadonlyArray<string>
}