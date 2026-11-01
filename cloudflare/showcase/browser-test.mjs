// Playwright checks: screenshots, no horizontal scroll, axe, grayscale legend. Run after build.mjs.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, 'public');
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const stats = JSON.parse(fs.readFileSync(path.join(here, 'stats.json'), 'utf8'));
const prog = JSON.parse(fs.readFileSync(path.join(here, '..', '..', 'foundry/out/law-audit/PROGRESS.json'), 'utf8'));
const pick = (st) => Object.entries(prog.states).find(([, v]) => v.checkStatus === st)[0].toLowerCase();
const pages = {
  home: '/', method: '/method/',
  checked: `/state/${pick('checked')}/`,
  gaps: `/state/${pick('checked with gaps')}/`,
  unreachable: `/state/${pick("Couldn't reach source")}/`,
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(pub, p);
  if (!f.startsWith(pub) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'content-type': f.endsWith('.html') ? 'text/html' : 'text/plain' });
  res.end(fs.readFileSync(f));
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let fail = 0;
const say = (m) => console.log(m);
for (const w of [320, 375, 768, 1024, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  for (const [name, url] of Object.entries(pages)) {
    await page.goto(base + url);
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    const small = await page.evaluate(() => [...document.querySelectorAll('a')].filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && !a.classList.contains('skip') && (r.height < 44 || r.width < 44); }).map((a) => a.textContent.trim().slice(0, 30)));
    const bad = o.sw > o.cw;
    if (bad) fail++;
    say(`${w}px ${name}: scrollWidth ${o.sw} clientWidth ${o.cw} ${bad ? 'HORIZONTAL SCROLL' : 'ok'}; links under 44px: ${small.length}${small.length ? ' ' + JSON.stringify(small.slice(0, 3)) : ''}`);
    if (w === 375 || w === 768 || w === 1440) await page.screenshot({ path: path.join(shots, `${name}-${w}.png`), fullPage: false });
  }
  await ctx.close();
}

// axe on every page type, plus a sample of all state pages at 375
const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
const page = await ctx.newPage();
const all = Object.values(pages).concat(Object.keys(prog.states).map((s) => `/state/${s.toLowerCase()}/`));
let serious = 0;
for (const url of new Set(all)) {
  await page.goto(base + url);
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const v = r.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical');
  serious += v.length;
  if (v.length) say(`axe ${url}: ${v.map((x) => x.id + ' (' + x.impact + ')').join(', ')}`);
}
say(`axe: ${new Set(all).size} pages, serious/critical violations: ${serious}`);
if (serious) fail++;

// grayscale legend: screenshot each badge in grayscale; the images must all differ
await page.goto(base + '/');
await page.addStyleTag({ content: 'html{filter:grayscale(1)}' });
const hashes = {};
for (const cls of ['st-ok', 'st-gap', 'st-no']) {
  const el = page.locator(`.legend .badge.${cls}`);
  const buf = await el.screenshot({ path: path.join(shots, `legend-gray-${cls}.png`) });
  hashes[cls] = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 12);
}
await page.locator('.legend').screenshot({ path: path.join(shots, 'legend-gray.png') });
// the three borders must also use different CSS border styles
const styles = await page.evaluate(() => ['st-ok', 'st-gap', 'st-no'].map((c) => getComputedStyle(document.querySelector('.legend .badge.' + c)).borderTopStyle));
const distinct = new Set(Object.values(hashes)).size === 3 && new Set(styles).size === 3;
say(`grayscale legend hashes ${JSON.stringify(hashes)} border styles ${JSON.stringify(styles)}: ${distinct ? 'all three differ' : 'NOT DISTINCT'}`);
if (!distinct) fail++;
await browser.close();
server.close();
say(fail ? `FAIL (${fail})` : 'PASS');
process.exit(fail ? 1 : 0);
