import type { LabelRegion } from "../types"

export function cropRegion(
  src: HTMLCanvasElement,
  region: LabelRegion,
): HTMLCanvasElement {
  const out = document.createElement("canvas")
  out.width = Math.max(1, Math.floor(region.width))
  out.height = Math.max(1, Math.floor(region.height))
  const ctx = out.getContext("2d")
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

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
