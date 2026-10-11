/**
 * The shell's Phase 1 pieces, driven through the UI at every width: the install card, the setup
 * banner and the setup flow (D12), the developer panel readouts (BLUEPRINT 9 checklist), and the
 * device preview (CLAUDE.md engineering rules).
 */
import { expect, test } from '@playwright/test';
import {
  PIN,
  expectNoProblems,
  makeShopPhone,
  openApp,
  readSettings,
  readStore,
  setUpStudyPhone,
  turnDeveloperToolsOn,
  watchProblems,
} from '../fixtures/app';

const INSTALL_TITLE = /^Install (on this phone|the app)$/;

test.describe('install card (D3)', () => {
  test('shows on Home and Settings when not running standalone, not on working screens', async ({ page }) => {
    await openApp(page, '/');
    await expect(page.getByText(INSTALL_TITLE)).toBeVisible();
    await expect(page.getByText(/Safari can erase it after 7 days/)).toBeVisible();
    await openApp(page, '/settings');
    await expect(page.getByText(INSTALL_TITLE)).toBeVisible();
    for (const path of ['/fixit', '/cards', '/search']) {
      await openApp(page, path);
      await expect(page.getByText(INSTALL_TITLE)).toHaveCount(0);
    }
  });

  test('"Not now" hides it, and it stays hidden after a reload', async ({ page }) => {
    await openApp(page, '/');
    const card = page.locator('.ui-banner').filter({ hasText: /Install (on this phone|the app)/ });
    await card.getByRole('button', { name: 'Not now' }).click();
    await expect(page.getByText(INSTALL_TITLE)).toHaveCount(0);
    await page.reload();
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText(INSTALL_TITLE)).toHaveCount(0);
  });

  test('is absent when the app runs as the installed Home Screen app', async ({ page }) => {
    await page.addInitScript(() => {
      const real = window.matchMedia.bind(window);
      window.matchMedia = (query: string) => {
        if (query.includes('display-mode: standalone')) {
          const fake = real('(min-width: 0px)');
          return Object.assign(Object.create(fake), { matches: true, media: query });
        }
        return real(query);
      };
      Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });
    });
    await openApp(page, '/');
    await expect(page.getByText('Set up this phone')).toBeVisible();
    await expect(page.getByText(INSTALL_TITLE)).toHaveCount(0);
  });
});

