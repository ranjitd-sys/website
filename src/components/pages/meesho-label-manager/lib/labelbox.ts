import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/src/display/api"
import type { PdfBox } from "./pdf"
import { pageAnchors, renderPageToCanvas } from "./pdf"
import { detectAutoPage, fullWidthLines } from "./detect"
import type { DetectedRegion, LabelMeta } from "../types"

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
const COURIER_RE =
  /\b(Valmo|Delhivery|XpressBees|Shadowfax|Ekart|Ecom Express|DTDC|Blue Dart|India Post|Amazon Shipping)\b/i

interface TItem {
  str: string
  x: number
  y: number
  w: number
}

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

function center(i: TItem): number {
  return i.x + i.w / 2
}

function clusterByY(items: TItem[], tol = 5): TItem[][] {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  const groups: TItem[][] = []
  for (const item of sorted) {
    const last = groups[groups.length - 1]
    if (last && item.y - last[0].y <= tol) last.push(item)
    else groups.push([item])
  }
  return groups
}

function nearestByHeader(hdrRow: TItem[], dataRow: TItem[], re: RegExp): string {
  const hdr = hdrRow.find((i) => re.test(i.str.trim()))
  if (!hdr) return ""
  const hx = center(hdr)
  let best = ""
  let bestD = Infinity
  for (const d of dataRow) {
    const dist = Math.abs(center(d) - hx)
    if (dist < bestD) {
      bestD = dist
      best = d.str.trim()
    }
  }
  return best
}

function extractMeta(
  items: TItem[],
  productY: number | null,
  taxY: number | null,
): LabelMeta {
  const text = items.map((i) => i.str).join(" ")
  const courier = (text.match(COURIER_RE)?.[1] || "").trim()
  let sku = ""
  let qty = ""
  let orderNo = ""
  if (productY != null) {
    const lo = productY + 1
    const hi = taxY ?? productY + 180
    const between = items.filter((i) => i.y > lo && i.y < hi)
    const groups = clusterByY(between).filter((g) => g.some((i) => i.str.trim() !== ""))
    const hdr = groups.find((g) => g.some((i) => /^sku$/i.test(i.str.trim())))
    if (hdr) {
      const hdrY = hdr[0].y
      const rows = groups.filter((g) => g[0].y - hdrY > 3).sort((a, b) => a[0].y - b[0].y)
      const dataRow = rows[0]
      if (dataRow) {
        sku = nearestByHeader(hdr, dataRow, /^SKU$/i)
        qty = nearestByHeader(hdr, dataRow, /^Qty/i)
        orderNo = nearestByHeader(hdr, dataRow, /^Order/i)
      }
    }
  }
  return { courier, sku, qty, orderNo }
}

function firstBlackLineAbove(
  canvas: HTMLCanvasElement,
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

export async function analyzePage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  canvas?: HTMLCanvasElement,
): Promise<AnalyzedPage> {
  const page = await pdf.getPage(pageNum)
  const items = await textItems(page)
  const { productDetailsY, taxInvoiceY, widthPt: W, heightPt: H } = await pageAnchors(page)
  const meta = extractMeta(items, productDetailsY, taxInvoiceY)

  let box: BoxSet
  if (productDetailsY != null || taxInvoiceY != null) {
    let cut: number
    let lineCut = false
    if (productDetailsY != null && taxInvoiceY != null) {
      const cv = canvas ?? (await renderPageToCanvas(pdf, pageNum, 1))
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
    const labelBottom = H - cut
    box = {
      labelBox: { left: 0, bottom: labelBottom, right: W, top: H },
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
  } else {
    const cv = canvas ?? (await renderPageToCanvas(pdf, pageNum, 1))
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