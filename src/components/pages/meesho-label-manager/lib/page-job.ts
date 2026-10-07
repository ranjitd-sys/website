import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api"
import type { LabelProvider } from "@/components/pages/label-provider/provider"
import type { LabelMeta } from "../types"
import type { PdfBox } from "./pdf"
import { renderPageToCanvas } from "./pdf"
import { analyzePage } from "./labelbox"
import { cropRegion } from "./crop"
import { downscaleCanvas, type AnyCanvas } from "./canvas"

export interface PageResult {
  box: PdfBox
  invoice: PdfBox | null
  meta: LabelMeta
  raster: boolean
  /** cropped label, already scaled down for the preview grid */
  thumb: AnyCanvas
  width: number
  height: number
}

/** Everything needed for one page: render, locate the label, read its data, make a preview. */
export async function processPage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  provider: LabelProvider,
): Promise<PageResult> {
  const fullP = renderPageToCanvas(pdf, pageNum, 1)
  const analyzed = await analyzePage(pdf, pageNum, fullP, provider)
  const full = await fullP
  const box = analyzed.box.labelBox
  const cropped = cropRegion(full, {
    page: pageNum,
    x: box.left,
    y: full.height - box.top,
    width: box.right - box.left,
    height: box.top - box.bottom,
  })
  const thumb = downscaleCanvas(cropped)
  const width = cropped.width
  const height = cropped.height
  full.width = 0
  full.height = 0
  if (thumb !== cropped) {
    cropped.width = 0
    cropped.height = 0
  }
  return { box, invoice: analyzed.box.invoiceBox, meta: analyzed.meta, raster: analyzed.box.fromRaster, thumb, width, height }
}
