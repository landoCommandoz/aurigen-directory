/**
 * Customer View leak test (BLUEPRINT 3.4 and 3.8, quality bar item 6, D10). The enforcement of the
 * <Internal> rule: with Customer View on, nothing internal is on the page or in the accessibility
 * tree, on any route, including after a refresh, with the developer tools turned on beforehand.
 */
import { expect, test, type Page } from '@playwright/test';
import {
  ROUTES,
  customerViewLeaks,
  expectNoProblems,
  makeShopPhone,
  openApp,
  readSettings,
  readStore,
  turnCustomerViewOn,
  turnDeveloperToolsOn,
  watchProblems,
} from '../fixtures/app';

/** Words that must never be in the accessibility tree while Customer View is on. */
const FORBIDDEN_IN_TREE = ['Fix It', 'Quick card', 'Search', 'Settings', 'Developer', 'Device preview', 'Install', 'PIN', 'Set up', 'Backup', 'unverified', '[VERIFY', '[SUPERSEDED', 'Shop', 'Academy', 'Job Runner', 'Business', 'study phone', 'shop phone'];

async function treeLeaks(page: Page): Promise<string[]> {
  const tree = await page.locator('body').ariaSnapshot();
  return FORBIDDEN_IN_TREE.filter((word) => tree.includes(word)).map((word) => `accessibility tree has "${word}"`);
}

/** Tap "Done" on the Focus reminder and wait until the mark is saved, so a reload does not repeat it. */
async function dismissFocusReminder(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('Turn on your Customer Focus: Control Center, Focus.')).toHaveCount(0);
  await expect.poll(async () => (await readSettings(page)).focusReminderShown).toBe(true);
}

async function shopPhoneInCustomerView(page: Page, opts: { devTools?: boolean } = {}): Promise<void> {
  await makeShopPhone(page);
  if (opts.devTools === true) await turnDeveloperToolsOn(page);
  await turnCustomerViewOn(page);
}

test.describe('Customer View on: nothing internal anywhere', () => {
  test('every route shows the customer screen only, in the DOM and in the accessibility tree', async ({ page }) => {
    const problems = watchProblems(page);
    await shopPhoneInCustomerView(page, { devTools: true });
    // Dismiss the Focus reminder first so its text does not mask a check.
    await dismissFocusReminder(page);
    for (const path of [...ROUTES, '/cards/card-ipa-wipe', '/search?q=ipa', '/settings/developer?panel=1']) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
      await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
      expect(await customerViewLeaks(page), `DOM leaks on ${path}`).toEqual([]);
      expect(await treeLeaks(page), `tree leaks on ${path}`).toEqual([]);
      // The only control is the way out.
      const buttons = await page.getByRole('button').allInnerTexts();
      expect(buttons.map((b) => b.trim()), `buttons on ${path}`).toEqual(['Exit Customer View']);
    }
    expectNoProblems(problems);
  });

  test('a refresh in Customer View never flashes an internal element, even for one frame', async ({ page }) => {
    await shopPhoneInCustomerView(page, { devTools: true });
    await dismissFocusReminder(page);
    await page.addInitScript(() => {
      const seen: string[] = [];
      (window as unknown as { __leaks: string[] }).__leaks = seen;
      const check = () => {
        if (document.querySelector('[data-internal]')) seen.push('data-internal');
        if (document.querySelector('nav[aria-label="Main"] a')) seen.push('internal bottom row');
        const top = document.querySelector('header.app-top');
        if (top) seen.push(`internal top bar "${(top.textContent ?? '').trim()}"`);
        if (document.querySelector('.ui-banner')) seen.push('banner');
        if (document.querySelector('.mc-preview, .mc-dev')) seen.push('developer tools');
      };
      new MutationObserver(check).observe(document, { subtree: true, childList: true, attributes: true });
    });
    const flashes: Record<string, string[]> = {};
    for (const path of ['/', '/fixit', '/cards/card-bucket-mix', '/settings', '/settings/developer']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
      await page.waitForTimeout(300);
      const seen = await page.evaluate(() => (window as unknown as { __leaks: string[] }).__leaks);
      if (seen.length > 0) flashes[path] = [...new Set(seen)];
    }
    expect(flashes, 'internal elements drawn during the load of a Customer View page').toEqual({});
  });

  // Pass 2 recheck of DEF-01: the fix reads a hint from localStorage before the first frame. With
  // the hint gone on every load (a phone upgraded from the pass 1 build, or site data half cleared),
  // the shell must still hold every internal element until the saved flag is read.
  test('with the Customer View hint missing on every load, a refresh still never flashes an internal element', async ({ page }) => {
    await shopPhoneInCustomerView(page, { devTools: true });
    await dismissFocusReminder(page);
    await page.addInitScript(() => {
      try {
        window.localStorage.removeItem('masterclass.customerView');
      } catch {
        // Storage blocked: the hint reads "unknown" anyway.
      }
      const seen: string[] = [];
      (window as unknown as { __leaks: string[] }).__leaks = seen;
      const check = () => {
        if (document.querySelector('[data-internal]')) seen.push('data-internal');
        if (document.querySelector('nav[aria-label="Main"] a')) seen.push('internal bottom row');
        const top = document.querySelector('header.app-top');
        if (top) seen.push(`internal top bar "${(top.textContent ?? '').trim()}"`);
        if (document.querySelector('.ui-banner')) seen.push('banner');
        if (document.querySelector('.mc-preview, .mc-dev')) seen.push('developer tools');
      };
      new MutationObserver(check).observe(document, { subtree: true, childList: true, attributes: true });
    });
    const flashes: Record<string, string[]> = {};
    for (const path of ['/', '/fixit', '/cards/card-bucket-mix', '/settings', '/settings/developer', '/no-such-route']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
      await page.waitForTimeout(300);
      const seen = await page.evaluate(() => (window as unknown as { __leaks: string[] }).__leaks);
      if (seen.length > 0) flashes[path] = [...new Set(seen)];
    }
    expect(flashes, 'internal elements drawn during the load of a Customer View page with no hint').toEqual({});
  });

  test('the "/" key does not open Search in Customer View', async ({ page }) => {
    await shopPhoneInCustomerView(page);
    await page.keyboard.press('/');
    await page.waitForTimeout(200);
    expect(new URL(page.url()).pathname).toBe('/');
    expect(await customerViewLeaks(page)).toEqual([]);
  });
});

