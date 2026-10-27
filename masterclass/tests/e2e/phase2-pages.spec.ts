/**
 * Every Phase 2 content page at every width (BUILD_PROMPT 9 items 4 and 6; the Phase 2 brief,
 * checks 2 and 4). Owner: qa-adversary. Each project in playwright.config.ts runs this file at its
 * own width: 375, 430, 768, 1024, 1440.
 *
 * Per page (every fix, Quick Card, lesson, procedure, product, tool, and glossary term in the
 * build, split into chunks so the workers share them): the title is the h1; no console or page
 * error; no horizontal scroll; no clipped or cut-off text; every target at least 44 x 44 and 64 px
 * tall in Shop density; every unverified line and row carries the "unverified" badge, and every
 * pending one the "pending" badge; a verify item says so at the top.
 */
import { expect, test, type Page } from '@playwright/test';
import { marksFor, itemById, pagesChunk, type Mark } from '../fixtures/bundle';
import { expectNoProblems, horizontalOverflow, measureTargets, openApp, watchProblems } from '../fixtures/app';

const CHUNKS = 10;

/** Text that is cut off: clipped by overflow, an ellipsis, a line clamp, or pushed past the right edge. */
async function clipped(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const sel = 'main h1, main h2, main h3, main p, main li, main dt, main dd, .ui-tile__label, .ui-row__title, .ui-row__detail, .ui-btn__label, .ui-stopband__text';
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      const s = getComputedStyle(el);
      const clips = s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.textOverflow === 'ellipsis' || (s.webkitLineClamp !== 'none' && s.webkitLineClamp !== '');
      const over = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
      const name = `${el.tagName.toLowerCase()}.${el.className.split(' ')[0] ?? ''} "${(el.textContent ?? '').trim().slice(0, 50)}"`;
      if (clips && over) out.push(`clipped ${name}`);
      if (box.right > window.innerWidth + 1) out.push(`past the right edge by ${Math.round(box.right - window.innerWidth)} px: ${name}`);
    }
    return out;
  });
}

/** The marks that are on the page without their badge. */
async function missingBadges(page: Page, marks: Mark[]): Promise<string[]> {
  return page.evaluate((list) => {
    const words = (el: Element) => {
      const copy = el.cloneNode(true) as Element;
      for (const b of Array.from(copy.querySelectorAll('.mc-badge'))) b.remove();
      return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
    };
    const norm = (t: string) => t.replace(/\s+/g, ' ').trim();
    const out: string[] = [];
    for (const m of list) {
      const sel = m.kind === 'row' ? 'main dt' : m.kind === 'step' ? 'main .ac-step__text' : 'main li, main .ui-stopband__text';
      const found = Array.from(document.querySelectorAll(sel)).filter((el) => words(el) === norm(m.text));
      if (found.length === 0) {
        out.push(`not on the page (${m.kind}): ${m.text.slice(0, 80)}`);
        continue;
      }
      const badged = found.some((el) => Array.from(el.querySelectorAll('.mc-badge')).some((b) => (b.textContent ?? '').trim() === m.badge));
      if (!badged) out.push(`no "${m.badge}" badge (${m.kind}): ${m.text.slice(0, 80)}`);
    }
    return out;
  }, marks);
}

/** An "unverified" badge outside the Related and Keep going lists (the item's own). */
async function ownUnverifiedBadge(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('main .mc-badge')).some((b) => {
      if ((b.textContent ?? '').trim() !== 'unverified') return false;
      const section = b.closest('section');
      const heading = section?.querySelector('h2')?.textContent ?? '';
      return heading !== 'Related' && heading !== 'Keep going';
    }),
  );
}

for (let chunk = 0; chunk < CHUNKS; chunk += 1) {
  test(`content pages, chunk ${chunk + 1} of ${CHUNKS}: title, no errors, no scroll, no clipping, targets, badges`, async ({ page }) => {
    test.setTimeout(240_000);
    const problems = watchProblems(page);
    const failures: string[] = [];
    const pages = pagesChunk(chunk, CHUNKS);
    expect(pages.length).toBeGreaterThan(0);
    for (const { id, path, title } of pages) {
      await openApp(page, path);
      const h1 = (await page.locator('h1').first().innerText()).trim();
      if (h1 !== title.trim()) failures.push(`${path}: h1 "${h1}", title "${title}"`);
      const { scrollWidth, width } = await horizontalOverflow(page);
      if (scrollWidth > width) failures.push(`${path}: horizontal scroll ${scrollWidth} > ${width}`);
      failures.push(...(await clipped(page)).map((c) => `${path}: ${c}`));
      for (const t of await measureTargets(page, 44, 44)) failures.push(`${path}: target under 44 x 44: ${t.what} ${t.width} x ${t.height}`);
      for (const t of await measureTargets(page, 0, 64)) failures.push(`${path}: target under 64 px tall in Shop: ${t.what} ${t.width} x ${t.height}`);
      const item = itemById(id);
      if (item !== undefined) {
        failures.push(...(await missingBadges(page, marksFor(item))).map((m) => `${path}: ${m}`));
        if (item.status === 'verify' && !(await ownUnverifiedBadge(page))) failures.push(`${path}: a verify item with no unverified badge of its own`);
      }
    }
    expect(failures).toEqual([]);
    expectNoProblems(problems);
  });
}
