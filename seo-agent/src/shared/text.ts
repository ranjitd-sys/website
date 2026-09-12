// Shared text helpers used across the agent.

export const describeFinding = (entry: { field: string; message: string }): string =>
  `${entry.field}: ${entry.message}`

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")