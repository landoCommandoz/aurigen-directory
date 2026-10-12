/**
 * The first session offline (QA DEF-27, closed in Phase 2 pass 4; D1 amendment 2026-10-12), and a
 * saved copy that does not serve the page (QA DEF-29, closed in pass 5). Owner:
 * qa-adversary. Runs at the five widths, against both base paths: `/` (vite preview on 4173, the
 * Netlify shape) and `/aurigen-directory/` (vite preview on 4174, the GitHub Pages shape).
 *
 * Lando's own steps: the first visit (or the first launch from the Home Screen icon), wait for
 * "Ready offline", walk into the garage, airplane mode, and keep using the app without closing it.
 * vite preview sends Cache-Control: no-cache, so the browser's own cache never answers: every piece
 * that opens offline here was served by the saved copy. The fix: the first install takes the open
 * page (clientsClaim), "Ready offline" waits until it does, and Try again reloads into the saved copy
 * when a page is not served by it (src/core/pwa.ts, src/core/freshPage.ts).
 */
import { expect, test, type Page } from '@playwright/test';
import { PAGES_URL } from '../../playwright.config';
import { customerViewLeaks, makeShopPhone, turnCustomerViewOn, waitForScreen } from '../fixtures/app';

test.use({ serviceWorkers: 'allow' });

const BASES = [
  { name: 'root', url: '/' },
  { name: 'Pages', url: PAGES_URL },
] as const;

/** The lazy pieces the warm-up does not bring in: each must come from the saved copy in airplane mode. */
const NOT_WARMED = /\/assets\/content-(lesson|sop|product|equipment|glossaryterm)-/;

interface ChipMoment {
  text: string;
  controlled: boolean;
}

/** Record every change of the offline marker with whether a service worker served the page at that moment. */
async function recordMarker(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __qaChip: { text: string; controlled: boolean }[]; __qaControlledAtStart: boolean };
    w.__qaChip = [];
    w.__qaControlledAtStart = navigator.serviceWorker?.controller != null;
    const look = () => {
      const text = document.querySelector('.app-status')?.textContent?.trim() ?? '';
      const controlled = navigator.serviceWorker?.controller != null;
      const last = w.__qaChip[w.__qaChip.length - 1];
      if (text !== '' && (last === undefined || last.text !== text || last.controlled !== controlled)) w.__qaChip.push({ text, controlled });
    };
    new MutationObserver(look).observe(document, { subtree: true, childList: true, characterData: true });
    navigator.serviceWorker?.addEventListener('controllerchange', look);
  });
}

async function nothingFailed(page: Page, where: string): Promise<void> {
  await expect(page.getByText(/did not load/), where).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Try again' }), where).toHaveCount(0);
}

async function openRelated(page: Page, name: RegExp, h1: RegExp): Promise<void> {
  await page.getByRole('list', { name: 'Related' }).getByRole('button', { name }).click();
  await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible();
  await nothingFailed(page, String(name));
}

