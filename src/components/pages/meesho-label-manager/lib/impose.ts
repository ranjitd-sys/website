import {
  PDFDocument,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  translate,
  rotateDegrees,
  scale as opScale,
} from "pdf-lib"
import type { LabelMeta, PerSheet } from "../types"
import type { PdfBox } from "./pdf"
import { drawSkuOverlay } from "./overlay"

export interface ImposeUnit {
  bytes: ArrayBuffer
  pageIndex: number
  box: PdfBox
  invoice?: PdfBox | null
  meta?: LabelMeta
}

export interface ImposeOptions {
  cutGuides: boolean
  overlay: boolean
  endLine: boolean
  autoRotate: boolean
  cutGap: number
}

export interface ImposeGrid {
  rows: number
  cols: number
}

const A4_W = 595.28
const A4_H = 841.89
const GUIDE_PAD = 8
const OUTER = 10
const GUIDE_COLOR = rgb(0.35, 0.4, 0.5)
const END_LINE = rgb(0, 0, 0)

export function nextFrame(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(() => resolve())
    else setTimeout(resolve, 0)
  })
}

interface Fitted {
  dw: number
  dh: number
  rotated: boolean
}

function fitIn(sw: number, sh: number, availW: number, availH: number, autoRotate: boolean): Fitted {
  const uprightScale = Math.min(availW / sw, availH / sh)
  const rotatedScale = Math.min(availW / sh, availH / sw)
  const rotated = autoRotate && rotatedScale > uprightScale + 1e-6
  const s = rotated ? rotatedScale : uprightScale
  return { dw: (rotated ? sh : sw) * s, dh: (rotated ? sw : sh) * s, rotated }
}

export function chooseGrid(perSheet: PerSheet, aspect: number): ImposeGrid {
  const pad = GUIDE_PAD
  const outer = OUTER + pad
  let best: ImposeGrid = { rows: 1, cols: 1 }
  let bestScore = -1
  for (let rows = 1; rows <= perSheet; rows++) {
    if (perSheet % rows !== 0) continue
    const cols = perSheet / rows
    const gap = pad * 2 + 8
    const availW = (A4_W - 2 * outer - (cols - 1) * gap - 2 * pad * cols) / cols
    const availH = (A4_H - 2 * outer - (rows - 1) * gap - 2 * pad * rows) / rows
    if (availW <= 0 || availH <= 0 || !Number.isFinite(aspect) || aspect <= 0) continue
    const upright = Math.min(availW / aspect, availH)
    const rotated = Math.min(availW, availH / aspect)
    const scale = Math.max(upright, rotated)
    const area = aspect * scale * scale
    const balance = Math.abs(rows - cols)
    const score = area / (1 + balance * 2)
    if (score > bestScore) {
      bestScore = score
      best = { rows, cols }
    }
  }
  return best
}

export function sheetCount(totalPages: number, perSheet: PerSheet): number {
  if (totalPages <= 0) return 0
  return Math.ceil(totalPages / perSheet)
}

export interface PlacedCell {
  unit: number
  sheet: number
  col: number
  row: number
  left: number
  y: number
  width: number
  height: number
  rotated: boolean
}

export interface A4Layout {
  rows: number
  cols: number
  sheets: number
  cells: PlacedCell[]
}

export function computeLayout(
  units: ImposeUnit[],
  perSheet: PerSheet,
  grid: ImposeGrid,
  options: ImposeOptions,
): A4Layout {
  const { rows, cols } = grid
  const pad = options.cutGuides ? GUIDE_PAD : 0
  const outer = OUTER + pad
  const gap = options.cutGuides ? pad * 2 + options.cutGap : options.cutGap
  const availW = (A4_W - 2 * outer - 2 * pad * cols - (cols - 1) * gap) / cols
  const availH = (A4_H - 2 * outer - 2 * pad * rows - (rows - 1) * gap) / rows

  const fits: Fitted[] = []
  const colW = Array.from({ length: cols }, () => 0)
  const rowH = Array.from({ length: rows }, () => 0)
  for (const [i, unit] of units.entries()) {
    const bb = unit.box
    const f = fitIn(bb.right - bb.left, bb.top - bb.bottom, availW, availH, options.autoRotate)
    fits.push(f)
    const col = i % cols
    const row = Math.floor((i % perSheet) / cols)
    if (f.dw > colW[col]) colW[col] = f.dw
    if (f.dh > rowH[row]) rowH[row] = f.dh
  }

  const blockW = colW.reduce((a, b) => a + b, 0) + (cols - 1) * gap
  const blockH = rowH.reduce((a, b) => a + b, 0) + (rows - 1) * gap
  const left0 = (A4_W - blockW) / 2
  const top0 = (A4_H + blockH) / 2

  const cells: PlacedCell[] = []
  for (let i = 0; i < units.length; i++) {
    const f = fits[i]
    const pos = i % perSheet
    const sheet = Math.floor(i / perSheet)
    const col = pos % cols
    const row = Math.floor(pos / cols)
    let cellLeft = left0
    for (let c = 0; c < col; c++) cellLeft += colW[c] + gap
    let rowBottom = top0
    for (let r = 0; r <= row; r++) rowBottom -= rowH[r] + (r === row ? 0 : gap)
    const x = cellLeft + (colW[col] - f.dw) / 2
    const y = rowBottom + (rowH[row] - f.dh) / 2
    cells.push({ unit: i, sheet, col, row, left: x, y, width: f.dw, height: f.dh, rotated: f.rotated })
  }

  return { rows, cols, sheets: Math.ceil(units.length / perSheet), cells }
}

