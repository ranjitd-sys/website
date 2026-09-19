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

export function resizeForPrint(
  src: HTMLCanvasElement,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  const scale = Math.min(targetW / src.width, targetH / src.height)
  const dw = Math.max(1, Math.floor(src.width * scale))
  const dh = Math.max(1, Math.floor(src.height * scale))
  const out = document.createElement("canvas")
  out.width = targetW
  out.height = targetH
  const ctx = out.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, targetW, targetH)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(src, Math.floor((targetW - dw) / 2), Math.floor((targetH - dh) / 2), dw, dh)
  return out
}

export function printTargetPx(size: "4x6" | "a4"): { w: number; h: number } {
  if (size === "4x6") return { w: 1200, h: 1800 }
  return { w: 2480, h: 3508 }
}

export function canvasToPngDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png")
}
