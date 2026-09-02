const { chromium } = require("playwright")
async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const logs = []
  page.on("console", (m) => { if (m.type() === "error") logs.push("[console] " + m.text()) })
  page.on("pageerror", (e) => logs.push("[pageerror] " + e.message))
  await page.goto("http://127.0.0.1:8300/", { waitUntil: "load" })
  await page.waitForTimeout(1200)

  const s = await page.evaluate(() => {
    const hero = document.querySelector(".hero-section")
    const nav = document.querySelector("[data-nav-root]")
    const heroRect = hero ? hero.getBoundingClientRect() : null
    const navRect = nav ? nav.getBoundingClientRect() : null
    const arch = document.querySelector(".arch-diagram")
    const cards = arch ? Array.from(arch.querySelectorAll(".arch-card, .arch-card-highlight")).map(c => c.getBoundingClientRect()) : []
    const cons = arch ? Array.from(arch.querySelectorAll(".flow-connector-svg")).map(c => c.getBoundingClientRect()) : []
    return {
      heroTop: heroRect ? Math.round(heroRect.top) : null,
      navBottom: navRect ? Math.round(navRect.bottom) : null,
      gapHeroToNav: heroRect && navRect ? Math.round(heroRect.top - navRect.bottom) : null,
      heroPadTop: hero ? getComputedStyle(hero).paddingTop : "n/a",
      heroMarginTop: hero ? getComputedStyle(hero).marginTop : "n/a",
      archCardWidths: cards.map(c => Math.round(c.width)),
      archCardHeights: cards.map(c => Math.round(c.height)),
      archCardCentersY: cards.map(c => Math.round(c.top + c.height / 2)),
      conWidths: cons.map(c => Math.round(c.width)),
      conHeights: cons.map(c => Math.round(c.height)),
      conCentersY: cons.map(c => Math.round(c.top + c.height / 2)),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }
  })
  console.log(JSON.stringify(s, null, 1))
  console.log("=== errors ===")
  console.log(logs.slice(0, 8).join("\n") || "(none)")
  await browser.close()
}
main().catch((e) => { console.error("SCRIPT ERROR:", e.message); process.exit(1) })