export async function imposePdf(
  units: ImposeUnit[],
  perSheet: PerSheet,
  grid: ImposeGrid,
  options: ImposeOptions,
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  const { rows, cols } = grid
  const pad = options.cutGuides ? GUIDE_PAD : 0
  const outer = OUTER + pad
  const gap = options.cutGuides ? pad * 2 + options.cutGap : options.cutGap
  const availW = (A4_W - 2 * outer - 2 * pad * cols - (cols - 1) * gap) / cols
  const availH = (A4_H - 2 * outer - 2 * pad * rows - (rows - 1) * gap) / rows

  const docCache = new Map<ArrayBuffer, PDFDocument>()
  async function docFor(bytes: ArrayBuffer): Promise<PDFDocument> {
    let doc = docCache.get(bytes)
    if (!doc) {
      doc = await PDFDocument.load(bytes.slice(0))
      docCache.set(bytes, doc)
    }
    return doc
  }

  const fits: Fitted[] = []
  const colW = Array.from({ length: cols }, () => 0)
  const rowH = Array.from({ length: rows }, () => 0)
  for (const [i, unit] of units.entries()) {
    const bb = unit.box
    const f = fitIn(bb.right - bb.left, bb.top - bb.bottom, availW, availH, options.autoRotate)
    fits.push(f)
    const col = i % cols
    const row = Math.floor((i % perSheet) / cols)
    if (f.dw > colW[col]) colW[col] = f.dw
    if (f.dh > rowH[row]) rowH[row] = f.dh
  }

  const blockW = colW.reduce((a, b) => a + b, 0) + (cols - 1) * gap
  const blockH = rowH.reduce((a, b) => a + b, 0) + (rows - 1) * gap
  const left0 = (A4_W - blockW) / 2
  const top0 = (A4_H + blockH) / 2

  let placed = 0
  for (let i = 0; i < units.length; i++) {
    const unit = units[i]
    const f = fits[i]
    const pos = placed % perSheet
    const sheet =
      pos === 0 ? out.addPage([A4_W, A4_H]) : out.getPages()[out.getPageCount() - 1]
    const src = await docFor(unit.bytes)
    const page = src.getPage(unit.pageIndex - 1)
    const embedded = await out.embedPage(page, unit.box)
    const col = pos % cols
    const row = Math.floor(pos / cols)
    let cellLeft = left0
    for (let c = 0; c < col; c++) cellLeft += colW[c] + gap
    let rowBottom = top0
    for (let r = 0; r <= row; r++) rowBottom -= rowH[r] + (r === row ? 0 : gap)
    const x = cellLeft + (colW[col] - f.dw) / 2
    const y = rowBottom + (rowH[row] - f.dh) / 2

    if (f.rotated) {
      const cx = x + f.dw / 2
      const cy = y + f.dh / 2
      const x0 = cx - f.dw / 2
      const y0 = cy + f.dh / 2
      sheet.pushOperators(
        pushGraphicsState(),
        translate(x0, y0),
        rotateDegrees(-90),
        opScale(f.dw / (unit.box.top - unit.box.bottom), f.dh / (unit.box.right - unit.box.left)),
      )
      sheet.drawPage(embedded, { x: 0, y: 0, xScale: 1, yScale: 1 })
      sheet.pushOperators(popGraphicsState())
      if (options.endLine) {
        sheet.drawRectangle({
          x: x0 + 1,
          y: y,
          width: Math.max(1, f.dw - 2),
          height: 2.2,
          color: END_LINE,
        })
      }
      if (options.overlay && unit.meta) {
        drawSkuOverlay(sheet, x + 3, y + f.dh - 11, f.dw - 6, unit.meta)
      }
      if (options.cutGuides) {
        sheet.drawRectangle({
          x: x - GUIDE_PAD,
          y: y - GUIDE_PAD,
          width: f.dw + GUIDE_PAD * 2,
          height: f.dh + GUIDE_PAD * 2,
          borderColor: GUIDE_COLOR,
          borderWidth: 0.75,
          borderDashArray: [3, 3],
        })
      }
    } else {
      sheet.drawPage(embedded, { x, y, xScale: f.dw / (unit.box.right - unit.box.left), yScale: f.dh / (unit.box.top - unit.box.bottom) })
      if (options.endLine) {
        sheet.drawRectangle({
          x: x + 1,
          y: y,
          width: Math.max(1, f.dw - 2),
          height: 2.2,
          color: END_LINE,
        })
      }
      if (options.overlay && unit.meta) {
        drawSkuOverlay(sheet, x + 3, y + f.dh - 11, f.dw - 6, unit.meta)
      }
      if (options.cutGuides) {
        sheet.drawRectangle({
          x: x - GUIDE_PAD,
          y: y - GUIDE_PAD,
          width: f.dw + GUIDE_PAD * 2,
          height: f.dh + GUIDE_PAD * 2,
          borderColor: GUIDE_COLOR,
          borderWidth: 0.75,
          borderDashArray: [3, 3],
        })
      }
    }
    placed++
    onProgress?.(placed, units.length)
    await nextFrame()
  }
  await nextFrame()
  return out.save()
}