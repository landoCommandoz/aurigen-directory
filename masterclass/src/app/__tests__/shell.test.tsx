import 'fake-indexeddb/auto';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../../components/ui';
import { getItemsByType, loadAllContent } from '../../core/content';
import { CustomerViewProvider, turnCustomerViewOn } from '../../core/customerView';
import { __resetDbForTests, updateSettings } from '../../core/db';
import { startFresh } from '../../core/deviceRole';
import { __resetPinStateForTests } from '../../core/pin';
import { __resetSettingsStoreForTests } from '../../core/settingsStore';
import { config } from '../config';
import { setMode } from '../mode';
import { ROUTE_PATHS, AppRoutes } from '../routes';
import { sessionNotices } from '../banners/sessionNotices';

// Pages load their content in shards after the shell draws (DEF-17). These tests check what each
// page draws with its content in, so every shard is loaded once, up front.
await loadAllContent();

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

const bottomRow = () => screen.getByRole('navigation', { name: /main|customer view/i });

async function shellReady() {
  await waitFor(() => expect(within(bottomRow()).queryByRole('link', { name: 'Fix It' }) ?? within(bottomRow()).queryByRole('button')).not.toBeNull());
}

let errors: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
  sessionNotices.set({ setupClosed: false, backupLater: false, updateLater: false });
  setMode('shop');
  errors = vi.spyOn(console, 'error');
});

afterEach(() => {
  cleanup();
  __resetSettingsStoreForTests();
  errors.mockRestore();
  window.localStorage.clear();
});

describe('every route renders inside the shell', () => {
  const cardId = getItemsByType('quickcard')[0]?.id ?? 'missing-card';
  const paths = [...ROUTE_PATHS.map((path) => path.replace(':id', cardId)), '/no/such/screen'];

  it.each(paths)('%s: renders, Fix It is one tap away, no console errors', async (path) => {
    renderAt(path);
    await shellReady();
    const fixIt = within(bottomRow()).getByRole('link', { name: 'Fix It' });
    expect(fixIt.getAttribute('href')).toBe('/fixit');
    expect(within(bottomRow()).getByRole('link', { name: 'Quick cards' })).toBeTruthy();
    expect(within(bottomRow()).getByRole('link', { name: 'Search' })).toBeTruthy();
    expect(screen.getAllByRole('main').length).toBeGreaterThan(0);
    expect(errors).not.toHaveBeenCalled();
  });
});

