import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [{w:320,h:700},{w:375,h:812},{w:768,h:1024},{w:1280,h:800}]) {
  const p = await b.newPage({ viewport: { width: vw.w, height: vw.h } });
  await p.goto('http://localhost:4321/', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const w = document.querySelector('.cta-banner-wrapper');
    const c = document.querySelector('.cta-banner');
    const inner = document.querySelector('.cta-banner-inner');
    const left = document.querySelector('.cta-content-left');
    const right = document.querySelector('.cta-content-right');
    const avatar = document.querySelector('.logo-avatar');
    const title = document.querySelector('.banner-title');
    const btn = document.querySelector('.button-group');
    const g = (el) => el ? el.getBoundingClientRect() : null;
    return {
      wrapper: g(w), card: g(c), inner: g(inner), left: g(left), right: g(right),
      avatar: g(avatar), titleW: g(title).width, titleText: title.textContent.trim(),
      btnW: g(btn).width, cardsW: g(btn).width,
      innerDir: getComputedStyle(inner).flexDirection,
      leftDir: getComputedStyle(left).flexDirection,
      leftAlign: getComputedStyle(left).alignItems,
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
      avatarVsTitle: avatar ? (avatar.getBoundingClientRect().bottom - title.getBoundingClientRect().top) : null,
    };
  });
  console.log(`[${vw.w}x${vw.h}]`, JSON.stringify(r, (k,v) => typeof v==='number' ? Math.round(v*10)/10 : v));
  await p.close();
}
await b.close();
