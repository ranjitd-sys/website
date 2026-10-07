import type { ProviderId } from "@/components/pages/label-provider/provider"
import type { LabelMeta } from "../types"
import type { PdfBox } from "./pdf"

export type WorkerRequest =
  | { type: "open"; fileIndex: number; data: ArrayBuffer }
  | { type: "page"; id: number; fileIndex: number; page: number; providerId: ProviderId }
  | { type: "close" }

export interface WorkerPageResult {
  box: PdfBox
  invoice: PdfBox | null
  meta: LabelMeta
  raster: boolean
  width: number
  height: number
  blob: Blob
}

export type WorkerResponse =
  | { type: "opened"; fileIndex: number; numPages: number }
  | { type: "open-failed"; fileIndex: number; error: string }
  | { type: "result"; id: number; ok: true; result: WorkerPageResult }
  | { type: "result"; id: number; ok: false; error: string }
