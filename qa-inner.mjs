import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [375, 390]) {
  const p = await b.newPage({ viewport: { width: vw, height: 900 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const H = (el) => el ? Math.round(el.getBoundingClientRect().height) : null;
    const items = ['raw-card', 'engine-card', 'business-card'].map((c) => {
      const card = document.querySelector('.' + c);
      return {
        card: c,
        h: H(card),
        header: H(card.querySelector('.card-header')),
        list: H(card.querySelector('.data-list, .output-list, .engine-body')),
        extra: H(card.querySelector('.raw-more, .audit-badge')),
      };
    });
    return {
      engineBanner: H(document.querySelector('.engine-banner')),
      engineFeatures: document.querySelectorAll('.feature-item').length,
      outputItems: document.querySelectorAll('.output-item').length,
      info: H(document.querySelector('.info-column')),
      pipe: H(document.querySelector('.pipeline-column')),
      gap: getComputedStyle(document.querySelector('.pipeline-column')).gap,
      items,
    };
  });
  console.log(`[${vw}]`, JSON.stringify(res));
  await p.close();
}
await b.close();
