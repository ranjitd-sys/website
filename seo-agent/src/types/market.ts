// Canonical market-data types shared across tools, drivers and measurements.
// Tools import these instead of declaring their own copies.

export type SerpSource = "google" | "bing"

export interface SerpResult {
  readonly rank: number
  readonly url: string
  readonly title: string
  readonly snippet: string
}

export interface SerpResults {
  readonly results: ReadonlyArray<SerpResult>
}

export type GscWindow = "7d" | "28d"

export interface GscMetrics {
  readonly clicks: number
  readonly impressions: number
  readonly position: number
  readonly ctr: number
  readonly trend: ReadonlyArray<number>
}

export interface CrawlResult {
  readonly title: string
  readonly description: string
  readonly h1: string
  readonly jsonLdBlocks: number
  readonly internalLinks: number
  readonly brokenLinks: number
}