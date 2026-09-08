import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [{ w: 390, h: 844 }, { w: 768, h: 1024 }]) {
  const p = await b.newPage({ viewport: { width: vw.w, height: vw.h } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => {
    const m = document.querySelector('.cs-marquee-section');
    const trust = document.querySelector('.trust-bar');
    const hero = document.querySelector('.hero-section');
    const rect = m ? m.getBoundingClientRect() : null;
    const seen = document.querySelectorAll('.cs-marquee-section ~ *, .cs-marquee-section').length;
    return {
      visible: m ? getComputedStyle(m).display !== 'none' : 'missing',
      positionInDom: [...document.querySelectorAll('main > section')].map(s => s.className).indexOf('cs-marquee-section'),
      top: rect ? Math.round(rect.top) : null,
      cards: document.querySelectorAll('.cs-card').length,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      trustTop: trust ? Math.round(trust.getBoundingClientRect().top) : null,
      heroBottom: hero ? Math.round(hero.getBoundingClientRect().bottom) : null,
    };
  });
  console.log(`[${vw.w}]`, JSON.stringify(r));
  await p.close();
}
await b.close();
