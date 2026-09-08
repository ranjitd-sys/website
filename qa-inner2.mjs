import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 900 } });
await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2000);
const r = await p.evaluate(() => {
  const H = (s) => { const el = document.querySelector(s); return el ? Math.round(el.getBoundingClientRect().height) : null; };
  return {
    section: H('.difference-section'),
    card: H('.difference-card'),
    info: H('.info-column'),
    pipe: H('.pipeline-column'),
    rawCard: H('.raw-card'), rawList: H('.raw-card .data-list'), rawMore: H('.card .raw-more'),
    engineCard: H('.engine-card'), engineBanner: H('.engine-banner'), engineBody: H('.engine-body'),
    bizCard: H('.business-card'), bizList: H('.output-list'), audit: H('.audit-badge'),
    connectors: [...document.querySelectorAll('.pipeline-connector')].reduce((a,c)=>a+c.getBoundingClientRect().height,0),
    title: H('.title'), eyebrow: H('.eyebrow'),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
