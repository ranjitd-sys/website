import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/src/display/api"

export interface PdfBox {
  left: number
  bottom: number
  right: number
  top: number
}

async function pdfjs() {
  const mod = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const lib = (mod as unknown as { default?: unknown }).default ?? mod
  return lib as typeof import("pdfjs-dist")
}

let workerConfigured = false

export async function loadPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjsLib = await pdfjs()
  if (!workerConfigured) {
    const { default: workerUrl } = await import(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"
    )
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl as string
    workerConfigured = true
  }
  const task = pdfjsLib.getDocument({ data })
  return task.promise
}

export async function renderPageToCanvas(
  pdf: PDFDocumentProxy,
  pageNum: number,
  scale = 2,
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNum)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement("canvas")
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  await page.render({ canvas, canvasContext: ctx, viewport }).promise
  return canvas
}

export interface PageAnchors {
  productDetailsY: number | null
  taxInvoiceY: number | null
  widthPt: number
  heightPt: number
}

export async function pageAnchors(page: PDFPageProxy): Promise<PageAnchors> {
  const vp = page.getViewport({ scale: 1 })
  const H = vp.height
  const W = vp.width
  const tc = await page.getTextContent()
  let productDetailsY: number | null = null
  let taxInvoiceY: number | null = null
  for (const raw of tc.items) {
    const it = raw as { str?: string; transform?: number[]; height?: number }
    if (!it.str || !it.transform) continue
    const h = it.height ?? 0
    const [, yTop] = vp.convertToViewportPoint(it.transform[4], it.transform[5] + h)
    if (productDetailsY == null && /product\s*details/i.test(it.str)) productDetailsY = yTop
    if (taxInvoiceY == null && /tax\s*invoice/i.test(it.str)) taxInvoiceY = yTop
  }
  return { productDetailsY, taxInvoiceY, widthPt: W, heightPt: H }
}