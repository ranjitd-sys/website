// Deterministic intent classifier used as the stub fallback for
// `brain.classifyIntent` (no GROQ_API_KEY, or a live brain call fails).
//
// Reads competitor SERP titles + snippets and the keyword itself, scores
// weighted signal words, and returns the best matching intent. Tie -> the
// highest-weighted intent (commercial > transactional > informational),
// matching `INTENT_WEIGHT` in scoring.ts.

import type { Intent } from "../types/agent.js"
import type { SerpResults } from "../types/market.js"

const TRANSACTIONAL_SIGNALS = [
  "buy",
  "order",
  "price",
  "pricing",
  "deal",
  "coupon",
  "discount",
  "free trial",
  "sign up",
  "signup",
  "download",
  "subscribe",
  "checkout",
  "quote",
  "hire",
  "book a",
  "purchase",
  "shop",
  "sell online",
]

const COMMERCIAL_SIGNALS = [
  "best",
  "top",
  "review",
  "compare",
  "comparison",
  " vs ",
  "vs.",
  "alternative",
  "software",
  "tool",
  "platform",
  "service",
  "solution",
  "provider",
  "agency",
  "for amazon",
  "for d2c",
  "for flipkart",
  "for ecommerce",
  "for online sellers",
  "for sellers",
  "features",
  "demo",
]

const INFORMATIONAL_SIGNALS = [
  "what is",
  "what are",
  "how to",
  "how does",
  "how do",
  "guide",
  "tutorial",
  "learn",
  "example",
  "definition",
  "meaning of",
  "difference",
  "benefits",
  "tips",
  "why ",
  "when to",
  "explained",
  "everything about",
  "blog",
]

const TITLE_WEIGHT = 2
const SNIPPET_WEIGHT = 1
const KEYWORD_WEIGHT = 2
const TOP_RESULTS = 5

const hits = (haystack: string, signals: ReadonlyArray<string>): number => {
  let count = 0
  for (const signal of signals) {
    if (haystack.includes(signal)) count += 1
  }
  return count
}

export const classifySerpIntent = (input: {
  readonly keyword: string
  readonly serp: SerpResults | null
}): Intent => {
  const keyword = input.keyword.toLowerCase()
  const results = input.serp?.results.slice(0, TOP_RESULTS) ?? []

  const titles = results.map((r) => r.title.toLowerCase()).join(" ")
  const snippets = results.map((r) => r.snippet.toLowerCase()).join(" ")

  const score = (signals: ReadonlyArray<string>): number =>
    hits(titles, signals) * TITLE_WEIGHT +
    hits(snippets, signals) * SNIPPET_WEIGHT +
    hits(keyword, signals) * KEYWORD_WEIGHT

  const commercial = score(COMMERCIAL_SIGNALS)
  const transactional = score(TRANSACTIONAL_SIGNALS)
  const informational = score(INFORMATIONAL_SIGNALS)

  // Tie-break toward the highest INTENT_WEIGHT first.
  if (commercial >= transactional && commercial >= informational) return "commercial"
  if (transactional >= informational) return "transactional"
  return "informational"
}
