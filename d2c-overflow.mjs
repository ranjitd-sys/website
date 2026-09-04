import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const info = await p.evaluate(() => {
  const offenders = [];
  const all = document.querySelectorAll('*');
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.right > 390.5 || r.left < -0.5) {
      const cls = (el.getAttribute('class')||'').slice(0,50);
      const tag = el.tagName.toLowerCase();
      offenders.push({ tag, cls, left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
    }
  }
  return offenders.slice(0, 20);
});
console.log(JSON.stringify(info, null, 1));
await b.close();
