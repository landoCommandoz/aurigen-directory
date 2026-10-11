/**
 * Pass 2 recheck of the shell fixes, aimed at the edges:
 *
 * - DEF-01: the first frame after a reload in Customer View. The fix reads a synchronous hint from
 *   localStorage. What if the hint is missing (a phone upgraded from the pass 1 build, or storage
 *   for the hint blocked), or the hint write fails while turning Customer View on?
 * - DEF-02: every kind of line break the router's "*" cannot match (CR, LF, U+2028, U+2029), in the
 *   first segment and deeper, lands on Not found inside the shell with a way out.
 * - DEF-09: the router basename keeps its trailing slash for every way the base can be written.
 */
import 'fake-indexeddb/auto';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { basenameFor, deepLinkTarget, slashedBaseFor } from '../../src/app/deepLink';
import { AppRoutes } from '../../src/app/routes';
import { showTopBar } from '../../src/app/Shell';
import { ToastProvider } from '../../src/components/ui';
import { CustomerViewProvider, turnCustomerViewOff, turnCustomerViewOn } from '../../src/core/customerView';
import { CUSTOMER_VIEW_HINT_KEY, readCustomerViewHint } from '../../src/core/customerViewHint';
import { __resetDbForTests } from '../../src/core/db';
import { chooseStudy, startFresh } from '../../src/core/deviceRole';
import { __resetPinStateForTests } from '../../src/core/pin';
import { __resetSettingsStoreForTests } from '../../src/core/settingsStore';

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

/** What a privacy scan cares about in one frame: the top bar, internal markers, the bottom row's internal links. */
function internalsIn(container: HTMLElement): string[] {
  const found: string[] = [];
  if (container.querySelector('header.app-top') !== null) found.push('header.app-top');
  if (container.querySelector('[data-internal]') !== null) found.push('[data-internal]');
  for (const a of Array.from(container.querySelectorAll('a'))) {
    const text = a.textContent?.trim() ?? '';
    if (['Fix It', 'Quick cards', 'Quick Cards', 'Search', 'Settings', 'Home'].includes(text)) found.push(`link:${text}`);
  }
  return found;
}

beforeEach(async () => {
  window.localStorage.clear();
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  __resetSettingsStoreForTests();
  window.localStorage.clear();
});

describe('DEF-01 recheck: the first frame after a reload in Customer View', () => {
  async function shopInCustomerView(): Promise<void> {
    const made = await startFresh({ warningAccepted: true, newPin: '482915' });
    if (!made.ok) throw new Error(made.message);
    expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
    __resetSettingsStoreForTests();
  }

  it('hint present: the first frame holds every internal element, on several routes', async () => {
    await shopInCustomerView();
    expect(readCustomerViewHint()).toBe('on');
    for (const path of ['/', '/fixit', '/cards', '/settings', '/settings/developer', '/no-such-route']) {
      const { container, unmount } = renderAt(path);
      expect({ path, found: internalsIn(container) }).toEqual({ path, found: [] });
      unmount();
      __resetSettingsStoreForTests();
    }
  });

  it('hint missing (phone upgraded from the pass 1 build, or the hint was cleared): the first frame still holds the top bar', async () => {
    await shopInCustomerView();
    window.localStorage.removeItem(CUSTOMER_VIEW_HINT_KEY);
    const { container } = renderAt('/');
    expect(internalsIn(container)).toEqual([]);
    // Once the row answers, the customer screen shows and the hint is filled in for next time.
    await waitFor(() => expect(screen.getByRole('button', { name: /Exit Customer View/ })).toBeTruthy(), { timeout: 2000 });
    expect(internalsIn(container)).toEqual([]);
    expect(readCustomerViewHint()).toBe('on');
  });

  it('the hint cannot be written when Customer View goes on (storage full): it reads unknown, never off, so the top bar is held', async () => {
    const made = await startFresh({ warningAccepted: true, newPin: '482915' });
    if (!made.ok) throw new Error(made.message);
    window.localStorage.setItem(CUSTOMER_VIEW_HINT_KEY, '0');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
    vi.restoreAllMocks();
    expect(readCustomerViewHint()).toBe('unknown');
    __resetSettingsStoreForTests();
    const { container } = renderAt('/settings');
    expect(internalsIn(container)).toEqual([]);
  });

  it('a refused switch-on (study phone) leaves no "on" hint behind; switching off clears it', async () => {
    expect((await chooseStudy()).ok).toBe(true);
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false, code: 'notShopPhone' });
    expect(readCustomerViewHint()).not.toBe('on');
    await __resetDbForTests();
    const made = await startFresh({ warningAccepted: true, newPin: '482915' });
    if (!made.ok) throw new Error(made.message);
    expect((await turnCustomerViewOn()).ok).toBe(true);
    expect(readCustomerViewHint()).toBe('on');
    expect(await turnCustomerViewOff()).toEqual({ ok: true, on: false });
    expect(readCustomerViewHint()).toBe('off');
  });

  it('showTopBar: the hint "on" holds the bar even when storage is stuck; only "unknown" plus stuck shows the title (with Reload)', () => {
    const cases: Array<[boolean, boolean, 'on' | 'off' | 'unknown', boolean, boolean]> = [
      [false, false, 'on', false, false],
      [false, false, 'on', true, false],
      [false, false, 'unknown', false, false],
      [false, false, 'unknown', true, true],
      [false, false, 'off', false, true],
      [true, true, 'off', false, false],
      [true, true, 'unknown', true, false],
      [true, false, 'on', false, true],
    ];
    for (const [ready, on, hint, slow, expected] of cases) {
      expect({ ready, on, hint, slow, bar: showTopBar({ ready, on, hint, slow }) }).toEqual({ ready, on, hint, slow, bar: expected });
    }
  });
});

