import type { DetectedRegion, GridSpec, LayoutMode, PageDetection } from "../types"
import { clampGrid } from "../types"

const DARK_THRESHOLD = 128
const CONTENT_MIN = 0.005
const BLANK_CELL_MAX = 0.01
const GUTTER_MAX = 0.02
const MIN_GUTTER_FRAC = 0.012
const GRID_MAX_AUTO = 5
const GRID_SEARCH_MAX = 8
const GRID_SNAP_TOL_FRAC = 0.015

function rowDarkFractions(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  stepX = 4,
): Float32Array {
  const out = new Float32Array(h)
  for (let y = 0; y < h; y++) {
    let dark = 0
    let n = 0
    const row = y * w
    for (let x = 0; x < w; x += stepX) {
      const i = (row + x) * 4
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (lum < DARK_THRESHOLD) dark++
      n++
    }
    out[y] = dark / n
  }
  return out
}

function findFullWidthLines(
  rows: Float32Array,
  w: number,
  minFrac: number,
): number[] {
  const lines: number[] = []
  for (let y = 0; y < rows.length; y++) {
    if (rows[y] >= minFrac) lines.push(y)
  }
  const merged: number[] = []
  let run: number[] = []
  for (const y of lines) {
    if (run.length === 0 || y - run[run.length - 1] <= 3) run.push(y)
    else {
      merged.push(Math.floor((run[0] + run[run.length - 1]) / 2))
      run = [y]
    }
  }
  if (run.length > 0)
    merged.push(Math.floor((run[0] + run[run.length - 1]) / 2))

  return merged
}

function blockDarkness(
  data: Uint8ClampedArray,
  w: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  step = 6,
): number {
  let dark = 0
  let n = 0
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const i = (y * w + x) * 4
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (lum < DARK_THRESHOLD) dark++
      n++
    }
  }
  return n === 0 ? 0 : dark / n
}

export function columnDarkFractions(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  stepY = 4,
): Float32Array {
  const out = new Float32Array(w)
  for (let x = 0; x < w; x++) {
    let dark = 0
    let n = 0
    for (let y = 0; y < h; y += stepY) {
      const i = (y * w + x) * 4
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (lum < DARK_THRESHOLD) dark++
      n++
    }
    out[x] = dark / n
  }
  return out
}

export interface ContentBox {
  x0: number
  y0: number
  x1: number
  y1: number
}

