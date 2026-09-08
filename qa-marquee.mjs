import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [{ w: 390, h: 844 }, { w: 375, h: 667 }, { w: 768, h: 1024 }, { w: 1280, h: 900 }]) {
  const p = await b.newPage({ viewport: { width: vw.w, height: vw.h } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => {
    const m = document.querySelector('.cs-marquee');
    const track = document.querySelector('.cs-marquee-track');
    const rect = m.getBoundingClientRect();
    return {
      visible: getComputedStyle(m).display !== 'none',
      cardCount: document.querySelectorAll('.cs-card').length,
      trackWidth: track ? Math.round(track.getBoundingClientRect().width) : 0,
      marqueeWidth: Math.round(rect.width),
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });
  console.log(`[${vw.w}]`, JSON.stringify(r));
  await p.close();
}
await b.close();
