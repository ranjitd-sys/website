import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const info = await p.evaluate(() => {
  const meas = (sel, max=12) => Array.from(document.querySelectorAll(sel)).slice(0,max).map(el => {
    const r = el.getBoundingClientRect();
    return { left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) };
  });
  return {
    sec: meas('.sec'),
    sectionBand: meas('.section-band'),
    d2ce: meas('.d2ce'),
    grid: meas('.grid.items-center'),
    spaceGutter: getComputedStyle(document.documentElement).getPropertyValue('--space-gutter').trim(),
    bodyOverflow: getComputedStyle(document.body).overflowX,
  };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
