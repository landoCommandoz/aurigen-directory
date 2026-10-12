import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppRoutes } from '../../app/routes';
import { setMode } from '../../app/mode';
import { ToastProvider } from '../../components/ui';
import { __setContentBundleForTests } from '../../core/content';
import { emptyBundle } from '../../core/contentBundle';
import { CustomerViewProvider, turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { __resetSearchForTests } from '../../core/search';
import type { ContentItemValue } from '../../schemas';
import { afterAllReset, currentPath, renderScreen, resetAll } from '../settings/__tests__/harness';
import { CUSTOMER_VIEW_NOTICE } from '../settings/ui/InternalNotice';
import { FIX_JERK, FIX_STOP, FIX_TESLA } from '../shared/__tests__/fixture';
import { loadFixtureBundle } from '../shared/__tests__/helpers';
import { EMPTY_FIXES_LINE, FixItGrid } from './FixItGrid';
import { FixPage } from './FixPage';
import { GROUP_LABELS, groupFixes, isStopSymptom, stopBandText } from './fixModel';

const ROUTES = { '/fixit': <FixItGrid />, '/fixit/:id': <FixPage />, '/cards/:id': <p>Card page</p>, '/cards': <p>All cards</p>, '/': <p>Home</p> };

let items: ContentItemValue[] = [];

beforeEach(async () => {
  await resetAll();
  items = loadFixtureBundle();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

function titleOf(id: string): string {
  const item = items.find((i) => i.id === id);
  if (item === undefined) throw new Error(`${id} is not in the fixture`);
  return item.title;
}

describe('fix model', () => {
  it('groups fixes in FIX_GROUPS order with plain names, the STOP symptom apart', () => {
    const fixes = items.filter((i) => i.type === 'fixnode');
    const groups = groupFixes(fixes);
    expect(groups.map((g) => g.label)).toEqual(['Machine', 'Paint', 'Tesla']);
    expect(groups[0]?.tiles.map((f) => f.id)).toEqual(['fix-01', 'fix-02']);
    expect(groups[1]?.tiles).toEqual([]);
    expect(groups[1]?.stops.map((f) => f.id)).toEqual([FIX_STOP]);
    expect(groupFixes([])).toEqual([]);
    for (const label of Object.values(GROUP_LABELS)) expect(label).toMatch(/^[A-Z][a-z]/);
  });

  it('sorts ids by number, so fix-9 comes before fix-10', () => {
    const fix = (id: string) => ({ id, group: 'machine' as const, title: id });
    expect(groupFixes([fix('fix-10'), fix('fix-09'), fix('fix-100')])[0]?.tiles.map((f) => f.id)).toEqual(['fix-09', 'fix-10', 'fix-100']);
  });

  it('knows the STOP symptom by the one capitalized word, and words the band without it', () => {
    expect(isStopSymptom({ title: 'Paint color on the pad: STOP' })).toBe(true);
    expect(isStopSymptom({ title: 'Pad stops spinning' })).toBe(false);
    expect(stopBandText('Paint color on the pad: STOP')).toBe('Paint color on the pad');
    expect(stopBandText('STOP: paint on the pad')).toBe('paint on the pad');
    expect(stopBandText('STOP')).toBe('STOP');
  });
});

describe('FixItGrid', () => {
  it('shows the search box on top, every fix as a tile under its group, the STOP band, and the Quick Cards', async () => {
    renderScreen('/fixit', ROUTES);
    expect(await screen.findByLabelText('What is happening?')).toBeInTheDocument();
    expect(screen.queryByText(EMPTY_FIXES_LINE)).toBeNull();
    for (const name of ['Machine', 'Paint', 'Tesla']) expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    const machine = screen.getByRole('group', { name: 'Machine' });
    const tiles = within(machine).getAllByRole('button');
    expect(tiles).toHaveLength(2);
    // Every tile carries its group glyph and the symptom words.
    for (const tile of tiles) expect(tile.querySelector('.ui-tile__icon svg')).not.toBeNull();
    expect(within(machine).getByRole('button', { name: titleOf(FIX_JERK) })).toBeInTheDocument();
    // The STOP symptom is the red band, not a tile.
    const band = screen.getByRole('button', { name: /STOP\s+Paint color on the pad/ });
    expect(band).toHaveClass('ui-stopband');
    // An unverified fix says so on its tile.
    expect(within(screen.getByRole('group', { name: 'Tesla' })).getByRole('button', { name: /Tesla test symptom\s*Unverified/ })).toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Quick Cards' })).getAllByRole('button')).toHaveLength(1);
    expect(document.querySelector('[data-internal]')).not.toBeNull();
  });

  it('opens the fix page from a tile, and the STOP band opens its fix', async () => {
    renderScreen('/fixit', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: titleOf(FIX_JERK) }));
    expect(currentPath()).toBe(`/fixit/${FIX_JERK}`);
    expect(await screen.findByRole('heading', { level: 1, name: titleOf(FIX_JERK) })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Fix It' }));
    fireEvent.click(await screen.findByRole('button', { name: /STOP\s+Paint color on the pad/ }));
    expect(currentPath()).toBe(`/fixit/${FIX_STOP}`);
  });

  it('one word finds the fix: type it, press Enter, and the fix page opens', async () => {
    renderScreen('/fixit', ROUTES);
    const box = await screen.findByLabelText('What is happening?');
    fireEvent.change(box, { target: { value: 'jerking' } });
    const fixes = await screen.findByRole('list', { name: 'Fix It' });
    expect(within(fixes).getByText(titleOf(FIX_JERK))).toBeInTheDocument();
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(currentPath()).toBe(`/fixit/${FIX_JERK}`);
  });

  it('with zero fixes in the build, still offers search and the cards, and says so plainly', async () => {
    __setContentBundleForTests(emptyBundle());
    __resetSearchForTests();
    renderScreen('/fixit', ROUTES);
    expect(await screen.findByText(EMPTY_FIXES_LINE)).toBeInTheDocument();
    expect(screen.getByLabelText('What is happening?')).toBeInTheDocument();
    expect(screen.getByText('No Quick Cards in this build yet.')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Home' }).at(-1) as HTMLElement);
    expect(currentPath()).toBe('/');
  });

  it('is replaced by a plain notice in Customer View', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen('/fixit', ROUTES);
    expect(await screen.findByText(CUSTOMER_VIEW_NOTICE)).toBeInTheDocument();
    expect(screen.queryByText(titleOf(FIX_TESLA))).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
  });
});

describe('two taps to a fix, from any screen', () => {
  function renderApp(path: string) {
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

  it.each(['/', '/academy', '/search', `/academy/lesson-l4-03-pressure`])('from %s: Fix It, then the tile, shows the fix', async (path) => {
    setMode('shop');
    renderApp(path);
    const row = await screen.findByRole('navigation', { name: 'Main' });
    const fixIt = await within(row).findByRole('link', { name: 'Fix It' });
    fireEvent.click(fixIt); // tap 1
    const tile = await screen.findByRole('button', { name: titleOf(FIX_JERK) });
    fireEvent.click(tile); // tap 2
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: titleOf(FIX_JERK) })).toBeInTheDocument());
    // STOP is on screen without scrolling past anything else.
    expect(screen.getAllByText('STOP').length).toBeGreaterThan(0);
  });
});
