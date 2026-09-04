import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
const info = await p.evaluate(() => {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const withIn = reveals.filter(r => r.classList.contains('in'));
  const sample = reveals.slice(0, 8).map(r => ({ cls: (r.getAttribute('class')||'').slice(0,40), hasIn: r.classList.contains('in'), opacity: getComputedStyle(r).opacity }));
  return {
    total: reveals.length,
    withIn: withIn.length,
    hasJsClass: document.documentElement.classList.contains('js'),
    sample,
  };
});
console.log(JSON.stringify(info, null, 1));
await p.close();
await b.close();
