import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [320, 375, 390, 430]) {
  const p = await b.newPage({ viewport: { width: vw, height: 800 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const sizes = [];
    document.querySelectorAll('.pipeline-column .card').forEach((c) => {
      const r = c.getBoundingClientRect();
      const cls = (c.className||'').toString();
      sizes.push(`${cls.slice(5, cls.includes(' ') ? cls.indexOf(' '):cls.length)}: ${Math.round(r.height)}px`);
    });
    const connectors = document.querySelectorAll('.pipeline-connector').length;
    const sec = document.querySelector('.difference-section');
    const rawMore = document.querySelector('.card .raw-more');
    return {
      cards: sizes,
      connectors,
      sectionH: Math.round(sec.getBoundingClientRect().height),
      rawMoreDisplay: rawMore ? getComputedStyle(rawMore).display : 'n/a',
      dataItems: document.querySelectorAll('.data-item').length,
      cardHeader: getComputedStyle(document.querySelector('.card-header')).padding,
    };
  });
  console.log(`[${vw}]`, JSON.stringify(res));
  await p.close();
}
await b.close();
