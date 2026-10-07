import type { LabelMeta } from "../types"

export interface BatchSummary {
  labels: number
  orders: number
  units: number
  cod: number
  prepaid: number
  unknownPayment: number
  couriers: string[]
  /** order value summed once per order id; null when no label had an amount */
  value: number | null
  tax: number | null
  codValue: number | null
  destinations: number
}

const num = (s: string): number | null => {
  if (!s) return null
  const n = Number(s.replace(/,/g, ""))
  return Number.isFinite(n) ? n : null
}

/** The invoice repeats on every package of a split order, so money is counted once per order. */
export function summarize(metas: LabelMeta[]): BatchSummary {
  const orderKey = (m: LabelMeta, i: number) => m.orderNo || `#${i}`
  const seen = new Set<string>()
  let units = 0
  let value: number | null = null
  let tax: number | null = null
  let codValue: number | null = null
  let cod = 0
  let prepaid = 0
  let unknownPayment = 0
  const couriers = new Set<string>()
  const dest = new Set<string>()
  metas.forEach((m, i) => {
    if (m.courier) couriers.add(m.courier)
    if (m.pincode) dest.add(m.pincode)
    if (m.payment === "COD") cod++
    else if (m.payment === "Prepaid") prepaid++
    else unknownPayment++
    const key = orderKey(m, i)
    if (seen.has(key)) return
    seen.add(key)
    units += num(m.qty) ?? 0
    const a = num(m.amount)
    if (a != null) {
      value = (value ?? 0) + a
      if (m.payment === "COD") codValue = (codValue ?? 0) + a
    }
    const t = num(m.tax)
    if (t != null) tax = (tax ?? 0) + t
  })
  return {
    labels: metas.length,
    orders: seen.size,
    units,
    cod,
    prepaid,
    unknownPayment,
    couriers: [...couriers].sort(),
    value,
    tax,
    codValue,
    destinations: dest.size,
  }
}

export type FlagLevel = "warn" | "info"

export interface BatchFlag {
  level: FlagLevel
  title: string
  /** 1-based label numbers (upload order) */
  labels: number[]
}

export function validate(metas: LabelMeta[]): BatchFlag[] {
  const flags: BatchFlag[] = []
  const byAwb = new Map<string, number[]>()
  const byOrder = new Map<string, number[]>()
  const missingAwb: number[] = []
  const badQty: number[] = []
  const missingPin: number[] = []
  metas.forEach((m, i) => {
    const n = i + 1
    if (m.awb) byAwb.set(m.awb, [...(byAwb.get(m.awb) ?? []), n])
    else missingAwb.push(n)
    if (m.orderNo) byOrder.set(m.orderNo, [...(byOrder.get(m.orderNo) ?? []), n])
    const q = num(m.qty)
    if (q == null || q <= 0) badQty.push(n)
    if (!m.pincode) missingPin.push(n)
  })
  const dupAwb = [...byAwb.values()].filter((v) => v.length > 1).flat()
  if (dupAwb.length) flags.push({ level: "warn", title: "Duplicate AWB — the same package appears more than once", labels: dupAwb })
  if (missingAwb.length) flags.push({ level: "warn", title: "No AWB / tracking number found", labels: missingAwb })
  if (badQty.length) flags.push({ level: "warn", title: "Quantity missing or zero", labels: badQty })
  if (missingPin.length) flags.push({ level: "warn", title: "Destination pincode not found", labels: missingPin })
  const split = [...byOrder.values()].filter((v) => v.length > 1)
  if (split.length)
    flags.push({
      level: "info",
      title: `${split.length} order${split.length === 1 ? " is" : "s are"} split across multiple packages — counted once in totals`,
      labels: split.flat(),
    })
  return flags
}

const CSV_COLS: { head: string; get: (m: LabelMeta, i: number) => string }[] = [
  { head: "Label #", get: (_m, i) => String(i + 1) },
  { head: "Order ID", get: (m) => m.orderNo },
  { head: "AWB", get: (m) => m.awb },
  { head: "SKU", get: (m) => m.sku },
  { head: "Qty", get: (m) => m.qty },
  { head: "Customer", get: (m) => m.name },
  { head: "City", get: (m) => m.city },
  { head: "State", get: (m) => m.state },
  { head: "Pincode", get: (m) => m.pincode },
  { head: "Courier", get: (m) => m.courier },
  { head: "Payment", get: (m) => m.payment },
  { head: "Order value (INR)", get: (m) => m.amount },
  { head: "GST (INR)", get: (m) => m.tax },
  { head: "Seller", get: (m) => m.seller },
]

function csvCell(v: string): string {
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(v) && !/^-?\d+(\.\d+)?$/.test(v) ? `'${v}` : v
  return `"${safe.replace(/"/g, '""')}"`
}

export function toCsv(metas: LabelMeta[]): string {
  const lines = [CSV_COLS.map((c) => csvCell(c.head)).join(",")]
  metas.forEach((m, i) => lines.push(CSV_COLS.map((c) => csvCell(c.get(m, i))).join(",")))
  // BOM so Excel opens UTF-8 (₹, Indian names) correctly.
  return "\uFEFF" + lines.join("\r\n") + "\r\n"
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

/** Most common seller name across the batch — "" when none was detected. */
export function topSeller(metas: LabelMeta[]): string {
  const counts = new Map<string, number>()
  for (const m of metas) if (m.seller) counts.set(m.seller, (counts.get(m.seller) ?? 0) + 1)
  let best = ""
  let max = 0
  for (const [s, c] of counts) if (c > max) [best, max] = [s, c]
  return best
}

export function formatINR(n: number | null): string {
  if (n == null) return "—"
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