for (const base of BASES) {
  test(`DEF-27 at ${base.name}: first session, "Ready offline", airplane mode with no reload: a lesson, a product, a tool, a word, a procedure, and search open by tapping`, async ({ page, context }) => {
    test.setTimeout(75_000);
    await recordMarker(page);
    const offlineAssets: { url: string; fromServiceWorker: boolean }[] = [];
    const failed: string[] = [];
    let offline = false;
    page.on('response', (r) => {
      if (offline && r.url().includes('/assets/')) offlineAssets.push({ url: r.url(), fromServiceWorker: r.fromServiceWorker() });
    });
    page.on('requestfailed', (r) => {
      if (offline) failed.push(`${r.url()} ${r.failure()?.errorText ?? ''}`);
    });

    // The very first visit: no worker, no copy, no storage (a fresh browser context).
    await page.goto(base.url);
    await waitForScreen(page);
    expect(await page.evaluate(() => (window as unknown as { __qaControlledAtStart: boolean }).__qaControlledAtStart), 'no worker served the first page as it loaded').toBe(false);
    await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
    const controlled = await page.evaluate(() => navigator.serviceWorker.controller !== null);
    test.info().annotations.push({ type: 'controlled before airplane mode', description: String(controlled) });
    expect(controlled, '"Ready offline" means the saved copy serves this page').toBe(true);
    const fetchedBefore = await page.evaluate((re) => performance.getEntriesByType('resource').map((e) => e.name).filter((n) => new RegExp(re).test(n)), NOT_WARMED.source);
    expect(fetchedBefore, 'these pieces load for the first time in airplane mode').toEqual([]);

    await context.setOffline(true);
    offline = true;
    await expect(page.locator('.app-status')).toContainText('Offline, ready');

    // A lesson, by taps.
    await page.getByRole('button', { name: /^Academy/ }).click();
    await page.getByRole('button', { name: /One full square, start to finish/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: /One full square/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'The steps' })).toBeVisible();
    await nothingFailed(page, 'lesson');
    // A product, a tool, and a word from the lesson's Related list.
    await openRelated(page, /^Meguiar's M210 Ultra Pro Finishing Polish/, /M210/);
    await page.goBack();
    await openRelated(page, /^BAUER 20 mm long-throw DA polisher/, /BAUER/);
    await page.goBack();
    await openRelated(page, /^One-step polish/, /One-step polish/i);
    // A procedure, from the jerking fix's Related list.
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
    await page.getByRole('button', { name: /^Polisher jerks, walks, or hops side to side/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
    await page.getByRole('list', { name: 'Related' }).getByRole('button', { name: /^Machine polishing, one-step/ }).click();
    await expect(page.getByRole('list', { name: 'The steps' })).toBeVisible();
    await nothingFailed(page, 'procedure');
    // Search, then Enter.
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Search' }).click();
    await page.getByRole('searchbox').first().fill('jerking');
    await expect(page.locator('.sr-results button').first()).toContainText('Polisher jerks');
    await page.getByRole('searchbox').first().press('Enter');
    await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
    await nothingFailed(page, 'search');

    // Every piece came from the saved copy; nothing went to the network and failed.
    const lazy = offlineAssets.filter((a) => NOT_WARMED.test(a.url));
    expect(new Set(lazy.map((a) => a.url.replace(/^.*\/assets\/content-([a-z]+)-.*$/, '$1')))).toEqual(new Set(['lesson', 'product', 'equipment', 'glossaryterm', 'sop']));
    expect(offlineAssets.filter((a) => !a.fromServiceWorker).map((a) => a.url)).toEqual([]);
    expect(failed).toEqual([]);
    // The marker never said "Ready offline" while no worker served the page.
    const moments = await page.evaluate(() => (window as unknown as { __qaChip: ChipMoment[] }).__qaChip);
    expect(moments.filter((m) => /Ready offline|Offline, ready/.test(m.text) && !m.controlled)).toEqual([]);
    // Pass 5 (DEF-29's words): between the save and the claim the marker may read "Saved, reopen app" for a moment; it never stays.
    test.info().annotations.push({ type: 'marker log', description: moments.map((m) => `${m.text}${m.controlled ? ' [served]' : ''}`).join(' > ') });
    expect(moments.filter((m) => /Saving for offline|Saved, reopen app/.test(m.text) && moments.indexOf(m) > moments.findIndex((x) => x.text === 'Ready offline'))).toEqual([]);
    await context.setOffline(false);
  });
}

/** A reload that skips the saved copy (Shift + reload, Ctrl+Shift+R): the page is not served by it, though it is saved. */
async function hardReload(page: Page): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Page.reload', { ignoreCache: true });
  await page.waitForLoadState('load');
  await waitForScreen(page);
  await cdp.detach();
}

test('belt and braces: a page the saved copy does not serve heals with one Try again in airplane mode, by reloading into the copy', async ({ page, context }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await waitForScreen(page);
  await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
  await hardReload(page);
  expect(await page.evaluate(() => navigator.serviceWorker.controller), 'a hard reload is not served by the worker').toBeNull();
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.active?.state)).toBe('activated');
  await expect(page.locator('.app-status')).not.toContainText('Ready offline');
  await context.setOffline(true);
  await page.getByRole('button', { name: /^Academy/ }).click();
  await expect(page.getByText('This page did not load. Check the signal, then tap Try again.')).toBeVisible();
  const loads: string[] = [];
  page.on('load', () => loads.push(page.url()));
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: /One full square, start to finish/ })).toBeVisible({ timeout: 15_000 });
  expect(loads.length, 'one reload, into the saved copy').toBe(1);
  expect(new URL(page.url()).pathname).toBe('/academy');
  expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
  await expect(page.locator('.app-status')).toContainText('Offline, ready');
  await expect(page.getByText(/There is no signal right now/)).toHaveCount(0);
  await context.setOffline(false);
});

