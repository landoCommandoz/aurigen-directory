/**
 * Updates in the first session (QA DEF-30, closed in Phase 2 pass 5). Owner: qa-adversary.
 *
 * A first session is a page no service worker served as it loaded: the first visit to the link, or
 * the first launch from the Home Screen icon. workbox-window reports isUpdate false for the whole of
 * it, so the plugin never calls onNeedReload; since pass 5 the app reloads when one worker replaces
 * another on controllerchange (src/core/pwa.ts), and the quiet-moment guard still decides when.
 * These tests attack that new path: a takeover the page did not ask for (another tab's Update now)
 * while a stage runs or Customer View is on, two first-session tabs, and a page the saved copy
 * does not serve (a hard reload) when a new version arrives. Helpers: tests/fixtures/update.ts.
 */
import { expect, test, type Page } from '@playwright/test';
import { readStore, tapNewPin, waitForScreen } from '../fixtures/app';
import { qaJob } from '../fixtures/jobs';
import { startSite, VERSIONS, type Site, type SiteName } from '../fixtures/site';
import {
  countLoads,
  expectSecondVersion,
  installingBanner,
  keepWorking,
  markDocument,
  notTakenOver,
  openFirstVersion,
  personReturns,
  putJob,
  skipWaitingFromOutside,
  swState,
  updateBanner,
  waitForWaitingUpdate,
} from '../fixtures/update';

test.use({ serviceWorkers: 'allow' });

/** Taken by the new worker, and still the same document running the first version's code. */
async function takenNotReloaded(page: Page, firstScript: string, where: string): Promise<void> {
  expect(await swState(page), where).toMatchObject({ controlled: true, waiting: false, sameDocument: true, controllerChanges: 1, appScript: firstScript });
}

async function tapMain(page: Page, name: string): Promise<void> {
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name, exact: true }).click();
}

for (const name of ['root', 'pages'] as const satisfies readonly SiteName[]) {
  const versions = VERSIONS[name];

  test.describe(`first session at ${versions.base}`, () => {
    let site: Site;
    test.beforeEach(async () => {
      site = await startSite(versions.base, versions.v1);
    });
    test.afterEach(async () => {
      await site.close();
    });

    test('a stage running here: Update now is refused in words; another tab hands the page to the new version: no reload while the stage runs, through taps; paused, the next tap reloads once into it; the job row is untouched', async ({ page }) => {
      test.setTimeout(90_000);
      const first = await openFirstVersion(page, site);
      const loads = countLoads(page);
      const job = qaJob('inProgress');
      await putJob(page, job);
      site.serve(versions.v2);
      await personReturns(page);
      await waitForWaitingUpdate(page);
      // This screen read the jobs at load, before the stage started, so it may still draw the banner; the tap must be refused.
      if (await updateBanner(page).isVisible()) {
        await updateBanner(page).getByRole('button', { name: 'Update now' }).click();
        await expect(updateBanner(page)).toContainText('A stage is running. The update waits until the job is paused or done.');
        await page.waitForTimeout(1_500);
        await notTakenOver(page, first, 'Update now refused');
      }

      await skipWaitingFromOutside(page);
      await expect.poll(async () => (await swState(page)).controllerChanges, { timeout: 15_000, message: 'the new worker takes the page' }).toBe(1);
      await page.waitForTimeout(3_000);
      await takenNotReloaded(page, first, 'a stage is running');
      await keepWorking(page);
      await tapMain(page, 'Quick cards');
      await waitForScreen(page);
      await takenNotReloaded(page, first, 'a stage is running, after taps');
      await expect(installingBanner(page)).toHaveCount(0);
      expect(loads(), 'no reload while the stage runs').toBe(0);

      const paused = { ...job, pausedAt: new Date().toISOString() };
      await putJob(page, paused);
      await page.waitForTimeout(1_000);
      expect(loads(), 'pausing alone is not a navigation').toBe(0);
      await tapMain(page, 'Fix It');
      await expect.poll(loads, { timeout: 15_000, message: 'the next tap reloads into the new version' }).toBe(1);
      await expectSecondVersion(page, first);
      await page.waitForTimeout(1_500);
      expect(loads(), 'exactly one reload').toBe(1);
      expect(await readStore(page, 'jobs')).toEqual([paused]);
    });
  });
}

