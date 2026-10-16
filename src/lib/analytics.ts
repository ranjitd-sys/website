type EventName =
  | "free_tool_completed"
  | "tally_sync_cta_viewed"
  | "tally_sync_cta_clicked"
  | "tally_sync_intro_viewed"
  | "tally_sync_intro_dismissed"
  | "tally_sync_intro_cta_clicked"
  | "tally_sync_signup_started"
  | "tally_connected"
  | "marketplace_connected"
  | "first_sync_completed"
  | "reconciliation_viewed"
  | "paid_conversion"

type EventProps = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    plausible?: (event: string, options?: { props?: EventProps }) => void
  }
}

export function trackEvent(event: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return
  const safe: EventProps = { ...props }
  // scrub obvious sensitive keys defensively
  for (const key of Object.keys(safe)) {
    if (/token|key|secret|password|auth|email|phone|amount|order|invoice/i.test(key)) {
      delete safe[key]
    }
  }
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, safe as Record<string, unknown>)
    if (typeof window.plausible === "function") window.plausible(event, { props: safe as EventProps })
  } catch {
    // no-op: analytics is optional and must never break the UI
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, safe)
  }
}
