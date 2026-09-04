import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
async function check(url) {
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // scroll to bottom slowly
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 400) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  const res = await page.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    return {
      total: reveals.length,
      withIn: reveals.filter(r => r.classList.contains('in')).length,
    };
  });
  await page.close();
  return res;
}
console.log('D2C:', await check('http://localhost:4321/solutions/d2c-brands'));
console.log('ENTERPRISE:', await check('http://localhost:4321/solutions/enterprise'));
await b.close();
