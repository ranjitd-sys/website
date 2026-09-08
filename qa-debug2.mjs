import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 667 } });
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
const res = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  // For each top-level main section, measure content rect vs viewport
  document.querySelectorAll('main > section').forEach((sec) => {
    const sr = sec.getBoundingClientRect();
    // find descendants whose bounding box exceeds viewport width significantly
    let worst = null;
    sec.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (!worst || rect.right > worst.right) worst = { el, right: rect.right, width: rect.width };
    });
    out.push({
      section: (sec.className||'').toString().slice(0,40),
      secLeft: Math.round(sr.left), secRight: Math.round(sr.right),
      worstRight: worst ? Math.round(worst.right) : null,
      worstWidth: worst ? Math.round(worst.width) : null,
      worstEl: worst ? `${worst.el.tagName}.${(worst.el.getAttribute('class')||'').toString().slice(0,40)}` : null,
    });
  });
  return { vw, out };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
