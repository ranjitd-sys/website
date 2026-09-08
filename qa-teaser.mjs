import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [{ w: 390, h: 844 }, { w: 768, h: 900 }]) {
  const p = await b.newPage({ viewport: { width: vw.w, height: vw.h } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1800);
  const r = await p.evaluate(() => {
    const teaser = document.querySelector('.cs-teaser');
    const staticCard = document.querySelector('.customers-card .case-study-card');
    const slides = [...document.querySelectorAll('.cs-slide')];
    const active = () => document.querySelector('.cs-slide.is-active');
    const h = active() ? active().querySelector('.cs-slide-headline').textContent.trim() : '';
    return {
      teaserVisible: teaser ? getComputedStyle(teaser).display !== 'none' : 'missing',
      staticVisible: staticCard ? getComputedStyle(staticCard).display !== 'none' : 'missing',
      slideCount: slides.length,
      firstSlide: h,
      additionalSlides: slides.slice(1).map(s => s.querySelector('.cs-slide-logo').textContent),
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });
  console.log(`[${vw.w}]`, JSON.stringify(r));
  await p.close();
}
await b.close();
