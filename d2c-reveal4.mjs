import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const checkVisible = () => p.evaluate(() => {
  const bad = [];
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  for (const r of reveals) {
    const rect = r.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && !r.classList.contains('in') && getComputedStyle(r).opacity === '0') {
      bad.push((r.getAttribute('class')||'').slice(0,40) + ' top=' + Math.round(rect.top));
    }
  }
  return bad.slice(0, 8);
});
const before = await checkVisible();
// scroll slowly like a user
await p.mouse.wheel(0, 900);
await p.waitForTimeout(400);
const mid = await checkVisible();
await p.mouse.wheel(0, 900);
await p.waitForTimeout(400);
const after = await checkVisible();
console.log(JSON.stringify({ before, mid, after }, null, 1));
await b.close();
