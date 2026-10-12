/**
 * Offline with the Phase 2 content (BUILD_PROMPT 9 item 5; the Phase 2 brief, check 5). Owner:
 * qa-adversary. After the service worker is ready, airplane mode, reload: a fix page, a lesson, a
 * procedure, an item page, and a search all work from the offline copy, by tapping and by deep link.
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { openApp, waitForScreen } from '../fixtures/app';

/** Every lazy chunk the build wrote: one per content shard, and the search index (DEF-17's cut). */
const LAZY_CHUNKS = readdirSync(fileURLToPath(new URL('../../dist/assets', import.meta.url))).filter((f) => /^(content-[a-z]+|search-index)-[^/]+\.js$/.test(f));

test.use({ serviceWorkers: 'allow' });

async function readyOffline(page: Page): Promise<void> {
  await openApp(page, '/');
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
}

test('airplane mode after the offline copy is saved: Fix It, a fix, a lesson, a procedure, an item, and search all work', async ({ page, context }) => {
  test.setTimeout(90_000);
  await readyOffline(page);
  const cached = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const name of await caches.keys()) for (const r of await (await caches.open(name)).keys()) urls.push(new URL(r.url).pathname);
    return urls;
  });
  test.info().annotations.push({ type: 'precache entries', description: String(cached.length) });
  // The content is cut into one chunk per shard plus the search index; every one must be in the offline copy.
  expect(LAZY_CHUNKS.length, 'lazy chunks in dist/assets').toBeGreaterThanOrEqual(16);
  expect(LAZY_CHUNKS.filter((f) => !cached.some((u) => u.endsWith(`/assets/${f}`))), 'lazy chunks missing from the offline copy').toEqual([]);

  await context.setOffline(true);
  await page.reload();
  await waitForScreen(page);
  await expect(page.locator('.app-status')).toContainText('Offline, ready');

  // Two taps to the jerking fix, with no signal.
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
  await page.getByRole('button', { name: /^Polisher jerks, walks, or hops side to side/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Read aloud' })).toBeVisible();

  // A lesson from the Academy outline.
  await page.goto('/academy');
  await waitForScreen(page);
  await page.getByRole('button', { name: /One full square, start to finish/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /One full square/ })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'The steps' })).toBeVisible();

  // A procedure, by deep link.
  await page.goto('/sops/sop-polish');
  await waitForScreen(page);
  await expect(page.getByRole('list', { name: 'The steps' })).toBeVisible();

  // An item page, by deep link.
  await page.goto('/items/equipment-bauer-56367');
  await waitForScreen(page);
  await expect(page.getByRole('heading', { level: 2, name: 'Related' })).toBeVisible();

  // Search, then Enter.
  await page.goto('/search');
  await waitForScreen(page);
  await page.getByRole('searchbox').first().fill('jerking');
  await expect(page.locator('.sr-results button').first()).toContainText('Polisher jerks');
  await page.getByRole('searchbox').first().press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();

  // A deep link to a fix opened cold with no signal.
  await page.goto('/fixit/fix-09');
  await waitForScreen(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Paint color on the pad: STOP' })).toBeVisible();

  // The other shards a page draws, cold, with no signal: a card, a product, a word, an outline lesson, the card list.
  for (const [path, h1] of [
    ['/cards/card-machine-settings', /./],
    ['/items/product-meguiars-m210', /M210/],
    ['/items/term-backing-plate', /backing plate/i],
    ['/academy/lesson-l6-01-tesla', /Tesla Model Y, what changes/],
    ['/cards', /Quick cards/i],
  ] as const) {
    await page.goto(path);
    await waitForScreen(page);
    await expect(page.locator('h1').first(), path).toHaveText(h1);
    await expect(page.getByText(/did not load/), path).toHaveCount(0);
  }
  await context.setOffline(false);
});

test('a search typed in the first second after an offline reload still answers (the index loads from the offline copy)', async ({ page, context }) => {
  await readyOffline(page);
  await context.setOffline(true);
  await page.goto('/fixit');
  const box = page.getByRole('searchbox').first();
  await box.fill('pad not spinning');
  await expect(page.locator('.sr-results button').first()).toContainText('Pad stops spinning', { timeout: 10_000 });
  await context.setOffline(false);
});

// DEF-27 (fix-before-deploy, app-engineer): on the first visit (and the first launch from the Home
// Screen icon, which has its own storage on iOS) the service worker saves the copy and the chip says
// "Ready offline", but it does not control the open page (clientsClaim false, prompt mode). With no
// reload, every lazy chunk the warm-up did not bring in (lessons, procedures, products, tools, words)
// goes to the network. On GitHub Pages the browser's own cache covers that for 10 minutes
// (max-age=600); vite preview sends no-cache, which is the same as after those 10 minutes. Try again
// then checks the app's address from the uncontrolled page, gets no answer, and says "no signal"
// forever, while the chip says "Offline, ready". A reload would be served by the saved copy.
test('DEF-27: "Ready offline", then airplane mode with no reload: the Academy, a lesson, the jerking fix, its procedure, and a word open', async ({ page, context }) => {
  test.fail(true, 'DEF-27: the page is not controlled by the service worker until a reload, so lazy chunks fail offline and Try again says "no signal"');
  test.setTimeout(60_000);
  await readyOffline(page);
  // The warm-up has brought in the index, the fixes, the cards, and the catalog.
  await expect
    .poll(async () => page.evaluate(() => performance.getEntriesByType('resource').filter((e) => /\/assets\/(search-index|content-(fixnode|quickcard|catalog))-/.test(e.name)).length), { timeout: 10_000 })
    .toBeGreaterThanOrEqual(4);
  test.info().annotations.push({ type: 'controlled before airplane mode', description: String(await page.evaluate(() => navigator.serviceWorker.controller !== null)) });
  await context.setOffline(true);
  await expect(page.locator('.app-status')).toContainText('Offline, ready');
  // In-app taps only, as a person does: no reload.
  await page.getByRole('button', { name: /^Academy/ }).click();
  const again = page.getByRole('button', { name: 'Try again' });
  if (await again.isVisible().catch(() => false)) await again.click();
  await expect(page.getByRole('button', { name: /One full square, start to finish/ })).toBeVisible({ timeout: 6_000 });
  await page.getByRole('button', { name: /One full square, start to finish/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /One full square/ })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
  await page.getByRole('button', { name: /^Polisher jerks, walks, or hops side to side/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
  // Its Related list: a procedure and a word, each a lazy piece the warm-up did not bring in.
  const related = page.getByRole('list', { name: 'Related' });
  await related.getByRole('button', { name: /^Machine polishing, one-step/ }).click();
  await expect(page.getByRole('list', { name: 'The steps' })).toBeVisible();
  await page.goBack();
  await page.getByRole('list', { name: 'Related' }).getByRole('button', { name: /^Long-throw/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Long-throw/ })).toBeVisible();
  await expect(page.getByText(/did not load/)).toHaveCount(0);
  await context.setOffline(false);
});
