
import type { CrawlResult, GscMetrics, SerpResults } from "./market.js"

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

// The three search intents the agent reasons about. Classified by the brain
// from competitor SERP titles (see src/shared/intent.ts for the stub fallback).
export type Intent = "commercial" | "transactional" | "informational"

export interface ClassifyIntentInput {
  readonly keyword: string
  readonly serp: SerpResults | null
}

// A keyword surfaced by GSC query discovery (KEYWORD_DISCOVERY) that is ready
// to be researched. Discovery upserts it into the `keywords` table and resolves
// intent (brain, from competitor SERP titles) + target_url (GSC page) before
// RESEARCH runs. The discovery-fetched SERP is carried so RESEARCH reuses it.
export interface DiscoveredKeyword {
  readonly keywordId: number
  readonly term: string
  readonly intent: string
  readonly targetUrl: string
  readonly serp: SerpResults | null
}

export interface ResearchRow {
  readonly keywordId: number
  readonly term: string
  readonly intent: string
  readonly targetUrl: string
  readonly serp: SerpResults | null
  readonly gsc: GscMetrics | null
  readonly crawl: CrawlResult | null
}

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