/**
 * A product's notes (DEF-20, Product.notes added 2026-10-12): the item page draws each note as its
 * own line in order, a pending decision with its own badge, a superseded line never; the label
 * paragraph stays last. Search finds a word that is only in the notes. Test words only: no number
 * or direction here is a house or label value.
 */
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildSearchIndex, runSearch } from '../../core/searchEngine';
import { ContentItem, type ContentItemValue } from '../../schemas';
import { afterAllReset, renderScreen, resetAll } from '../settings/__tests__/harness';
import { ItemDetail } from './ItemDetail';

const product = (notes: unknown[]): ContentItemValue =>
  ContentItem.parse({
    id: 'product-test-notes',
    type: 'product',
    title: 'Test wheel cleaner',
    audience: ['owner', 'crew'],
    visibility: 'internal',
    status: 'house',
    brand: 'Test brand',
    jobs: ['Wheels.'],
    notes,
    sources: [{ label: 'Test manual', url: 'https://example.com/manual.pdf', date: '2026-10-10', note: 'Fact-checker test finding.' }],
    labelNotes: 'The label paragraph.',
  });

const THREE = [
  { text: 'House line: the test words.', status: 'house' },
  { text: 'The test manual says otherwise.', status: 'sourced' },
  { text: 'Lando decides how this applies (pending).', status: 'verify' },
  { text: 'Zebrawood line that was replaced.', status: 'superseded' },
];

beforeEach(async () => {
  await resetAll();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

describe('ItemDetail: a product with notes', () => {
  it('draws each note as its own line, in order, the pending one with its own badge, and the label paragraph after them', async () => {
    renderScreen('/x', { '/x': <ItemDetail item={product(THREE)} /> });
    const list = await screen.findByRole('list', { name: 'Notes' });
    expect(screen.getByRole('heading', { level: 2, name: 'Notes' })).toBeInTheDocument();
    const lines = within(list).getAllByRole('listitem');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toHaveTextContent(/^House line: the test words\.$/);
    expect(lines[1]).toHaveTextContent(/^The test manual says otherwise\.$/);
    expect(lines[2]).toHaveTextContent('Lando decides how this applies (pending).');
    // The badge is internal: it draws once the saved Customer View flag is read.
    expect(await within(lines[2] as HTMLElement).findByText('pending')).toHaveClass('mc-badge');
    expect(within(lines[0] as HTMLElement).queryByText(/pending|unverified/)).toBeNull();
    expect(within(lines[1] as HTMLElement).queryByText(/pending|unverified/)).toBeNull();
    expect(lines[2]).toHaveAttribute('data-pending', 'true');
    expect(screen.queryByText(/Zebrawood/)).toBeNull();
    const label = screen.getByText('The label paragraph.');
    expect(list.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('in the sheet the heading sits one level down', async () => {
    renderScreen('/x', { '/x': <ItemDetail item={product(THREE)} headingLevel={3} /> });
    expect(await screen.findByRole('heading', { level: 3, name: 'Notes' })).toBeInTheDocument();
  });

  it('no notes, or only superseded ones: no Notes heading', async () => {
    renderScreen('/x', { '/x': <ItemDetail item={product([{ text: 'Zebrawood line.', status: 'superseded' }])} /> });
    expect(await screen.findByText('The label paragraph.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Notes' })).toBeNull();
    expect(screen.queryByRole('list', { name: 'Notes' })).toBeNull();
  });
});

describe('search: a product note is searchable', () => {
  it('finds a word that is only in the notes, and never a superseded one', () => {
    const index = buildSearchIndex([product(THREE)], []);
    expect(runSearch(index, 'otherwise')[0]?.id).toBe('product-test-notes');
    expect(runSearch(index, 'zebrawood')).toEqual([]);
  });
});
