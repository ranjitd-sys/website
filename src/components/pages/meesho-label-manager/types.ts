export type LabelRegion = {
  page: number
  x: number
  y: number
  width: number
  height: number
}

export type RegionKind = "label" | "invoice"

export type LayoutMode = "auto" | "grid"

export type GridSpec = {
  rows: number
  cols: number
}

export const GRID_MIN = 1
export const GRID_MAX = 5

export function clampGrid(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.max(GRID_MIN, Math.min(GRID_MAX, Math.floor(n)))
}

export type DetectedRegion = LabelRegion & {
  kind: RegionKind
  confidence: number
}

export type PageDetection = {
  page: number
  pageWidth: number
  pageHeight: number
  foldY: number | null
  totalY: number | null
  regions: DetectedRegion[]
  detectedRows?: number | null
  detectedCols?: number | null
  warning?: string | null
}

export type LabelImage = {
  id: string
  page: number
  kind: RegionKind
  previewUrl: string
  fullUrl: string
  width: number
  height: number
}

export type ProcessStatus =
  | "idle"
  | "reading"
  | "detecting"
  | "cropping"
  | "generating"
  | "done"
  | "error"

export type PrintSizeId = "4x6" | "a4"

export type PrintSettings = {
  size: PrintSizeId
  dpi: number
}
