import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4321/solutions/enterprise', { waitUntil: 'networkidle' });
const sc = await p.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  innerHeight: window.innerHeight,
  viewportLen: Math.round(document.documentElement.scrollHeight / window.innerHeight),
}));
console.log('page scrollHeight:', sc.scrollHeight, '~', sc.viewportLen, 'viewport-lengths');
await p.screenshot({ path: '/tmp/ent-hero.png', clip: { x:0, y:0, width:1440, height:900 } });
await p.close();
await b.close();
