import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [375, 768, 1280]) {
  const p = await b.newPage({ viewport: { width: vw, height: 900 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const g = (s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); return { L: Math.round(r.left), R: Math.round(r.right), W: Math.round(r.width) }; };
    return { vw: document.documentElement.clientWidth, cta: g('.cta-banner'), platform: g('.platform-card'), erp: g('.erp-card'), capability: g('.capability-card'), customers: g('.customers-card') };
  });
  console.log(`[${res.vw}]`, JSON.stringify(res));
  await p.close();
}
await b.close();
