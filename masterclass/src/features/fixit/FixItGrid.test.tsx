import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { __setContentBundleForTests } from '../../core/content';
import { emptyBundle } from '../../core/contentBundle';
import { turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { ContentItem, type ContentItemValue } from '../../schemas';
import { afterAllReset, currentPath, loadSeedBundle, renderScreen, resetAll } from '../settings/__tests__/harness';
import { CUSTOMER_VIEW_NOTICE } from '../settings/ui/InternalNotice';
import { FixItGrid, PHASE_2_LINE } from './FixItGrid';

const ROUTES = { '/fixit': <FixItGrid />, '/cards/:id': <p>Card page</p>, '/cards': <p>All cards</p>, '/': <p>Home</p> };

let items: ContentItemValue[] = [];

beforeEach(async () => {
  await resetAll();
  items = loadSeedBundle();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

describe('FixItGrid (Phase 1)', () => {
  it('does something real: search on top, every Quick Card as a tile, the Phase 2 line, and Home', async () => {
    renderScreen('/fixit', ROUTES);
    expect(await screen.findByLabelText('What is happening?')).toBeInTheDocument();
    expect(screen.getByText(PHASE_2_LINE)).toBeInTheDocument();
    const tiles = screen.getByRole('group', { name: 'Quick Cards' });
    const cards = items.filter((i) => i.type === 'quickcard');
    expect(within(tiles).getAllByRole('button')).toHaveLength(cards.length);
    fireEvent.click(within(tiles).getByRole('button', { name: /Pad ladder for the test spot/ }));
    expect(currentPath()).toBe('/cards/card-pad-ladder');
  });

  it('Home is always in reach', async () => {
    renderScreen('/fixit', ROUTES);
    // The back link at the top and a 64 px Home button at the bottom, by the thumb.
    const homes = await screen.findAllByRole('button', { name: 'Home' });
    expect(homes).toHaveLength(2);
    const bottom = homes[homes.length - 1];
    if (bottom === undefined) throw new Error('no Home button');
    fireEvent.click(bottom);
    expect(currentPath()).toBe('/');
  });

  it('shows Fix It entries as tiles that open in a sheet once the content has them', async () => {
    const fix = ContentItem.parse({
      id: 'fix-01',
      type: 'fixnode',
      title: 'Polisher jerks, walks, or hops side to side',
      audience: ['owner', 'crew'],
      visibility: 'internal',
      status: 'house',
      group: 'machine',
      sayIt: ['jerking'],
      stopIf: ['Grinding noise or burning smell'],
      causes: ['Pad tilted onto an edge'],
      steps: ['Re-center the pad'],
    });
    __setContentBundleForTests({ ...emptyBundle(), items: [...items, fix] });
    renderScreen('/fixit', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Machine' })).toBeInTheDocument();
    expect(screen.queryByText(PHASE_2_LINE)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Polisher jerks, walks, or hops side to side' }));
    const sheet = await screen.findByRole('dialog');
    expect(within(sheet).getByText('STOP')).toBeInTheDocument();
    expect(within(sheet).getByText('Re-center the pad')).toBeInTheDocument();
  });

  it('is replaced by a plain notice in Customer View', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen('/fixit', ROUTES);
    expect(await screen.findByText(CUSTOMER_VIEW_NOTICE)).toBeInTheDocument();
    expect(screen.queryByText(PHASE_2_LINE)).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
  });
});
