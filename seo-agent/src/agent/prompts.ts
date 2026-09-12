export interface PromptSerpEntry {
  readonly rank: number
  readonly url: string
  readonly title: string
  readonly snippet: string
}

export interface PromptCrawl {
  readonly title: string
  readonly description: string
}

export interface PromptGsc {
  readonly impressions: number
  readonly position: number
  readonly ctr: number
}

export interface PlanPromptInput {
  readonly keyword: string
  readonly intent: string
  readonly crawl: PromptCrawl | null
  readonly serp: { readonly results: ReadonlyArray<PromptSerpEntry> } | null
  readonly gsc: PromptGsc | null
  readonly learnings: ReadonlyArray<string>
}

export interface ActPromptInput {
  readonly keyword: string
  readonly targetUrl: string
  readonly crawl: PromptCrawl | null
  readonly diagnosis: string
  readonly action: string
  readonly rationale: string
}

export interface ReviewPromptInput {
  readonly title: string
  readonly description: string
  readonly diffSummary: string
}

export interface RevisePromptInput {
  readonly title: string
  readonly description: string
  readonly jsonLd: string
  readonly lastReason: string
}

const POSITIONING_RULES = [
  "DeepEcom is the accounting layer for ecommerce — it connects marketplaces to reconciliation, intelligence and ERP accounting.",
  "DeepEcom does NOT replace the ERP. DeepEcom makes the ERP ecommerce-ready.",
  "Current scope only: Platform (data aggregation, dashboard, profitability, payment reconciliation, reports) and ERP Connector (order-wise / GST-wise / warehouse-wise accounting, marketplace charges, returns, refunds, TCS/TDS, inventory, stock transfers, ERP posting to Tally / SAP / Zoho).",
  "Never present future products as launched capabilities. Do not invent stats, counts, quotes or integrations.",
  "Never fabricate numbers or performance claims.",
].join("\n")

const METADATA_RULES = [
  "Title: at most 60 characters.",
  "Description: between 120 and 160 characters.",
  "JSON-LD: valid JSON.",
  "Return ONLY a JSON object — no markdown fences, no commentary.",
].join("\n")

export const driverPrompt = (input: PlanPromptInput): string => [
  `You are DeepEcom's SEO agent. Your job: diagnose why "${input.keyword}" is under-trusted for an existing page, then propose the right fix.`,
  "",
  "DeepEcom background and hard rules:",
  POSITIONING_RULES,
  "",
  "Facts available to you:",
  `- Intent: ${input.intent}`,
  input.gsc
    ? `- GSC: ${input.gsc.impressions} impressions, ${input.gsc.position} avg position, ${(input.gsc.ctr * 100).toFixed(2)}% CTR`
    : "- GSC: unavailable",
  input.crawl ? `- Current page title: "${input.crawl.title}"` : "- Current page title: unknown",
  input.crawl ? `- Current meta description: "${input.crawl.description}"` : "- Current meta description: unknown",
  ...(input.serp && input.serp.results.length > 0
    ? input.serp.results.slice(0, 5).map(
        (r) => `- SERP ${r.rank}: ${r.title} (${r.url}) ${r.snippet ? `— ${r.snippet}` : ""}`,
      )
    : []),
  ...(input.learnings.length > 0
    ? ["", ...input.learnings.map((l) => `- Learning: ${l}`)]
    : []),
  "",
  "Diagnose the gap: intent mismatch, technical issue, weak CTR, thin content, or poor coverage.",
  "Respond with a single JSON object:",
  '{"diagnosis": "one-sentence analysis", "action": "string", "rationale": "string"}',
].join("\n")

export const actPrompt = (input: ActPromptInput): string => [
  `Write the optimized metadata for the page ${input.targetUrl} targeting "${input.keyword}".`,
  "",
  "DeepEcom background and hard rules:",
  POSITIONING_RULES,
  "",
  "Your plan for this page:",
  `- Diagnosis: ${input.diagnosis}`,
  `- Action: ${input.action}`,
  `- Rationale: ${input.rationale}`,
  "",
  input.crawl ? `- Current page title: "${input.crawl.title}"` : "- Current page title: unknown",
  input.crawl ? `- Current meta description: "${input.crawl.description}"` : "- Current meta description: unknown",
  "",
  "Write the new metadata. Keep the title and description honest, scoped to current DeepEcom capabilities, and on-brand (clear + intelligent; precise + technical).",
  "",
  METADATA_RULES,
  'Return ONLY a JSON object: {"title": "string", "description": "string", "jsonLd": "string"}',
].join("\n")

export const revisePrompt = (input: RevisePromptInput): string => [
  "Your previous change failed validation or review. Fix it minimally.",
  "",
  "Previous change:",
  `- Title: "${input.title}"`,
  `- Description: "${input.description}"`,
  `- JSON-LD: ${input.jsonLd}`,
  "",
  `Failure reason: ${input.lastReason}`,
  "",
  "Fix ONLY what is wrong. Keep everything that already works.",
  "",
  METADATA_RULES,
  'Return ONLY a JSON object: {"title": "string", "description": "string", "jsonLd": "string"}',
].join("\n")

export const reviewerPrompt = (input: ReviewPromptInput): string => [
  "You are DeepEcom's senior SEO reviewer. Judge the following proposed change.",
  "",
  "Proposed change:",
  `- Title: "${input.title}"`,
  `- Description: "${input.description}"`,
  `- Diff: ${input.diffSummary}`,
  "",
  "Reject if ANY of these are true:",
  "- Fabricated data: unverified customer counts, order volumes, GMV, revenue, percentages, quotes.",
  "- Scope violation: future products (Order Management, Inventory Management, AI automation, autonomous operations) presented as launched.",
  "- Positioning violation: implies DeepEcom replaces the ERP.",
  "- Material technical inaccuracy about ecommerce accounting, GST, TCS/TDS, settlements, or ERP posting.",
  "- Title over 60 characters or description outside 120–160 characters or broken JSON-LD.",
  "",
  POSITIONING_RULES,
  'Respond with a single JSON object: {"verdict": "pass" or "fail", "reason": "string"}',
].join("\n")

export interface LearnedDelta {
  readonly keyword: string
  readonly before: number
  readonly after: number
  readonly delta: number
  readonly verdict: "won" | "stuck" | "falling"
}

export const learnPrompt = (deltas: ReadonlyArray<LearnedDelta>): string => [
  "You are DeepEcom's SEO performance analyst. Below are the measured results of recent metadata optimizations.",
  "",
  deltas
    .map(
      (d) =>
        `- "${d.keyword}": position ${d.before} → ${d.after} (delta ${d.delta > 0 ? "+" : ""}${d.delta}) — verdict: ${d.verdict}`,
    )
    .join("\n"),
  "",
  "Generalize 1–3 concise, transferable learnings about which kinds of ecommerce metadata interventions correlate with ranking movement (intent alignment, CTR, coverage, depth).",
  "Do not claim guarantees. Notes are historical patterns only.",
  "",
  "Keep each learning under 200 characters.",
  'Respond with a single JSON object: {"learnings": ["string", ...]}',
].join("\n")