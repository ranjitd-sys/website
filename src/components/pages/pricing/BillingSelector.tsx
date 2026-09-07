import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"
import { BILLING_CYCLES } from "@/data/pricing"
import type { BillingCycleId } from "@/data/pricing"

export default function BillingSelector() {
  const [active, setActive] = useState<BillingCycleId>("quarterly")
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const root = document.getElementById("pricing-period-root")
    if (root) root.setAttribute("data-active", active)
  }, [active])

  useEffect(() => {
    refs.current[active]?.focus()
  }, [active])

  const onKeyDown = (e: React.KeyboardEvent, id: BillingCycleId) => {
    const idx = BILLING_CYCLES.findIndex((c) => c.id === id)
    let next: BillingCycleId | undefined
    if (e.key === "ArrowRight") next = BILLING_CYCLES[(idx + 1) % BILLING_CYCLES.length].id
    if (e.key === "ArrowLeft") next = BILLING_CYCLES[(idx - 1 + BILLING_CYCLES.length) % BILLING_CYCLES.length].id
    if (next) {
      e.preventDefault()
      setActive(next)
    }
  }

  return (
    <div
      role="group"
      aria-label="Billing period"
      className="billing-selector"
    >
      {BILLING_CYCLES.map((cycle) => {
        const selected = cycle.id === active
        return (
          <button
            key={cycle.id}
            ref={(el) => {
              refs.current[cycle.id] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={clsx("billing-option", selected && "is-active")}
            onKeyDown={(e) => onKeyDown(e, cycle.id)}
            onClick={() => setActive(cycle.id)}
          >
            {cycle.label}
          </button>
        )
      })}
    </div>
  )
}