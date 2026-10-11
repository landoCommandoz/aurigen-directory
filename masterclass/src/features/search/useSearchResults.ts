/**
 * The search box's query and live results, from core search (on the device, well under 100 ms).
 * Results are computed in the change handler, not in an effect: with the index loaded the answer
 * is synchronous; before that, the first query waits for the index and only the answer for the
 * latest query is kept, so a slow answer never replaces a newer one.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ContentTypeName } from '../../schemas';
import { describeError } from '../../core/errors';
import { preloadSearch, search, searchNow, type SearchHit } from '../../core/search';

export interface SearchState {
  query: string;
  setQuery: (next: string) => void;
  hits: SearchHit[];
  /** The query is typed but its answer has not arrived yet (only before the index has loaded). */
  loading: boolean;
  error: string | null;
}

interface Answer {
  query: string;
  hits: SearchHit[];
  error: string | null;
}

export interface SearchOptions {
  limit?: number;
  types?: readonly ContentTypeName[];
}

export function useSearch(initialQuery: string, opts: SearchOptions = {}): SearchState {
  const limit = opts.limit ?? 20;
  const types = opts.types;
  const [query, setQueryState] = useState(initialQuery);
  const [answer, setAnswer] = useState<Answer>({ query: '', hits: [], error: null });
  const latest = useRef(initialQuery.trim());

  const run = useCallback(
    (raw: string) => {
      const q = raw.trim();
      latest.current = q;
      if (q === '') return;
      const searchOpts = types === undefined ? { limit } : { limit, types };
      const now = searchNow(q, searchOpts);
      if (now !== null) {
        setAnswer({ query: q, hits: now, error: null });
        return;
      }
      search(q, searchOpts)
        .then((hits) => {
          if (latest.current === q) setAnswer({ query: q, hits, error: null });
        })
        .catch((error: unknown) => {
          if (latest.current === q) setAnswer({ query: q, hits: [], error: `Search hit a problem. ${describeError(error)}` });
        });
    },
    [limit, types],
  );

  // Load the index once; then answer a query that arrived with the page (?q=).
  useEffect(() => {
    let live = true;
    const first = latest.current;
    preloadSearch()
      .then(() => {
        if (live && first !== '' && latest.current === first) run(first);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [run]);

  const setQuery = useCallback(
    (next: string) => {
      setQueryState(next);
      run(next);
    },
    [run],
  );

  const q = query.trim();
  if (q === '') return { query, setQuery, hits: [], loading: false, error: null };
  if (answer.query !== q) return { query, setQuery, hits: answer.query === '' ? [] : answer.hits, loading: true, error: null };
  return { query, setQuery, hits: answer.hits, loading: false, error: answer.error };
}
