/**
 * The search box when the index did not load (QA DEF-26): plain words with Try again, never
 * "Nothing found"; Try again, the next word, or the index arriving by another path answers the
 * word on screen. Core search's loading is replaced here; core/searchLoadFailure.test.ts covers it.
 */
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../core/search';
import { afterAllReset, currentPath, renderScreen, resetAll } from '../settings/__tests__/harness';
import { FIX_JERK } from '../shared/__tests__/fixture';
import { SearchBox } from './SearchBox';

vi.mock('../../core/search', async (importOriginal) => {
  const real = await importOriginal<typeof import('../../core/search')>();
  return {
    ...real,
    search: vi.fn<typeof real.search>(),
    searchNow: vi.fn<typeof real.searchNow>(),
    preloadSearch: vi.fn<typeof real.preloadSearch>(),
    retrySearch: vi.fn<typeof real.retrySearch>(),
  };
});

const search = vi.mocked(core.search);
const searchNow = vi.mocked(core.searchNow);
const preloadSearch = vi.mocked(core.preloadSearch);
const retrySearch = vi.mocked(core.retrySearch);

const TITLE = 'Polisher jerks, walks, or hops side to side';
const HIT: core.SearchHit = { id: FIX_JERK, type: 'fixnode', title: TITLE, status: 'house', score: 1 };
const notLoaded = (words = core.SEARCH_NOT_LOADED) => new core.SearchNotLoaded(words);
const ROUTES = { '/x': <SearchBox label="Search here" />, '/fixit/:id': <p>Fix page</p> };
/** The visible failure line (the screen-reader line under the box says the same words). */
const LINE = { selector: '.mc-status' };

beforeEach(async () => {
  await resetAll();
  searchNow.mockReturnValue(null);
  search.mockRejectedValue(notLoaded());
  preloadSearch.mockRejectedValue(notLoaded());
  retrySearch.mockRejectedValue(notLoaded());
});

afterEach(() => {
  cleanup();
  afterAllReset();
  vi.clearAllMocks();
});

/** The box, with "jerking" typed while search cannot load. */
async function failedBox(): Promise<HTMLElement> {
  renderScreen('/x', ROUTES);
  const box = await screen.findByLabelText('Search here');
  fireEvent.change(box, { target: { value: 'jerking' } });
  expect(await screen.findByText(core.SEARCH_NOT_LOADED, LINE)).toBeInTheDocument();
  return box;
}

describe('the search box when search did not load', () => {
  it('says so in plain words with Try again, never "Nothing found", not even to a screen reader', async () => {
    await failedBox();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText(core.SEARCH_NOT_LOADED, { selector: '[aria-live]' })).toBeInTheDocument();
    expect(screen.queryByText(/Nothing found/)).toBeNull();
    expect(screen.queryByText(/TypeError|https?:\/\//)).toBeNull();
  });

  it('Try again with the signal back answers the word on screen', async () => {
    await failedBox();
    retrySearch.mockResolvedValue(undefined);
    searchNow.mockReturnValue([HIT]);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(TITLE)).toBeInTheDocument();
    expect(screen.queryByText(core.SEARCH_NOT_LOADED, LINE)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  });

  it('Try again with no signal says so, and Try again stays', async () => {
    await failedBox();
    retrySearch.mockRejectedValue(notLoaded(core.SEARCH_NO_SIGNAL));
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(core.SEARCH_NO_SIGNAL, LINE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('the index arriving by another path (the warm-up) answers the word with no keystroke', async () => {
    await failedBox();
    searchNow.mockReturnValue([HIT]);
    act(() => core.searchStatus.update({ state: 'ready' }));
    expect(await screen.findByText(TITLE)).toBeInTheDocument();
    expect(screen.queryByText(core.SEARCH_NOT_LOADED, LINE)).toBeNull();
  });

  it('the next word starts a fresh load and shows no stale failure while it runs', async () => {
    const box = await failedBox();
    let answer: (hits: core.SearchHit[]) => void = () => undefined;
    search.mockImplementation(() => new Promise<core.SearchHit[]>((resolve) => (answer = resolve)));
    fireEvent.change(box, { target: { value: 'jerkin' } });
    expect(screen.queryByText(core.SEARCH_NOT_LOADED, LINE)).toBeNull();
    expect(screen.getByText('Searching')).toBeInTheDocument();
    act(() => answer([HIT]));
    expect(await screen.findByText(TITLE)).toBeInTheDocument();
  });

  it('Enter after a failure loads again and opens the top answer when it arrives', async () => {
    const box = await failedBox();
    search.mockResolvedValue([HIT]);
    fireEvent.keyDown(box, { key: 'Enter' });
    await waitFor(() => expect(currentPath()).toBe(`/fixit/${FIX_JERK}`));
  });

  it('a bug in search shows plain words too, with the detail kept for the developer panel', async () => {
    search.mockRejectedValue(new RangeError('index out of range'));
    renderScreen('/x', ROUTES);
    fireEvent.change(await screen.findByLabelText('Search here'), { target: { value: 'jerking' } });
    expect(await screen.findByText('Search hit a problem. Tap Try again.', LINE)).toBeInTheDocument();
    expect(screen.queryByText(/RangeError/)).toBeNull();
    expect(core.searchStatus.get().lastError).toMatch(/RangeError: index out of range/);
  });
});
