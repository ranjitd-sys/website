import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const info = await p.evaluate(() => {
  const svgs = Array.from(document.querySelectorAll('svg')).map((s) => {
    const r = s.getBoundingClientRect();
    const vb = s.getAttribute('viewBox');
    return { cls: (s.getAttribute('class')||'').slice(0,30), w: Math.round(r.width), h: Math.round(r.height), vb };
  });
  // check key visual elements have nonzero size
  const visual = {
    heroStage: !!document.querySelector('.d2c-h-stage'),
    heroChips: document.querySelectorAll('.d2c-h-chip').length,
    coreChips: document.querySelectorAll('.d2c-h-core-chip').length,
    oneView: document.querySelectorAll('.d2c-h-one-card').length,
    erpChips: document.querySelectorAll('.d2c-h-erp-chip').length,
  };
  return { svgs, visual };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
