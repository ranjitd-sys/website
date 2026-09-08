import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [{w:1280,h:800},{w:375,h:812}]) {
  const p = await b.newPage({ viewport: { width: vw.w, height: vw.h } });
  await p.goto('http://localhost:4321/', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector('.cta-banner-wrapper').scrollIntoView({ block:'center' }));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `/tmp/opencode/cta-${vw.w}.png`, fullPage:false });
  await p.close();
}
await b.close();