test.describe('setup banner and setup flow (D12)', () => {
  test('a new install opens straight into the rooms with the setup banner; the banner never blocks Fix It', async ({ page }) => {
    await openApp(page, '/');
    await expect(page.getByText('Set up this phone')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Fix It' })).toBeVisible();
  });

  test('"Later" closes the banner for this session; it returns on the next launch', async ({ page }) => {
    await openApp(page, '/');
    await page.locator('.ui-banner').filter({ hasText: 'Set up this phone' }).getByRole('button', { name: 'Later' }).click();
    await expect(page.getByText('Set up this phone')).toHaveCount(0);
    // Moving around inside the app keeps it closed.
    await page.getByRole('banner').getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
    await expect(page.getByText('Set up this phone')).toHaveCount(0);
    await page.getByRole('banner').getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
    await expect(page.getByText('Set up this phone')).toHaveCount(0);
    // A reload is a new launch of the Home Screen app: the banner comes back.
    await page.reload();
    await expect(page.getByText('Set up this phone')).toBeVisible();
  });

  test('banner steps follow the setup: role, then PIN, then first backup, then gone', async ({ page }) => {
    const problems = watchProblems(page);
    await openApp(page, '/');
    await expect(page.getByText('Set up this phone')).toBeVisible();

    await openApp(page, '/settings/setup');
    await page.getByRole('button', { name: 'This is a study phone' }).click();
    await expect(page.getByText('Saved: this is a study phone. Next, set the owner PIN.')).toBeVisible();
    await openApp(page, '/');
    await expect(page.locator('.app-banners').getByText('Set the owner PIN')).toBeVisible();

    await page.getByRole('button', { name: 'Set the PIN' }).click();
    await page.getByRole('button', { name: 'Create the owner PIN' }).click();
    for (let round = 0; round < 2; round += 1) {
      for (const digit of PIN) await page.locator('fieldset.ui-pinpad').getByRole('button', { name: digit, exact: true }).click();
    }
    // The first backup screen follows the PIN right then (Lando, 2026-10-10).
    await expect(page.getByRole('heading', { level: 1, name: 'Save your first backup' })).toBeVisible();
    await expect(page.getByText('Owner PIN saved. The weekly backup reminder is on.')).toBeVisible();
    const afterPin = await readSettings(page);
    expect(afterPin.ownerPin).not.toBeNull();
    expect(afterPin.backupReminderWeekly).toBe(true);
    expect(afterPin.lastBackupAt).toBeNull();
    expect(JSON.stringify(afterPin)).not.toContain(PIN);

    // "Not now" leaves the banner on the backup step.
    await page.getByRole('button', { name: 'Not now' }).click();
    await openApp(page, '/');
    await expect(page.locator('.app-banners').getByText('Save your first backup')).toBeVisible();

    // Back up through the banner; Chromium has no share sheet, so the app downloads the file.
    await page.getByRole('button', { name: 'Back up now' }).click();
    await page.getByRole('button', { name: /Make a backup now|Save your first backup/ }).first().click();
    const button = page.getByRole('button', { name: 'Save your first backup', exact: true }).last();
    await expect(button).toBeEnabled();
    const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
    expect(download.suggestedFilename()).toMatch(/^masterclass-backup-\d{4}-\d{2}-\d{2}\.json$/);
    await expect(page.getByText(/Path: download\./)).toBeVisible();
    await page.getByRole('button', { name: 'Done', exact: true }).click();

    await openApp(page, '/');
    await expect(page.locator('.app-banners').getByText(/Set up this phone|Set the owner PIN|Save your first backup|Backup due/)).toHaveCount(0);
    const done = await readSettings(page);
    expect(done.lastBackupAt).not.toBeNull();
    const audit = await readStore<{ type: string; detail: string }>(page, 'auditLog');
    expect(audit.map((a) => a.type).sort()).toEqual(['export', 'pinSet', 'roleChange']);
    expect(audit.some((a) => a.detail.includes(PIN))).toBe(false);
    expectNoProblems(problems);
  });

  test('the downloaded first backup is a valid backup file with the PIN as a hash only', async ({ page }) => {
    const download = await setUpStudyPhone(page);
    const path = await download.path();
    const { readFileSync } = await import('node:fs');
    const text = readFileSync(path, 'utf8');
    expect(text).not.toContain(PIN);
    const file = JSON.parse(text) as { kind: string; version: number; deviceRole: string; tables: { settings: Array<{ ownerPin: { hash: string } | null }> } };
    expect(file.kind).toBeTruthy();
    expect(file.deviceRole).toBe('study');
    expect(file.tables.settings[0]?.ownerPin?.hash).toBeTruthy();
  });
});

test.describe('developer panel (production build, behind the owner PIN)', () => {
  const LABELS = [
    'Device role',
    'Owner PIN set',
    'Owner pass active',
    'Setup step',
    'Last backup',
    'Weekly backup reminder',
    'Running as the Home Screen app',
    'iOS version (user agent)',
    'Customer View',
    'Focus reminder shown',
    'Thumb side',
    'Job state',
    'Online or offline',
    'Service worker',
    'Ready offline',
    'Update available',
    'Reload waiting for a quiet moment',
    'Last update check',
    'Offline helper error',
    'Database',
    'Base path',
    'App version',
    'Build',
    'Content bundle',
    'Search index',
    'Storage manager',
    'Quota',
    'Usage',
    'Storage kept (persisted)',
    'Asked to keep storage this launch',
    'Answer to the keep request',
    'Checked',
    'Storage error',
    'Screen wake lock supported',
    'Screen held awake now',
    'If not supported',
    'Last test',
    'Speech supported',
    'Voices on this phone',
    'Default English voice',
    'Voice unlocked by a tap',
    'Speaking now',
    'Last speech error',
    'Share PNG',
    'Share PDF',
    'Share JSON',
  ];

  test('is off without the PIN toggle, and renders every readout label once turned on', async ({ page }) => {
    const problems = watchProblems(page);
    await openApp(page, '/settings/developer');
    await expect(page.getByText('Developer tools are off.', { exact: false })).toBeVisible();

    await setUpStudyPhone(page);
    await turnDeveloperToolsOn(page);
    await page.getByRole('button', { name: 'Open the developer panel' }).click();
    await expect(page.getByText('Developer panel. Removable before the final deploy.')).toBeVisible();
    const missing: string[] = [];
    for (const label of LABELS) {
      if ((await page.locator('.mc-dev').getByText(label, { exact: true }).count()) === 0) missing.push(label);
    }
    expect(missing).toEqual([]);
    await expect(page.locator('.mc-dev').getByText('Production', { exact: true })).toBeVisible();
    const audit = await readStore<{ type: string }>(page, 'auditLog');
    expect(audit.filter((a) => a.type === 'developerToggle')).toHaveLength(1);
    expectNoProblems(problems);
  });

  test('device preview resizes the app frame to 375 and 768, and Desktop full brings it back', async ({ page }) => {
    await setUpStudyPhone(page);
    await turnDeveloperToolsOn(page);
    await openApp(page, '/');
    const bar = page.getByRole('toolbar', { name: 'Device preview' });
    await expect(bar).toBeVisible();

    for (const width of [375, 768] as const) {
      await bar.getByRole('button', { name: width === 375 ? 'Mobile 375' : 'Tablet 768' }).click();
      const frame = page.locator('iframe.app-preview__frame');
      await expect(frame).toBeVisible();
      const inner = page.frameLocator('iframe.app-preview__frame');
      await expect(inner.locator('h1').first()).toBeVisible();
      const innerWidth = await frame.evaluate((el) => (el as HTMLIFrameElement).contentWindow?.innerWidth ?? 0);
      const viewport = page.viewportSize()?.width ?? 0;
      // The stage has 16 px padding each side and the frame a 1 px border: the frame can be exact
      // only when the window is wider than the preview. Narrower, it shrinks to fit (max-width 100%).
      if (viewport >= width + 2 + 32) expect(innerWidth, `frame inner width at a ${viewport} px window`).toBe(width);
      else {
        test.info().annotations.push({ type: 'preview-clamped', description: `${width} preview is ${innerWidth} px inside a ${viewport} px window` });
        expect(innerWidth).toBeLessThan(width);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport);
      }
      // The app inside the frame shows no preview bar of its own.
      await expect(inner.getByRole('toolbar', { name: 'Device preview' })).toHaveCount(0);
    }
    await page.getByRole('toolbar', { name: 'Device preview' }).first().getByRole('button', { name: 'Desktop full' }).click();
    await expect(page.locator('iframe.app-preview__frame')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: 'Masterclass 101' })).toBeVisible();
  });
});

test.describe('shop phone path through the UI (D12)', () => {
  test('Start fresh with the warning, a new PIN, and the first backup makes a shop phone', async ({ page }) => {
    const problems = watchProblems(page);
    const download = await makeShopPhone(page);
    expect(download?.suggestedFilename()).toMatch(/\.json$/);
    const s = await readSettings(page);
    expect(s.deviceRole).toBe('shop');
    expect(s.ownerPin).not.toBeNull();
    expect(s.backupReminderWeekly).toBe(true);
    expect(s.lastBackupAt).not.toBeNull();
    const types = (await readStore<{ type: string }>(page, 'auditLog')).map((a) => a.type).sort();
    expect(types).toEqual(['export', 'pinSet', 'roleChange', 'startFresh']);
    await openApp(page, '/');
    await expect(page.getByText('The shop phone. Jobs, counters, and sign-offs live here.')).toBeVisible();
    expectNoProblems(problems);
  });
});
