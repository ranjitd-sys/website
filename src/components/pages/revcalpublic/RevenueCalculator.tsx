import { useState } from "react"
import {
  CATEGORIES,
  OPTIONS,
  SAMPLE_CATALOGUE,
  ZONES,
  estimateChannel,
  type ChannelId,
  type ChannelEstimate,
  type FeeLine,
  type Provenance,
  type Zone,
} from "@/data/amazon-fees"
import { ArrowRight, Check, Layers, Link2, Plus, Search, TrendingDown, X } from "lucide-react"

function money(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: n % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n)
}

function badge(prov: Provenance) {
  switch (prov.kind) {
    case "verified":
      return { text: "Public", cls: "border-brand-200/70 bg-brand-50/60 text-brand-600" }
    case "estimate":
      return { text: "Est.", cls: "border-amber-200/70 bg-amber-50/60 text-amber-700" }
    case "sp-api":
      return { text: "SP-API", cls: "border-danger-200/70 bg-danger-50/60 text-danger-600" }
  }
}

function FeeRow({ line }: { line: FeeLine }) {
  const b = badge(line.prov)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-1">
      <span className="min-w-0 text-sm leading-snug break-words text-ink-600">{line.label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span tabIndex={0} aria-label={line.prov.note} className="group relative inline-flex cursor-help outline-none">
          <span className={"inline-flex items-center rounded-full border px-1.5 py-[2px] text-[10px] font-semibold whitespace-nowrap " + b.cls}>{b.text}</span>
          <span className="pointer-events-none absolute right-0 bottom-full z-30 mb-1.5 w-56 max-w-[calc(100vw-2rem)] rounded-lg border border-ink-200 bg-white p-2 text-xs leading-relaxed font-normal text-ink-600 opacity-0 shadow-popover transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {line.prov.note}
          </span>
        </span>
        <span className="min-w-[5.5rem] text-right text-sm font-semibold text-ink-900 tabular-nums">
          {line.amount === null ? "—" : money(line.amount)}
        </span>
      </span>
    </div>
  )
}

