/**
 * The shell defects from QA round 1, at unit level:
 *   DEF-01  a refresh in Customer View draws no internal top bar, not even before the flag is read
 *   DEF-02  an address no route can match (an encoded line break) still shows Not found in the shell
 *   DEF-09  under the GitHub Pages base every in-app link stays inside the service worker scope
 */
import 'fake-indexeddb/auto';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, type Location } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../../components/ui';
import { config } from '../config';
import { CustomerViewProvider, turnCustomerViewOff, turnCustomerViewOn } from '../../core/customerView';
import { CUSTOMER_VIEW_HINT_KEY, readCustomerViewHint, writeCustomerViewHint } from '../../core/customerViewHint';
import { __resetDbForTests } from '../../core/db';
import { startFresh } from '../../core/deviceRole';
import { __resetPinStateForTests } from '../../core/pin';
import { __resetSettingsStoreForTests } from '../../core/settingsStore';
import { setMode } from '../mode';
import { AppRoutes, renderLocationFor } from '../routes';
import { visiblePath } from '../screens/NotFound';
import { showTopBar } from '../Shell';
import { NO_SCREEN_PATH } from '../unmatched';

const PAGES = '/aurigen-directory/';

function renderAt(path: string, basename?: string) {
  return render(
    <CustomerViewProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]} basename={basename}>
          <AppRoutes />
        </MemoryRouter>
      </ToastProvider>
    </CustomerViewProvider>,
  );
}

const topBar = () => document.querySelector('header.app-top');

/** Record every internal top bar that is ever attached while the callback runs. */
function watchTopBar(): { seen: string[]; stop: () => void } {
  const seen: string[] = [];
  const observer = new MutationObserver(() => {
    const bar = topBar();
    if (bar !== null) seen.push((bar.textContent ?? '').trim());
  });
  observer.observe(document.body, { subtree: true, childList: true });
  return { seen, stop: () => observer.disconnect() };
}

async function shopPhoneWithCustomerViewOn(): Promise<void> {
  const fresh = await startFresh({ warningAccepted: true, newPin: '482915' });
  if (!fresh.ok) throw new Error(fresh.message);
  expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
  // A reload: the settings snapshot starts over at "loading".
  __resetSettingsStoreForTests();
}

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
  vi.restoreAllMocks();
});

describe('DEF-01: the top bar before the Customer View flag is read', () => {
  it('the rule: internal screens always, Customer View never, and before the flag only on a hint of off or a stuck phone', () => {
    const rows: Array<[Parameters<typeof showTopBar>[0], boolean]> = [
      [{ ready: true, on: false, hint: 'on', slow: false }, true],
      [{ ready: true, on: true, hint: 'off', slow: true }, false],
      [{ ready: false, on: false, hint: 'off', slow: false }, true],
      [{ ready: false, on: false, hint: 'on', slow: false }, false],
      [{ ready: false, on: false, hint: 'on', slow: true }, false],
      [{ ready: false, on: false, hint: 'unknown', slow: false }, false],
      [{ ready: false, on: false, hint: 'unknown', slow: true }, true],
    ];
    expect(rows.map(([input]) => showTopBar(input))).toEqual(rows.map(([, expected]) => expected));
  });

  it('a refresh in Customer View: no frame ever draws the internal top bar, and the first frame is already the customer density', async () => {
    await shopPhoneWithCustomerViewOn();
    const watch = watchTopBar();
    renderAt('/settings');
    expect(topBar()).toBeNull();
    expect(document.documentElement.dataset.density).toBe('customer');
    await screen.findByRole('main', { name: config.brandName });
    watch.stop();
    expect(watch.seen).toEqual([]);
    expect(topBar()).toBeNull();
  });

  it('first launch (no hint yet): the top bar waits for the flag, then shows with its buttons, and the hint is filled in', async () => {
    renderAt('/');
    expect(topBar()).toBeNull();
    await waitFor(() => expect(within(topBar() as HTMLElement).getByRole('link', { name: 'Home' })).toBeTruthy());
    expect(readCustomerViewHint()).toBe('off');
  });

  it('a hint of off draws the title at once, with no buttons until the flag is read', async () => {
    writeCustomerViewHint(false);
    renderAt('/');
    const bar = topBar() as HTMLElement;
    expect(bar.textContent).toContain('Masterclass 101');
    expect(within(bar).queryByRole('link')).toBeNull();
    await waitFor(() => expect(within(topBar() as HTMLElement).getByRole('link', { name: 'Settings' })).toBeTruthy());
  });

  it('the switches keep the hint in step: on before the row, off after it; a refused switch leaves it off', async () => {
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false, code: 'notShopPhone' });
    expect(readCustomerViewHint()).not.toBe('on');
    await startFresh({ warningAccepted: true, newPin: '482915' });
    expect((await turnCustomerViewOn()).ok).toBe(true);
    expect(window.localStorage.getItem(CUSTOMER_VIEW_HINT_KEY)).toBe('1');
    expect((await turnCustomerViewOff()).ok).toBe(true);
    expect(readCustomerViewHint()).toBe('off');
  });

  it('storage that refuses the write leaves the hint unknown (held), never off; storage that refuses reads says unknown', () => {
    writeCustomerViewHint(false);
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    writeCustomerViewHint(true);
    expect(readCustomerViewHint()).toBe('unknown');
    setItem.mockRestore();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(readCustomerViewHint()).toBe('unknown');
  });
});

describe('DEF-02: an address no route can match', () => {
  it.each(['/%0a', '/abc%0d%0a', '/%0d%0aSet-Cookie'])('%s shows Not found inside the shell, with the address as typed, Home, Fix It, and the bottom row', async (path) => {
    renderAt(path);
    const main = await screen.findByRole('main', { name: 'No screen here' });
    expect(main.textContent).toContain(path);
    expect(within(main).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    expect(within(main).getByRole('link', { name: 'Fix It' })).toBeTruthy();
    await waitFor(() => expect(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Fix It' })).toBeTruthy());
  });

  it('renderLocationFor leaves a matching address alone and carries an unmatched one to NO_SCREEN_PATH', () => {
    const loc = (pathname: string): Location => ({ pathname, search: '?a=1', hash: '#h', state: null, key: 'k', unstable_mask: undefined }) as Location;
    expect(renderLocationFor(loc('/cards/x'))).toBeUndefined();
    expect(renderLocationFor(loc('/anything/at/all'))).toBeUndefined();
    expect(renderLocationFor(loc('/\n'))).toMatchObject({ pathname: NO_SCREEN_PATH, search: '', hash: '', state: { unmatchedPath: '/\n' } });
  });

  it('visiblePath shows control characters as their codes', () => {
    expect(visiblePath('/a\r\nb\u007f')).toBe('/a%0D%0Ab%7F');
    expect(visiblePath('/cards/x')).toBe('/cards/x');
  });
});

describe('DEF-09: links under the GitHub Pages base', () => {
  it.each(['/aurigen-directory/', '/aurigen-directory/cards', '/aurigen-directory/settings', '/aurigen-directory/nope'])(
    'from %s every link starts with the base and its slash; Home is the base itself',
    async (path) => {
      renderAt(path, PAGES);
      await waitFor(() => expect(within(topBar() as HTMLElement).getByRole('link', { name: 'Home' })).toBeTruthy());
      const hrefs = Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href') ?? '');
      expect(hrefs.length).toBeGreaterThan(0);
      expect(hrefs.filter((href) => !href.startsWith(PAGES))).toEqual([]);
      expect(within(topBar() as HTMLElement).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe(PAGES);
    },
  );
});
