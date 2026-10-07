import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/src/display/api"
import type { PdfBox } from "./pdf"
import { renderPageToCanvas } from "./pdf"
import { detectAutoPage, fullWidthLines } from "./detect"
import { EMPTY_META, type DetectedRegion, type LabelMeta } from "../types"
import type { LabelProvider, ProviderAnchors } from "@/components/pages/label-provider/provider"
import type { TItem } from "./meta"
import { context2d, type AnyCanvas } from "./canvas"

export interface BoxSet {
  labelBox: PdfBox
  invoiceBox: PdfBox | null
  fromRaster: boolean
}

export interface AnalyzedPage {
  box: BoxSet
  meta: LabelMeta
}

const PAD = 8

async function textItems(page: PDFPageProxy): Promise<TItem[]> {
  const vp = page.getViewport({ scale: 1 })
  const tc = await page.getTextContent()
  const out: TItem[] = []
  for (const raw of tc.items) {
    const it = raw as { str?: string; transform?: number[]; height?: number; width?: number }
    if (!it.str || !it.transform) continue
    const h = it.height ?? 0
    const [x, yTop] = vp.convertToViewportPoint(it.transform[4], it.transform[5] + h)
    out.push({ str: it.str, x, y: yTop, w: it.width ?? 0 })
  }
  return out
}

function regionToPt(r: DetectedRegion, H: number): PdfBox {
  return {
    left: r.x,
    bottom: H - (r.y + r.height),
    right: r.x + r.width,
    top: H - r.y,
  }
}

function firstBlackLineAbove(
  canvas: AnyCanvas,
  yTop: number,
  windowPt = 90,
): number | null {
  const lines = fullWidthLines(canvas, 0.6)
  let best: number | null = null
  for (const y of lines) {
    if (y <= yTop + 1 && y >= yTop - windowPt) {
      if (best == null || y > best) best = y
    }
  }
  return best
}

const TRIM_DARK = 128
const TRIM_MIN_COL = 5
const TRIM_PAD = 4

// Shrinks a full-width label band [0, cut] to the printed label box: drops blank side
// margins and stops above a full-width separator (e.g. Flipkart's dashed fold line).
function trimToContent(
  canvas: AnyCanvas,
  cut: number,
): { top: number; left: number; right: number; cut: number } | null {
  const ctx = context2d(canvas, true)
  if (!ctx) return null
  const w = canvas.width
  const h = Math.min(canvas.height, Math.ceil(cut))
  if (w === 0 || h === 0) return null
  const data = ctx.getImageData(0, 0, w, h).data
  const isDark = (x: number, y: number) => {
    const i = (y * w + x) * 4
    return (data[i] + data[i + 1] + data[i + 2]) / 3 < TRIM_DARK
  }
  const cols = new Uint32Array(w)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (isDark(x, y)) cols[x]++
  let x0 = -1
  let x1 = -1
  for (let x = 0; x < w; x++) {
    if (cols[x] >= TRIM_MIN_COL) {
      if (x0 < 0) x0 = x
      x1 = x
    }
  }
  if (x0 < 0) return null
  let sepTop: number | null = null
  for (let y = h - 1; y >= 0; y--) {
    let outside = 0
    for (let x = 0; x < x0 - TRIM_PAD; x++) if (isDark(x, y)) outside++
    for (let x = x1 + TRIM_PAD; x < w; x++) if (isDark(x, y)) outside++
    if (outside > 10) sepTop = y
    else if (sepTop != null) break
  }
  let y0 = 0
  for (let y = 0; y < h; y++) {
    let dark = 0
    for (let x = x0; x <= x1; x++) if (isDark(x, y)) dark++
    if (dark > 0) {
      y0 = y
      break
    }
  }
  const bottomLimit = sepTop != null ? sepTop - 2 : h
  let y1 = bottomLimit
  for (let y = Math.min(h, bottomLimit) - 1; y >= 0; y--) {
    let dark = 0
    for (let x = x0; x <= x1; x++) if (isDark(x, y)) dark++
    if (dark > 0) {
      y1 = Math.min(bottomLimit, y + 1 + TRIM_PAD)
      break
    }
  }
  return {
    top: Math.max(0, y0 - TRIM_PAD),
    left: Math.max(0, x0 - TRIM_PAD),
    right: Math.min(w, x1 + 1 + TRIM_PAD),
    cut: y1,
  }
}

