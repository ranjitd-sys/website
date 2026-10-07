import fs from "fs"
import * as M from "./src/components/pages/meesho-label-manager/lib/meta.ts"
const [f, kind, pages] = process.argv.slice(2)
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
const lib = pdfjs.default ?? pdfjs
lib.GlobalWorkerOptions.workerSrc = process.cwd() + "/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs"
const doc = await lib.getDocument({ data: new Uint8Array(fs.readFileSync(f)), verbosity: 0 }).promise
const list = pages ? pages.split(",").map(Number) : Array.from({ length: doc.numPages }, (_, i) => i + 1)
for (const p of list) {
  const page = await doc.getPage(p)
  const vp = page.getViewport({ scale: 1 })
  const tc = await page.getTextContent()
  const items = []
  let pd = null, ti = null
  for (const r of tc.items) {
    if (!r.str || !r.transform) continue
    const [x, y] = vp.convertToViewportPoint(r.transform[4], r.transform[5] + (r.height ?? 0))
    items.push({ str: r.str, x, y, w: r.width ?? 0 })
    if (pd == null && kind === "meesho" && /product\s*details/i.test(r.str)) pd = y
    if (ti == null && /tax\s*invoice/i.test(r.str)) ti = y
  }
  const m = kind === "meesho" ? M.extractMetaMeesho(items, pd, ti) : M.extractMetaFlipkart(items, pd, ti)
  console.log(p, JSON.stringify(m))
}
