import { useEffect, useState } from "react"
import { ArrowRight, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface Props {
  title: string
  body: string
  cta: string
  href: string
  storageKey?: string
  source?: string
  placement?: string
  variant?: "primary" | "secondary"
  /** When false, the card shows on every eligible render instead of once per session. */
  oncePerSession?: boolean
}

export default function TallySyncConversionCard({
  title,
  body,
  cta,
  href,
  storageKey = "ts-dismiss",
  source = "free-tool",
  placement = "post-result",
  variant = "secondary",
  oncePerSession = true,
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (oncePerSession && window.sessionStorage.getItem(storageKey)) return
      const t = window.setTimeout(() => setVisible(true), 400)
      // note the view once the card becomes eligible to render
      trackEvent("tally_sync_cta_viewed", { source_tool: source, placement, variant })
      return () => window.clearTimeout(t)
    } catch {
      setVisible(true)
      trackEvent("tally_sync_cta_viewed", { source_tool: source, placement, variant })
    }
  }, [storageKey, source, placement, variant, oncePerSession])

  const dismiss = () => {
    setVisible(false)
    if (oncePerSession) {
      try { window.sessionStorage.setItem(storageKey, "1") } catch {}
    }
  }

  const handleClick = () => {
    trackEvent("tally_sync_cta_clicked", { source_tool: source, placement, variant })
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Next step"
      className={
        "mt-4 overflow-hidden rounded-xl p-4 sm:p-5 " +
        (variant === "primary"
          ? "border border-brand-200 bg-gradient-to-br from-brand-50 to-white"
          : "border border-ink-200 bg-ink-50/60")
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{body}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={href}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {cta}
            <ArrowRight size={14} />
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="inline-flex items-center justify-center rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