function findAnchors(
  items: TItem[],
  anchors: ProviderAnchors,
): { productDetailsY: number | null; taxInvoiceY: number | null } {
  let productDetailsY: number | null = null
  let taxInvoiceY: number | null = null
  for (const it of items) {
    if (productDetailsY == null && anchors.productDetails?.test(it.str)) productDetailsY = it.y
    if (taxInvoiceY == null && anchors.taxInvoice.test(it.str)) taxInvoiceY = it.y
  }
  return { productDetailsY, taxInvoiceY }
}

/**
 * `canvas` may be a promise so the caller can start rendering the page while the text
 * layer is still being extracted; it is only awaited when pixels are actually needed.
 */
export async function analyzePage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  canvas?: AnyCanvas | Promise<AnyCanvas>,
  provider?: LabelProvider,
): Promise<AnalyzedPage> {
  const page = await pdf.getPage(pageNum)
  const vp = page.getViewport({ scale: 1 })
  const W = vp.width
  const H = vp.height
  const items = await textItems(page)
  const { productDetailsY, taxInvoiceY } = findAnchors(
    items,
    provider?.anchors ?? { taxInvoice: /tax\s*invoice/i },
  )
  let canvasCache: Promise<AnyCanvas> | null = null
  const getCanvas = (): Promise<AnyCanvas> =>
    (canvasCache ??= canvas ? Promise.resolve(canvas) : renderPageToCanvas(pdf, pageNum, 1))
  const meta = provider
    ? provider.extractMeta(items, productDetailsY, taxInvoiceY)
    : { ...EMPTY_META }

  let box: BoxSet
  if (productDetailsY != null || taxInvoiceY != null) {
    let cut: number
    let lineCut = false
    if (productDetailsY != null && taxInvoiceY != null) {
      const cv = await getCanvas()
      const line = firstBlackLineAbove(cv, taxInvoiceY)
      if (line != null && line > productDetailsY) {
        cut = line + 2
        lineCut = true
      } else {
        const guard = taxInvoiceY - 2
        let end = productDetailsY
        for (const it of items) {
          if (it.y > productDetailsY && it.y < guard && it.y > end) end = it.y
        }
        cut = Math.min(end + 3, guard)
      }
    } else if (productDetailsY != null) {
      cut = productDetailsY + 14
    } else {
      cut = (taxInvoiceY as number) - 2
    }
    let left = 0
    let right = W
    let top = H
    if (provider?.trimSides) {
      const cv = await getCanvas()
      const sx = cv.width / W
      const t = trimToContent(cv, cut * sx)
      if (t) {
        left = t.left / sx
        right = t.right / sx
        top = H - t.top / sx
        cut = t.cut / sx
      }
    }
    const labelBottom = H - cut
    box = {
      labelBox: { left, bottom: labelBottom, right, top },
      invoiceBox:
        taxInvoiceY != null
          ? {
              left: 0,
              bottom: 0,
              right: W,
              top: lineCut ? labelBottom : Math.min(H, H - (taxInvoiceY - PAD)),
            }
          : null,
      fromRaster: false,
    }
  } else if (provider?.trimSides) {
    // No invoice anchor: the page is already a cropped label (e.g. a re-uploaded output).
    const cv = await getCanvas()
    const sx = cv.width / W
    const t = trimToContent(cv, cv.height)
    box = {
      labelBox: t
        ? { left: t.left / sx, bottom: H - t.cut / sx, right: t.right / sx, top: H - t.top / sx }
        : { left: 0, bottom: 0, right: W, top: H },
      invoiceBox: null,
      fromRaster: false,
    }
  } else {
    const cv = await getCanvas()
    const det = detectAutoPage(cv, pageNum)
    const full: PdfBox = { left: 0, bottom: 0, right: W, top: H }
    const labelReg = det.regions.find((r) => r.kind === "label") ?? det.regions[0] ?? null
    const invoiceReg = det.regions.find((r) => r.kind === "invoice") ?? null
    box = {
      labelBox: labelReg ? regionToPt(labelReg, H) : full,
      invoiceBox: invoiceReg ? regionToPt(invoiceReg, H) : full,
      fromRaster: true,
    }
  }
  return { box, meta }
}
