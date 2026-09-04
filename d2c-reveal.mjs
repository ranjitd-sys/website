import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
// scroll through to trigger reveals
await p.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 80));
  }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(600);
const info = await p.evaluate(() => {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const hidden = reveals.filter(r => r.classList.contains('js') === false || getComputedStyle(r).opacity === '0' || getComputedStyle(r).visibility === 'hidden');
  return {
    totalReveal: reveals.length,
    stillHidden: hidden.length,
    pageHeight: document.documentElement.scrollHeight,
  };
});
console.log(JSON.stringify(info, null, 1));
await p.close();
await b.close();
