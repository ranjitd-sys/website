import type { ImposeUnit } from "./impose"
import type { SortKey } from "../types"

export function sortUnits(units: ImposeUnit[], key: SortKey): ImposeUnit[] {
  if (key === "default") return units
  const arr = [...units]
  arr.sort((a, b) => {
    const ca = String(a.meta?.courier ?? "").toLowerCase()
    const cb = String(b.meta?.courier ?? "").toLowerCase()
    const sa = String(a.meta?.sku ?? "").toLowerCase()
    const sb = String(b.meta?.sku ?? "").toLowerCase()
    if (key === "courier") {
      if (ca !== cb) return ca.localeCompare(cb)
      if (sa !== sb) return sa.localeCompare(sb)
      return a.pageIndex - b.pageIndex
    }
    // key === "sku"
    if (sa !== sb) return sa.localeCompare(sb)
    if (ca !== cb) return ca.localeCompare(cb)
    return a.pageIndex - b.pageIndex
  })
  return arr
}