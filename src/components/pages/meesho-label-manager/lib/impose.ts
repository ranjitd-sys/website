import { PDFDocument, rgb } from "pdf-lib"
import { nextFrame } from "./generate"
import type { PerSheet } from "../types"
import type { PdfBox } from "./pdf"

export interface ImposeSource {
  bytes: ArrayBuffer
  numPages: number
  boxes: (PdfBox | null)[]
}

export interface ImposeOptions {
  cutGuides: boolean
}

export interface ImposeGrid {
  rows: number
  cols: number
}

const A4_W = 595.28
const A4_H = 841.89
const GUIDE_PAD = 8
const GUIDE_GAP = 12
const ROW_GAP = 14
const GUIDE_COLOR = rgb(0.35, 0.4, 0.5)

function insetFor(cutGuides: boolean): number {
  return cutGuides ? GUIDE_PAD * 2 + GUIDE_GAP : 0
}

export function chooseGrid(perSheet: PerSheet, aspect: number): ImposeGrid {
  const inset = insetFor(true)
  const maxH = A4_H - inset
  let best: ImposeGrid = { rows: 1, cols: 1 }
  let bestArea = -1
  for (let rows = 1; rows <= perSheet; rows++) {
    if (perSheet % rows !== 0) continue
    const cols = perSheet / rows
    const availW = A4_W / cols - inset
    if (availW <= 0 || !Number.isFinite(aspect) || aspect <= 0) continue
    let scale = availW / aspect
    const blockH0 = rows * scale + (rows - 1) * ROW_GAP
    if (blockH0 > maxH) scale *= maxH / blockH0
    const area = aspect * scale * scale
    if (area > bestArea) {
      bestArea = area
      best = { rows, cols }
    }
  }
  return best
}

export function sheetCount(totalPages: number, perSheet: PerSheet): number {
  if (totalPages <= 0) return 0
  return Math.ceil(totalPages / perSheet)
}

export async function imposePdf(
  sources: ImposeSource[],
  perSheet: PerSheet,
  grid: ImposeGrid,
  options: ImposeOptions,
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  const { rows, cols } = grid
  const cellW = A4_W / cols
  const inset = insetFor(options.cutGuides)
  const rowGap = options.cutGuides ? ROW_GAP : 8
  const maxH = A4_H - inset
  let total = 0
  for (const s of sources) total += s.numPages
  let placed = 0
  for (const s of sources) {
    const src = await PDFDocument.load(s.bytes.slice(0))
    for (let i = 0; i < s.numPages; i++) {
      const pos = placed % perSheet
      const sheet =
        pos === 0 ? out.addPage([A4_W, A4_H]) : out.getPages()[out.getPageCount() - 1]
      const page = src.getPage(i)
      const size = page.getSize()
      const bb = s.boxes[i] ?? { left: 0, bottom: 0, right: size.width, top: size.height }
      const sw = bb.right - bb.left
      const sh = bb.top - bb.bottom
      const embedded = await out.embedPage(page, bb)
      let scale = (cellW - inset) / sw
      let dh = sh * scale
      let blockH = rows * dh + (rows - 1) * rowGap
      if (blockH > maxH) {
        scale *= maxH / blockH
        dh = sh * scale
        blockH = rows * dh + (rows - 1) * rowGap
      }
      const dw = sw * scale
      const col = pos % cols
      const row = Math.floor(pos / cols)
      const x = col * cellW + (cellW - dw) / 2
      const blockTop = (A4_H + blockH) / 2
      const y = blockTop - row * (dh + rowGap) - dh
      sheet.drawPage(embedded, { x, y, xScale: scale, yScale: scale })
      if (options.cutGuides) {
        sheet.drawRectangle({
          x: x - GUIDE_PAD,
          y: y - GUIDE_PAD,
          width: dw + GUIDE_PAD * 2,
          height: dh + GUIDE_PAD * 2,
          borderColor: GUIDE_COLOR,
          borderWidth: 0.75,
          borderDashArray: [3, 3],
        })
      }
      placed++
      onProgress?.(placed, total)
      await nextFrame()
    }
  }
  await nextFrame()
  return out.save()
}
