// Shared scoring helpers used by the optimizer driver.

import type { GscMetrics } from "../types/market.js"

export const INTENT_WEIGHT: Readonly<Record<string, number>> = {
  commercial: 1.0,
  transactional: 0.9,
  informational: 0.5,
}

export const momentumMultiplier = (trend: ReadonlyArray<number>): number => {
  if (trend.length === 0) return 1.0
  const first = trend[0] ?? 0
  const last = trend[trend.length - 1] ?? first
  if (first === 0) return 1.0
  const improvement = (first - last) / first
  if (improvement >= 0.3) return 1.6
  if (improvement >= 0.1) return 1.3
  if (improvement <= -0.05) return 0.6
  return 1.0
}

export const opportunityScore = (
  intent: string,
  gsc: Pick<GscMetrics, "impressions" | "position" | "trend"> | null,
): number => {
  if (gsc === null) return 0
  const position = Math.max(gsc.position, 1)
  return gsc.impressions * position * (INTENT_WEIGHT[intent] ?? 0.5) * momentumMultiplier(gsc.trend)
}