import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 320, height: 800 } });
await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2000);
const res = await p.evaluate(() => {
  const cont = document.querySelector('.hero-container');
  const grid = document.querySelector('.hero-grid');
  const copy = document.querySelector('.hero-copy');
  const visual = document.querySelector('.hero-visual');
  const dash = document.querySelector('.hero-visual .dash-stage');
  const m = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { tag: el.tagName, cls: (el.className||'').toString().slice(0,32), W: Math.round(r.width), L: Math.round(r.left), R: Math.round(r.right), minW: cs.minWidth, maxW: cs.maxWidth, overflow: cs.overflowX };
  };
  return { gutter: getComputedStyle(document.documentElement).getPropertyValue('--space-gutter'), cont: m(cont), grid: m(grid), copy: m(copy), visual: m(visual), dash: m(dash), scrollW: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
