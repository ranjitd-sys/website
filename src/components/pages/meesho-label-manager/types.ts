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
