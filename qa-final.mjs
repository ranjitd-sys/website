import { chromium } from 'playwright';
const b = await chromium.launch();
let allOk = true;
for (const vw of [320, 375, 390, 768, 1024, 1280]) {
  const p = await b.newPage({ viewport: { width: vw, height: 900 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1500);
  const res = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const doc = document.documentElement;
    const breakers = [];
    const scrollContainers = [];
    document.querySelectorAll('main *').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') scrollContainers.push('.' + (el.getAttribute('class')||'').toString().slice(0,20));
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2) {
        let sp = el.parentElement;
        while (sp) {
          const o = getComputedStyle(sp).overflowX;
          if (o === 'auto' || o === 'scroll') break;
          sp = sp.parentElement;
        }
        if (sp) return;
        breakers.push(`${el.tagName}.${(el.getAttribute('class')||'').toString().slice(0,30)} R=${Math.round(r.right)}`);
      }
    });
    return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, breakers: breakers.slice(0,6), scrollContainers };
  });
  const ok = res.scrollW === res.clientW && res.breakers.length === 0;
  if (!ok) allOk = false;
  console.log(`[${vw}] scrollW=${res.scrollW} clientW=${res.clientW} ${ok ? '✅' : '❌'} breakers=${res.breakers.join('; ') || 'none'}`);
  await p.close();
}
console.log(allOk ? '\nALL GOOD' : '\nISSUES FOUND');
await b.close();