function OptionCard({
  est,
  active,
  onToggle,
}: {
  est: ChannelEstimate
  active: boolean
  onToggle: (id: ChannelId) => void
}) {
  const rows: FeeLine[] = [est.referral, est.closing, est.variableClosing]
  return (
    <div className="flex h-full min-w-0 w-full flex-col rounded-xl border border-ink-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 rounded-t-xl border-b border-ink-100 bg-ink-50/70 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            {est.meta.short.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{est.meta.name}</p>
            <p className="truncate text-xs text-ink-400">{est.meta.blurb}</p>
          </div>
        </div>
        {active && (
          <button
            type="button"
            onClick={() => onToggle(est.channel)}
            className="grid size-5 shrink-0 place-items-center rounded text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            aria-label={`Remove ${est.meta.name}`}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-3">
        <div className="flex items-center justify-between py-1 text-sm leading-6">
          <span className="text-ink-500">Item price</span>
          <span className="font-semibold text-ink-900 tabular-nums">{money(est.itemPrice)}</span>
        </div>
        {est.shippingCharge > 0 && (
          <>
            <div className="flex items-center justify-between py-1 text-sm leading-6">
              <span className="text-ink-500">Shipping charge</span>
              <span className="font-semibold text-ink-900 tabular-nums">{money(est.shippingCharge)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-ink-200 py-1 text-sm leading-6">
              <span className="font-medium text-ink-700">Sales price</span>
              <span className="font-semibold text-ink-900 tabular-nums">{money(est.salesPrice)}</span>
            </div>
          </>
        )}

        <div className="mt-2 border-t border-ink-100 pt-2">
          <div className="flex items-center justify-between text-xs font-bold tracking-wide text-ink-400 uppercase">
            <span>Amazon fees</span>
            <span className="tabular-nums text-ink-700">{money(est.amazonFees)}</span>
          </div>
          <div className="divide-y divide-ink-100">
            {rows.map((l) => (
              <FeeRow key={l.id} line={l} />
            ))}
          </div>
        </div>

        <div className="mt-2 border-t border-ink-100 pt-2">
          <div className="divide-y divide-ink-100">
            <FeeRow line={est.fulfilment} />
            <FeeRow line={est.storage} />
            <FeeRow line={est.otherFees} />
            {est.gstOnFees && <FeeRow line={est.gstOnFees} />}
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-b-xl border-t border-ink-100 bg-ink-50/50 px-4 py-3">
        <div className="min-w-0">
          <p className="mb-0.5 text-xs font-bold tracking-wide text-ink-400 uppercase">Cost / unit</p>
          <p className="truncate text-sm leading-6 font-bold text-ink-900 tabular-nums">{money(est.costPerUnit)}</p>
        </div>
        <div className="min-w-0">
          <p className="mb-0.5 text-xs font-bold tracking-wide text-ink-400 uppercase">Est. sales · 30d</p>
          <p className="truncate text-sm leading-6 font-bold text-ink-900 tabular-nums">{est.estimatedSales30.toLocaleString("en-IN")}</p>
        </div>
        <div className="min-w-0">
          <p className="mb-0.5 text-xs font-bold tracking-wide text-ink-400 uppercase">Net proceeds</p>
          <p className="truncate text-sm leading-6 font-bold text-ink-900 tabular-nums">{money(est.netProceeds)}</p>
        </div>
        <div className="min-w-0">
          <p className="mb-0.5 text-xs font-bold tracking-wide text-ink-400 uppercase">Profit</p>
          <p className={"truncate text-sm leading-6 font-bold tabular-nums " + (est.profit >= 0 ? "text-success-700" : "text-danger-600")}>
            {money(est.profit)}
          </p>
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-lg bg-white px-3 py-1.5 ring-1 ring-ink-100">
          <span className="text-xs font-semibold text-ink-500">Margin</span>
          <span className={"text-sm font-bold tabular-nums " + (est.marginPct >= 0 ? "text-brand-700" : "text-danger-600")}>
            {est.marginPct.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default function RevenueCalculator() {
  const [price, setPrice] = useState(799)
  const [categoryId, setCategoryId] = useState("mobile-phones")
  const [weight, setWeight] = useState(0.5)
  const [zone, setZone] = useState<Zone>("regional")
  const [cost, setCost] = useState(350)
  const [units, setUnits] = useState(100)
  const [shipping, setShipping] = useState(0)
  const [selfShipCost, setSelfShipCost] = useState(0)
  const [dim, setDim] = useState({ l: 0, w: 0, h: 0 })
  const [includeGst, setIncludeGst] = useState(false)
  const [selected, setSelected] = useState<ChannelId[]>(["fc", "self-ship"])
  const [tab, setTab] = useState<"define" | "catalogue" | "bulk">("define")
  const [query, setQuery] = useState("")
  const [usedAsin, setUsedAsin] = useState<string | null>(null)
  const [bulkRows, setBulkRows] = useState([
    { id: 1, name: "Aurora X5 Smartphone", categoryId: "mobile-phones", price: 12999, channel: "fc" as ChannelId },
    { id: 2, name: "Trailblazer Running Shoes", categoryId: "shoes", price: 1899, channel: "self-ship" as ChannelId },
  ])

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]
  const baseInput = {
    sellingPrice: price,
    category,
    weightKg: weight,
    zone,
    productCost: cost,
    unitsPerMonth: units,
    shippingCharge: shipping,
    selfShipCost,
    dimensions: dim,
    includeGst,
  }
  const allEstimates = OPTIONS.map((option) => estimateChannel(baseInput, option.id))
  const estimates = selected.flatMap((id) => {
    const match = allEstimates.find((estimate) => estimate.channel === id)
    return match ? [match] : []
  })
  const rankedEstimates = [...estimates].sort((a, b) => b.netProceeds - a.netProceeds)
  const scaleMax = Math.max(...allEstimates.map((e) => e.netProceeds), 1)
  const bestPick = rankedEstimates[0]

  const toggle = (id: ChannelId) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const inputCls =
    "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 shadow-xs outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500"

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-white">
            <Link2 size={16} />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-900">Connect your Seller Central account</p>
            <p className="text-[13px] text-brand-700">
              Exact per-order fees need your account — Seller ID / merchant token via SP-API.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Seller ID (e.g. A21TJRUUN4KGV)"
            aria-label="Seller ID"
            className="w-56 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm text-ink-700 outline-none focus:border-brand-400"
          />
          <span className="inline-flex items-center rounded-full border border-danger-200/70 bg-danger-50/60 px-2 py-[3px] text-[10px] font-semibold whitespace-nowrap text-danger-600">
            SP-API
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-1 border-b border-ink-200 bg-ink-50/60 px-3 pt-2" role="tablist" aria-label="Product input mode">
          {(
            [
              { id: "define", label: "Define product", icon: <Plus size={13} />, badge: null },
              { id: "catalogue", label: "Search Amazon catalogue", icon: <Search size={13} />, badge: "preview" },
              { id: "bulk", label: "Estimate in bulk", icon: <Layers size={13} />, badge: "preview" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={
                "inline-flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 text-sm transition-colors " +
                (tab === t.id
                  ? "border border-b-0 border-ink-200 bg-white font-semibold text-brand-700"
                  : "font-medium text-ink-400 hover:bg-white/60 hover:text-ink-600")
              }
            >
              {t.icon} {t.label}
              {t.badge && (
                <span className="ml-1 inline-flex items-center rounded-full border border-amber-200/70 bg-amber-50/60 px-1.5 py-[2px] text-[10px] font-semibold whitespace-nowrap text-amber-700">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "define" && (
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="rc-price" className={labelCls}>Item price (₹)</label>
            <input id="rc-price" type="number" min={0} step={1} value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="rc-category" className={labelCls}>Category</label>
            <select id="rc-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rc-weight" className={labelCls}>Unit weight (kg)</label>
            <input id="rc-weight" type="number" min={0} step={0.1} value={weight} onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="rc-zone" className={labelCls}>Shipment zone</label>
            <select id="rc-zone" value={zone} onChange={(e) => setZone(e.target.value as Zone)} className={inputCls}>
              {ZONES.map((z) => (
                <option key={z.id} value={z.id}>{z.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rc-cost" className={labelCls}>Product cost (₹)</label>
            <input id="rc-cost" type="number" min={0} step={1} value={cost} onChange={(e) => setCost(Math.max(0, Number(e.target.value)))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="rc-units" className={labelCls}>Units / 30 days</label>
            <input id="rc-units" type="number" min={0} step={1} value={units} onChange={(e) => setUnits(Math.max(0, Number(e.target.value)))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="rc-ship" className={labelCls}>Buyer shipping charge (₹)</label>
            <input id="rc-ship" type="number" min={0} step={1} value={shipping} onChange={(e) => setShipping(Math.max(0, Number(e.target.value)))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="rc-selfcost" className={labelCls}>Your courier cost (₹)</label>
            <input id="rc-selfcost" type="number" min={0} step={1} value={selfShipCost} onChange={(e) => setSelfShipCost(Math.max(0, Number(e.target.value)))} className={inputCls} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelCls}>Package dimensions — L × W × H (cm) <span className="font-normal normal-case text-ink-400">for FC storage</span></label>
            <div className="flex gap-2">
              {(["l", "w", "h"] as const).map((k) => (
                <input
                  key={k}
                  type="number"
                  min={0}
                  step={1}
                  value={dim[k] || ""}
                  placeholder={k.toUpperCase()}
                  onChange={(e) => setDim((d) => ({ ...d, [k]: Math.max(0, Number(e.target.value)) }))}
                  className={inputCls}
                  aria-label={`Package ${k}`}
                />
              ))}
            </div>
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm font-medium text-ink-600">
            <input type="checkbox" checked={includeGst} onChange={(e) => setIncludeGst(e.target.checked)} className="size-4 accent-brand-600" />
            Apply 18% GST on fees
          </label>
        </div>
        )}

        {tab === "catalogue" && (
        <div className="p-5">
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-800">
            <Search size={14} className="mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Sample catalogue for preview.</strong> Live Amazon catalogue search with your real ASINs, weights and dimensions needs your SP-API connection.</span>
          </div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name or ASIN — try “shoes” or “B0D3”"
              aria-label="Search sample catalogue"
              className={inputCls}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {SAMPLE_CATALOGUE.filter((p) => {
              const q = query.trim().toLowerCase()
              if (!q) return true
              const cat = CATEGORIES.find((c) => c.id === p.categoryId)?.label ?? ""
              return p.name.toLowerCase().includes(q) || p.asin.toLowerCase().includes(q) || cat.toLowerCase().includes(q)
            }).map((p) => {
              const cat = CATEGORIES.find((c) => c.id === p.categoryId)
              const used = usedAsin === p.asin
              return (
                <div key={p.asin} className={"flex flex-col gap-2 rounded-xl border p-4 transition-colors " + (used ? "border-brand-300 bg-brand-50/60" : "border-ink-200 bg-white hover:border-ink-300")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink-900">{p.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-ink-400">ASIN · {p.asin}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-ink-900 tabular-nums">{money(p.price)}</span>
                  </div>
                  <p className="text-xs text-ink-500">
                    {cat?.label} · {p.weightKg} kg · {p.dims.l}×{p.dims.w}×{p.dims.h} cm
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setPrice(p.price)
                        setCategoryId(p.categoryId)
                        setWeight(p.weightKg)
                        setDim({ ...p.dims })
                        setUsedAsin(p.asin)
                      }}
                      className={
                        "inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all " +
                        (used
                          ? "bg-success-50 text-success-700 ring-1 ring-success-200"
                          : "bg-brand-600 !text-white shadow-sm hover:bg-brand-700 hover:shadow")
                      }
                    >
                      {used ? (
                        <><Check size={14} strokeWidth={3} /> In calculator</>
                      ) : (
                        <>Use in calculator <ArrowRight size={14} /></>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        )}

        {tab === "bulk" && (
        <div className="p-5">
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-800">
            <Layers size={14} className="mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Bulk preview.</strong> Edit rows inline to compare several products at once — file upload and full bulk reports need SP-API.</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-ink-200">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50/70 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                  <th scope="col" className="px-3 py-2.5">Product</th>
                  <th scope="col" className="px-3 py-2.5">Category</th>
                  <th scope="col" className="px-3 py-2.5">Price (₹)</th>
                  <th scope="col" className="px-3 py-2.5">Channel</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Net proceeds</th>
                  <th scope="col" className="px-3 py-2.5"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {bulkRows.map((row) => {
                  const cat = CATEGORIES.find((c) => c.id === row.categoryId) ?? CATEGORIES[0]
                  const est = estimateChannel(
                    { sellingPrice: row.price, category: cat, weightKg: weight, zone, productCost: 0, unitsPerMonth: 1, shippingCharge: 0, selfShipCost, dimensions: dim, includeGst },
                    row.channel,
                  )
                  const setRow = (patch: Partial<typeof row>) =>
                    setBulkRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...patch } : r)))
                  return (
                    <tr key={row.id}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => setRow({ name: e.target.value })}
                          aria-label="Bulk product name"
                          className="w-full min-w-[10rem] rounded-lg border border-transparent px-2 py-1.5 font-medium text-ink-700 outline-none transition-colors hover:border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={row.categoryId}
                          onChange={(e) => setRow({ categoryId: e.target.value })}
                          aria-label="Bulk product category"
                          className="rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-ink-600 outline-none transition-colors hover:border-ink-200 focus:border-brand-400"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          value={row.price}
                          onChange={(e) => setRow({ price: Math.max(0, Number(e.target.value)) })}
                          aria-label="Bulk product price"
                          className="w-24 rounded-lg border border-transparent px-2 py-1.5 text-right font-semibold text-ink-700 tabular-nums outline-none transition-colors hover:border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={row.channel}
                          onChange={(e) => setRow({ channel: e.target.value as ChannelId })}
                          aria-label="Bulk fulfilment channel"
                          className="rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-ink-600 outline-none transition-colors hover:border-ink-200 focus:border-brand-400"
                        >
                          {OPTIONS.map((o) => (
                            <option key={o.id} value={o.id}>{o.short}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-brand-700 tabular-nums">{money(est.netProceeds)}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setBulkRows((prev) => prev.filter((r) => r.id !== row.id))}
                          aria-label={`Remove ${row.name}`}
                          className="grid size-6 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-ink-200 bg-brand-50/60 text-sm font-bold">
                  <td colSpan={4} className="px-3 py-2.5 text-ink-700">Total net proceeds</td>
                  <td className="px-3 py-2.5 text-right text-brand-800 tabular-nums">
                    {money(bulkRows.reduce((sum, row) => {
                      const cat = CATEGORIES.find((c) => c.id === row.categoryId) ?? CATEGORIES[0]
                      return sum + estimateChannel(
                        { sellingPrice: row.price, category: cat, weightKg: weight, zone, productCost: 0, unitsPerMonth: 1, shippingCharge: 0, selfShipCost, dimensions: dim, includeGst },
                        row.channel,
                      ).netProceeds
                    }, 0))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          {bulkRows.length < 5 && (
            <button
              type="button"
              onClick={() => setBulkRows((prev) => [...prev, { id: Math.max(0, ...prev.map((r) => r.id)) + 1, name: "New product", categoryId: "mobile-phones", price: 999, channel: "fc" as ChannelId }])}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <Plus size={14} /> Add product
            </button>
          )}
        </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="flex items-center gap-2.5 border-b border-ink-100 bg-gradient-to-r from-brand-50 to-white px-4 py-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
            <Layers size={15} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">Compare options</p>
            <p className="truncate text-xs text-ink-400 tabular-nums">
              {selected.length} of {OPTIONS.length} selected · tap a row to add or remove
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700 ring-1 ring-brand-100">
            {bestPick ? `Best · ${bestPick.meta.short}` : "net"}
          </span>
        </div>
        <div role="group" aria-label="Fulfilment options to compare" className="grid gap-2 p-3.5 sm:grid-cols-2">
          {OPTIONS.map((opt) => {
            const active = selected.includes(opt.id)
            const preview = allEstimates.find((estimate) => estimate.channel === opt.id)
            const rank = rankedEstimates.findIndex((estimate) => estimate.channel === opt.id)
            const best = active && rank === 0
            const width = preview ? Math.max(4, (Math.max(0, preview.netProceeds) / scaleMax) * 100) : 4
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                aria-pressed={active}
                title={opt.blurb}
                className={
                  "rounded-xl border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none " +
                  (active
                    ? "border-brand-300 bg-brand-50/50 shadow-sm"
                    : "border-ink-200 bg-white opacity-70 hover:border-ink-300 hover:opacity-100 hover:shadow-sm")
                }
              >
                <div className="flex items-center gap-2">
                  <span className={"grid size-6 shrink-0 place-items-center rounded-lg text-[11px] font-bold " + (active ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400")}>
                    {active ? rank + 1 : <Plus size={11} strokeWidth={2.5} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink-900">{opt.short}</span>
                  {best && (
                    <span className="shrink-0 rounded-full bg-brand-600 px-1.5 py-px text-[9px] font-bold uppercase text-white">
                      Best
                    </span>
                  )}
                  <span className="shrink-0 text-sm font-bold text-ink-900 tabular-nums">
                    {preview ? money(preview.netProceeds) : "—"}{" "}
                    <span className="text-xs font-semibold text-ink-400">
                      · {preview ? `${preview.marginPct.toFixed(1)}%` : ""}
                    </span>
                  </span>
                  <span className={"grid size-4 shrink-0 place-items-center rounded-full border " + (active ? "border-brand-600 bg-brand-600 text-white" : "border-ink-300 text-ink-400")}>
                    {active ? <Check size={10} strokeWidth={3} /> : <Plus size={10} strokeWidth={2.5} />}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={"h-full rounded-full transition-all duration-500 " + (best ? "bg-gradient-to-r from-brand-400 to-brand-600" : active ? "bg-brand-300" : "bg-ink-200")}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
          {estimates.map((est) => (
            <OptionCard key={est.channel} est={est} active={selected.length > 1} onToggle={toggle} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full border border-brand-200/70 bg-brand-50/60 px-1.5 py-[2px] text-[10px] font-semibold whitespace-nowrap text-brand-600">Public</span>
          From Amazon's published rate card
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full border border-amber-200/70 bg-amber-50/60 px-1.5 py-[2px] text-[10px] font-semibold whitespace-nowrap text-amber-700">Est.</span>
          Modelled from published examples
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full border border-danger-200/70 bg-danger-50/60 px-1.5 py-[2px] text-[10px] font-semibold whitespace-nowrap text-danger-600">SP-API</span>
          Needs your Seller Central account
        </span>
        <span className="inline-flex items-center gap-1.5">
          <TrendingDown size={12} />
          Profit = sales price − fees − product cost
        </span>
      </div>
    </div>
  )
}