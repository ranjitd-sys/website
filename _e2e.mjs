import { chromium } from "playwright"
import fs from "fs"
const file = process.argv[2], out = process.argv[3]
const b = await chromium.launch()
const p = await b.newPage({ acceptDownloads: true })
const errs = []
p.on("pageerror", e => errs.push(e.message))
await p.goto("http://localhost:4321/tools/flipkart-label-manager", { waitUntil: "networkidle" })
await p.setInputFiles('input[type=file]', file)
await p.getByText("Your labels are ready").waitFor({ timeout: 90000 })
const dl = p.waitForEvent("download")
await p.getByRole("button", { name: /Download PDF/ }).click()
const d = await dl
await d.saveAs(out)
console.log("saved", out, "errors:", errs)
await b.close()
