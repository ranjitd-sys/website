import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { ImposeUnit } from "./impose"
import { summarize } from "./insights"

const A4: [number, number] = [595.28, 841.89]
const M = 40
const ROW_H = 18
const SIZE = 8.5
const ink = rgb(0.12, 0.12, 0.14)
const muted = rgb(0.45, 0.45, 0.5)
const rule = rgb(0.86, 0.87, 0.9)
const codBg = rgb(1, 0.93, 0.85)

// Standard fonts are WinAnsi-only; anything outside Latin-1 would throw.
function safe(s: string): string {
  return s
    .replace(/₹/g, "Rs.")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?")
}

function fit(text: string, font: PDFFont, size: number, maxW: number): string {
  let s = safe(text)
  if (font.widthOfTextAtSize(s, size) <= maxW) return s
  while (s.length > 1 && font.widthOfTextAtSize(s + "...", size) > maxW) s = s.slice(0, -1)
  return s + "..."
}

const COLS = [
  { head: "#", x: M, w: 22 },
  { head: "SKU x Qty", x: M + 24, w: 170 },
  { head: "Order ID", x: M + 198, w: 120 },
  { head: "Destination", x: M + 322, w: 140 },
  { head: "Payment", x: M + 466, w: 49 },
]

const money = (n: number | null) => (n == null ? "-" : `Rs. ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`)

export async function picklistPdf(units: ImposeUnit[], title: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const s = summarize(units.map((u) => u.meta).filter((m) => m != null))

  let page: PDFPage = doc.addPage(A4)
  let y = A4[1] - M

  const header = (first: boolean) => {
    if (first) {
      page.drawText(fit(title, bold, 16, A4[0] - 2 * M), { x: M, y: y - 14, size: 16, font: bold, color: ink })
      y -= 32
      const line = [
        `Picklist - ${s.labels} label${s.labels === 1 ? "" : "s"}`,
        `${s.orders} order${s.orders === 1 ? "" : "s"}`,
        `${s.units} unit${s.units === 1 ? "" : "s"}`,
        `${s.cod} COD (${money(s.codValue)})`,
        `${s.prepaid} prepaid`,
      ].join("  |  ")
      page.drawText(safe(line), { x: M, y, size: 9, font, color: muted })
      y -= 22
    }
    for (const c of COLS) page.drawText(c.head, { x: c.x, y, size: SIZE, font: bold, color: muted })
    y -= 6
    page.drawLine({ start: { x: M, y }, end: { x: A4[0] - M, y }, thickness: 0.6, color: rule })
    y -= ROW_H - 4
  }

  header(true)
  units.forEach((u, i) => {
    if (y < M + ROW_H) {
      page = doc.addPage(A4)
      y = A4[1] - M
      header(false)
    }
    const m = u.meta
    const cod = m?.payment === "COD"
    if (cod) page.drawRectangle({ x: COLS[4].x - 3, y: y - 4, width: COLS[4].w + 3, height: ROW_H - 4, color: codBg })
    const skuQty = m?.sku ? `${m.sku}${m.qty ? `  x${m.qty}` : ""}` : `Label ${i + 1}${m?.qty ? `  x${m.qty}` : ""}`
    const dest = [m?.city, m?.pincode].filter(Boolean).join(" - ")
    const cells = [String(i + 1).padStart(2, "0"), skuQty, m?.orderNo || "-", dest || "-", m?.payment || "-"]
    cells.forEach((v, ci) => {
      const c = COLS[ci]
      const f = ci === 0 || (ci === 4 && cod) ? bold : font
      page.drawText(fit(v, f, SIZE, c.w), { x: c.x, y, size: SIZE, font: f, color: ci === 0 ? muted : ink })
    })
    page.drawLine({ start: { x: M, y: y - 5 }, end: { x: A4[0] - M, y: y - 5 }, thickness: 0.3, color: rule })
    y -= ROW_H
  })
  return doc.save()
}
