import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const info = await p.evaluate(() => {
  return {
    convApp: !!document.querySelector('.d2cv-app'),
    convScroll: !!document.querySelector('.d2cv-scroll'),
    convSvg: !!document.querySelector('.d2cv-svg'),
    convCount: document.querySelectorAll('.d2cv-svg').length,
    erpScroll: !!document.querySelector('.d2cef-scroll'),
  };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
