import type { DetectedRegion, PageDetection } from "../types"

const DARK_THRESHOLD = 128

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
  void w
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
