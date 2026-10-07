import { useState } from "react"
import { AlertTriangle, Info, Sheet, ChevronDown } from "lucide-react"
import type { LabelMeta } from "./types"
import { summarize, validate, formatINR } from "./lib/insights"

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-ink-100 bg-white px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 truncate text-lg font-bold tabular-nums text-ink-950">{value}</p>
      {sub && <p className="truncate text-[11px] text-ink-500">{sub}</p>}
    </div>
  )
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`

export default function BatchPanel({ metas, onCsv }: { metas: LabelMeta[]; onCsv: () => void }) {
  const [showFlags, setShowFlags] = useState(false)
  if (metas.length === 0) return null
  const s = summarize(metas)
  const flags = validate(metas)
  const warns = flags.filter((f) => f.level === "warn")
  const knownPayment = s.cod + s.prepaid > 0

  return (
    <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-ink-900">Batch summary</p>
          <p className="text-xs text-ink-500">Read from your labels and invoices — nothing leaves your browser.</p>
        </div>
        <button
          type="button"
          onClick={onCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
        >
          <Sheet size={14} /> Export orders (CSV)
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Orders" value={String(s.orders)} sub={s.orders !== s.labels ? plural(s.labels, "package") : undefined} />
        <Stat label="Units" value={String(s.units)} />
        <Stat
          label="COD / Prepaid"
          value={knownPayment ? `${s.cod} / ${s.prepaid}` : "—"}
          sub={s.codValue != null ? `${formatINR(s.codValue)} to collect` : undefined}
        />
        <Stat label="Couriers" value={String(s.couriers.length)} sub={s.couriers.join(", ") || undefined} />
        <Stat label="Order value" value={formatINR(s.value)} sub={s.destinations ? plural(s.destinations, "pincode") : undefined} />
        <Stat label="GST" value={formatINR(s.tax)} />
      </div>

      {flags.length > 0 && (
        <div className="mt-3 rounded-lg border border-ink-200 bg-white">
          <button
            type="button"
            onClick={() => setShowFlags((v) => !v)}
            aria-expanded={showFlags}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
          >
            {warns.length > 0 ? (
              <AlertTriangle size={15} className="text-amber-600" />
            ) : (
              <Info size={15} className="text-brand-600" />
            )}
            <span className="font-semibold text-ink-900">
              {warns.length > 0 ? `${plural(warns.length, "check")} need a look` : "Notes on this batch"}
            </span>
            <ChevronDown size={15} className={`ml-auto text-ink-400 transition-transform ${showFlags ? "rotate-180" : ""}`} />
          </button>
          {showFlags && (
            <ul className="border-t border-ink-100 px-3 py-2 text-[13px]">
              {flags.map((f) => (
                <li key={f.title} className="flex items-start gap-2 py-1">
                  {f.level === "warn" ? (
                    <AlertTriangle size={13} className="mt-0.5 flex-none text-amber-600" />
                  ) : (
                    <Info size={13} className="mt-0.5 flex-none text-brand-600" />
                  )}
                  <span className="text-ink-700">
                    {f.title}
                    <span className="text-ink-400"> — label{f.labels.length === 1 ? "" : "s"} {f.labels.join(", ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
