/**
 * Updates (BLUEPRINT 3.5; D1 and its 2026-10-12 amendment: prompt mode, clientsClaim true,
 * skipWaiting false). Owner: qa-adversary. Phase 2 pass 4, written to attack DEF-27's fix: now that
 * the first install takes the open page, a new version must still never take over a running page
 * until "Update now" is tapped, and never while a job stage runs.
 *
 * Each test serves the first version from its own host (tests/fixtures/site.ts), opens it, waits for
 * "Ready offline", then deploys the second version (the same app with another version number, built
 * by tests/fixtures/second-version-build.ts) and comes back to the app, which is when the app checks
 * for an update (src/core/pwa.ts). The measures and the job hooks are in tests/fixtures/update.ts.
 * There is no Job Runner until Phase 3, so a test writes the job row the way an imported backup
 * would, then reloads so the screen reads it. Pass 5: DEF-30 flipped to two normal tests.
 */
import { expect, test } from '@playwright/test';
import { readStore, waitForScreen } from '../fixtures/app';
import { qaJob } from '../fixtures/jobs';
import { startSite, VERSIONS, type Site, type SiteName } from '../fixtures/site';
import {
  keepWorking,
  markDocument,
  notTakenOver,
  openFirstVersion,
  personReturns,
  putJob,
  setCustomerView,
  swState,
  tapUpdateNow,
  updateBanner,
  waitForWaitingUpdate,
} from '../fixtures/update';

test.use({ serviceWorkers: 'allow' });