describe('no dead ends', () => {
  it('an unknown address offers Home and Fix It', async () => {
    renderAt('/nope');
    const main = await screen.findByRole('main', { name: 'No screen here' });
    expect(within(main).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    expect(within(main).getByRole('link', { name: 'Fix It' }).getAttribute('href')).toBe('/fixit');
  });

  it('the Job Runner placeholder names Phase 3 and the job sheet the phone can act on, with Fix It, Quick cards, and Home', async () => {
    renderAt('/job');
    const main = await screen.findByRole('main', { name: 'Job Runner' });
    expect(main.textContent).toContain('The Job Runner arrives in Phase 3.');
    expect(main.textContent).toContain('Until then, keep using the Model Y job sheet you already have.');
    expect(main.textContent).not.toContain('reference/');
    for (const name of ['Fix It', 'Quick cards', 'Home']) expect(within(main).getByRole('link', { name })).toBeTruthy();
    // A study phone is told the Job Runner is shop-phone only, with the way to set it up.
    expect(await within(main).findByRole('link', { name: 'Set up this phone' })).toBeTruthy();
  });

  it('the Academy outline lists Levels 0 to 8, says what arrives in Phase 5, and offers Quick cards and Search', async () => {
    renderAt('/academy');
    const heading = await screen.findByRole('heading', { level: 1, name: 'Academy' });
    const main = heading.closest('main');
    if (main === null) throw new Error('the Academy heading is not in a main');
    expect(main.textContent).toContain('Drills, quizzes, and sign-off arrive in Phase 5.');
    for (let level = 0; level <= 8; level += 1) expect(main.textContent).toContain(`Level ${level}.`);
    expect(within(main).getByRole('button', { name: 'Quick cards' })).toBeTruthy();
    expect(within(main).getByRole('button', { name: 'Search' })).toBeTruthy();
  });

  it('every new page offers a way back: fix, lesson, procedure, and item pages, found or not', async () => {
    for (const path of ['/fixit/fix-nope', '/academy/lesson-nope', '/sops', '/sops/sop-nope', '/items/product-nope']) {
      const view = renderAt(path);
      await shellReady();
      const main = (await screen.findAllByRole('main'))[0];
      if (main === undefined) throw new Error(`${path}: no main`);
      expect({ path, buttons: within(main).getAllByRole('button').length > 1 }).toEqual({ path, buttons: true });
      view.unmount();
    }
  });
});

describe('first run (D12) and the notices', () => {
  it('the setup and install notices stay off working screens such as Fix It', async () => {
    renderAt('/fixit');
    await shellReady();
    expect(screen.queryByText('Set up this phone')).toBeNull();
    expect(screen.queryByText('Install on this phone')).toBeNull();
    expect(screen.queryByRole('radio', { name: 'Shop' })).toBeNull();
  });

  it('a new install opens straight into Home with the setup banner, which closes for the session', async () => {
    renderAt('/');
    expect(await screen.findByText('Set up this phone')).toBeTruthy();
    expect(screen.getByRole('main', { name: 'Masterclass 101' })).toBeTruthy();
    const banner = screen.getByText('Set up this phone').closest('.ui-banner') as HTMLElement;
    fireEvent.click(within(banner).getByRole('button', { name: 'Later' }));
    await waitFor(() => expect(screen.queryByText('Set up this phone')).toBeNull());
  });

  it('the install card shows in a browser tab and Not now hides it', async () => {
    renderAt('/');
    expect(await screen.findByText('Install on this phone')).toBeTruthy();
    const card = screen.getByText('Install on this phone').closest('.ui-banner') as HTMLElement;
    fireEvent.click(within(card).getByRole('button', { name: 'Not now' }));
    await waitFor(() => expect(screen.queryByText('Install on this phone')).toBeNull());
  });
});

describe('modes and densities', () => {
  it('Shop and Academy switch the density on <html>', async () => {
    renderAt('/');
    await shellReady();
    expect(document.documentElement.dataset.density).toBe('shop');
    fireEvent.click(screen.getByRole('radio', { name: 'Academy' }));
    await waitFor(() => expect(document.documentElement.dataset.density).toBe('academy'));
  });

  it('a right thumb mirrors the row through data-hand on <html>', async () => {
    renderAt('/');
    await shellReady();
    expect(document.documentElement.dataset.hand).toBeUndefined();
    await act(async () => {
      await updateSettings({ handedness: 'right' });
    });
    await waitFor(() => expect(document.documentElement.dataset.hand).toBe('right'));
  });

  it('a study phone cannot turn Customer View on: the reason shows with a way to set up, and nothing changes', async () => {
    renderAt('/');
    await shellReady();
    fireEvent.click(screen.getByRole('radio', { name: 'Customer' }));
    expect(await screen.findByText(/This phone is a study phone/)).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Set up this phone' }).length).toBeGreaterThan(0);
    expect(document.documentElement.dataset.density).toBe('shop');
    expect(within(bottomRow()).getByRole('link', { name: 'Fix It' })).toBeTruthy();
  });
});

describe('Customer View in the shell (3.4, D10)', () => {
  beforeEach(async () => {
    const result = await startFresh({ warningAccepted: true, newPin: '482915' });
    if (!result.ok) throw new Error(`startFresh refused: ${result.message}`);
  });

  it('on the shop phone: every route shows the customer screen, no internal item, only the way out', async () => {
    expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
    renderAt('/settings');
    const main = await screen.findByRole('main', { name: config.brandName });
    expect(main.textContent).toContain('Turn on your Customer Focus: Control Center, Focus.');
    expect(document.documentElement.dataset.density).toBe('customer');
    expect(document.querySelectorAll('[data-internal]').length).toBe(0);
    expect(screen.queryByRole('link', { name: 'Fix It' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Search' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Settings' })).toBeNull();
    expect(screen.queryByRole('radio', { name: 'Shop' })).toBeNull();
    expect(document.querySelectorAll('.ui-banner').length).toBe(0);
    expect(within(bottomRow()).getAllByRole('button')).toHaveLength(1);
  });

  it('Done records the Focus reminder, and Exit Customer View is one tap with no session', async () => {
    expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
    renderAt('/');
    fireEvent.click(await screen.findByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByText(/Customer Focus/)).toBeNull());
    fireEvent.click(within(bottomRow()).getByRole('button', { name: 'Exit Customer View' }));
    await waitFor(() => expect(within(bottomRow()).getByRole('link', { name: 'Fix It' })).toBeTruthy());
    expect(document.documentElement.dataset.density).toBe('shop');
  });

  it('the mode switch on Home turns it on', async () => {
    renderAt('/');
    await shellReady();
    fireEvent.click(screen.getByRole('radio', { name: 'Customer' }));
    await waitFor(() => expect(document.documentElement.dataset.density).toBe('customer'));
    expect(screen.queryByRole('link', { name: 'Fix It' })).toBeNull();
  });
});

describe('fail closed while the saved flag loads', () => {
  it('draws no internal screen and no Fix It before the flag is read', () => {
    renderAt('/settings');
    expect(screen.queryByRole('link', { name: 'Fix It' })).toBeNull();
    expect(document.querySelectorAll('[data-internal]').length).toBe(0);
    expect(screen.getByText('Opening')).toBeTruthy();
  });
});
