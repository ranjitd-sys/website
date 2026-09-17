// Shared text helpers used across the agent.

export const describeFinding = (entry: { field: string; message: string }): string =>
  `${entry.field}: ${entry.message}`

// Deterministic query-quality gate used as the stub fallback for
// `brain.filterQueries` (no GROQ_API_KEY, or a live filter call fails).
// Skips vague, noisy, or operator-spam GSC queries: too-short terms, search
// operators (site:/-site:/inurl:/...), purely numeric terms, short
// alphanumeric codes (e.g. "ai33178"), URL-like terms, and special-character
// garbage. Real keywords ("payment reconciliation", "GST", "d2c brand
// accounting") always pass; vague garbage never reaches SERP/planner.
export const isRelevantQuery = (term: string): boolean => {
  const value = term.trim()
  if (value.length < 3) return false
  if (/\b(?:site|inurl|intitle|filetype|related|cache|link|allinurl|allintitle|allintext):/i.test(value)) return false
  if (/-site:/i.test(value)) return false
  if (/^\d+$/.test(value)) return false
  if (/^[a-z]{1,4}\d{3,}$/i.test(value)) return false
  if (/^\d+[a-z]{1,4}$/i.test(value)) return false
  if (/https?:|www\.|\.com\b|\.in\b|\.net\b|\.org\b/i.test(value)) return false
  if (/[{}[\]|\\@#$%^*+=~`<>]/.test(value)) return false
  return true
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")