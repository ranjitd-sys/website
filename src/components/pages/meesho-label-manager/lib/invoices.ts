import { PDFDocument } from "pdf-lib"
import type { PdfBox } from "./pdf"
import type { ImposeUnit } from "./impose"
import { nextFrame } from "./impose"

export interface InvoicesOptions {
  mode: "off" | "a4"
}

export async function invoicesPdf(
  units: ImposeUnit[],
  options: InvoicesOptions,
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  if (options.mode === "off") throw new Error("invoices disabled")
  const out = await PDFDocument.create()
  const docCache = new Map<ArrayBuffer, PDFDocument>()
  async function docFor(bytes: ArrayBuffer): Promise<PDFDocument> {
    let doc = docCache.get(bytes)
    if (!doc) {
      doc = await PDFDocument.load(bytes.slice(0))
      docCache.set(bytes, doc)
    }
    return doc
  }
  let placed = 0
  for (const unit of units) {
    const src = await docFor(unit.bytes)
    const srcPage = src.getPage(unit.pageIndex - 1)
    const bb: PdfBox = unit.invoice ?? { left: 0, top: 0, right: 1, bottom: 1 }
    const sw = bb.right - bb.left
    const sh = bb.top - bb.bottom
    if (sw > 1 && sh > 1) {
      const embedded = await out.embedPage(srcPage, bb)
      const page = out.addPage([595.28, 841.89])
      const scale = Math.min(595.28 / sw, 841.89 / sh) * 0.97
      const dw = sw * scale
      const dh = sh * scale
      page.drawPage(embedded, {
        x: (595.28 - dw) / 2,
        y: (841.89 - dh) / 2 + 18,
        xScale: scale,
        yScale: scale,
      })
    }
    placed++
    onProgress?.(placed, units.length)
    await nextFrame()
  }
  await nextFrame()
  return out.save()
}