describe('DEF-02 recheck: no address renders nothing', () => {
  const addresses = ['/%0a', '/%0d', '/%0d%0a', '/abc%0d%0a', '/%E2%80%A8', '/%E2%80%A9', '/%0a/cards', '/settings%0a', '/cards%0d/x', '/%00', '/%7f'];
  for (const path of addresses) {
    it(`${path} shows Not found inside the shell, with Home and Fix It`, async () => {
      renderAt(path);
      await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'No screen here' })).toBeTruthy(), { timeout: 2000 });
      expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Fix It' }).length).toBeGreaterThan(0);
    });
  }

  it('a real deep link with a line break inside a card id still opens the card route (the card screen says it is missing)', async () => {
    renderAt('/cards/%0a');
    await waitFor(() => expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0), { timeout: 2000 });
    expect(screen.getAllByRole('link', { name: 'Fix It' }).length).toBeGreaterThan(0);
  });

  it('the Pages deep link guard refuses every line break and control character, raw or percent-encoded', () => {
    const base = '/aurigen-directory/';
    const at = (p: string) => deepLinkTarget({ pathname: base, search: `?p=${encodeURIComponent(p)}`, hash: '', origin: 'https://landocommandoz.github.io' }, base);
    const evil = ['/\n', '/\r', '/%0a', '/%0d%0aSet-Cookie:x', '/\u0000', '/%00', '/\u007f', '/%7F', '/%E0%A4%A'];
    expect(evil.map((e) => [e, at(e)]).filter(([, r]) => r !== 'refused')).toEqual([]);
    // Encoded twice, one decode leaves the literal text "%0a", which the router matches as a
    // plain unknown path (Not found), so the guard may let it through.
    expect(at('/%250a')).toBe('/aurigen-directory/%250a');
  });

  it('a twice-encoded line break, as the router receives it after the guard, is Not found (not blank)', async () => {
    renderAt('/%250a');
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'No screen here' })).toBeTruthy(), { timeout: 2000 });
  });
});

describe('DEF-09 recheck: the base keeps its trailing slash', () => {
  it('basenameFor keeps one trailing slash for every way the base can be written', () => {
    expect(basenameFor('/aurigen-directory/')).toBe('/aurigen-directory/');
    expect(basenameFor('/aurigen-directory')).toBe('/aurigen-directory/');
    expect(basenameFor('aurigen-directory/')).toBe('/aurigen-directory/');
    expect(basenameFor('//aurigen-directory//')).toBe('/aurigen-directory/');
    expect(basenameFor(' /aurigen-directory/ ')).toBe('/aurigen-directory/');
    expect(basenameFor('/')).toBe('/');
    expect(basenameFor('')).toBe('/');
  });

  it('slashedBaseFor fixes only the bare base, never a deeper path or the root base', () => {
    const base = '/aurigen-directory/';
    expect(slashedBaseFor('/aurigen-directory', base)).toBe(base);
    expect(slashedBaseFor('/aurigen-directory/', base)).toBeNull();
    expect(slashedBaseFor('/aurigen-directory/cards', base)).toBeNull();
    expect(slashedBaseFor('/aurigen-directoryx', base)).toBeNull();
    expect(slashedBaseFor('/', '/')).toBeNull();
    expect(slashedBaseFor('', '/')).toBeNull();
  });
});