for (const name of ['root', 'pages'] as const satisfies readonly SiteName[]) {
  const versions = VERSIONS[name];

  test.describe(`updates at ${versions.base}`, () => {
    let site: Site;
    test.beforeEach(async () => {
      site = await startSite(versions.base, versions.v1);
    });
    test.afterEach(async () => {
      await site.close();
    });

    test('a new version waits: the banner shows, nothing takes over until Update now (not with time, taps, Later, or a reload); a double tap on Update now reloads once into it', async ({ page, context }) => {
      test.setTimeout(90_000);
      const first = await openFirstVersion(page, site);
      site.serve(versions.v2);
      await personReturns(page);
      await expect(updateBanner(page)).toBeVisible({ timeout: 20_000 });
      await expect(updateBanner(page)).toContainText('It installs only when you tap Update now, never during a job.');
      await notTakenOver(page, first, 'banner shown');

      await page.waitForTimeout(3_000);
      await keepWorking(page);
      await expect(updateBanner(page)).toBeVisible();
      await notTakenOver(page, first, 'after 3 s and four taps');

      await updateBanner(page).getByRole('button', { name: 'Later' }).click();
      await expect(updateBanner(page)).toHaveCount(0);
      await notTakenOver(page, first, 'after Later');

      // A reload is served by the worker in charge, the first version; the waiting one stays waiting.
      await page.reload();
      await waitForScreen(page);
      await markDocument(page);
      await expect(updateBanner(page)).toBeVisible({ timeout: 10_000 });
      await notTakenOver(page, first, 'after a reload');

      const loads = await tapUpdateNow(page, first, { double: true });
      await page.waitForTimeout(2_000);
      expect(loads, 'a double tap reloads once').toBe(1);
      // The second version's copy works offline, and the first version's code is gone from it.
      const cached = await page.evaluate(async () => {
        const urls: string[] = [];
        for (const key of await caches.keys()) for (const r of await (await caches.open(key)).keys()) urls.push(new URL(r.url).pathname);
        return urls;
      });
      expect(cached, 'the first version\'s app code left the offline copy').not.toContain(first);
      expect(cached, 'the second version\'s app code is in it').toContain((await swState(page)).appScript);
      await context.setOffline(true);
      await keepWorking(page);
      await context.setOffline(false);
    });

    // DEF-30 (closed in pass 5), found in pass 4: in the first session (no worker served the page as
    // it loaded, so workbox-window's isUpdate stays false and the plugin never calls onNeedReload),
    // Update now installed the new version and took the page, but nothing reloaded: "Installing the
    // update" stayed. The fix (src/core/pwa.ts): one worker replacing another on controllerchange
    // marks the reload pending, and the quiet-moment guard decides when. The rest of the first
    // session's update cases (a stage, Customer View, two tabs) are in phase2-update-first-session.spec.ts.
    test('DEF-30: first session, an update found while the app is open: Update now reloads once into the new version', async ({ page }) => {
      test.setTimeout(60_000);
      const first = await openFirstVersion(page, site);
      site.serve(versions.v2);
      await personReturns(page);
      await expect(updateBanner(page)).toBeVisible({ timeout: 20_000 });
      await notTakenOver(page, first, 'banner shown');
      const loads = await tapUpdateNow(page, first);
      await page.waitForTimeout(2_000);
      expect(loads, 'one reload').toBe(1);
    });

    test('DEF-30: first session, a double tap on Update now reloads exactly once, and the new version works offline', async ({ page, context }) => {
      test.setTimeout(60_000);
      const first = await openFirstVersion(page, site);
      site.serve(versions.v2);
      await personReturns(page);
      await expect(updateBanner(page)).toBeVisible({ timeout: 20_000 });
      const loads = await tapUpdateNow(page, first, { double: true });
      await page.waitForTimeout(2_000);
      expect(loads, 'a double tap reloads once').toBe(1);
      await context.setOffline(true);
      await keepWorking(page);
      await context.setOffline(false);
    });

    test('a running job stage: the update downloads but no banner shows and nothing takes over; paused, the banner shows and Update now installs it; the job is untouched', async ({ page }) => {
      test.setTimeout(90_000);
      await openFirstVersion(page, site);
      const job = qaJob('inProgress');
      await putJob(page, job);
      await page.reload();
      await waitForScreen(page);
      await markDocument(page);
      const first = (await swState(page)).appScript ?? '';

      site.serve(versions.v2);
      await personReturns(page);
      await waitForWaitingUpdate(page);
      await page.waitForTimeout(2_500);
      await expect(updateBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Update now' })).toHaveCount(0);
      await notTakenOver(page, first, 'job running, update waiting');
      await keepWorking(page);
      await notTakenOver(page, first, 'job running, after taps');

      // The stage is paused (the row an imported backup or the Phase 3 Job Runner writes); the screen reads it on the next load.
      const paused = { ...job, pausedAt: new Date().toISOString() };
      await putJob(page, paused);
      await page.reload();
      await waitForScreen(page);
      await markDocument(page);
      await expect(updateBanner(page)).toBeVisible({ timeout: 10_000 });
      await notTakenOver(page, first, 'job paused, banner shown');
      await tapUpdateNow(page, first);
      expect(await readStore(page, 'jobs')).toEqual([paused]);
    });
  });
}

test.describe('updates: the guard behind the banner (root)', () => {
  let site: Site;
  test.beforeEach(async () => {
    site = await startSite(VERSIONS.root.base, VERSIONS.root.v1);
  });
  test.afterEach(async () => {
    await site.close();
  });

  test('a later launch: a stage starts after the banner showed, Update now is refused in words and nothing takes over; paused, Update now reloads once into the new version', async ({ page }) => {
    test.setTimeout(90_000);
    await openFirstVersion(page, site);
    // A later launch: the saved copy serves the page from the start (the case DEF-30 does not touch).
    await page.reload();
    await waitForScreen(page);
    await markDocument(page);
    const first = (await swState(page)).appScript ?? '';
    site.serve(VERSIONS.root.v2);
    await personReturns(page);
    await expect(updateBanner(page)).toBeVisible({ timeout: 20_000 });
    // The banner was drawn before the stage started (another tab, or an import); the tap must still be refused.
    const job = qaJob('inProgress');
    await putJob(page, job);
    await updateBanner(page).getByRole('button', { name: 'Update now' }).click();
    await expect(updateBanner(page)).toContainText('A stage is running. The update waits until the job is paused or done.');
    await page.waitForTimeout(3_000);
    await notTakenOver(page, first, 'refused');
    await putJob(page, { ...job, pausedAt: new Date().toISOString() });
    await tapUpdateNow(page, first);
  });

  test('Customer View on when the update arrives: no notice at all, nothing takes over; off again, the banner shows', async ({ page }) => {
    test.setTimeout(90_000);
    await openFirstVersion(page, site);
    await setCustomerView(page, true);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
    await markDocument(page);
    const first = (await swState(page)).appScript ?? '';
    site.serve(VERSIONS.root.v2);
    await personReturns(page);
    await waitForWaitingUpdate(page);
    await page.waitForTimeout(2_500);
    await expect(page.locator('.ui-banner')).toHaveCount(0);
    await expect(page.getByText(/Update ready|Update now|new version/i)).toHaveCount(0);
    await notTakenOver(page, first, 'Customer View on');
    await setCustomerView(page, false);
    await page.reload();
    await waitForScreen(page);
    await markDocument(page);
    await expect(updateBanner(page)).toBeVisible({ timeout: 10_000 });
    await notTakenOver(page, first, 'Customer View off');
  });
});
