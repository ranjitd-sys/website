import { PDFDocument } from "pdf-lib"
import type { LabelImage, PrintSizeId } from "../types"

function pageSizePts(size: PrintSizeId): [number, number] {
  return size === "4x6" ? [288, 432] : [595.28, 841.89]
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? ""
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function selectOutputLabels(labels: LabelImage[], includeInvoices: boolean): LabelImage[] {
  return includeInvoices ? labels : labels.filter((l) => l.kind === "label")
}

export function nextFrame(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(() => resolve())
    else setTimeout(resolve, 0)
  })
}

export async function generatePdf(
  labels: LabelImage[],
  size: PrintSizeId,
  includeInvoices: boolean,
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const [pw, ph] = pageSizePts(size)
  const items = selectOutputLabels(labels, includeInvoices)
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const png = await doc.embedPng(dataUrlToBytes(item.fullUrl))
    const page = doc.addPage([pw, ph])
    page.drawImage(png, { x: 0, y: 0, width: pw, height: ph })
    onProgress?.(i + 1, items.length)
    await nextFrame()
  }
  await nextFrame()
  return doc.save()
}

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