export function contentBounds(
  data: Uint8ClampedArray,
  w: number,
  h: number,
): ContentBox | null {
  const rows = rowDarkFractions(data, w, h, 8)
  const cols = columnDarkFractions(data, w, h, 8)
  let y0 = -1
  let y1 = -1
  for (let y = 0; y < h; y++) {
    if (rows[y] > CONTENT_MIN) {
      y0 = y
      break
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    if (rows[y] > CONTENT_MIN) {
      y1 = y
      break
    }
  }
  let x0 = -1
  let x1 = -1
  for (let x = 0; x < w; x++) {
    if (cols[x] > CONTENT_MIN) {
      x0 = x
      break
    }
  }
  for (let x = w - 1; x >= 0; x--) {
    if (cols[x] > CONTENT_MIN) {
      x1 = x
      break
    }
  }
  if (y0 < 0 || x0 < 0 || x1 <= x0 || y1 <= y0) return null
  return { x0, y0, x1, y1 }
}

export interface CellRect {
  x: number
  y: number
  width: number
  height: number
}

export function segmentGrid(box: ContentBox, rows: number, cols: number): CellRect[] {
  const r = clampGrid(rows)
  const c = clampGrid(cols)
  const cw = (box.x1 - box.x0 + 1) / c
  const ch = (box.y1 - box.y0 + 1) / r
  const cells: CellRect[] = []
  for (let row = 0; row < r; row++) {
    const yStart = row === 0 ? box.y0 : Math.round(box.y0 + row * ch)
    const yEnd = row === r - 1 ? box.y1 + 1 : Math.round(box.y0 + (row + 1) * ch)
    for (let col = 0; col < c; col++) {
      const xStart = col === 0 ? box.x0 : Math.round(box.x0 + col * cw)
      const xEnd = col === c - 1 ? box.x1 + 1 : Math.round(box.x0 + (col + 1) * cw)
      cells.push({
        x: xStart,
        y: yStart,
        width: Math.max(1, xEnd - xStart),
        height: Math.max(1, yEnd - yStart),
      })
    }
  }
  return cells
}

export function detectGridPage(
  canvas: HTMLCanvasElement,
  page: number,
  spec: GridSpec,
): PageDetection {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  const w = canvas.width
  const h = canvas.height
  const img = ctx.getImageData(0, 0, w, h)
  const data = img.data
  const empty = { page, pageWidth: w, pageHeight: h, foldY: null, totalY: null, regions: [] }
  const box = contentBounds(data, w, h)
  if (!box) return empty
  const cells = segmentGrid(box, spec.rows, spec.cols)
  const regions: DetectedRegion[] = []
  for (const cell of cells) {
    const dark = blockDarkness(data, w, cell.x, cell.y, cell.x + cell.width, cell.y + cell.height, 8)
    if (dark < BLANK_CELL_MAX) continue
    regions.push({
      page,
      x: cell.x,
      y: cell.y,
      width: cell.width,
      height: cell.height,
      kind: "label",
      confidence: 0.75,
    })
  }
  return { page, pageWidth: w, pageHeight: h, foldY: null, totalY: null, regions }
}

export interface GutterGap {
  start: number
  end: number
}

export function findWhiteGutters(profile: Float32Array, dimSize: number): GutterGap[] {
  const minLen = Math.max(4, Math.floor(dimSize * MIN_GUTTER_FRAC))
  const gaps: GutterGap[] = []
  let start = -1
  for (let i = 0; i < profile.length; i++) {
    if (profile[i] < GUTTER_MAX) {
      if (start < 0) start = i
    } else if (start >= 0) {
      if (i - start >= minLen) gaps.push({ start, end: i - 1 })
      start = -1
    }
  }
  if (start >= 0 && profile.length - start >= minLen) {
    gaps.push({ start, end: profile.length - 1 })
  }
  return gaps
}

export function internalWhiteGaps(profile: Float32Array, dimSize: number): GutterGap[] {
  return findWhiteGutters(profile, dimSize).filter(
    (g) => g.start > 0 && g.end < profile.length - 1,
  )
}

export function cellsFromBounds(xEdges: number[], yEdges: number[]): CellRect[] {
  const cells: CellRect[] = []
  for (let r = 0; r + 1 < yEdges.length; r++) {
    for (let c = 0; c + 1 < xEdges.length; c++) {
      cells.push({
        x: xEdges[c],
        y: yEdges[r],
        width: Math.max(1, xEdges[c + 1] - xEdges[c]),
        height: Math.max(1, yEdges[r + 1] - yEdges[r]),
      })
    }
  }
  return cells
}

function emptyDetection(
  page: number,
  w: number,
  h: number,
  extra?: Partial<PageDetection>,
): PageDetection {
  return {
    page,
    pageWidth: w,
    pageHeight: h,
    foldY: null,
    totalY: null,
    regions: [],
    ...extra,
  }
}

function clampGap(g: GutterGap, lo: number, hi: number): GutterGap | null {
  const start = Math.max(g.start, lo)
  const end = Math.min(g.end, hi)
  return end > start ? { start, end } : null
}

interface GridHypothesis {
  rows: number
  cols: number
  cells: CellRect[]
  deviation: number
}

function snapDivider(
  pos: number,
  gaps: GutterGap[],
  contentLen: number,
): { at: number; dev: number } | null {
  const tol = Math.max(2, contentLen * GRID_SNAP_TOL_FRAC)
  let best: { at: number; dev: number } | null = null
  for (const g of gaps) {
    if (pos >= g.start - tol && pos <= g.end + tol) {
      const mid = Math.floor((g.start + g.end) / 2)
      const dev = Math.abs(pos - mid)
      if (!best || dev < best.dev) best = { at: mid, dev }
    }
  }
  return best
}

function tryGrid(
  data: Uint8ClampedArray,
  w: number,
  box: ContentBox,
  rowGaps: GutterGap[],
  colGaps: GutterGap[],
  R: number,
  C: number,
): GridHypothesis | null {
  const contentW = box.x1 - box.x0 + 1
  const contentH = box.y1 - box.y0 + 1
  const yDivs: number[] = []
  let dev = 0
  for (let k = 1; k < R; k++) {
    const s = snapDivider(box.y0 + (k * contentH) / R, rowGaps, contentH)
    if (!s) return null
    yDivs.push(s.at)
    dev += s.dev
  }
  const xDivs: number[] = []
  for (let k = 1; k < C; k++) {
    const s = snapDivider(box.x0 + (k * contentW) / C, colGaps, contentW)
    if (!s) return null
    xDivs.push(s.at)
    dev += s.dev
  }
  const cells = cellsFromBounds([box.x0, ...xDivs, box.x1 + 1], [box.y0, ...yDivs, box.y1 + 1])
  const kept: CellRect[] = []
  for (const cell of cells) {
    const dark = blockDarkness(data, w, cell.x, cell.y, cell.x + cell.width, cell.y + cell.height, 8)
    if (dark < BLANK_CELL_MAX) continue
    kept.push(cell)
  }
  if (kept.length === 0) return null
  return { rows: R, cols: C, cells: kept, deviation: dev }
}

function detectAutoGrid(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  page: number,
  box: ContentBox,
  rowGaps: GutterGap[],
  colGaps: GutterGap[],
): PageDetection | null {
  let best: GridHypothesis | null = null
  for (let R = 1; R <= GRID_SEARCH_MAX; R++) {
    for (let C = 1; C <= GRID_SEARCH_MAX; C++) {
      if (R === 1 && C === 1) continue
      const hyp = tryGrid(data, w, box, rowGaps, colGaps, R, C)
      if (!hyp) continue
      const size = hyp.rows * hyp.cols
      const bestSize = best ? best.rows * best.cols : 0
      if (!best || size > bestSize || (size === bestSize && hyp.deviation < best.deviation)) {
        best = hyp
      }
    }
  }
  if (!best) return null
  if (best.rows > GRID_MAX_AUTO || best.cols > GRID_MAX_AUTO) {
    return emptyDetection(page, w, h, {
      detectedRows: best.rows,
      detectedCols: best.cols,
      warning: `grid ${best.rows}×${best.cols} exceeds 5×5 — skipped`,
    })
  }
  return {
    page,
    pageWidth: w,
    pageHeight: h,
    foldY: null,
    totalY: null,
    detectedRows: best.rows,
    detectedCols: best.cols,
    regions: best.cells.map((cell) => ({
      page,
      x: cell.x,
      y: cell.y,
      width: cell.width,
      height: cell.height,
      kind: "label" as const,
      confidence: 0.7,
    })),
  }
}

export function detectAutoPage(canvas: HTMLCanvasElement, page: number): PageDetection {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  const w = canvas.width
  const h = canvas.height
  const img = ctx.getImageData(0, 0, w, h)
  const data = img.data
  const rows = rowDarkFractions(data, w, h, 8)
  const cols = columnDarkFractions(data, w, h, 8)

  const box = contentBounds(data, w, h)
  if (!box) return emptyDetection(page, w, h)

  const rowGaps: GutterGap[] = []
  for (const g of internalWhiteGaps(rows, h)) {
    const c = clampGap(g, box.y0, box.y1)
    if (c) rowGaps.push(c)
  }
  const colGaps: GutterGap[] = []
  for (const g of internalWhiteGaps(cols, w)) {
    const c = clampGap(g, box.x0, box.x1)
    if (c) colGaps.push(c)
  }
  if (typeof window !== "undefined" && (window as unknown as { __MLM_DEBUG?: boolean }).__MLM_DEBUG) {
    console.log(
      `[mlm-debug] page ${page} ${w}x${h} box x:${box.x0}-${box.x1} y:${box.y0}-${box.y1} ` +
        `rowGaps=${JSON.stringify(rowGaps.map((g) => [g.start, g.end]))} ` +
        `colGaps=${JSON.stringify(colGaps.map((g) => [g.start, g.end]))}`,
    )
  }
  const grid = detectAutoGrid(data, w, h, page, box, rowGaps, colGaps)
  if (grid) return grid

  const foldLines = findFullWidthLines(rows, w, 0.3).filter(
    (y) => y > h * 0.3 && y < h * 0.6,
  )
  if (foldLines.length > 0) return detectPage(canvas, page)

  return {
    page,
    pageWidth: w,
    pageHeight: h,
    foldY: null,
    totalY: null,
    detectedRows: 1,
    detectedCols: 1,
    regions: [
      {
        page,
        x: box.x0,
        y: box.y0,
        width: box.x1 - box.x0 + 1,
        height: box.y1 - box.y0 + 1,
        kind: "label",
        confidence: 0.6,
      },
    ],
  }
}

export function detectMultiPage(
  canvas: HTMLCanvasElement,
  page: number,
  mode: LayoutMode,
  grid: GridSpec,
): PageDetection {
  if (mode === "grid") return detectGridPage(canvas, page, grid)
  return detectAutoPage(canvas, page)
}

export function detectPage(canvas: HTMLCanvasElement, page: number): PageDetection {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  const w = canvas.width
  const h = canvas.height
  const img = ctx.getImageData(0, 0, w, h)
  const data = img.data

  const rows = rowDarkFractions(data, w, h)

  const foldLines = findFullWidthLines(rows, w, 0.3).filter(
    (y) => y > h * 0.3 && y < h * 0.6,
  )
  let foldY: number | null = null
  if (foldLines.length > 0) {
    foldY = foldLines.reduce((best, y) =>
      Math.abs(y - h * 0.44) < Math.abs(best - h * 0.44) ? y : best,
    )
  }

  const totalLines = findFullWidthLines(rows, w, 0.25).filter(
    (y) => y > h * 0.6 && y < h * 0.88,
  )
  let totalY: number | null = null
  if (totalLines.length > 0) {
    totalY = totalLines.reduce((a, b) => (rows[a] >= rows[b] ? a : b))
  }

  const bannerDark = blockDarkness(
    data, w,
    Math.floor(w * 0.45), 0,
    w, Math.floor(h * 0.08),
  )
  const hasBanner = bannerDark > 0.12

  const barcodeZoneTop = foldY != null ? Math.floor(foldY * 0.75) : Math.floor(h * 0.3)
  const barcodeZoneBottom = foldY != null ? Math.floor(foldY * 0.98) : Math.floor(h * 0.42)
  const barcodeDark = blockDarkness(
    data, w,
    Math.floor(w * 0.45), barcodeZoneTop,
    w, barcodeZoneBottom,
  )
  const hasBarcode = barcodeDark > 0.08

  const regions: DetectedRegion[] = []
  let confidence = 0.4
  if (foldY != null) confidence += 0.25
  if (hasBanner) confidence += 0.15
  if (hasBarcode) confidence += 0.15
  if (totalY != null) confidence += 0.05
  confidence = Math.min(1, Math.round(confidence * 100) / 100)

  if (foldY != null) {
    regions.push({
      page,
      x: 0,
      y: 0,
      width: w,
      height: foldY,
      kind: "label",
      confidence,
    })
    regions.push({
      page,
      x: 0,
      y: foldY,
      width: w,
      height: (totalY != null ? totalY + 6 : Math.floor(h * 0.88)) - foldY,
      kind: "invoice",
      confidence,
    })
  }

  return { page, pageWidth: w, pageHeight: h, foldY, totalY, regions }
}
