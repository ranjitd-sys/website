import { useEffect, useRef, useState } from "react"
import {
  CATEGORIES,
  CM_PER_LENGTH_UNIT,
  FEE_DATA_VERSION,
  KG_PER_WEIGHT_UNIT,
  OPTIONS,
  STEP_LEVELS,
  ZONES,
  chargeableSlabs,
  chargeableWeightKg,
  estimateChannel,
  pickPackFee,
  referralFor,
  sizeTier,
  volumetricWeightKg,
  type ChannelId,
  type ChannelEstimate,
  type FeeLine,
  type Provenance,
  type StepLevel,
  type Zone,
} from "@/data/amazon-fees"
import { Check, ChevronDown, Layers, Plus, Search, TrendingDown, X } from "lucide-react"

function money(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: n % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n)
}

interface Preset {
  name: string
  price: number
  categoryId: string
  weight: number
  weightUnit: "kg" | "g" | "lb"
  zone: Zone
  step: StepLevel
  cost: number
  units: number
  shipping: number
  selfShipCost: number
  otherCosts: number
  avgInventory: number
  dim: { l: number; w: number; h: number }
  dimUnit: "cm" | "in"
  includeGst: boolean
}

const PRESET_KEY = "revcal-presets-v1"

function loadPresets(): Preset[] {
  try {
    if (typeof window === "undefined") return []
    const raw = window.localStorage.getItem(PRESET_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is Preset =>
        typeof p === "object" &&
        p !== null &&
        typeof (p as Preset).name === "string" &&
        typeof (p as Preset).price === "number" &&
        typeof (p as Preset).categoryId === "string",
    )
  } catch {
    return []
  }
}

