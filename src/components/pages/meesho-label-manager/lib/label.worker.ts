// Renders and analyzes label pages off the main thread. Each worker runs pdf.js
// entirely in-thread (no nested worker) and draws to OffscreenCanvas.
import * as pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs"
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api"
import { getProvider } from "@/components/pages/label-provider/provider"
import { processPage } from "./page-job"
import type { WorkerRequest, WorkerResponse } from "./worker-protocol"

// pdf.js uses this in-thread message handler instead of spawning another worker.
;(globalThis as { pdfjsWorker?: unknown }).pdfjsWorker = pdfjsWorker

interface CanvasAndContext {
  canvas: OffscreenCanvas | null
  context: OffscreenCanvasRenderingContext2D | null
}

class OffscreenCanvasFactory {
  create(width: number, height: number): CanvasAndContext {
    const canvas = new OffscreenCanvas(width, height)
    return { canvas, context: canvas.getContext("2d", { willReadFrequently: true }) }
  }
  reset(cc: CanvasAndContext, width: number, height: number): void {
    if (!cc.canvas) throw new Error("Canvas is not specified")
    cc.canvas.width = width
    cc.canvas.height = height
  }
  destroy(cc: CanvasAndContext): void {
    if (cc.canvas) cc.canvas.width = cc.canvas.height = 0
    cc.canvas = null
    cc.context = null
  }
}

// SVG filters need a DOM; labels don't use them, so every filter is a no-op.
class NoopFilterFactory {
  addFilter(): string { return "none" }
  addHCMFilter(): string { return "none" }
  addAlphaFilter(): string { return "none" }
  addLuminosityFilter(): string { return "none" }
  addKnockoutFilter(): string { return "none" }
  addHighlightHCMFilter(): string { return "none" }
  addSelectionHCMFilter(): string { return "none" }
  addSelectionFilter(): string { return "none" }
  createSelectionStyle(): null { return null }
  destroy(): void {}
}

const scope = self as unknown as {
  fonts?: unknown
  onmessage: ((e: MessageEvent<WorkerRequest>) => void) | null
  postMessage(msg: WorkerResponse): void
}

let lib: typeof import("pdfjs-dist") | null = null
async function pdfjs() {
  if (!lib) {
    const mod = await import("pdfjs-dist/legacy/build/pdf.mjs")
    lib = ((mod as unknown as { default?: unknown }).default ?? mod) as typeof import("pdfjs-dist")
  }
  return lib
}

const docs = new Map<number, Promise<PDFDocumentProxy>>()

async function open(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjsLib = await pdfjs()
  const hasFonts = !!scope.fonts
  const params = {
    data,
    // Fonts are registered on the worker's own FontFaceSet (self.fonts).
    ownerDocument: { fonts: scope.fonts },
    CanvasFactory: OffscreenCanvasFactory,
    FilterFactory: NoopFilterFactory,
    isOffscreenCanvasSupported: true,
    // pdf.js runs in-thread here by design; its "fake worker" notice is just noise.
    verbosity: pdfjsLib.VerbosityLevel.ERRORS,
    disableFontFace: !hasFonts,
  }
  return pdfjsLib.getDocument(params as unknown as Parameters<typeof pdfjsLib.getDocument>[0]).promise
}

async function handle(msg: WorkerRequest): Promise<void> {
  if (msg.type === "open") {
    const doc = open(msg.data)
    docs.set(msg.fileIndex, doc)
    try {
      scope.postMessage({ type: "opened", fileIndex: msg.fileIndex, numPages: (await doc).numPages })
    } catch (e) {
      scope.postMessage({ type: "open-failed", fileIndex: msg.fileIndex, error: String((e as Error)?.message ?? e) })
    }
    return
  }
  if (msg.type === "close") {
    for (const d of docs.values()) void d.then((doc) => doc.loadingTask.destroy()).catch(() => {})
    docs.clear()
    return
  }
  try {
    const doc = docs.get(msg.fileIndex)
    if (!doc) throw new Error(`file ${msg.fileIndex} was not opened`)
    const r = await processPage(await doc, msg.page, getProvider(msg.providerId))
    const thumb = r.thumb as OffscreenCanvas
    const blob = await thumb.convertToBlob({ type: "image/png" })
    thumb.width = thumb.height = 0
    scope.postMessage({
      type: "result",
      id: msg.id,
      ok: true,
      result: { box: r.box, invoice: r.invoice, meta: r.meta, raster: r.raster, width: r.width, height: r.height, blob },
    })
  } catch (e) {
    scope.postMessage({ type: "result", id: msg.id, ok: false, error: String((e as Error)?.message ?? e) })
  }
}

scope.onmessage = (e) => {
  void handle(e.data)
}
