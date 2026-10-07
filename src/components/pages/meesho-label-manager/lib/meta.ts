import { EMPTY_META, type LabelMeta, type PaymentMode } from "../types"

export interface TItem {
  str: string
  x: number
  y: number
  w: number
}

export const COURIER_RE =
  /\b(Valmo|Delhivery|XpressBees|Shadowfax|Ekart|Ecom Express|DTDC|Blue Dart|India Post|Amazon Shipping)\b/i

function center(i: TItem): number {
  return i.x + i.w / 2
}

export function clusterByY(items: TItem[], tol = 5): TItem[][] {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  const groups: TItem[][] = []
  for (const item of sorted) {
    const last = groups[groups.length - 1]
    if (last && item.y - last[0].y <= tol) last.push(item)
    else groups.push([item])
  }
  return groups
}

function nearestByHeader(hdrRow: TItem[], dataRow: TItem[], re: RegExp): string {
  const hdr = hdrRow.find((i) => re.test(i.str.trim()))
  if (!hdr) return ""
  const hx = center(hdr)
  let best = ""
  let bestD = Infinity
  for (const d of dataRow) {
    const dist = Math.abs(center(d) - hx)
    if (dist < bestD) {
      bestD = dist
      best = d.str.trim()
    }
  }
  return best
}

const t = (i: TItem) => i.str.trim()

function money(s: string): number | null {
  const m = s.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/)
  return m ? Number(m[0]) : null
}

function fmtMoney(n: number | null): string {
  return n == null || !Number.isFinite(n) ? "" : n.toFixed(2)
}

/** Items in the same column as `hdr` (left edge within `tol`) below it, until `stopY`. */
function columnBelow(items: TItem[], hdr: TItem, stopY: number, tol = 10): TItem[] {
  return items
    .filter((i) => i.y > hdr.y + 1 && i.y < stopY && Math.abs(i.x - hdr.x) <= tol && t(i) !== "")
    .sort((a, b) => a.y - b.y || a.x - b.x)
}

function rowText(row: TItem[]): string {
  return [...row].sort((a, b) => a.x - b.x).map(t).join(" ").replace(/\s+/g, " ").trim()
}

function stripTrail(s: string): string {
  return s.replace(/[\s,]+$/, "").trim()
}

function detectPayment(text: string, prepaidRe: RegExp, codRe: RegExp): PaymentMode {
  if (prepaidRe.test(text)) return "Prepaid"
  if (codRe.test(text)) return "COD"
  return ""
}

// Meesho: SKU/qty/order from the "Product Details" table just above the Tax Invoice
// anchor; customer block under "Customer Address"; totals on the invoice "Total" row.
export function extractMetaMeesho(
  items: TItem[],
  productY: number | null,
  taxY: number | null,
): LabelMeta {
  const text = items.map((i) => i.str).join(" ")
  const meta: LabelMeta = { ...EMPTY_META }
  meta.courier = (text.match(COURIER_RE)?.[1] || "").trim()
  meta.payment = detectPayment(text, /prepaid/i, /payable amount on the app|\bCOD\b/i)

  if (productY != null) {
    const lo = productY + 1
    const hi = taxY ?? productY + 180
    const between = items.filter((i) => i.y > lo && i.y < hi)
    const groups = clusterByY(between).filter((g) => g.some((i) => t(i) !== ""))
    const hdr = groups.find((g) => g.some((i) => /^sku$/i.test(t(i))))
    if (hdr) {
      const hdrY = hdr[0].y
      const rows = groups.filter((g) => g[0].y - hdrY > 3).sort((a, b) => a[0].y - b[0].y)
      const dataRow = rows[0]
      if (dataRow) {
        meta.sku = nearestByHeader(hdr, dataRow, /^SKU$/i)
        meta.qty = nearestByHeader(hdr, dataRow, /^Qty/i)
        meta.orderNo = nearestByHeader(hdr, dataRow, /^Order/i)
      }
    }
  }

  const labelEnd = productY ?? taxY ?? Infinity
  const custHdr = items.find((i) => /^customer address$/i.test(t(i)))
  const returnHdr = items.find((i) => /^if undelivered/i.test(t(i)))
  if (custHdr) {
    const addr = columnBelow(items, custHdr, returnHdr?.y ?? labelEnd)
    if (addr[0]) meta.name = stripTrail(t(addr[0]))
    const last = addr[addr.length - 1]
    if (last) {
      const parts = t(last).split(",").map((p) => p.trim()).filter(Boolean)
      if (parts.length >= 3 && /^\d{6}$/.test(parts[parts.length - 1])) {
        meta.pincode = parts[parts.length - 1]
        meta.state = parts[parts.length - 2]
        meta.city = parts[parts.length - 3]
      }
    }
    if (!meta.pincode) {
      const pins = addr.map(t).join(" ").match(/\b\d{6}\b/g)
      if (pins) meta.pincode = pins[pins.length - 1]
    }
  }
  if (returnHdr) {
    const ret = columnBelow(items, returnHdr, labelEnd)
    if (ret[0]) meta.seller = stripTrail(t(ret[0]))
  }

  const awb = items.find((i) => i.y < labelEnd && /^[A-Z]{2,5}\d{9,}$/.test(t(i)))
  if (awb) meta.awb = t(awb)

  if (taxY != null) {
    const rsRow = (y: number) =>
      items.filter((i) => Math.abs(i.y - y) <= 3 && /Rs\.?\s*[\d,]/.test(t(i))).sort((a, b) => a.x - b.x)
    const totals = items
      .filter((i) => i.y > taxY && /^total$/i.test(t(i)))
      .map((i) => rsRow(i.y))
      .filter((r) => r.length > 0)
    const row = totals[totals.length - 1]
    if (row) {
      meta.amount = fmtMoney(money(t(row[row.length - 1])))
      if (row.length >= 2) meta.tax = fmtMoney(money(t(row[row.length - 2])))
    }
  }
  return meta
}

