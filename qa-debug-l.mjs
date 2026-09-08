import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 800 } });
await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2000);
const res = await p.evaluate(() => {
  const g = (s, props) => { const el = document.querySelector(s); if (!el) return null; const cs = getComputedStyle(el); const o = {}; props.forEach(pr => o[pr] = cs[pr]); return o; };
  return {
    card: g('.difference-card', ['padding', 'gap', 'gridTemplateColumns']),
    pipeline: g('.pipeline-column', ['flexDirection', 'gap']),
    cardEl: g('.card', ['minHeight', 'padding']),
    dataItem: g('.data-item', ['display', 'padding']),
    visibleDataItems: (() => { let c=0; document.querySelectorAll('.data-item').forEach((e,i)=>{ if (getComputedStyle(e).display !== 'none') c++; }); return c; })(),
    rawMore: g('.raw-more', ['display']),
  };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
