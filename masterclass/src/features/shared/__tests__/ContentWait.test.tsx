import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONTENT_NOT_LOADED, contentCount, getItem, __setContentBundleForTests } from '../../../core/content';
import { __resetSearchForTests, searchStatus } from '../../../core/search';
import { FixItGrid } from '../../fixit/FixItGrid';
import { FixPage } from '../../fixit/FixPage';
import { SearchBox } from '../../search/SearchBox';
import { afterAllReset, currentPath, renderScreen, resetAll } from '../../settings/__tests__/harness';
import { ContentWait, ContentWaitBody, OPENING_LINE } from '../ContentWait';

const BACK = { to: '/fixit', label: 'All symptoms' };

beforeEach(async () => {
  await resetAll();
  // The generated content, unloaded, as on a phone that just opened the app.
  __setContentBundleForTests(null);
  __resetSearchForTests();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

describe('ContentWait', () => {
  it('while loading: the frame, its way back, and one plain line', async () => {
    renderScreen('/x', { '/x': <ContentWait title="Fix It" back={BACK} content={{ problem: null, retry: () => undefined }} /> });
    // An internal screen waits for the saved Customer View flag (fail closed), then draws.
    expect(await screen.findByRole('heading', { level: 1, name: 'Fix It' })).toBeInTheDocument();
    expect(screen.getByText(OPENING_LINE)).toBeInTheDocument();
    // Busy, as the shell's own Opening frame is, so a screen reader and the tests both wait.
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'All symptoms' }));
    expect(currentPath()).toBe('/fixit');
  });

  it('while only the Customer View flag loads: the frame alone', async () => {
    renderScreen('/x', { '/x': <ContentWait title="Fix It" back={BACK} /> });
    expect(await screen.findByRole('heading', { level: 1, name: 'Fix It' })).toBeInTheDocument();
    expect(screen.queryByText(OPENING_LINE)).toBeNull();
  });

  it('a failure is a final state: the frame is no longer busy', async () => {
    renderScreen('/x', { '/x': <ContentWait title="Fix It" back={BACK} content={{ problem: CONTENT_NOT_LOADED, retry: () => undefined }} /> });
    expect(await screen.findByText(/did not load/)).toBeInTheDocument();
    expect(screen.getByRole('main')).not.toHaveAttribute('aria-busy');
  });

  it('when content did not load: why, Try again, and Home', () => {
    const retry = vi.fn<() => void>();
    renderScreen('/x', { '/x': <ContentWaitBody content={{ problem: CONTENT_NOT_LOADED, retry }} />, '/': <p>Home page</p> });
    expect(screen.getByText(/did not load/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(currentPath()).toBe('/');
  });
});

describe.skipIf(contentCount('fixnode') === 0)('pages on the generated content, loaded in shards', () => {
  it('a fix page says Opening, then draws the fix from its shard', async () => {
    renderScreen('/fixit/fix-01', { '/fixit/:id': <FixPage /> });
    expect(await screen.findByText(OPENING_LINE)).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    const title = await waitFor(() => {
      const fix = getItem('fix-01');
      if (fix === undefined) throw new Error('not loaded yet');
      return fix.title;
    });
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.queryByText(OPENING_LINE)).toBeNull();
    expect(screen.getByRole('main')).not.toHaveAttribute('aria-busy');
    expect(await screen.findByRole('list', { name: 'Related' })).toBeInTheDocument();
  });

  it('the Fix It grid keeps its search box while the tiles load, and a word typed meanwhile stays', async () => {
    renderScreen('/fixit', { '/fixit': <FixItGrid /> });
    const box = await screen.findByLabelText('What is happening?');
    fireEvent.change(box, { target: { value: 'swirl' } });
    await waitFor(() => expect(screen.getAllByRole('button').length).toBeGreaterThan(10));
    expect(screen.getByLabelText('What is happening?')).toHaveValue('swirl');
    expect(screen.getByLabelText('What is happening?')).toBe(box);
  });
});

describe('the search box and the index', () => {
  it('a box on screen does not load the index until it is focused', async () => {
    renderScreen('/x', { '/x': <SearchBox label="Search here" /> });
    const box = await screen.findByLabelText('Search here');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(searchStatus.get().state).toBe('idle');
    fireEvent.focus(box);
    await waitFor(() => expect(searchStatus.get().state).toBe('ready'));
  });

  it('Enter before the index has loaded still opens the top answer for exactly the words typed', async () => {
    renderScreen('/x', { '/x': <SearchBox label="Search here" />, '/fixit/:id': <p>Fix page</p> });
    const box = await screen.findByLabelText('Search here');
    fireEvent.change(box, { target: { value: 'bucket mix' } });
    fireEvent.change(box, { target: { value: 'jerking' } });
    expect(searchStatus.get().state).not.toBe('ready');
    fireEvent.keyDown(box, { key: 'Enter' });
    await waitFor(() => expect(currentPath()).toBe('/fixit/fix-01'));
  });

  it('a word changed before the index answers is not opened (no stale result)', async () => {
    renderScreen('/x', { '/x': <SearchBox label="Search here" />, '/fixit/:id': <p>Fix page</p>, '/cards/:id': <p>Card page</p> });
    const box = await screen.findByLabelText('Search here');
    fireEvent.change(box, { target: { value: 'jerking' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    fireEvent.change(box, { target: { value: 'jerking more' } });
    await waitFor(() => expect(searchStatus.get().state).toBe('ready'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(currentPath()).toBe('/x');
  });
});