test.describe('first session (root)', () => {
  let site: Site;
  test.beforeEach(async () => {
    site = await startSite(VERSIONS.root.base, VERSIONS.root.v1);
  });
  test.afterEach(async () => {
    await site.close();
  });

  test('Customer View on: no notice at all, and another tab handing the page to the new version never reloads it in front of the customer; off, the next tap reloads once', async ({ page }) => {
    test.setTimeout(120_000);
    // The whole session is one document: the first visit opens the Device screen, and every later step is a tap.
    await page.goto(`${site.url}settings/device`);
    await waitForScreen(page);
    await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
    await markDocument(page);
    await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
    await page.getByLabel('Type zero to confirm').fill('zero');
    await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
    await tapNewPin(page);
    await expect(page.getByText(/This is now the shop phone\./)).toBeVisible();
    await page.locator('header.app-top').getByRole('link', { name: 'Home', exact: true }).click();
    await waitForScreen(page);
    await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
    const first = (await swState(page)).appScript ?? '';
    expect((await swState(page)).sameDocument, 'still the first document').toBe(true);
    const loads = countLoads(page);

    site.serve(VERSIONS.root.v2);
    await personReturns(page);
    await waitForWaitingUpdate(page);
    await skipWaitingFromOutside(page);
    await expect.poll(async () => (await swState(page)).controllerChanges, { timeout: 15_000 }).toBe(1);
    await page.waitForTimeout(3_000);
    await takenNotReloaded(page, first, 'Customer View on');
    await expect(page.locator('.ui-banner')).toHaveCount(0);
    await expect(page.getByText(/Update ready|Update now|Installing|new version/i)).toHaveCount(0);
    expect(loads(), 'nothing reloads in front of the customer').toBe(0);

    await page.getByRole('button', { name: 'Exit Customer View' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
    await tapMain(page, 'Fix It');
    await expect.poll(loads, { timeout: 15_000, message: 'the next tap after Customer View reloads into the new version' }).toBe(1);
    await expectSecondVersion(page, first);
  });

  test('two tabs, both in their first session: Update now in one reloads both, each exactly once, into the new version', async ({ context }) => {
    test.setTimeout(90_000);
    const a = await context.newPage();
    const b = await context.newPage();
    // Both open before any worker exists, so neither was served by one as it loaded.
    await Promise.all([a.goto(site.url), b.goto(`${site.url}fixit`)]);
    for (const page of [a, b]) {
      await waitForScreen(page);
      await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
      await markDocument(page);
    }
    const first = (await swState(a)).appScript ?? '';
    const loadsA = countLoads(a);
    const loadsB = countLoads(b);
    site.serve(VERSIONS.root.v2);
    await personReturns(a);
    await expect(updateBanner(a)).toBeVisible({ timeout: 20_000 });
    await notTakenOver(b, first, 'tab B before Update now');
    await updateBanner(a).getByRole('button', { name: 'Update now' }).click();
    await expect.poll(loadsA, { timeout: 20_000, message: 'tab A reloads' }).toBe(1);
    await expect.poll(loadsB, { timeout: 20_000, message: 'tab B reloads' }).toBe(1);
    await expectSecondVersion(a, first);
    await expectSecondVersion(b, first);
    await a.waitForTimeout(2_000);
    expect([loadsA(), loadsB()], 'each tab reloads exactly once').toEqual([1, 1]);
  });

  // Pass 4 "also seen": a page the saved copy does not serve (Shift + reload on the PC) has no client
  // of the old worker to wait for, so a new version activates at once and takes it, and no reload
  // follows (the takeover is a first claim for this page). Not a dead end: no notice waits on
  // anything, the marker tells the truth, and the next launch runs the new version and says so.
  test('a page the saved copy does not serve (hard reload) when a new version arrives: no Update ready with nothing to install, never stuck on Installing, and the next launch runs the new version', async ({ page }) => {
    test.setTimeout(90_000);
    await openFirstVersion(page, site);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Page.reload', { ignoreCache: true });
    await page.waitForLoadState('load');
    await cdp.detach();
    await waitForScreen(page);
    await markDocument(page);
    const before = await swState(page);
    expect(before.controlled, 'a hard reload is not served by the worker').toBe(false);
    await expect(page.locator('.app-status')).toContainText('Saved, reopen app');
    const first = before.appScript ?? '';

    site.serve(VERSIONS.root.v2);
    await personReturns(page);
    // No page is served by the first version, so the second has nothing to wait for and takes this page at once.
    await expect.poll(async () => (await swState(page)).controlled, { timeout: 20_000, message: 'the new worker takes the page' }).toBe(true);
    await page.waitForTimeout(2_500);
    await expect(updateBanner(page), 'no Update now for a version that already took the page').toHaveCount(0);
    await expect(installingBanner(page)).toHaveCount(0);
    await expect(page.locator('.app-status')).toContainText('Ready offline');
    await keepWorking(page);
    await expect(installingBanner(page)).toHaveCount(0);
    // The next launch (a normal reload) runs the new version and says so.
    await page.reload();
    await expectSecondVersion(page, first);
  });
});
