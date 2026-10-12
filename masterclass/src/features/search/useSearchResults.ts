/**
 * The search box's query and live results, from core search (on the device, well under 100 ms).
 * Results are computed in the change handler, not in an effect: with the index loaded the answer
 * is synchronous; before that, the first query waits for the index and only the answer for the
 * latest query is kept, so a slow answer never replaces a newer one.
 * The index loads when the box is first focused (prepare), or at once when the page arrived with
 * a query (?q=); the app's warm-up loads it after the first screen otherwise (app/warmUp.ts). A box
 * on screen never puts the index ahead of the first screen (QA DEF-17).
 *
 * When the index did not load (QA DEF-26) the box says so in plain words with Try again, never
 * "Nothing found". The next word starts a fresh load, and once the index arrives by any path (the
 * warm-up, Enter, Try again) the word on screen is answered without another keystroke.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ContentTypeName } from '../../schemas';
import { preloadSearch, retrySearch, search, SearchNotLoaded, searchNow, searchStatus, useSearchLoadState, type SearchHit } from '../../core/search';
import { describeError } from '../../core/errors';

/** A failure that is not a load failure (a bug): plain words here, the detail in the developer panel. */
export const SEARCH_PROBLEM = 'Search hit a problem. Tap Try again.';

export interface SearchState {
  query: string;
  setQuery: (next: string) => void;
  hits: SearchHit[];
  /** The query is typed but its answer has not arrived yet (only before the index has loaded). */
  loading: boolean;
  /** Plain words when search could not answer, shown with Try again; null otherwise. */
  error: string | null;
  /** Start loading the index now (the box was focused), so the first word answers at once. */
  prepare: () => void;
  /** Try again after search did not load. */
  retry: () => void;
}

interface Answer {
  query: string;
  hits: SearchHit[];
  error: string | null;
  /** The index did not load: the answer comes on its own once it does. */
  notLoaded: boolean;
}

const NO_ANSWER: Answer = { query: '', hits: [], error: null, notLoaded: false };

export interface SearchOptions {
  limit?: number;
  types?: readonly ContentTypeName[];
}

function plainWords(error: unknown): string {
  if (error instanceof SearchNotLoaded) return error.message;
  searchStatus.update({ lastError: `Search failed: ${describeError(error)}` });
  return SEARCH_PROBLEM;
}

export function useSearch(initialQuery: string, opts: SearchOptions = {}): SearchState {
  const limit = opts.limit ?? 20;
  const types = opts.types;
  const [query, setQueryState] = useState(initialQuery);
  const [answer, setAnswer] = useState<Answer>(NO_ANSWER);
  const latest = useRef(initialQuery.trim());
  const loadState = useSearchLoadState();

  const fail = useCallback((q: string, error: unknown) => {
    if (latest.current === q) setAnswer({ query: q, hits: [], error: plainWords(error), notLoaded: error instanceof SearchNotLoaded });
  }, []);

  const run = useCallback(
    (raw: string) => {
      const q = raw.trim();
      latest.current = q;
      if (q === '') return;
      const searchOpts = types === undefined ? { limit } : { limit, types };
      let now: SearchHit[] | null;
      try {
        now = searchNow(q, searchOpts);
      } catch (error) {
        fail(q, error);
        return;
      }
      if (now !== null) {
        setAnswer({ query: q, hits: now, error: null, notLoaded: false });
        return;
      }
      // A new load is starting: a failure from an earlier one no longer stands.
      setAnswer((prev) => (prev.error === null ? prev : NO_ANSWER));
      search(q, searchOpts)
        .then((hits) => {
          if (latest.current === q) setAnswer({ query: q, hits, error: null, notLoaded: false });
        })
        .catch((error: unknown) => fail(q, error));
    },
    [limit, types, fail],
  );

  // A query that arrived with the page (?q=): load the index, then answer it.
  useEffect(() => {
    let live = true;
    const first = latest.current;
    if (first === '') return undefined;
    preloadSearch()
      .then(() => {
        if (live && latest.current === first) run(first);
      })
      .catch((error: unknown) => {
        if (live) fail(first, error);
      });
    return () => {
      live = false;
    };
  }, [run, fail]);

  // The index arrived by another path (the warm-up, Enter, another box): answer the word on screen.
  useEffect(() => {
    if (loadState !== 'ready' || !answer.notLoaded) return;
    if (answer.query !== '' && answer.query === latest.current) run(answer.query);
  }, [loadState, answer, run]);

  const setQuery = useCallback(
    (next: string) => {
      setQueryState(next);
      run(next);
    },
    [run],
  );

  const prepare = useCallback(() => {
    preloadSearch().catch(() => undefined);
  }, []);

  const retry = useCallback(() => {
    const q = latest.current;
    setAnswer(NO_ANSWER);
    retrySearch()
      .then(() => {
        if (latest.current === q) run(q);
      })
      .catch((error: unknown) => fail(q, error));
  }, [run, fail]);

  const q = query.trim();
  if (q === '') return { query, setQuery, hits: [], loading: false, error: null, prepare, retry };
  if (answer.query !== q) return { query, setQuery, hits: answer.query === '' ? [] : answer.hits, loading: true, error: null, prepare, retry };
  return { query, setQuery, hits: answer.hits, loading: false, error: answer.error, prepare, retry };
}
