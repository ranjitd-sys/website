import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [320, 375, 390, 430]) {
  const p = await b.newPage({ viewport: { width: vw, height: 800 } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const sec = document.querySelector('.difference-section');
    const card = document.querySelector('.difference-card');
    const pipe = document.querySelector('.pipeline-column');
    const info = document.querySelector('.info-column');
    const pipelineVisible = pipe.getBoundingClientRect().height;
    return {
      section: Math.round(sec.getBoundingClientRect().height),
      card: Math.round(card.getBoundingClientRect().height),
      pipeline: Math.round(pipelineVisible),
      info: Math.round(info.getBoundingClientRect().height),
      rawItems: document.querySelectorAll('.data-item').length,
    };
  });
  console.log(`[${vw}]`, JSON.stringify(res));
  await p.close();
}
await b.close();
