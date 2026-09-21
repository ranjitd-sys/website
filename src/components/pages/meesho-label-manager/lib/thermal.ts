import {
  PDFDocument,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  translate,
  rotateDegrees,
  scale as opScale,
} from "pdf-lib"
import type { ThermalPresetId, FitMode } from "../types"
import { THERMAL_PRESETS } from "../types"
import type { PdfBox } from "./pdf"
import type { ImposeUnit } from "./impose"
import { nextFrame } from "./impose"
import { drawSkuOverlay } from "./overlay"

const END_LINE = rgb(0, 0, 0)

export interface ThermalOptions {
  preset: ThermalPresetId
  fit: FitMode
  overlay: boolean
  endLine: boolean
}

function drawEndLine(
  page: Awaited<ReturnType<PDFDocument["addPage"]>>,
  x: number,
  y: number,
  w: number,
): void {
  page.drawRectangle({
    x,
    y,
    width: Math.max(1, w),
    height: 2.2,
    color: END_LINE,
  })
}

export async function thermalPdf(
  units: ImposeUnit[],
  options: ThermalOptions,
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  const preset = THERMAL_PRESETS[options.preset]
  const pw = preset.wPt
  const ph = preset.hPt
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
  for (let i = 0; i < units.length; i++) {
    const unit = units[i]
    const page = out.addPage([pw, ph])
    const src = await docFor(unit.bytes)
    const srcPage = src.getPage(unit.pageIndex - 1)
    const bb: PdfBox = unit.box
    const sw = bb.right - bb.left
    const sh = bb.top - bb.bottom
    const embedded = await out.embedPage(srcPage, bb)

    const rotateIfBetter = options.fit === "auto"
    const uprightScale = Math.min(pw / sw, ph / sh)
    const rotatedScale = Math.min(pw / sh, ph / sw)
    const rotated = rotateIfBetter && rotatedScale > uprightScale + 1e-6

    if (rotated) {
      const s = rotatedScale
      const dw = sh * s
      const dh = sw * s
      page.pushOperators(
        pushGraphicsState(),
        translate((pw - dw) / 2, (ph + dh) / 2),
        rotateDegrees(-90),
        opScale(s, s),
      )
      page.drawPage(embedded, { x: 0, y: 0, xScale: 1, yScale: 1 })
      page.pushOperators(popGraphicsState())
      if (options.endLine) {
        drawEndLine(page, (pw - dw) / 2, (ph - dh) / 2, dw)
      }
    } else if (options.fit === "contain" || options.fit === "auto") {
      const s = uprightScale
      const dw = sw * s
      const dh = sh * s
      const x = (pw - dw) / 2
      const y = (ph - dh) / 2
      page.drawPage(embedded, { x, y, xScale: s, yScale: s })
      if (options.endLine) drawEndLine(page, x + 1, y, dw - 2)
    } else if (options.fit === "actual") {
      page.drawPage(embedded, { x: 0, y: Math.max(0, ph - sh), xScale: 1, yScale: 1 })
      if (options.endLine) drawEndLine(page, 0, Math.max(0, ph - sh), sw)
    } else {
      const sx = pw / sw
      const sy = ph / sh
      page.drawPage(embedded, { x: 0, y: 0, xScale: sx, yScale: sy })
      if (options.endLine) drawEndLine(page, 0, 0, pw)
    }
    if (options.overlay && unit.meta) {
      drawSkuOverlay(page, 3, ph - 12, pw - 6, unit.meta)
    }
    onProgress?.(i + 1, units.length)
    await nextFrame()
  }
  await nextFrame()
  return out.save()
}