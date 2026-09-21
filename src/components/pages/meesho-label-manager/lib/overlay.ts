import { rgb, type PDFPage } from "pdf-lib"
import type { LabelMeta } from "../types"

const CHIP_BG = rgb(0.16, 0.16, 0.18)
const CHIP_TEXT = rgb(0.98, 0.98, 0.99)

export function drawSkuOverlay(
  sheet: PDFPage,
  x: number,
  y: number,
  maxW: number,
  meta: LabelMeta,
): void {
  const sku = meta.sku.trim()
  const qty = meta.qty.trim()
  if (!sku && !qty) return
  const text = qty ? `${sku} ×${qty}` : sku
  const size = 7
  const padX = 5
  const padY = 2.5
  const textW = sku.length * (size * 0.62) + (qty ? 14 : 0)
  const w = Math.min(maxW, Math.max(24, textW + padX * 2))
  sheet.drawRectangle({
    x,
    y,
    width: w,
    height: size + padY * 2,
    color: CHIP_BG,
  })
  sheet.drawText(text, {
    x: x + padX,
    y: y + padY,
    size,
    color: CHIP_TEXT,
  })
}