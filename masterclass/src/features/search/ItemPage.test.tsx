import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { afterAllReset, currentPath, renderScreen, resetAll } from '../settings/__tests__/harness';
import { CUSTOMER_VIEW_NOTICE } from '../settings/ui/InternalNotice';
import { DRILL, FIX_JERK, LESSON_PRESSURE, PRODUCT, TERM, TOOL } from '../shared/__tests__/fixture';
import { loadFixtureBundle } from '../shared/__tests__/helpers';
import { ItemPage } from './ItemPage';
import { ItemSheet } from './ItemSheet';

/** Heading levels in document order; a step down may go any distance, a step up only by one. */
function skippedHeadings(root: ParentNode = document): string[] {
  const levels = Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => ({ level: Number(h.tagName.slice(1)), text: h.textContent ?? '' }));
  const skips: string[] = [];
  levels.forEach((h, i) => {
    const before = levels[i - 1];
    if (before !== undefined && h.level > before.level + 1) skips.push(`h${before.level} "${before.text}" to h${h.level} "${h.text}"`);
  });
  return skips;
}

const ROUTES = {
  '/items/:id': <ItemPage />,
  '/fixit/:id': <p>Fix page</p>,
  '/academy/:lessonId': <p>Lesson page</p>,
  '/search': <p>Search screen</p>,
  '/': <p>Home</p>,
};

beforeEach(async () => {
  await resetAll();
  loadFixtureBundle();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

describe('ItemPage', () => {
  it('shows a product with what it is for, related items, and where it comes from', async () => {
    renderScreen(`/items/${PRODUCT}`, ROUTES);
    expect(await screen.findByRole('heading', { level: 1, name: 'Test polish' })).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('What it is for')).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('list', { name: 'Related' })).getByText('Polisher jerks, walks, or hops side to side'));
    expect(currentPath()).toBe(`/fixit/${FIX_JERK}`);
  });

  it('shows a tool with its specs and leaves out a related drill, which has no page yet', async () => {
    renderScreen(`/items/${TOOL}`, ROUTES);
    expect(await screen.findByRole('heading', { level: 1, name: 'Test polisher' })).toBeInTheDocument();
    expect(screen.getByText('Tool')).toBeInTheDocument();
    expect(screen.getByText('Test throw.')).toBeInTheDocument();
    const related = screen.getByRole('list', { name: 'Related' });
    expect(within(related).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByText('Scale pressure drill')).toBeNull();
  });

  it('never skips a heading level on a product or a tool page (DEF-19)', async () => {
    renderScreen(`/items/${PRODUCT}`, ROUTES);
    expect(await screen.findByRole('heading', { level: 2, name: 'What it is for' })).toBeInTheDocument();
    expect(skippedHeadings()).toEqual([]);
    cleanup();
    renderScreen(`/items/${TOOL}`, ROUTES);
    expect(await screen.findByRole('heading', { level: 1, name: 'Test polisher' })).toBeInTheDocument();
    expect(skippedHeadings()).toEqual([]);
  });

  it('in the sheet, the detail headings sit one level under the sheet title', async () => {
    renderScreen('/sheet', { '/sheet': <ItemSheet id={PRODUCT} onClose={() => undefined} /> });
    // The sheet waits for the saved Customer View flag (fail closed), then shows the item.
    expect(await screen.findByRole('heading', { level: 2, name: 'Test polish' })).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { level: 3, name: 'What it is for' })).toBeInTheDocument();
    expect(skippedHeadings(dialog)).toEqual([]);
  });

  it('shows a glossary term', async () => {
    renderScreen(`/items/${TERM}`, ROUTES);
    expect(await screen.findByText('One pass each way.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Related' })).toBeNull();
  });

  it('sends an id that has its own page there', async () => {
    renderScreen(`/items/${LESSON_PRESSURE}`, ROUTES);
    expect(await screen.findByText('Lesson page')).toBeInTheDocument();
    expect(currentPath()).toBe(`/academy/${LESSON_PRESSURE}`);
  });

  it('an id with no page yet says which phase brings it, and offers the way out', async () => {
    renderScreen(`/items/${DRILL}`, ROUTES);
    expect(await screen.findByText('Drills open in the Academy, Phase 5.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Search' }));
    expect(currentPath()).toBe('/search');
  });

  it('an unknown id says so, with Search and Home', async () => {
    renderScreen('/items/product-nope', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Not found' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Home' }).at(-1) as HTMLElement);
    expect(currentPath()).toBe('/');
  });

  it('shows nothing internal in Customer View', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen(`/items/${PRODUCT}`, ROUTES);
    expect(await screen.findByText(CUSTOMER_VIEW_NOTICE)).toBeInTheDocument();
    expect(screen.queryByText('Test polish')).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
  });
});
