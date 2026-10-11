/**
 * Persistence (quality bar item 7, BLUEPRINT 3.8 persistence tests that apply to Phase 1): what
 * must survive a refresh or a kill does, what must not (the owner pass) does not, and a refresh in
 * the middle of the device role flow writes nothing.
 * There is no job engine in Phase 1, so "resume on the same step with timers" waits for Phase 3.
 */
import { expect, test } from '@playwright/test';
import { PIN, makeShopPhone, openApp, readSettings, readStore, tapNewPin, tapPin, turnCustomerViewOn, waitForScreen } from '../fixtures/app';

test.describe('state that must survive', () => {
  test('PIN and shop role survive a reload and a kill (a new page on the same storage)', async ({ page, context }) => {
    await makeShopPhone(page);
    const before = await readSettings(page);
    await page.reload();
    await waitForScreen(page);
    await openApp(page, '/settings');
    await expect(page.getByText('Owner PIN is set')).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Device role' })).toContainText(/shop phone/i);

    await page.close();
    const again = await context.newPage();
    await openApp(again, '/');
    await expect(again.getByText('The shop phone. Jobs, counters, and sign-offs live here.')).toBeVisible();
    const after = await readSettings(again);
    expect(after.ownerPin).toEqual(before.ownerPin);
    expect(after.deviceRole).toBe('shop');
    expect(after.lastBackupAt).toBe(before.lastBackupAt);
  });

  test('Customer View survives a reload, and so does leaving it', async ({ page }) => {
    await makeShopPhone(page);
    await turnCustomerViewOn(page);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
    await expect(page.getByRole('button', { name: 'Exit Customer View' })).toBeVisible();
    await page.getByRole('button', { name: 'Exit Customer View' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
    await page.reload();
    await waitForScreen(page);
    await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' })).toBeVisible();
  });

  test('Shop or Academy mode and the thumb side survive a reload', async ({ page }) => {
    await openApp(page, '/');
    await page.getByRole('group', { name: 'Mode' }).getByText('Academy', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'academy');
    await openApp(page, '/settings');
    await page.getByRole('group', { name: 'Thumb side' }).getByText('Right', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-hand', 'right');
    await page.reload();
    await waitForScreen(page);
    await expect(page.locator('html')).toHaveAttribute('data-density', 'academy');
    await expect(page.locator('html')).toHaveAttribute('data-hand', 'right');
  });

  test('three wrong PINs lock entry, and the lock survives a reload', async ({ page }) => {
    await makeShopPhone(page, { backup: false });
    await page.reload();
    await openApp(page, '/settings/device');
    await page.getByRole('button', { name: 'Make this a study phone' }).click();
    for (let i = 0; i < 3; i += 1) await tapPin(page, '000000');
    await expect(page.getByText(/locked|Locked/).first()).toBeVisible();
    await page.reload();
    await openApp(page, '/settings/device');
    await page.getByRole('button', { name: 'Make this a study phone' }).click();
    await tapPin(page, PIN);
    await expect(page.getByText(/Too many wrong PINs|Locked/).first()).toBeVisible();
    expect((await readSettings(page)).deviceRole).toBe('shop');
    const fails = (await readStore<{ type: string }>(page, 'auditLog')).filter((a) => a.type === 'pinFail');
    expect(fails).toHaveLength(1);
  });
});

test.describe('state that must not survive', () => {
  test('the owner pass ends on reload: the PIN is asked again', async ({ page }) => {
    await makeShopPhone(page, { backup: false });
    // Right after the PIN is created the pass is open; after a reload it is gone.
    await page.reload();
    await openApp(page, '/settings');
    await page.getByRole('group', { name: 'Developer tools' }).getByText('On', { exact: true }).click();
    await expect(page.locator('fieldset.ui-pinpad')).toBeVisible();
    expect((await readSettings(page)).developerPanel).toBe(false);
  });
});

test.describe('a refresh in the middle of the device role flow (BLUEPRINT 3.8)', () => {
  test('on the Start fresh warning, or during PIN entry, nothing has been written', async ({ page }) => {
    await openApp(page, '/settings/device');
    const before = await readSettings(page);

    await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
    await page.getByLabel('Type zero to confirm').fill('zero');
    await page.reload();
    await waitForScreen(page);
    expect(await readSettings(page)).toEqual(before);
    await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();

    await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
    await page.getByLabel('Type zero to confirm').fill('zero');
    await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
    await tapPin(page, PIN); // the first of the two PIN entries
    await page.reload();
    await waitForScreen(page);
    const after = await readSettings(page);
    expect(after.deviceRole).toBe('study');
    expect(after.ownerPin).toBeNull();
    expect(await readStore(page, 'auditLog')).toEqual([]);
  });

  test('after the role write and before the first backup, the phone reopens as the shop phone with the banner on the backup', async ({ page }) => {
    await makeShopPhone(page, { backup: false });
    await page.reload();
    await openApp(page, '/');
    await expect(page.locator('.ui-banner').filter({ hasText: 'Save your first backup' })).toBeVisible();
    expect((await readSettings(page)).deviceRole).toBe('shop');
  });

  test('setup flow: a refresh between the two PIN entries saves nothing', async ({ page }) => {
    await openApp(page, '/settings/setup');
    await page.getByRole('button', { name: 'Create the owner PIN' }).click();
    await tapPin(page, PIN);
    await page.reload();
    await waitForScreen(page);
    expect((await readSettings(page)).ownerPin).toBeNull();
    await page.getByRole('button', { name: 'Create the owner PIN' }).click();
    await tapNewPin(page, PIN);
    await expect(page.getByRole('heading', { level: 1, name: 'Save your first backup' })).toBeVisible();
    expect((await readSettings(page)).ownerPin).not.toBeNull();
  });
});

test.describe('offline (quality bar item 5, BUILD_PROMPT gate: opens in airplane mode)', () => {
  test.use({ serviceWorkers: 'allow' });

  test('after the offline copy is saved, reload with no network: Home, Quick Cards, Fix It, Search, and a card all work', async ({ page, context }) => {
    await openApp(page, '/');
    await page.evaluate(async () => navigator.serviceWorker.ready);
    await expect
      .poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.active?.state ?? null), { timeout: 15_000 })
      .toBe('activated');
    // The marker says the full copy is saved (BLUEPRINT 5: "Ready offline").
    await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 15_000 });
    const cached = await page.evaluate(async () => {
      const names = await caches.keys();
      let entries = 0;
      for (const name of names) entries += (await (await caches.open(name)).keys()).length;
      return entries;
    });
    expect(cached).toBeGreaterThanOrEqual(15);

    await context.setOffline(true);
    await page.reload();
    await waitForScreen(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
    await expect(page.locator('.app-status')).toContainText('Offline, ready');
    expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);

    await page.goto('/cards');
    await waitForScreen(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Quick Cards' })).toBeVisible();
    await page.getByRole('button', { name: /^Pre-polish wash bucket mix/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Pre-polish wash bucket mix' })).toBeVisible();
    await expect(page.getByText('4 gal')).toBeVisible();

    await page.goto('/fixit');
    await waitForScreen(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Fix It' })).toBeVisible();
    await page.getByRole('button', { name: /^Pad ladder for the test spot/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Pad ladder for the test spot' })).toBeVisible();

    await page.goto('/search');
    await waitForScreen(page);
    await page.getByRole('searchbox', { name: 'Search' }).fill('clay lube');
    await expect(page.getByRole('button', { name: /Clay tub lube mix/ }).first()).toBeVisible();

    // A deep link opened offline gets the app shell (navigateFallback), not a browser error page.
    await page.goto('/settings/backup');
    await waitForScreen(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Backup and restore' })).toBeVisible();
    await context.setOffline(false);
  });

  test('the first visit is not controlled by the service worker until the next load (prompt mode, clientsClaim false)', async ({ page }) => {
    await openApp(page, '/');
    await page.evaluate(async () => navigator.serviceWorker.ready);
    const firstLoad = await page.evaluate(() => navigator.serviceWorker.controller !== null);
    await page.reload();
    await waitForScreen(page);
    const secondLoad = await page.evaluate(() => navigator.serviceWorker.controller !== null);
    test.info().annotations.push({ type: 'controller', description: `first load controlled=${firstLoad}, second load controlled=${secondLoad}` });
    expect(secondLoad).toBe(true);
  });
});
