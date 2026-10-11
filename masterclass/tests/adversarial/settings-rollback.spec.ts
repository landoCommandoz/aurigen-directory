/**
 * Pass 2 recheck of DEF-08 in the browser, and DEF-13 (new in pass 2).
 *
 * D5 allows rolling back to an older version. A newer version may have written fields, or values,
 * the older copy does not know. Each test edits the settings row behind the app's back (the way a
 * newer version would have left it), reloads, and then walks what Lando would do: read the notice,
 * open Backup, save a backup, restore one.
 */
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { PIN, clickAndDownload, makeShopPhone, openApp, readSettings, tapPin, waitForScreen, watchProblems } from '../fixtures/app';

/** Merge fields into the stored settings row (raw IndexedDB, no app code). */
async function patchSettingsRow(page: Page, patch: Record<string, unknown>): Promise<void> {
  await page.evaluate(
    (fields) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const tx = request.result.transaction('settings', 'readwrite');
          const store = tx.objectStore('settings');
          const get = store.get('device');
          get.onsuccess = () => {
            const row = get.result as Record<string, unknown>;
            const next: Record<string, unknown> = { ...row };
            for (const [key, value] of Object.entries(fields)) {
              if (key === 'ownerPin.algorithm') next.ownerPin = { ...(row.ownerPin as Record<string, unknown>), algorithm: value };
              else next[key] = value;
            }
            store.put(next);
          };
          tx.oncomplete = () => {
            request.result.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
    patch,
  );
}

async function rawSettingsRow(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(
    () =>
      new Promise<Record<string, unknown>>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const get = request.result.transaction('settings').objectStore('settings').get('device');
          get.onsuccess = () => {
            request.result.close();
            resolve(get.result as Record<string, unknown>);
          };
        };
      }),
  );
}

test.describe('DEF-08 recheck: a field a newer version added', () => {
  test('a shop phone: no notice, the backup saves without the field, and Restore of that file runs with the PIN', async ({ page }) => {
    await makeShopPhone(page);
    await patchSettingsRow(page, { fieldFromANewerVersion: { nested: true } });
    const problems = watchProblems(page);
    await openApp(page, '/');
    await expect(page.getByText('This phone is not saving')).toHaveCount(0);
    await expect(page.getByText('Settings could not be read', { exact: true })).toHaveCount(0);

    await openApp(page, '/settings/backup');
    const download = await clickAndDownload(page, 'Save backup');
    const json = readFileSync(await download.path(), 'utf8');
    expect(json).not.toContain('fieldFromANewerVersion');

    await page.getByRole('button', { name: 'Restore from a file' }).click();
    await page.locator('input[type="file"]').setInputFiles({ name: download.suggestedFilename(), mimeType: 'application/json', buffer: Buffer.from(json) });
    await expect(page.getByLabel('What this backup holds').first()).toBeVisible();
    await page.getByLabel(/Type replace to confirm/).fill('replace');
    await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await tapPin(page, PIN);
    await expect(page.getByRole('button', { name: 'Done', exact: true })).toBeVisible();
    expect(await rawSettingsRow(page)).not.toHaveProperty('fieldFromANewerVersion');
    expect((await readSettings(page)).deviceRole).toBe('shop');
    expect(problems.page).toEqual([]);
  });

  test('a damaged ordinary field: the notice names no wrong cause, Open Backup saves a backup and says what was reset', async ({ page }) => {
    await makeShopPhone(page);
    await patchSettingsRow(page, { handedness: 'both' });
    const problems = watchProblems(page);
    await openApp(page, '/');
    await expect(page.getByText('Settings could not be read', { exact: true })).toBeVisible();
    await expect(page.getByText(/Private Browsing/)).toHaveCount(0);
    await expect(page.getByText(/Unrecognized|Invalid option|expected one of/)).toHaveCount(0);
    await page.getByRole('button', { name: 'Open Backup' }).click();
    await waitForScreen(page);
    await expect(page.getByText(/were damaged, so this backup holds them at their starting values: handedness/)).toBeVisible();
    const download = await clickAndDownload(page, 'Save backup');
    expect(readFileSync(await download.path(), 'utf8')).toContain('"handedness":"left"');
    expect(problems.page).toEqual([]);
  });
});

// DEF-13 (fix-before-deploy, new in pass 2; fixed in the fix wave): the DEF-08 fix refused to guess
// the role or the PIN, which is right for the gates, but it also refused the backup, and the words
// looped back to Backup. Now the backup carries every job with a settingsUnreadable section, never a
// role or a PIN, and the Backup screen never tells the person to open Backup. The restore side is in
// settings-restore.spec.ts.
test.describe('DEF-13: the role or PIN field from a newer version', () => {
  for (const [label, patch, reason] of [
    ['a device role this version does not know', { deviceRole: 'crewTablet' }, 'deviceRoleUnreadable'],
    ['a PIN record from a newer hash', { 'ownerPin.algorithm': 'Argon2id' }, 'ownerPinUnreadable'],
    ['a shop role with the PIN record gone', { ownerPin: null }, 'shopRoleWithoutPin'],
  ] as const) {
    test(`${label}: Backup still saves a file with the jobs`, async ({ page }) => {
      await makeShopPhone(page);
      await patchSettingsRow(page, patch);
      const problems = watchProblems(page);
      await openApp(page, '/');
      await expect(page.getByText('Settings could not be read', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Open Backup' }).click();
      await expect(page.getByRole('heading', { level: 1, name: 'Backup and restore' })).toBeVisible();
      // Read the words once the backup is prepared and the line about the settings is on screen.
      await expect(page.getByText(/role and owner PIN could not be read, so the shop tools stay locked/)).toBeVisible();
      const words = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      test.info().annotations.push({ type: 'Backup screen words', description: words.slice(0, 600) });
      expect(problems.page).toEqual([]);
      await expect(page.getByText('The backup could not be prepared.', { exact: false })).toHaveCount(0);
      expect(words).not.toMatch(/open Settings, Backup|Unrecognized|Invalid option|expected one of|schema/);
      await expect(page.getByRole('button', { name: 'Save backup', exact: true })).toBeEnabled();
      const download = await clickAndDownload(page, 'Save backup');
      const file = JSON.parse(readFileSync(await download.path(), 'utf8')) as Record<string, unknown> & { tables: { settings: unknown[] } };
      expect(file).not.toHaveProperty('deviceRole');
      expect(file.tables.settings).toEqual([]);
      expect((file.settingsUnreadable as { reasons: string[] }).reasons).toEqual([reason]);
      // No gate opened, and the row is left exactly as the newer version wrote it.
      expect(await rawSettingsRow(page)).toMatchObject(reason === 'shopRoleWithoutPin' ? { deviceRole: 'shop', ownerPin: null } : reason === 'deviceRoleUnreadable' ? { deviceRole: 'crewTablet' } : { deviceRole: 'shop' });
      await openApp(page, '/');
      await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
      await page.waitForTimeout(300);
      await expect(page.locator('html')).not.toHaveAttribute('data-density', 'customer');
      expect(problems.page).toEqual([]);
    });
  }
});
