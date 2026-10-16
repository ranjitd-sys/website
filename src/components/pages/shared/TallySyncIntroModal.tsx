import { useEffect, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowRight, CheckCheck, Database, ListChecks, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import TallyWorkflowGraphic from "@/components/pages/shared/TallyWorkflowGraphic"

interface Props {
  /** Opens the modal when it flips to true (e.g. tool completion). */
  trigger: boolean
  /** Free tool that opened the popup, for attribution. */
  source?: string
  placement?: string
  /** Destination for the primary CTA. */
  href?: string
  /** Session key used to show the intro at most once per browser session. */
  storageKey?: string
  /** When false, the popup opens every time the trigger flips to true. */
  oncePerSession?: boolean
  /** Notified when the popup closes (X, Escape, or CTA), so the parent can reset its trigger. */
  onDismiss?: () => void
}

const STEPS = [
  {
    icon: Database,
    title: "Fetch marketplace data",
    body: "Orders, settlements and your Tally masters, pulled into one flow.",
  },
  {
    icon: ListChecks,
    title: "Map to Tally",
    body: "Fees, GST, TCS and TDS matched to the right ledgers.",
  },
  {
    icon: CheckCheck,
    title: "Sync and reconcile",
    body: "Vouchers posted to Tally, reconciled against payouts.",
  },
]

export default function TallySyncIntroModal({
  trigger,
  source = "free-tool",
  placement = "post-result",
  href = "/integrations/tally",
  storageKey = "ts-intro-dismissed",
  oncePerSession = true,
  onDismiss,
}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!trigger) return
    if (oncePerSession) {
      try {
        if (window.sessionStorage.getItem(storageKey)) return
      } catch {}
    }
    setOpen(true)
    trackEvent("tally_sync_intro_viewed", { source_tool: source, placement })
  }, [trigger, oncePerSession, storageKey, source, placement])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) return
    if (oncePerSession) {
      try { window.sessionStorage.setItem(storageKey, "1") } catch {}
    }
    trackEvent("tally_sync_intro_dismissed", { source_tool: source, placement })
    onDismiss?.()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange} disablePointerDismissal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink-950/45 motion-safe:transition-opacity motion-safe:duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl outline-none motion-safe:transition-all motion-safe:duration-200 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0">
          <div className="flex justify-end p-2 pb-0">
            <Dialog.Close
              aria-label="Close"
              className="inline-flex items-center justify-center rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <X size={17} />
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto overscroll-contain px-5 pb-6 pt-2 sm:px-7 sm:pb-7">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8">
              <div className="order-2 lg:order-1">
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  Introducing Tally Sync
                </span>
                <Dialog.Title className="mt-2.5 text-2xl font-extrabold leading-[1.12] tracking-[-0.02em] text-ink-950 sm:text-[1.75rem]">
                  Get your <span className="text-brand-600">Amazon, Flipkart and Meesho</span> Tally entries for free
                </Dialog.Title>
                <p className="mt-2 text-base font-bold tracking-[-0.01em] text-brand-600 sm:text-lg">
                  Ecommerce accounting for free
                </p>
                <Dialog.Description className="mt-3 text-sm leading-relaxed text-ink-500">
                  Stop re-entering transactions by hand. DeepEcom maps your marketplace data to Tally,
                  posts the vouchers and reconciles payouts.
                </Dialog.Description>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-gradient-to-br from-brand-50/70 via-white to-ink-50 p-3 sm:p-4">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-100/60 blur-2xl" />
                  <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
                    <TallyWorkflowGraphic />
                  </div>
                </div>
              </div>
            </div>

            <ul className="mt-6 grid gap-5 border-t border-ink-100 pt-5 sm:grid-cols-3 sm:gap-6">
              {STEPS.map((s) => (
                <li key={s.title} className="flex flex-col gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-brand-100 bg-brand-50 text-brand-600">
                    <s.icon size={15} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">{s.title}</span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-500">{s.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-ink-100 pt-5">
              <a
                href={`${href}?src=${encodeURIComponent(source)}&placement=${encodeURIComponent(placement)}`}
                onClick={() => trackEvent("tally_sync_intro_cta_clicked", { source_tool: source, placement })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Explore Tally Sync
                <ArrowRight size={15} />
              </a>
              <Dialog.Close className="inline-flex items-center justify-center rounded-lg border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                Maybe later
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
