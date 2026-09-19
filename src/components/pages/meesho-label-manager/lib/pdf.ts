import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api"

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
