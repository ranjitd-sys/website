import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [320, 375, 390]) {
  const p = await b.newPage({ viewport: { width: vw, height: 800 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const row = document.querySelector('.metrics-row');
    const card = document.querySelector('.platform-showcase .dashboard-card');
    // Only elements that break OUT of their scroll container
    const breakers = [];
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      let scrollParent = el.parentElement;
      while (scrollParent && getComputedStyle(scrollParent).overflowX !== 'auto' && getComputedStyle(scrollParent).overflowX !== 'scroll') {
        scrollParent = scrollParent.parentElement;
      }
      // inside metrics-row strip or table-container = fine
      if (row && row.contains(el)) return;
      if (r.right > vw + 2 || r.left < -2) {
        if (scrollParent) return; // inside a scroll container
        breakers.push(`${el.tagName}.${(el.getAttribute('class')||'').toString().slice(0,34)} R=${Math.round(r.right)}`);
      }
    });
    const rowRect = row.getBoundingClientRect();
    return {
      vw,
      metricsRow: { L: Math.round(rowRect.left+row.scrollLeft), R: Math.round(rowRect.right+row.scrollLeft), scrollable: row.scrollWidth > row.clientWidth, scrollW: row.scrollWidth, clientW: row.clientWidth },
      breakers: breakers.slice(0, 5),
      dashboardH: Math.round(card.getBoundingClientRect().height),
    };
  });
  console.log(`[${vw}]`, JSON.stringify(res));
  await p.close();
}
await b.close();
