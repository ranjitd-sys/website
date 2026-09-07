import { chromium } from "playwright-core"

const browser = await chromium.launch()
const results = []
const errors = []

async function check(page, label) {
  const info = await page.evaluate(() => {
    const doc = document.documentElement
    const overflowX = doc.scrollWidth > doc.clientWidth
    const cardLabels = [...document.querySelectorAll(".plan-card")].map((c) => {
      const name = c.querySelector(".plan-name")?.textContent?.trim()
      const amount = c.querySelector(".plan-amount")?.textContent?.trim()
      const billed = [...c.querySelectorAll(".plan-billed-line")]
        .filter((l) => l.offsetParent !== null)
        .map((l) => l.textContent?.trim())
      return { name, amount, billed }
    })
    const cmpRows = [...document.querySelectorAll(".pricing-cmp-table tbody tr")].map((tr) =>
      [...tr.querySelectorAll("th, td")].map((c) => c.textContent?.trim()),
    )
    return {
      overflowX,
      cardLabels,
      cmpCols: document.querySelectorAll(".pricing-cmp-table thead th").length,
      cmpRowsTotal: cmpRows.length,
      cmpRow1: cmpRows[0],
      cmpRowLast: cmpRows[cmpRows.length - 1],
      faqTriggers: document.querySelectorAll(".pricing-faq-acc button").length,
      activeCycle: document.getElementById("pricing-period-root")?.getAttribute("data-active"),
      billingButtons: [...document.querySelectorAll(".billing-option")].map((b) => ({
        label: b.textContent?.trim(),
        checked: b.getAttribute("aria-checked"),
      })),
    }
  })
  results.push({ label, ...info })
}

const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
page.on("console", (m) => m.type() === "error" && errors.push(`console.error: ${m.text()}`))
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))

await page.goto("http://127.0.0.1:4321/pricing", { waitUntil: "networkidle" })
await page.waitForTimeout(900)
await check(page, "desktop-1440")
await page.screenshot({ path: "/tmp/opencode/pricing-desktop.png" })
await page.screenshot({ path: "/tmp/opencode/pricing-desktop-full.png", fullPage: true })

const sel = page.locator(".billing-option")
await sel.nth(1).click()
await page.waitForTimeout(200)
await check(page, "desktop-halfYearly")
await sel.nth(2).click()
await page.waitForTimeout(200)
await check(page, "desktop-yearly")
await sel.nth(0).click()
await page.waitForTimeout(200)
await check(page, "desktop-back-quarterly")

// keyboard: ArrowRight from quarterly should move to halfYearly
await sel.nth(0).focus()
await page.keyboard.press("ArrowRight")
await page.waitForTimeout(200)
await check(page, "desktop-keyboard-right")

await page.setViewportSize({ width: 1024, height: 900 })
await page.waitForTimeout(300)
await check(page, "tablet-1024")
await page.screenshot({ path: "/tmp/opencode/pricing-tablet.png" })

await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(300)
await check(page, "mobile-390")
await page.screenshot({ path: "/tmp/opencode/pricing-mobile.png", fullPage: true })

await browser.close()
console.log(JSON.stringify({ errors, results }, null, 2))