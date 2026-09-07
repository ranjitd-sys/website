import { chromium } from "playwright-core"
const browser = await chromium.launch({ executablePath: await chromium.executablePath() })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
page.on("pageerror", (e) => errs.push(e.message))
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" })
await page.locator('button', { hasText: "Integrations" }).hover()
await page.waitForTimeout(500)
const data = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[data-nav-panel="integrations"] a[href*="/integrations/"] img')).map(img => {
    const ir = img.getBoundingClientRect()
    return { src: img.getAttribute('src')?.split('/').pop(), box: `${Math.round(ir.width)}x${Math.round(ir.height)}` }
  })
})
const overflow = await page.evaluate(() => {
  const panel = document.querySelector('[data-nav-panel="integrations"]')
  const pr = panel.getBoundingClientRect()
  const tiles = Array.from(panel.querySelectorAll('a[href*="/integrations/"]'))
  let maxRight = 0
  tiles.forEach(t => { maxRight = Math.max(maxRight, t.getBoundingClientRect().right) })
  return { panelRight: Math.round(pr.right), maxTileRight: Math.round(maxRight), innerOverflow: maxRight > pr.right }
})
console.log(JSON.stringify(data, null))
console.log("panel:", JSON.stringify(overflow), "errs:", errs.length)
await browser.close()
