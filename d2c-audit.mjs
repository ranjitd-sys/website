import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
p.on('console', m => { if (m.type() === 'error') logs.push('[console] ' + m.text().slice(0,200)); });
p.on('pageerror', e => logs.push('[pageerror] ' + e.message.slice(0,200)));
await p.goto('http://localhost:4321/solutions/d2c-brands', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
const info = await p.evaluate(() => {
  const sections = Array.from(document.querySelectorAll('main section')).map((s, i) => {
    const h = s.querySelector('h1, h2');
    const cls = Array.from(s.classList).join(' ');
    return `${i}: ${cls.slice(0,40)} | h:${h ? h.textContent.trim().slice(0,50) : '(none)'}`;
  });
  return {
    title: document.title,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    nav: !!document.querySelector('[data-nav-root]'),
    sectionCount: sections.length,
    sections: sections.slice(0, 22),
  };
});
console.log(JSON.stringify(info, null, 1));
console.log('=== errors ===');
console.log(logs.slice(0, 10).join('\n') || '(none)');
await p.screenshot({ path: '/tmp/d2c-full.png', fullPage: true });
await b.close();
