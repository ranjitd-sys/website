import { chromium } from 'playwright';

const sizes = [
  { w: 320, h: 568 },   // iPhone SE / small
  { w: 375, h: 667 },   // iPhone 8
  { w: 390, h: 844 },   // iPhone 12/13/14
  { w: 768, h: 1024 },  // iPad
];
const b = await chromium.launch();
for (const s of sizes) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h } });
  await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const res = await p.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [];
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > doc.clientWidth + 2 || r.left < -2) {
        const cls = (el.getAttribute('class') || '').toString().slice(0, 50);
        offenders.push(`${el.tagName}.${cls} L=${Math.round(r.left)} R=${Math.round(r.right)}`);
      }
    });
    return {
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      offenders: offenders.slice(0, 12),
    };
  });
  console.log(`\n[${s.w}x${s.h}] scrollWidth=${res.scrollW} clientWidth=${res.clientW} ${res.scrollW > res.clientW ? '❌ OVERFLOW' : '✅ ok'}`);
  if (res.offenders.length) console.log('  offenders:', res.offenders.join('\n  '));
  await p.close();
}
await b.close();
