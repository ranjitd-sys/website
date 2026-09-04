import { chromium } from 'playwright';

const url = process.env.AUDIT_URL || 'http://localhost:4321/solutions/enterprise';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    bodyScrollWidth: document.body.scrollWidth,
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    imgsNoAlt: [...document.querySelectorAll('img')].filter(i => !i.getAttribute('alt')).length,
    brokenAnchors: [
      ...document.querySelectorAll('a[href^="#"]'),
    ].filter(a => {
      const id = a.getAttribute('href').slice(1);
      return id && !document.getElementById(id);
    }).length,
  }));
  const overflow = result.scrollWidth > result.innerWidth;
  console.log(`\n[${vp.name}] width=${vp.width}px scrollWidth=${result.scrollWidth} innerWidth=${result.innerWidth} overflow=${overflow}`);
  console.log(`  bodyScrollWidth=${result.bodyScrollWidth}`);
  console.log(`  h1=${result.h1} h2=${result.h2} h3=${result.h3} imgsNoAlt=${result.imgsNoAlt} brokenAnchors=${result.brokenAnchors}`);
  if (overflow) {
    const offenders = await page.evaluate(() => {
      const widest = [];
      const w = window.innerWidth;
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > w + 1 || r.left < -1) {
          widest.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,60), right: Math.round(r.right), left: Math.round(r.left) });
        }
      });
      return widest.slice(0, 15);
    });
    console.log('  offending elements:', offenders);
  }
  await page.close();
}
await browser.close();
