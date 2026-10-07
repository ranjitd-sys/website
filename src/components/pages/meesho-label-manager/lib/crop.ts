import type { LabelRegion } from "../types"
import { makeCanvas, context2d, type AnyCanvas } from "./canvas"

export function cropRegion(src: AnyCanvas, region: LabelRegion): AnyCanvas {
  const out = makeCanvas(region.width, region.height)
  const ctx = context2d(out)
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, out.width, out.height)
  ctx.drawImage(
    src,
    region.x, region.y, region.width, region.height,
    0, 0, out.width, out.height,
  )
  return out
}

export function canvasToPngDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png")
}

export function downloadBytes(bytes: Uint8Array | string, filename: string, type = "application/pdf"): void {
  const blob = new Blob([bytes as BlobPart], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
