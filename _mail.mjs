import { chromium } from "playwright"
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1360, height: 900 } })
await p.goto("http://localhost:4321/admin/seo", { waitUntil: "networkidle" })
await p.fill("#admin-password", "deepEcom@tejes")
await p.click("button[type=submit]")
await p.waitForLoadState("networkidle")

const items = await p.evaluate(() => [...document.querySelectorAll("aside a")].map(a => a.textContent.replace(/\s+/g, " ").trim()))
console.log("sidebar:", JSON.stringify(items))
console.log("footer:", await p.locator("aside").last().innerText().then(t => t.split("\n").pop()))

await p.goto("http://localhost:4321/admin/email", { waitUntil: "networkidle" })
console.log("email page h1:", await p.locator("h1").innerText())
console.log("badge:", await p.locator("text=Coming soon").count() > 0)
await p.screenshot({ path: "/tmp/opencode/email-agent.png", fullPage: true })
await b.close()
