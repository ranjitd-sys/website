import fs from "fs"
const [f, pg, lo, hi] = process.argv.slice(2)
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
const lib = pdfjs.default ?? pdfjs
lib.GlobalWorkerOptions.workerSrc = process.cwd() + "/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs"
const doc = await lib.getDocument({ data: new Uint8Array(fs.readFileSync(f)) }).promise
const page = await doc.getPage(+pg)
const vp = page.getViewport({ scale: 1 })
const tc = await page.getTextContent()
const items = []
for (const r of tc.items) { if (!r.str?.trim() || !r.transform) continue
  const [x, y] = vp.convertToViewportPoint(r.transform[4], r.transform[5] + (r.height ?? 0))
  items.push({ s: r.str, x: Math.round(x), y: Math.round(y) }) }
items.filter(i => i.y >= +lo && i.y <= +hi).sort((a, b) => a.y - b.y || a.x - b.x).forEach(i => console.log(`y${i.y} x${i.x} ${i.s}`))
