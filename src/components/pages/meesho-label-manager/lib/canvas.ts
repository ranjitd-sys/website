/** A canvas on the main thread, or an OffscreenCanvas inside a Web Worker. */
export type AnyCanvas = HTMLCanvasElement | OffscreenCanvas
export type AnyContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export function makeCanvas(width: number, height: number): AnyCanvas {
  const w = Math.max(1, Math.floor(width))
  const h = Math.max(1, Math.floor(height))
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas")
    c.width = w
    c.height = h
    return c
  }
  return new OffscreenCanvas(w, h)
}

export function context2d(canvas: AnyCanvas, willReadFrequently = false): AnyContext2D | null {
  return canvas.getContext("2d", { willReadFrequently }) as AnyContext2D | null
}

/** Scale a canvas down so it is at most `maxW` wide (returns the input when already small). */
export function downscaleCanvas(canvas: AnyCanvas, maxW = 420): AnyCanvas {
  const scale = Math.min(1, maxW / canvas.width)
  if (scale >= 1) return canvas
  const c = makeCanvas(canvas.width * scale, canvas.height * scale)
  const ctx = context2d(c)
  if (!ctx) return canvas
  ctx.drawImage(canvas, 0, 0, c.width, c.height)
  return c
}
