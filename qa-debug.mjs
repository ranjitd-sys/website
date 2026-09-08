import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 667 } });
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const res = await p.evaluate(() => {
  const el = document.querySelector('.showcase-copy');
  if (!el) return 'not found';
  const out = [];
  let node = el;
  let depth = 0;
  while (node && depth < 8) {
    const r = node.getBoundingClientRect();
    const cs = window.getComputedStyle(node);
    out.push({
      depth,
      tag: node.tagName,
      cls: (node.getAttribute('class')||'').toString().slice(0,40),
      w: Math.round(r.width), left: Math.round(r.left), right: Math.round(r.right),
      overflowX: cs.overflowX, display: cs.display,
    });
    node = node.parentElement;
    depth++;
  }
  // Are the offenders actually clipped (offset within parent) or truly overflowing?
  const vw = document.documentElement.clientWidth;
  const clipped = [];
  document.querySelectorAll('main *').forEach((el2) => {
    const r = el2.getBoundingClientRect();
    if (r.right > vw + 2) {
      clipped.push(`${el2.tagName}.${(el2.getAttribute('class')||'').toString().slice(0,30)} right=${Math.round(r.width)}`);
    }
  });
  return { chain: out, clippedCount: clipped.length, clippedSample: clipped.slice(0,5), vw };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
