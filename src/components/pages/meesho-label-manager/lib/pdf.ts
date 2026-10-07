import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api"
import { makeCanvas, context2d, type AnyCanvas } from "./canvas"

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

async function configuredPdfjs() {
  const pdfjsLib = await pdfjs()
  if (!workerConfigured) {
    const { default: workerUrl } = await import(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"
    )
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl as string
    workerConfigured = true
  }
  return pdfjsLib
}

export type PdfWorker = InstanceType<typeof import("pdfjs-dist").PDFWorker>

/**
 * pdf.js parses each document's pages in a single worker thread, so pages are decoded
 * one at a time. Separate workers let several pages be parsed in parallel on
 * different cores; documents can share a worker, so the thread count stays fixed.
 */
export async function createPdfWorkers(count: number): Promise<PdfWorker[]> {
  const pdfjsLib = await configuredPdfjs()
  return Array.from({ length: count }, () => new pdfjsLib.PDFWorker())
}

export async function loadPdf(data: ArrayBuffer, worker?: PdfWorker): Promise<PDFDocumentProxy> {
  const pdfjsLib = await configuredPdfjs()
  const task = pdfjsLib.getDocument(worker ? { data, worker } : { data })
  return task.promise
}

export async function renderPageToCanvas(
  pdf: PDFDocumentProxy,
  pageNum: number,
  scale = 2,
): Promise<AnyCanvas> {
  const page = await pdf.getPage(pageNum)
  const viewport = page.getViewport({ scale })
  const canvas = makeCanvas(viewport.width, viewport.height)
  const ctx = context2d(canvas, true)
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  // pdf.js types only name HTMLCanvasElement, but it draws through the context and
  // works the same with an OffscreenCanvas inside a worker.
  await page.render({
    canvas: canvas as HTMLCanvasElement,
    canvasContext: ctx as CanvasRenderingContext2D,
    viewport,
  }).promise
  return canvas
}
