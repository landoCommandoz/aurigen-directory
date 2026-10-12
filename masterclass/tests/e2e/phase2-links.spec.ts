/**
 * No dead ends (BUILD_PROMPT 13; the Phase 2 brief, check 4): every button on every screen reachable
 * from Fix It, the Academy, Quick Cards, the procedures, and search results opens a real screen.
 * Owner: qa-adversary. Links do not change with the width, so this runs in the w375 project only.
 *
 * The crawl taps every row, tile, STOP band, and button in <main> of each content page and of the
 * four lists, one at a time, the way a person does, and reads where it landed: never a "not found"
 * screen, never a blank heading, never a tap that does nothing. Then it steps back. Each page's
 * Related list is also checked against the content: every related item that has a page is listed.
 */
import { expect, test, type Page } from '@playwright/test';
import { itemById, NOT_FOUND_TITLES, pagesChunk, relatedWithPages } from '../fixtures/bundle';
import { expectNoProblems, openApp, waitForScreen, watchProblems } from '../fixtures/app';

const CHUNKS = 8;
/** Buttons that act on the page instead of opening another one. */
const STAYS = /^(Read aloud|Pause|Resume|Repeat|Stop reading)$/;

/** Links are the same at every width, so the crawl runs once, in the w375 project. */
function onlyAt375(): void {
  test.skip(test.info().project.name !== 'w375', 'links are the same at every width');
}

interface Landing {
  from: string;
  button: string;
  to: string;
  h1: string;
}

/** Tap every navigating button in <main> on one screen; return where each one landed. */
async function tapEverything(page: Page, path: string): Promise<{ landings: Landing[]; problems: string[] }> {
  const landings: Landing[] = [];
  const problems: string[] = [];
  await openApp(page, path);
  const startTitle = (await page.locator('h1').first().innerText()).trim();
  const buttons = page.locator('main button');
  const count = await buttons.count();
  for (let i = 0; i < count; i += 1) {
    const button = buttons.nth(i);
    const label = (await button.innerText()).replace(/\s+/g, ' ').trim();
    if (STAYS.test(label) || (await button.isDisabled())) continue;
    const before = page.url();
    await button.click();
    try {
      await expect.poll(() => page.url(), { timeout: 3_000 }).not.toBe(before);
    } catch {
      problems.push(`${path}: "${label}" did nothing (no new screen)`);
      continue;
    }
    await waitForScreen(page);
    const h1 = (await page.locator('h1').first().innerText()).trim();
    landings.push({ from: path, button: label, to: new URL(page.url()).pathname, h1 });
    if (h1 === '' || NOT_FOUND_TITLES.includes(h1)) problems.push(`${path}: "${label}" landed on "${h1}" at ${page.url()}`);
    await page.goBack();
    await expect(page.locator('h1').first()).toHaveText(startTitle);
  }
  return { landings, problems };
}

for (let chunk = 0; chunk < CHUNKS; chunk += 1) {
  test(`content pages, chunk ${chunk + 1} of ${CHUNKS}: every button opens a real screen, and Related lists every linked page`, async ({ page }) => {
    onlyAt375();
    test.setTimeout(600_000);
    const watched = watchProblems(page);
    const problems: string[] = [];
    let taps = 0;
    for (const { id, path } of pagesChunk(chunk, CHUNKS)) {
      const result = await tapEverything(page, path);
      taps += result.landings.length;
      problems.push(...result.problems);
      const item = itemById(id);
      if (item === undefined) continue;
      const expected = relatedWithPages(item).length;
      await openApp(page, path);
      const shown = expected === 0 ? 0 : await page.getByRole('list', { name: 'Related' }).locator('button').count();
      if (shown !== expected) problems.push(`${path}: Related shows ${shown}, the content links ${expected} items with pages`);
    }
    test.info().annotations.push({ type: 'taps', description: String(taps) });
    expect(problems).toEqual([]);
    expectNoProblems(watched);
  });
}

test('the four lists: Fix It, the Academy, Quick Cards, and the procedures', async ({ page }) => {
  onlyAt375();
  test.setTimeout(600_000);
  const problems: string[] = [];
  let taps = 0;
  for (const path of ['/fixit', '/academy', '/cards', '/sops']) {
    const result = await tapEverything(page, path);
    taps += result.landings.length;
    problems.push(...result.problems);
  }
  test.info().annotations.push({ type: 'taps', description: String(taps) });
  expect(taps).toBeGreaterThan(150);
  expect(problems).toEqual([]);
});

test('search results: every result row for a spread of garage words opens a real screen', async ({ page }) => {
  onlyAt375();
  test.setTimeout(600_000);
  const problems: string[] = [];
  let taps = 0;
  for (const q of ['jerking', 'tesla', 'wheel cleaner', 'pad', 'gauge', 'bike', 'ipa', 'towel', 'backing plate', 'compound', 'glass', 'pet hair']) {
    await openApp(page, `/search?q=${encodeURIComponent(q)}`);
    await expect(page.locator('.sr-results button').first()).toBeVisible();
    const count = await page.locator('.sr-results button').count();
    for (let i = 0; i < count; i += 1) {
      const row = page.locator('.sr-results button').nth(i);
      const label = (await row.innerText()).replace(/\s+/g, ' ').trim();
      await row.click();
      await waitForScreen(page);
      const h1 = (await page.locator('h1').first().innerText()).trim();
      if (h1 === '' || NOT_FOUND_TITLES.includes(h1) || new URL(page.url()).pathname === '/search') problems.push(`"${q}" result "${label}" landed on "${h1}" at ${page.url()}`);
      taps += 1;
      await page.goBack();
      await expect(page.locator('.sr-results button').first()).toBeVisible();
    }
  }
  test.info().annotations.push({ type: 'taps', description: String(taps) });
  expect(problems).toEqual([]);
});
