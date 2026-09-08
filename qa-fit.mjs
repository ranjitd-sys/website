import { chromium } from 'playwright';
const b = await chromium.launch();
for (const vw of [{w:375,h:667},{w:390,h:844},{w:430,h:932}]) {
  const p = await b.newPage({ viewport: { width: vw.w, height: vw.h } });
  await p.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => {
    const sec = document.querySelector('.difference-section');
    const pipe = document.querySelector('.pipeline-column');
    const inner = document.querySelector('.difference-card');
    return {
      sectionH: Math.round(sec.getBoundingClientRect().height),
      cardH: Math.round(inner.getBoundingClientRect().height),
      pipeH: Math.round(pipe.getBoundingClientRect().height),
      vh: window.innerHeight,
      fits: Math.round(sec.getBoundingClientRect().height) <= window.innerHeight,
    };
  });
  console.log(`[${vw.w}x${vw.h}]`, JSON.stringify(r));
  await p.close();
}
await b.close();
