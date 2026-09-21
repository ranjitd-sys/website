export type LabelRegion = {
  page: number
  x: number
  y: number
  width: number
  height: number
}

export type RegionKind = "label" | "invoice"

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
  | "analyzing"
  | "preparing"
  | "done"
  | "error"

export type PerSheet = 1 | 2 | 4

export type OutputMode = "a4" | "thermal"

export type ThermalPresetId = "4x6" | "100x150"

export type ThermalSize = {
  id: ThermalPresetId
  label: string
  wPt: number
  hPt: number
}

export const THERMAL_PRESETS: Record<ThermalPresetId, ThermalSize> = {
  "4x6": { id: "4x6", label: "4 × 6 in", wPt: 288, hPt: 432 },
  "100x150": { id: "100x150", label: "100 × 150 mm", wPt: 283.46, hPt: 425.2 },
}

export type FitMode = "auto" | "contain" | "fit-width" | "actual"

export type SortKey = "default" | "courier" | "sku"

export type InvoiceMode = "off" | "a4"

export type LabelMeta = {
  courier: string
  sku: string
  qty: string
  orderNo: string
}
