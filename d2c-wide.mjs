import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const info = await p.evaluate(() => {
  const out = [];
  // focus on the .d2ce section
  const sec = document.querySelector('.d2ce');
  const walk = (el, depth) => {
    const r = el.getBoundingClientRect();
    const cls = (el.getAttribute('class')||'').slice(0,45);
    if (r.width > 350) out.push({ depth, tag: el.tagName.toLowerCase(), cls, w: Math.round(r.width) });
    if (depth < 6) for (const c of el.children) walk(c, depth+1);
  };
  if (sec) walk(sec, 0);
  return out.slice(0, 15);
});
console.log(JSON.stringify(info, null, 1));
await b.close();
