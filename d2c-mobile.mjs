import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const info = await p.evaluate(() => {
  const visual = {
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  };
  // check svg diagrams scale reasonably on mobile
  const svgs = Array.from(document.querySelectorAll('.d2cv-svg, .d2cef-svg')).map(s => {
    const r = s.getBoundingClientRect();
    return { cls: (s.getAttribute('class')||''), w: Math.round(r.width), h: Math.round(r.height) };
  });
  // check horizontal scrollable tables are contained
  const tables = Array.from(document.querySelectorAll('.d2cs-wrap, .d2cr-wrap')).map(t => {
    const r = t.getBoundingClientRect();
    return { cls: (t.getAttribute('class')||''), w: Math.round(r.width), scrollW: t.scrollWidth, overflow: t.scrollWidth > r.width };
  });
  return { visual, svgs, tables };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
