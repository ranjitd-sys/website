import { chromium } from 'playwright';
const b = await chromium.launch();
for (let vw of [390, 390]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1500);
  // scroll teaser into view so IntersectionObserver fires
  await p.evaluate(() => document.querySelector('.cs-teaser').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(500);
  const snapshots = [];
  for (let i = 0; i < 6; i++) {
    const logo = await p.evaluate(() => {
      const a = document.querySelector('.cs-slide.is-active');
      return a ? a.querySelector('.cs-slide-logo').textContent.trim() : 'none';
    });
    snapshots.push(logo);
    await p.waitForTimeout(2600);
  }
  console.log('rotation sequence:', snapshots.join(' → '));
  await p.close();
}
await b.close();
