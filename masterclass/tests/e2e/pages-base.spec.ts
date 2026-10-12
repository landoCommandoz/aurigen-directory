/**
 * The GitHub Pages build (D9, BLUEPRINT 10.3): the same app under /aurigen-directory/, the link
 * Lando installs from for Phases 1 to 6. Runs in the pages375 project only; baseURL ends with the
 * base path, so every goto below is relative ("cards", not "/cards").
 */
import { expect, test } from '@playwright/test';
import { expectNoProblems, settleAborted, waitForScreen, watchProblems } from '../fixtures/app';

test.use({ serviceWorkers: 'allow' });

const BASE = '/aurigen-directory/';

async function offlineReady(page: import('@playwright/test').Page): Promise<string> {
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 15_000 });
  return scope;
}

test('every asset and the service worker live under the base path; the app installs and works offline there', async ({ page, context }) => {
  const problems = watchProblems(page);
  await page.goto('./');
  await waitForScreen(page);
  const scope = await offlineReady(page);
  expect(new URL(scope).pathname).toBe(BASE);
  const manifest = await page.evaluate(() => document.querySelector('link[rel="manifest"]')?.getAttribute('href'));
  expect(manifest?.startsWith(BASE)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await waitForScreen(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
  await page.goto('cards');
  await page.getByRole('button', { name: /^Clay tub lube mix/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Clay tub lube mix' })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(`${BASE}cards/card-clay-tub`);
  await context.setOffline(false);
  expectNoProblems(problems);
});

// Pass 4: run 2 of the full suite failed the test above once, on a GET of the search-index chunk
// ending in net::ERR_ABORTED. The cause is the test's own page.goto landing while the idle search
// preload (src/main.tsx) was still in flight: the browser cancels it and the next page loads it
// again. This makes that moment happen on purpose: the person's next screen must still search,
// offline, with no error. expectNoProblems (settleAborted) sets the cancelled request aside.
test('a full reload while the search index is still loading, offline: no error, and the next screen searches', async ({ page, context }) => {
  const problems = watchProblems(page);
  await page.goto('./');
  await waitForScreen(page);
  await offlineReady(page);
  await context.setOffline(true);
  const preload = page.waitForRequest((request) => request.url().includes('/assets/search-index-'));
  await page.reload({ waitUntil: 'commit' });
  await preload;
  await page.goto('search');
  await waitForScreen(page);
  await page.getByRole('searchbox', { name: 'Search' }).fill('bucket');
  await expect(page.getByRole('button', { name: /^Pre-polish wash bucket mix/ }).first()).toBeVisible();
  await context.setOffline(false);
  settleAborted(problems);
  test.info().annotations.push({ type: 'requests cancelled by the reload', description: problems.superseded.join('; ') || 'none' });
  expectNoProblems(problems);
});

test('a Pages deep link (?p=) lands on the screen under the base path', async ({ page }) => {
  await page.goto('./?p=%2Fcards%2Fcard-bucket-mix');
  await expect(page.getByRole('heading', { level: 1, name: 'Pre-polish wash bucket mix' })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(`${BASE}cards/card-bucket-mix`);
});

// DEF-09 (blocks-gate): the router basename is "/aurigen-directory" (no trailing slash), so the Home
// link in the top bar and the bottom row's Home targets "/aurigen-directory". That address is outside
// the service worker's scope "/aurigen-directory/". Any reload there with no signal (the app's own
// Reload button, iOS reloading a backgrounded web app, a reload in a Safari tab) shows the browser's
// offline error page instead of the app: a dead end in the garage.
test('after tapping Home, a reload with no signal still opens the app', async ({ page, context }) => {
  await page.goto('cards');
  await waitForScreen(page);
  await offlineReady(page);
  await page.reload();
  await waitForScreen(page);
  await page.getByRole('banner').getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
  test.info().annotations.push({ type: 'address after Home', description: new URL(page.url()).pathname });
  await context.setOffline(true);
  await page.reload().catch(() => undefined);
  await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible({ timeout: 5000 });
  await context.setOffline(false);
});

// DEF-09 again: the Home link is the one outside the scope.
test('every in-app link stays inside the service worker scope', async ({ page }) => {
  await page.goto('./');
  await waitForScreen(page);
  const outside = await page.evaluate(
    (base) => Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href') ?? '').filter((href) => !href.startsWith(base)),
    BASE,
  );
  expect(outside).toEqual([]);
});

// Pass 2 recheck of DEF-09: every screen, not only Home, and the back button.
test('every link on every screen stays inside the service worker scope', async ({ page }) => {
  const outside: string[] = [];
  for (const path of ['./', 'fixit', 'cards', 'cards/card-bucket-mix', 'search', 'settings', 'settings/backup', 'settings/device', 'academy', 'job', 'business', 'no-such-route']) {
    await page.goto(path);
    await waitForScreen(page);
    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      if (!href.startsWith(BASE)) outside.push(`${path}: ${href}`);
    }
  }
  expect(outside).toEqual([]);
});

test('a back step onto the bare base address gets its slash back, and a reload there with no signal opens the app', async ({ page, context }) => {
  await page.goto('./');
  await waitForScreen(page);
  await offlineReady(page);
  await page.reload();
  await waitForScreen(page);
  // An entry in this page's history without the slash (a link followed from outside, or the pass 1
  // build's Home link), then an in-app step forward and the Back button: a same-page back step,
  // which is what watchBaseSlash() handles. (A back step that loads a new page goes to the server,
  // which on GitHub Pages redirects the bare base to the slash.)
  await page.evaluate(() => window.history.pushState(null, '', '/aurigen-directory'));
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Quick cards' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Quick cards' })).toBeVisible();
  await page.goBack();
  await expect.poll(() => new URL(page.url()).pathname).toBe(BASE);
  await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
  await context.setOffline(true);
  await page.reload().catch(() => undefined);
  await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible({ timeout: 5000 });
  await context.setOffline(false);
});

// Phase 2: the fix, lesson, procedure, and item pages under the base path. A Pages deep link, a
// Related tap, a search Enter, and a reload with no signal all stay under /aurigen-directory/.
test('Phase 2 pages under the base path: deep link, Related tap, search, and an offline reload', async ({ page, context }) => {
  const problems = watchProblems(page);
  await page.goto('./');
  await waitForScreen(page);
  await offlineReady(page);
  await page.goto('./?p=%2Ffixit%2Ffix-01');
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(`${BASE}fixit/fix-01`);
  await page.getByRole('list', { name: 'Related' }).locator('button').first().click();
  await waitForScreen(page);
  expect(new URL(page.url()).pathname.startsWith(`${BASE}`)).toBe(true);
  for (const path of ['academy/lesson-l4-07-full-square', 'sops/sop-polish', 'items/equipment-bauer-56367', 'fixit/fix-09']) {
    await page.goto(path);
    await waitForScreen(page);
    expect(await page.locator('h1').first().innerText(), path).not.toMatch(/not found|No screen here/i);
  }
  await page.goto('search');
  await page.getByRole('searchbox').first().fill('jerking');
  await page.getByRole('searchbox').first().press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(`${BASE}fixit/fix-01`);
  await context.setOffline(true);
  await page.reload().catch(() => undefined);
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible({ timeout: 5000 });
  await context.setOffline(false);
  expectNoProblems(problems);
});
