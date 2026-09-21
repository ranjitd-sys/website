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

export async function labelBoxByText(page: PDFPageProxy): Promise<PdfBox | null> {
  const vp = page.getViewport({ scale: 1 })
  const H = vp.height
  const W = vp.width
  const tc = await page.getTextContent()
  const findTop = (re: RegExp): number | null => {
    for (const item of tc.items) {
      const it = item as { str?: string; transform?: number[]; height?: number }
      if (!it.str || !it.transform) continue
      if (re.test(it.str)) {
        const h = it.height ?? 0
        const [, yTop] = vp.convertToViewportPoint(it.transform[4], it.transform[5] + h)
        return yTop
      }
    }
    return null
  }
  const cut = findTop(/product\s*details/i) ?? findTop(/tax\s*invoice/i)
  if (cut == null) return null
  const pad = 8
  const bottomTopOrigin = cut - pad
  if (bottomTopOrigin <= H * 0.1 || bottomTopOrigin >= H) return null
  return { left: 0, bottom: H - bottomTopOrigin, right: W, top: H }
}