function badge(prov: Provenance) {
  switch (prov.kind) {
    case "verified":
      return { text: "Public", cls: "border-brand-200/70 bg-brand-50/60 text-brand-600" }
    case "estimate":
      return { text: "Est.", cls: "border-amber-200/70 bg-amber-50/60 text-amber-700" }
    case "sp-api":
      return { text: "SP-API", cls: "border-danger-200/70 bg-danger-50/60 text-danger-600" }
    case "input":
      return { text: "You", cls: "border-ink-200 bg-ink-50 text-ink-600" }
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
  const [step, setStep] = useState<StepLevel>("standard")
  const [otherCosts, setOtherCosts] = useState(0)
  const [avgInventory, setAvgInventory] = useState(1)
  const [catQuery, setCatQuery] = useState("")
  const [catOpen, setCatOpen] = useState(false)
  const catPopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!catOpen) return
    const onDown = (e: PointerEvent) => {
      if (catPopRef.current && !catPopRef.current.contains(e.target as Node)) setCatOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [catOpen])
  const [weightUnit, setWeightUnit] = useState<"kg" | "g" | "lb">("kg")
  const [dimUnit, setDimUnit] = useState<"cm" | "in">("cm")
  const [presetName, setPresetName] = useState("")
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets())

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]
  const refPct = referralFor(category, price).pct
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
    step,
    otherCosts,
    avgInventory,
  }
  const allEstimates = OPTIONS.map((option) => estimateChannel(baseInput, option.id))
  const estimates = selected.flatMap((id) => {
    const match = allEstimates.find((estimate) => estimate.channel === id)
    return match ? [match] : []
  })
  const rankedEstimates = [...estimates].sort((a, b) => b.netProceeds - a.netProceeds)
  const scaleMax = Math.max(...allEstimates.map((e) => e.netProceeds), 1)
  const bestPick = rankedEstimates[0]

  const catFilter = catQuery.trim().toLowerCase()
  const filteredCats = catFilter
    ? CATEGORIES.filter((c) => c.label.toLowerCase().includes(catFilter))
    : CATEGORIES
  const selectedOutsideFilter = !filteredCats.some((c) => c.id === categoryId)
  const catGroups: Array<{ name: string; items: typeof CATEGORIES }> = []
  for (const c of CATEGORIES) {
    const g = catGroups.find((x) => x.name === c.group)
    if (g) g.items.push(c)
    else catGroups.push({ name: c.group, items: [c] })
  }

  const dispWeight = weight / KG_PER_WEIGHT_UNIT[weightUnit]
  const setDispWeight = (v: number) => setWeight(Math.max(0, v * KG_PER_WEIGHT_UNIT[weightUnit]))
  const dispDim = (k: "l" | "w" | "h") => dim[k] / CM_PER_LENGTH_UNIT[dimUnit]
  const setDispDim = (k: "l" | "w" | "h", v: number) =>
    setDim((d) => ({ ...d, [k]: Math.max(0, v * CM_PER_LENGTH_UNIT[dimUnit]) }))

  const pkgVolumetric = volumetricWeightKg(dim)
  const pkgChargeable = chargeableWeightKg(weight, dim)
  const pkgSlabs = chargeableSlabs(pkgChargeable)
  const pkgTier = sizeTier(categoryId, weight, dim)
  const pkgPick = pickPackFee("fc", pkgChargeable, pkgTier.tier)

  const savePreset = () => {
    const name = presetName.trim()
    if (!name) return
    const next = [
      ...presets.filter((p) => p.name !== name),
      { name, price, categoryId, weight, weightUnit, zone, step, cost, units, shipping, selfShipCost, otherCosts, avgInventory, dim, dimUnit, includeGst },
    ]
    setPresets(next)
    setPresetName("")
    try {
      window.localStorage.setItem(PRESET_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — presets stay in memory */
    }
  }

  const loadPreset = (p: Preset) => {
    setPrice(p.price)
    if (CATEGORIES.some((c) => c.id === p.categoryId)) setCategoryId(p.categoryId)
    setWeight(p.weight)
    setWeightUnit(p.weightUnit ?? "kg")
    setZone(p.zone)
    setStep(p.step ?? "standard")
    setCost(p.cost)
    setUnits(p.units)
    setShipping(p.shipping)
    setSelfShipCost(p.selfShipCost)
    setOtherCosts(p.otherCosts ?? 0)
    setAvgInventory(p.avgInventory ?? 1)
    setDim(p.dim)
    setDimUnit(p.dimUnit ?? "cm")
    setIncludeGst(p.includeGst)
  }

  const deletePreset = (name: string) => {
    const next = presets.filter((p) => p.name !== name)
    setPresets(next)
    try {
      window.localStorage.setItem(PRESET_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — presets stay in memory */
    }
  }
  const toggle = (id: ChannelId) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const inputCls =
    "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 shadow-xs outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
  const labelCls = "mb-1 flex h-6 items-end text-xs font-semibold uppercase tracking-wide text-ink-500"

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-200 bg-ink-50/60 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
              <Plus size={15} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900">Define product</p>
              <p className="text-xs text-ink-400">Manual entry — everything updates live.</p>
            </div>
          </div>
          <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 tabular-nums">
            {FEE_DATA_VERSION}
          </span>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-400">Saved</span>
            {presets.length === 0 && (
              <span className="text-xs text-ink-400">No presets yet — name this setup below to reuse it.</span>
            )}
            {presets.map((p) => (
              <span key={p.name} className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white py-0.5 pr-1 pl-2.5 text-xs font-semibold text-ink-700">
                <button type="button" onClick={() => loadPreset(p)} className="hover:text-brand-700" title="Load preset">
                  {p.name}
                </button>
                <button
                  type="button"
                  onClick={() => deletePreset(p.name)}
                  aria-label={`Delete preset ${p.name}`}
                  className="grid size-4 place-items-center rounded-full text-ink-400 hover:bg-danger-50 hover:text-danger-600"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <span className="ml-auto flex items-center gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
                aria-label="Preset name"
                className="w-32 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-ink-900 outline-none focus:border-brand-400"
              />
              <button
                type="button"
                onClick={savePreset}
                disabled={!presetName.trim()}
                className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold !text-white transition-opacity disabled:opacity-40"
              >
                Save
              </button>
            </span>
          </div>
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Product — drives Amazon fees</legend>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="rc-price" className={labelCls}>Item price (₹)</label>
                <input id="rc-price" type="number" min={0} step={1} value={price || ""} placeholder="0" onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} className={inputCls} />
              </div>
              <div>
                <span id="rc-catlabel" className={labelCls}>
                  Category · {filteredCats.length} of {CATEGORIES.length}
                </span>
                <div className="relative" ref={catPopRef}>
                  <button
                    type="button"
                    onClick={() => setCatOpen((o) => !o)}
                    aria-expanded={catOpen}
                    aria-haspopup="listbox"
                    aria-labelledby="rc-catlabel"
                    className={inputCls + " flex w-full items-center justify-between gap-2 text-left"}
                  >
                    <span className="truncate">{category.label}</span>
                    <ChevronDown size={16} className={"shrink-0 text-ink-400 transition-transform " + (catOpen ? "rotate-180" : "")} />
                  </button>
                  {catOpen && (
                    <div className="absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-popover">
                      <div className="border-b border-ink-100 p-2">
                        <div className="relative">
                          <input
                            autoFocus
                            type="text"
                            value={catQuery}
                            onChange={(e) => setCatQuery(e.target.value)}
                            placeholder="Type to filter, e.g. shoes"
                            aria-label="Filter categories"
                            className="w-full rounded-lg border border-ink-200 bg-white py-2 pr-8 pl-3 text-sm text-ink-900 outline-none focus:border-brand-400"
                          />
                          {catQuery ? (
                            <button
                              type="button"
                              onClick={() => setCatQuery("")}
                              aria-label="Clear category filter"
                              className="absolute top-1/2 right-2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                            >
                              <X size={12} />
                            </button>
                          ) : (
                            <Search size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-ink-300" />
                          )}
                        </div>
                      </div>
                      <ul role="listbox" aria-label="Categories" className="max-h-64 overflow-y-auto p-1.5">
                        {selectedOutsideFilter && (
                          <li role="option" aria-selected="true">
                            <button
                              type="button"
                              onClick={() => setCatOpen(false)}
                              className="flex w-full items-center gap-2 rounded-lg bg-brand-50 px-2.5 py-2 text-left text-sm"
                            >
                              <span className="min-w-0 flex-1 truncate font-semibold text-brand-800">{category.label}</span>
                              <span className="shrink-0 rounded-full bg-brand-600 px-1.5 py-px text-[10px] font-bold uppercase text-white">Selected</span>
                            </button>
                          </li>
                        )}
                        {catGroups.map((g) => {
                          const items = g.items.filter((c) => filteredCats.some((v) => v.id === c.id))
                          if (items.length === 0) return null
                          return (
                            <li key={g.name} role="presentation">
                              <p aria-hidden="true" className="px-2.5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-400">{g.name}</p>
                              <ul role="group" aria-label={g.name}>
                                {items.map((c) => (
                                  <li key={c.id} role="option" aria-selected={c.id === categoryId}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCategoryId(c.id)
                                        setCatQuery("")
                                        setCatOpen(false)
                                      }}
                                      className={
                                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors " +
                                        (c.id === categoryId ? "bg-brand-50 font-semibold text-brand-800" : "text-ink-700 hover:bg-ink-50")
                                      }
                                    >
                                      <span className="min-w-0 flex-1 truncate">{c.label}</span>
                                      {c.id === categoryId && <Check size={14} className="shrink-0 text-brand-600" />}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          )
                        })}
                        {filteredCats.length === 0 && !selectedOutsideFilter && (
                          <li className="px-3 py-4 text-center text-sm text-ink-400">No categories match — clear the search.</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-ink-400">Referral fee at this price: <span className="font-bold text-brand-700 tabular-nums">{refPct}%</span></p>
              </div>
              <div>
                <div className="mb-1 flex h-6 items-end justify-between gap-2">
                  <label htmlFor="rc-weight" className="text-xs font-semibold uppercase tracking-wide text-ink-500">Unit weight</label>
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as "kg" | "g" | "lb")}
                    aria-label="Weight unit"
                    className="rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-xs font-semibold text-ink-600 outline-none focus:border-brand-400"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
                <input id="rc-weight" type="number" min={0} step={weightUnit === "g" ? 10 : 0.1} value={dispWeight || ""} placeholder="0" onChange={(e) => setDispWeight(Number(e.target.value))} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">Billed per 500 g · zone scales the rate</p>
              </div>
              <div>
                <label htmlFor="rc-zone" className={labelCls}>Shipment zone</label>
                <div className="relative">
                  <select id="rc-zone" value={zone} onChange={(e) => setZone(e.target.value as Zone)} className={inputCls + " w-full appearance-none pr-9"}>
                    {ZONES.map((z) => (
                      <option key={z.id} value={z.id}>{z.label}</option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 grid -translate-y-1/2 place-items-center text-ink-400">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Your costs — drive profit</legend>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label htmlFor="rc-cost" className={labelCls}>Product cost (₹)</label>
                <input id="rc-cost" type="number" min={0} step={1} value={cost || ""} placeholder="0" onChange={(e) => setCost(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">Taken after settlement for profit &amp; margin</p>
              </div>
              <div>
                <label htmlFor="rc-units" className={labelCls}>Units / 30 days</label>
                <input id="rc-units" type="number" min={0} step={1} value={units || ""} placeholder="0" onChange={(e) => setUnits(Math.max(0, Number(e.target.value)))} className={inputCls} />
              </div>
              <div>
                <label htmlFor="rc-ship" className={labelCls}>Buyer shipping charge (₹)</label>
                <input id="rc-ship" type="number" min={0} step={1} value={shipping || ""} placeholder="0" onChange={(e) => setShipping(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">Self-ship only · adds to sales price</p>
              </div>
              <div>
                <label htmlFor="rc-selfcost" className={labelCls}>Your courier cost (₹)</label>
                <input id="rc-selfcost" type="number" min={0} step={1} value={selfShipCost || ""} placeholder="0" onChange={(e) => setSelfShipCost(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">Self-ship only · your delivery cost</p>
              </div>
              <div>
                <label htmlFor="rc-other" className={labelCls}>Other fees &amp; promos (₹)</label>
                <input id="rc-other" type="number" min={0} step={1} value={otherCosts || ""} placeholder="0" onChange={(e) => setOtherCosts(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">Deals, promos, extras you pay</p>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Package &amp; seller · optional</legend>
            <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <div className="mb-1 flex h-6 items-end justify-between gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Dimensions — L × W × H</label>
                  <select
                    value={dimUnit}
                    onChange={(e) => setDimUnit(e.target.value as "cm" | "in")}
                    aria-label="Dimension unit"
                    className="rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-xs font-semibold text-ink-600 outline-none focus:border-brand-400"
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  {(["l", "w", "h"] as const).map((k) => (
                    <input
                      key={k}
                      type="number"
                      min={0}
                      step={dimUnit === "in" ? 0.1 : 1}
                      value={dispDim(k) || ""}
                      placeholder={k.toUpperCase()}
                      onChange={(e) => setDispDim(k, Number(e.target.value))}
                      className={inputCls}
                      aria-label={`Package ${k} in ${dimUnit}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink-400">Drives volumetric weight, size tier, pick &amp; pack and storage</p>
              </div>
              <div>
                <label htmlFor="rc-step" className={labelCls}>STEP level</label>
                <select id="rc-step" value={step} onChange={(e) => setStep(e.target.value as StepLevel)} className={inputCls}>
                  {STEP_LEVELS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-ink-400">Sets weight-handling rates</p>
              </div>
              <div>
                <label htmlFor="rc-inventory" className={labelCls}>Avg inventory units</label>
                <input id="rc-inventory" type="number" min={0} step={1} value={avgInventory || ""} placeholder="1" onChange={(e) => setAvgInventory(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">For storage per unit sold</p>
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm font-medium text-ink-600">
              <input type="checkbox" checked={includeGst} onChange={(e) => setIncludeGst(e.target.checked)} className="size-4 accent-brand-600" />
              Apply 18% GST on fees
            </label>
            <div className="mt-3 rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">How Amazon reads this package</p>
              <dl className="mt-2 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-ink-500">Volumetric</dt>
                  <dd className="font-semibold text-ink-900 tabular-nums">{pkgVolumetric > 0 ? `${pkgVolumetric.toFixed(2)} kg` : "—"}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-ink-500">Chargeable</dt>
                  <dd className="font-semibold text-ink-900 tabular-nums">{pkgChargeable.toFixed(2)} kg · {pkgSlabs} slabs</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-ink-500">Size tier</dt>
                  <dd className="font-semibold text-ink-900" title={pkgTier.reasons.join("; ") || "Standard size"}>
                    {pkgTier.tier === "heavy-bulky" ? "Heavy & bulky" : "Standard"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-ink-500">FC pick &amp; pack</dt>
                  <dd className="font-semibold text-ink-900 tabular-nums">₹{pkgPick.fee}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-ink-400">Chargeable = higher of actual and volumetric (L×W×H/5000), minimum 500 g, billed per 500 g.</p>
            </div>
          </fieldset>
        </div>
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
          <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-1.5 py-[2px] text-[10px] font-semibold whitespace-nowrap text-ink-600">You</span>
          Numbers you entered yourself
        </span>
        <span className="inline-flex items-center gap-1.5">
          <TrendingDown size={12} />
          Profit = sales price − fees − product cost
        </span>
      </div>
    </div>
  )
}