import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
await p.screenshot({ path: '/tmp/opencode/mobile-full.png', fullPage: true });
const width = await p.evaluate(() => document.documentElement.scrollWidth);
console.log('doc scrollWidth:', width, 'expected <= 390');
await b.close();