const TAX_HDR_RE = /^(IGST|CGST|SGST|UTGST|CESS)$/i

// Flipkart: label table "SKU ID | Description … QTY" (rows "<idx> <sku> | <desc>"),
// customer block under "Shipping/Customer address:", totals at the foot of the invoice.
export function extractMetaFlipkart(
  items: TItem[],
  productY: number | null,
  taxY: number | null,
): LabelMeta {
  void productY
  const text = items.map((i) => i.str).join(" ")
  const meta: LabelMeta = { ...EMPTY_META }
  meta.courier = (text.match(COURIER_RE)?.[1] || "").trim()
  meta.orderNo = (text.match(/\bOD\d{10,}\b/)?.[0] || "").trim()
  meta.awb = (text.match(/AWB\s*No\.?\s*([A-Z0-9]{8,})/i)?.[1] || "").trim()
  const labelText = items.filter((i) => taxY == null || i.y < taxY).map((i) => i.str).join(" ")
  meta.payment = detectPayment(labelText, /prepaid/i, /\bCOD\b/i)

  const groups = clusterByY(items).filter((g) => g.some((i) => t(i) !== ""))
  const hdr = groups.find((g) => g.some((i) => /^SKU\s*ID/i.test(t(i))))
  if (hdr) {
    const hdrY = hdr[0].y
    const qtyHdr = hdr.find((i) => /^QTY$/i.test(t(i)))
    const notFor = items.find((i) => /^Not for resale/i.test(t(i)))
    const endY = notFor ? notFor.y : (taxY ?? hdrY + 60)
    const rows = groups.filter((g) => g[0].y > hdrY + 3 && g[0].y < endY - 2).sort((a, b) => a[0].y - b[0].y)
    const dataRow = rows[0]
    if (dataRow) {
      const skuItem = dataRow.find((i) => /^\d+\s+[^|]+\|/.test(t(i)))
      const m = skuItem && t(skuItem).match(/^\d+\s+([^|]+)\|/)
      if (m) meta.sku = m[1].trim()
      if (qtyHdr) {
        const qtyItem = dataRow.find((i) => Math.abs(i.x - qtyHdr.x) <= 8)
        if (qtyItem) meta.qty = t(qtyItem)
      }
    }
  }
  const totalQty = text.match(/TOTAL\s*QTY:\s*(\d+)/i)?.[1]
  if (totalQty) meta.qty = totalQty

  const addrHdr = items.find((i) => /^Shipping\/Customer address/i.test(t(i)))
  if (addrHdr) {
    const lines = clusterByY(items.filter((i) => i.y > addrHdr.y + 1 && i.y < addrHdr.y + 60 && i.x >= addrHdr.x - 4))
      .map(rowText)
      .filter(Boolean)
    const nameLine = lines.find((l) => /^Name:/i.test(l))
    if (nameLine) meta.name = stripTrail(nameLine.replace(/^Name:\s*/i, ""))
    const pinLine = lines.find((l) => /\b\d{6}\b/.test(l))
    if (pinLine) {
      const pm = pinLine.match(/^(.*?)\s*-?\s*(\d{6})\s*,?\s*(?:IN-([A-Z]{2}))?/)
      if (pm) {
        meta.city = stripTrail(pm[1].replace(/-\s*$/, ""))
        meta.pincode = pm[2]
        meta.state = pm[3] ?? ""
      }
    }
  }

  const soldBy = items.find((i) => /^Sold By:?$/i.test(t(i)))
  if (soldBy) {
    const row = items.filter((i) => Math.abs(i.y - soldBy.y) <= 3 && i.x > soldBy.x).sort((a, b) => a.x - b.x)
    if (row[0]) meta.seller = stripTrail(t(row[0]))
  } else {
    const sm = text.match(/Sold By:\s*([^,]+),/i)
    if (sm) meta.seller = sm[1].trim()
  }

  meta.amount = fmtMoney(money(text.match(/TOTAL\s*PRICE:\s*([\d,.]+)/i)?.[1] ?? ""))

  const taxHdrs = items.filter((i) => (taxY == null || i.y > taxY) && TAX_HDR_RE.test(t(i)))
  const totalRow = items.find((i) => /^TOTAL\s*(QTY|PRICE)/i.test(t(i)))
  if (taxHdrs.length > 0 && totalRow) {
    let sum = 0
    let found = false
    for (const h of taxHdrs) {
      for (const i of items) {
        if (i.y > h.y + 4 && i.y < totalRow.y - 1 && Math.abs(i.x - h.x) <= 12 && /^-?\d[\d,]*(\.\d+)?$/.test(t(i))) {
          sum += money(t(i)) ?? 0
          found = true
        }
      }
    }
    if (found) meta.tax = fmtMoney(sum)
  }
  return meta
}