test.describe('the Focus reminder (D10)', () => {
  test('shows once on entry, carries no internal text, and a refresh does not repeat it', async ({ page }) => {
    await shopPhoneInCustomerView(page);
    const reminder = page.getByText('Turn on your Customer Focus: Control Center, Focus.');
    await expect(reminder).toBeVisible();
    expect(await customerViewLeaks(page)).toEqual([]);
    expect((await readSettings(page)).focusReminderShown).toBe(false);
    await dismissFocusReminder(page);
    await expect(reminder).toHaveCount(0);
    await expect.poll(async () => (await readSettings(page)).focusReminderShown).toBe(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
    await expect(reminder).toHaveCount(0);
  });

  test('a refresh before "Done" shows it again (the safe direction), still with no internals', async ({ page }) => {
    await shopPhoneInCustomerView(page);
    await page.reload();
    await expect(page.getByText('Turn on your Customer Focus: Control Center, Focus.')).toBeVisible();
    expect(await customerViewLeaks(page)).toEqual([]);
  });
});

test.describe('held notices (D10): nothing of the app\'s own while Customer View is on', () => {
  test('a due backup reminder is held in Customer View and comes back after it is off', async ({ page }) => {
    await makeShopPhone(page);
    // Eight days later: the weekly reminder is due (BACKUP_REMINDER_DAYS = 7).
    await page.clock.setSystemTime(Date.now() + 8 * 24 * 60 * 60 * 1000);
    await openApp(page, '/');
    await expect(page.locator('.ui-banner').filter({ hasText: 'Backup due' })).toBeVisible();
    await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
    await dismissFocusReminder(page);
    for (const path of ['/', '/settings', '/settings/backup']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
      expect(await customerViewLeaks(page), path).toEqual([]);
    }
    await page.getByRole('button', { name: 'Exit Customer View' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
    await page.goto('/');
    await expect(page.locator('.ui-banner').filter({ hasText: 'Backup due' })).toBeVisible();
  });
});

test.describe('switching', () => {
  test('a study phone cannot turn Customer View on; it is told why and how to set up', async ({ page }) => {
    await openApp(page, '/');
    await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
    await expect(page.getByText('Customer View is on the shop phone. This phone is a study phone.')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
    await expect(page.getByRole('button', { name: 'Set up this phone' })).toBeVisible();
    expect((await readSettings(page)).customerViewOn).toBe(false);
  });

  test('with no customer session, leaving needs no PIN and every internal control comes back', async ({ page }) => {
    await shopPhoneInCustomerView(page);
    await page.getByRole('button', { name: 'Exit Customer View' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
    const s = await readSettings(page);
    expect(s.customerViewOn).toBe(false);
    expect(s.focusReminderShown).toBe(false);
    // No session, so no audit entry for the switch-off (only a session switch-off is logged).
    const audit = await readStore<{ type: string }>(page, 'auditLog');
    expect(audit.filter((a) => a.type === 'customerViewOff')).toHaveLength(0);
  });

  test('the Customer View tile on Home does the same as the mode switch', async ({ page }) => {
    await makeShopPhone(page);
    await openApp(page, '/');
    await page.getByRole('button', { name: /^Customer View/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
    expect(await customerViewLeaks(page).then((l) => l.filter((x) => !x.includes('Focus')))).toEqual([]);
  });
});