/** The top bar's height and whether the page scrolls sideways: the marker's words must never wrap the bar. */
async function topBar(page: Page): Promise<{ height: number; sideways: boolean }> {
  return page.evaluate(() => ({
    height: Math.round(document.querySelector('header.app-top')?.getBoundingClientRect().height ?? -1),
    sideways: document.documentElement.scrollWidth > window.innerWidth,
  }));
}

// DEF-29 (closed in pass 5), found in pass 4: with the copy saved but not serving this page
// (offlineCopy "savedNotServing": a hard reload; or a phone whose first launch is not taken over,
// the open phone check), the marker said "Saving for offline" for the whole session and, offline,
// the notice said "This phone has no offline copy of the app yet". The fix (src/app/status.ts,
// src/app/banners/): "Saved, reopen app" online, "Offline, saved" and "Offline copy saved" offline.
// This test holds the words, the bar (no wrap at any width, Shop density, the default), and the way
// out (Try again reloads into the copy, then the notice goes).
test('DEF-29: saved but not serving this page: the marker says saved, never saving or missing; offline the notice says the copy is saved; Try again heals and the notice goes', async ({ page, context }) => {
  test.setTimeout(60_000);
  await recordMarker(page);
  await page.goto('/');
  await waitForScreen(page);
  await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
  const readyBar = await topBar(page);
  await hardReload(page);
  expect(await page.evaluate(() => navigator.serviceWorker.controller), 'a hard reload is not served by the worker').toBeNull();
  await page.waitForTimeout(5_000);
  await expect(page.locator('.app-status')).toHaveText('Saved, reopen app');
  await expect(page.locator('.app-status')).toHaveAttribute('data-tone', 'neutral');
  const moments = await page.evaluate(() => (window as unknown as { __qaChip: ChipMoment[] }).__qaChip);
  expect(moments.map((m) => m.text), 'after the hard reload the marker never says it is still saving').not.toContain('Saving for offline');
  expect(await topBar(page), 'the marker never wraps the top bar').toEqual(readyBar);

  await context.setOffline(true);
  await expect(page.locator('.app-status')).toHaveText('Offline, saved');
  const notice = page.locator('.ui-banner').filter({ hasText: 'Offline copy saved' });
  await expect(notice).toContainText('The offline copy of the app is saved on this phone. If a page does not open, tap Try again and it opens from the saved copy.');
  await expect(page.getByText(/no offline copy of the app yet|not saved yet/)).toHaveCount(0);
  expect((await topBar(page)).height, 'offline words never wrap the top bar').toBe(readyBar.height);
  expect((await topBar(page)).sideways).toBe(false);

  // What the notice promises: a page that does not open heals with Try again, from the saved copy.
  await page.getByRole('button', { name: /^Academy/ }).click();
  await expect(page.getByText('This page did not load. Check the signal, then tap Try again.')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: /One full square, start to finish/ })).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.app-status')).toHaveText('Offline, ready');
  await expect(notice).toHaveCount(0);
  await context.setOffline(false);
  await expect(page.locator('.app-status')).toHaveText('Ready offline');
});

test('DEF-29 in Customer View: a saved copy that does not serve the page shows no marker and no notice, online or offline', async ({ page, context }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await waitForScreen(page);
  await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
  await makeShopPhone(page, { backup: false });
  await turnCustomerViewOn(page);
  await hardReload(page);
  expect(await page.evaluate(() => navigator.serviceWorker.controller)).toBeNull();
  await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
  await page.waitForTimeout(2_000);
  await expect(page.locator('.app-status')).toHaveCount(0);
  await expect(page.locator('.ui-banner')).toHaveCount(0);
  expect(await customerViewLeaks(page)).toEqual([]);
  await context.setOffline(true);
  await page.waitForTimeout(1_000);
  await expect(page.locator('.app-status')).toHaveCount(0);
  await expect(page.locator('.ui-banner')).toHaveCount(0);
  await expect(page.getByText(/offline copy|Try again|Offline/)).toHaveCount(0);
  expect(await customerViewLeaks(page)).toEqual([]);
  await context.setOffline(false);
});
