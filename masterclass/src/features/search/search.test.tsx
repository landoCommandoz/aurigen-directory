import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { preloadSearch, searchNow } from '../../core/search';
import type { ContentItemValue } from '../../schemas';
import { afterAllReset, currentPath, loadSeedBundle, renderScreen, resetAll } from '../settings/__tests__/harness';
import { CUSTOMER_VIEW_NOTICE } from '../settings/ui/InternalNotice';
import { groupHits, hitRoute, resultsWords, topCards, TOP_CARD_IDS } from './searchModel';
import { SearchScreen } from './SearchScreen';

const ROUTES = { '/search': <SearchScreen />, '/cards/:id': <p>Card page</p>, '/': <p>Home</p> };

let items: ContentItemValue[] = [];

beforeEach(async () => {
  await resetAll();
  items = loadSeedBundle();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

function titleOf(id: string): string {
  const item = items.find((i) => i.id === id);
  if (item === undefined) throw new Error(`${id} is not in the seed`);
  return item.title;
}

describe('search model', () => {
  const hit = (id: string, type: ContentItemValue['type'], score: number) => ({ id, type, title: id, status: 'house' as const, score });

  it('groups by type in the order of each group best hit, keeping rank inside a group', () => {
    const groups = groupHits([hit('product-a', 'product', 9), hit('card-a', 'quickcard', 8), hit('product-b', 'product', 7), hit('term-a', 'glossaryterm', 6)]);
    expect(groups.map((g) => g.label)).toEqual(['Products', 'Quick Cards', 'Glossary']);
    expect(groups[0]?.hits.map((h) => h.id)).toEqual(['product-a', 'product-b']);
    expect(groupHits([])).toEqual([]);
  });

  it('picks the five top cards in the preferred order and fills any gap', () => {
    const cards = items.filter((i) => i.type === 'quickcard');
    expect(topCards(cards).map((c) => c.id)).toEqual([...TOP_CARD_IDS]);
    const without = cards.filter((c) => c.id !== 'card-pad-ladder');
    const picked = topCards(without);
    expect(picked).toHaveLength(5);
    expect(new Set(picked.map((c) => c.id)).size).toBe(5);
    expect(topCards([])).toEqual([]);
  });

  it('sends cards to their page and everything else to the sheet', () => {
    expect(hitRoute({ id: 'card-pad-ladder', type: 'quickcard' })).toBe('/cards/card-pad-ladder');
    expect(hitRoute({ id: 'product-meguiars-m210', type: 'product' })).toBeNull();
  });

  it('words the result count for the live region', () => {
    expect(resultsWords('', 0)).toBe('');
    expect(resultsWords('pad', 1)).toBe('1 result');
    expect(resultsWords('pad', 3)).toBe('3 results');
    expect(resultsWords(' zzz ', 0)).toMatch(/Nothing found for "zzz"/);
  });
});

describe('search on the seed content', () => {
  it('answers in well under 100 ms once loaded', async () => {
    await preloadSearch();
    for (const q of ['what speed', 'which pad', 'clay lube', 'garage only', 'how much soap', 'thickness']) {
      const started = performance.now();
      const hits = searchNow(q, { limit: 20 });
      expect(performance.now() - started).toBeLessThan(100);
      expect(hits?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it('returns a card for a synonym that is not in its title, and Enter opens it', async () => {
    renderScreen('/search', ROUTES);
    const box = await screen.findByLabelText('Search');
    fireEvent.change(box, { target: { value: 'what speed' } });
    const title = titleOf('card-machine-settings');
    expect(title.toLowerCase()).not.toContain('speed');
    const group = await screen.findByRole('list', { name: 'Quick Cards' });
    expect(within(group).getByText(title)).toBeInTheDocument();
    expect(currentPath()).toBe('/search?q=what+speed');
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(currentPath()).toBe('/cards/card-machine-settings');
  });

  it('opens a product in a sheet, with its words', async () => {
    renderScreen('/search', ROUTES);
    fireEvent.change(await screen.findByLabelText('Search'), { target: { value: 'M210' } });
    const products = await screen.findByRole('list', { name: 'Products' });
    fireEvent.click(within(products).getByText(titleOf('product-meguiars-m210')));
    const sheet = await screen.findByRole('dialog');
    expect(within(sheet).getByText('What it is for')).toBeInTheDocument();
    fireEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
  });

  it('shows the top five cards when empty, and says so plainly when nothing matches', async () => {
    renderScreen('/search', ROUTES);
    const top = await screen.findByRole('list', { name: 'Top cards' });
    expect(within(top).getAllByRole('listitem')).toHaveLength(5);
    expect(within(top).getByText(titleOf('card-stop-rules'))).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'qqqzzzxx' } });
    expect(await screen.findByText(/Nothing found for "qqqzzzxx"/, { selector: '.sr-results__none' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByLabelText('Search'), { key: 'Escape' });
    expect(screen.getByLabelText('Search')).toHaveValue('');
  });

  it('keeps the query from the address and shows the dictation hint', async () => {
    renderScreen('/search?q=clay%20lube', ROUTES);
    expect(await screen.findByText('Tap the mic on your keyboard to say it.')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toHaveValue('clay lube');
    const cards = await screen.findByRole('list', { name: 'Quick Cards' });
    expect(within(cards).getByText(titleOf('card-clay-tub'))).toBeInTheDocument();
  });

  it('is not offered in Customer View', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen('/search', ROUTES);
    expect(await screen.findByText(CUSTOMER_VIEW_NOTICE)).toBeInTheDocument();
    expect(screen.queryByLabelText('Search')).toBeNull();
  });
});
