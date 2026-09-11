import { Context, Layer, Schema } from "effect"

export const SerpInput = Schema.Struct({
  keyword: Schema.String,
  source: Schema.Literals(["google", "bing"]),
})
export const SerpEntry = Schema.Struct({
  rank: Schema.Number,
  url: Schema.String,
  title: Schema.String,
  snippet: Schema.String,
})
export const SerpOutput = Schema.Struct({ results: Schema.Array(SerpEntry) })

export const GscInput = Schema.Struct({
  query: Schema.String,
  window: Schema.Literals(["7d", "28d"]),
})
export const GscOutput = Schema.Struct({
  clicks: Schema.Number,
  impressions: Schema.Number,
  position: Schema.Number,
  ctr: Schema.Number,
  trend: Schema.Array(Schema.Number),
})

export const CrawlInput = Schema.Struct({ path: Schema.String })
export const CrawlOutput = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  h1: Schema.String,
  jsonLdBlocks: Schema.Number,
  internalLinks: Schema.Number,
  brokenLinks: Schema.Number,
})

export const BuildInput = Schema.Struct({ branch: Schema.String })
export const BuildOutput = Schema.Struct({
  ok: Schema.Boolean,
  errors: Schema.Array(Schema.Struct({ file: Schema.String, message: Schema.String })),
})

export const ValidateInput = Schema.Struct({ filePath: Schema.String })
export const ValidateOutput = Schema.Struct({
  pass: Schema.Boolean,
  findings: Schema.Array(Schema.Struct({ field: Schema.String, message: Schema.String })),
})

export const GithubInput = Schema.Struct({
  title: Schema.String,
  body: Schema.String,
  base: Schema.String,
})
export const GithubOutput = Schema.Struct({ prUrl: Schema.String })

export interface ToolDefinition {
  readonly name: string
  readonly description: string
  readonly input: Schema.Schema<unknown>
  readonly output: Schema.Schema<unknown>
}

export const registry: Readonly<Record<string, ToolDefinition>> = {
  serp: {
    name: "serp",
    description: "Collect the current top-10 SERP results for a keyword (competitors, titles, snippets).",
    input: SerpInput,
    output: SerpOutput,
  },
  gsc: {
    name: "gsc",
    description: "Pull Search Console facts for a query: clicks, impressions, position, CTR, trend window.",
    input: GscInput,
    output: GscOutput,
  },
  crawl: {
    name: "crawl",
    description: "Crawl a page to collect title, description, H1, JSON-LD, internal links and broken links.",
    input: CrawlInput,
    output: CrawlOutput,
  },
  build: {
    name: "build",
    description: "Build the site and report compilation/lint errors.",
    input: BuildInput,
    output: BuildOutput,
  },
  validate: {
    name: "validate",
    description: "Validate a change against the rules (metadata, structured data, facts, tone).",
    input: ValidateInput,
    output: ValidateOutput,
  },
  github: {
    name: "github",
    description: "Open a pull request for an approved change and return its URL.",
    input: GithubInput,
    output: GithubOutput,
  },
}

export interface ToolRegistryShape {
  readonly tools: Readonly<Record<string, ToolDefinition>>
}

export class ToolRegistry extends Context.Service<ToolRegistry, ToolRegistryShape>()("ToolRegistry") {}

export const ToolRegistryLive: Layer.Layer<ToolRegistry> = Layer.succeed(ToolRegistry, { tools: registry })