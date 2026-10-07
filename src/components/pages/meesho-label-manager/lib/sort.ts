import type { ImposeUnit } from "./impose"
import type { SortKey } from "../types"

const key = (u: ImposeUnit, f: "courier" | "sku" | "pincode" | "city") =>
  String(u.meta?.[f] ?? "").toLowerCase()

function cmp(a: string, b: string): number {
  // Blank values sort last.
  if (a === b) return 0
  if (!a) return 1
  if (!b) return -1
  return a.localeCompare(b)
}

export function sortUnits(units: ImposeUnit[], sortKey: SortKey): ImposeUnit[] {
  if (sortKey === "default") return units
  const order: ("courier" | "sku" | "pincode" | "city")[] =
    sortKey === "courier"
      ? ["courier", "sku"]
      : sortKey === "sku"
        ? ["sku", "courier"]
        : ["pincode", "city", "courier"]
  return [...units].sort((a, b) => {
    for (const f of order) {
      const c = cmp(key(a, f), key(b, f))
      if (c !== 0) return c
    }
    return a.pageIndex - b.pageIndex
  })
}
