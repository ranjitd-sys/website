import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import type { LabelMeta } from "../types"
import type { ImposeUnit } from "./impose"

const FONT_SIZE = 9

function pickLabel(m: LabelMeta | undefined, i: number): string {
  const sku = m?.sku.trim() ?? ""
  const qty = m?.qty.trim() ?? ""
  const courier = m?.courier.trim() ?? ""
  const num = String(i + 1).padStart(2, "0")
  const skuPart = sku ? `${sku}${qty ? ` ×${qty}` : ""}` : `Label ${num}`
  return qty && !sku ? `${courier || "Label"} ${num} ×${qty}` : skuPart
}

export async function picklistPdf(
  units: ImposeUnit[],
  label: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([595.28, 595.28])
  const ink = rgb(0.12, 0.12, 0.14)
  const muted = rgb(0.45, 0.45, 0.5)
  page.drawText(label, {
    x: 48,
    y: 560,
    size: 17,
    font: fontBold,
    color: ink,
  })
  page.drawText(`Picklist · ${units.length} order${units.length === 1 ? "" : "s"}`, {
    x: 48,
    y: 542,
    size: 10,
    font: font,
    color: muted,
  })
  let y = 506
  units.forEach((u, i) => {
    const text = pickLabel(u.meta, i)
    page.drawText(String(i + 1).padStart(2, "0"), {
      x: 48,
      y,
      size: FONT_SIZE,
      font: fontBold,
      color: muted,
    })
    page.drawText(text, {
      x: 88,
      y,
      size: FONT_SIZE,
      font,
      color: ink,
    })
    y -= 22
  })
  return doc.save()
}