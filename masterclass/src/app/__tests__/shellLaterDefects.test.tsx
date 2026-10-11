/**
 * The shell's "later" defects from the QA gate, at unit level:
 *   DEF-11  Customer View shows no build words: brand, service area, one plain line, the phone
 *   DEF-12  the device preview labels always name the width really shown
 *   DEF-14  on a first launch the held top bar keeps its place, so nothing jumps; nothing internal shows
 *   DEF-13  the "Settings could not be read" notice offers Open Backup everywhere except on Backup itself
 */
import 'fake-indexeddb/auto';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ToastProvider } from '../../components/ui';
import { CustomerViewProvider, turnCustomerViewOn } from '../../core/customerView';
import { writeCustomerViewHint } from '../../core/customerViewHint';
import { __resetDbForTests, withDb } from '../../core/db';
import { BACKUP_SETTINGS_UNREADABLE_MESSAGE } from '../../core/errors';
import { startFresh } from '../../core/deviceRole';
import { __resetPinStateForTests } from '../../core/pin';
import { __resetSettingsStoreForTests } from '../../core/settingsStore';
import { PREVIEW_CHROME_PX, previewLabel } from '../../features/settings';
import { config } from '../config';
import { setMode } from '../mode';
import { AppRoutes } from '../routes';
import { CUSTOMER_LINE } from '../screens/CustomerScreen';
import { holdTopSpace } from '../Shell';
import { isBackupScreen } from '../banners/BannerStack';

function renderAt(path: string) {
  return render(
    <CustomerViewProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </ToastProvider>
    </CustomerViewProvider>,
  );
}

const topBar = () => document.querySelector('header.app-top');
const holdBox = () => document.querySelector('.app-top--hold');

beforeEach(async () => {
  window.localStorage.clear();
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
  setMode('shop');
});

afterEach(() => {
  cleanup();
  __resetSettingsStoreForTests();
  window.localStorage.clear();
});

describe('DEF-14: the held top bar keeps its place on a first launch', () => {
  it('the rule: only while the bar is held because the hint is unknown', () => {
    const rows: Array<[Parameters<typeof holdTopSpace>[0], boolean]> = [
      [{ ready: false, hint: 'unknown', header: false }, true],
      [{ ready: false, hint: 'unknown', header: true }, false],
      [{ ready: false, hint: 'on', header: false }, false],
      [{ ready: false, hint: 'off', header: true }, false],
      [{ ready: true, hint: 'unknown', header: true }, false],
      [{ ready: true, hint: 'unknown', header: false }, false],
    ];
    expect(rows.map(([input]) => holdTopSpace(input))).toEqual(rows.map(([, expected]) => expected));
  });

  it('first frame: an empty aria-hidden box and no top bar; once settings are read, the bar replaces it', async () => {
    renderAt('/');
    const box = holdBox();
    expect(box).not.toBeNull();
    expect(box?.getAttribute('aria-hidden')).toBe('true');
    expect(box?.textContent).toBe('');
    expect(box?.querySelector('a, button')).toBeNull();
    expect(topBar()).toBeNull();
    await waitFor(() => expect(topBar()).not.toBeNull());
    expect(holdBox()).toBeNull();
  });

  it('a hint of off draws the bar at once (no box); a hint of on draws neither', async () => {
    writeCustomerViewHint(false);
    renderAt('/');
    expect(topBar()).not.toBeNull();
    expect(holdBox()).toBeNull();
    cleanup();
    writeCustomerViewHint(true);
    __resetSettingsStoreForTests();
    renderAt('/');
    expect(topBar()).toBeNull();
    expect(holdBox()).toBeNull();
  });
});

describe('DEF-11: Customer View says nothing about the build', () => {
  it.each(['/', '/job', '/settings/backup', '/no-such-route'])('%s: brand, service area, one plain line, the phone; no phases, previews, or app name', async (path) => {
    const made = await startFresh({ warningAccepted: true, newPin: '482915' });
    if (!made.ok) throw new Error(made.message);
    expect((await turnCustomerViewOn()).ok).toBe(true);
    __resetSettingsStoreForTests();
    renderAt(path);
    const main = await screen.findByRole('main', { name: config.brandName });
    const text = main.textContent ?? '';
    expect(text).toContain(CUSTOMER_LINE);
    expect(text).toContain(config.phone);
    expect(text).toContain('Serving Tooele, Stansbury, and Grantsville.');
    for (const word of ['Phase', 'phase', 'preview', 'Preview', 'Masterclass', 'arrive']) expect(text).not.toContain(word);
  });
});

describe('DEF-12: the device preview labels are always true', () => {
  it('names the width when the window can show it, and the width really shown when it cannot', () => {
    const mobile = { width: 375 as const, label: 'Mobile 375' };
    const tablet = { width: 768 as const, label: 'Tablet 768' };
    const desktop = { width: null, label: 'Desktop full' };
    expect(previewLabel(mobile, 1440)).toBe('Mobile 375');
    expect(previewLabel(tablet, 768 + PREVIEW_CHROME_PX)).toBe('Tablet 768');
    expect(previewLabel(tablet, 768)).toBe('Tablet 768, shown at 734 here');
    expect(previewLabel(tablet, 430)).toBe('Tablet 768, shown at 396 here');
    expect(previewLabel(mobile, 375)).toBe('Mobile 375, shown at 341 here');
    expect(previewLabel(desktop, 375)).toBe('Desktop full');
    // An unknown window width (no layout yet) keeps the plain label.
    expect(previewLabel(tablet, 0)).toBe('Tablet 768');
  });
});

describe('DEF-13: the settings notice never points at the screen it is on', () => {
  async function unreadablePhone(): Promise<void> {
    const made = await startFresh({ warningAccepted: true, newPin: '482915' });
    if (!made.ok) throw new Error(made.message);
    await withDb(async (db) => {
      const row = await db.settings.get('device');
      await db.settings.put({ ...row, deviceRole: 'crewTablet' } as never);
    });
    __resetSettingsStoreForTests();
  }

  it('on Home: the notice with Open Backup', async () => {
    await unreadablePhone();
    renderAt('/');
    expect(await screen.findByText('Settings could not be read')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Open Backup' })).toBeTruthy();
  });

  it('on Backup: no notice and no Open Backup, only the screen\'s own words above Save backup', async () => {
    await unreadablePhone();
    renderAt('/settings/backup');
    expect(await screen.findByText(BACKUP_SETTINGS_UNREADABLE_MESSAGE)).toBeTruthy();
    expect(screen.queryByText('Settings could not be read')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Open Backup' })).toBeNull();
    expect(screen.queryByText(/open Settings, Backup|tap Open Backup/)).toBeNull();
  });

  it('the Backup screen is recognised with or without a trailing slash, and nothing else is', () => {
    expect(isBackupScreen('/settings/backup')).toBe(true);
    expect(isBackupScreen('/settings/backup/')).toBe(true);
    expect(isBackupScreen('/settings')).toBe(false);
    expect(isBackupScreen('/settings/backups')).toBe(false);
  });
});

