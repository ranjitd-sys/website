import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [320, 375, 390]) {
  const p = await b.newPage({ viewport: { width: vw, height: 800 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflowers = [];
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2) {
        overflowers.push(`${el.tagName}.${(el.getAttribute('class')||'').toString().slice(0,34)} R=${Math.round(r.right)} W=${Math.round(r.width)}`);
      }
    });
    const plat = document.querySelector('.platform-card');
    const dash = document.querySelector('.platform-showcase .dashboard-card');
    const erp = document.querySelector('.erp-card');
    return {
      overflowCount: overflowers.length,
      sample: overflowers.slice(0, 6),
      platformCard: plat ? `${Math.round(plat.getBoundingClientRect().height)}px tall, ${Math.round(plat.getBoundingClientRect().width)}w` : null,
      dashboard: dash ? `${Math.round(dash.getBoundingClientRect().height)}px tall` : null,
      erpCard: erp ? `${Math.round(erp.getBoundingClientRect().height)}px tall` : null,
    };
  });
  console.log(`[${vw}px]`, JSON.stringify(res));
  await p.close();
}
await b.close();
