/**
 * The one search box (BLUEPRINT 2.1, 5): typed or dictated words (the keyboard's mic), results
 * from the device in well under 100 ms, grouped by type with Fix It first (searchModel.groupHits).
 * Enter opens the top result, which is always the first row on screen; every result opens its own
 * page. "/" focuses the box from anywhere, Escape clears it, and the arrow keys move through the
 * results. Search is internal: in Customer View the box is not on the page (BLUEPRINT 3.4).
 */
import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import { Row, RowList } from '../../components/ui';
import { getItemsByType } from '../../core/content';
import { Internal } from '../../core/customerView';
import { searchNow } from '../../core/search';
import type { ContentTypeName } from '../../schemas';
import { UnverifiedBadge } from './contentViews';
import { useItemOpener } from './ItemSheet';
import { firstShown, groupHits, resultsWords, topCards, TYPE_SINGULAR } from './searchModel';
import { useSearch } from './useSearchResults';
import './search.css';

export interface SearchBoxProps {
  /** The visible label. */
  label?: string;
  /** Move focus into the box when it opens (the search screen). */
  focusOnOpen?: boolean;
  initialQuery?: string;
  onQueryChange?: (query: string) => void;
  /** With an empty box, show the top five Quick Cards. */
  showEmptyState?: boolean;
  limit?: number;
  types?: readonly ContentTypeName[];
}

function typingElsewhere(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select') !== null);
}

export function SearchBox(props: SearchBoxProps) {
  return (
    <Internal>
      <SearchBoxInner {...props} />
    </Internal>
  );
}

function SearchBoxInner({ label = 'Search', focusOnOpen = false, initialQuery = '', onQueryChange, showEmptyState = false, limit = 20, types }: SearchBoxProps) {
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const hintId = useId();
  const opener = useItemOpener();
  const { query, setQuery, hits, loading, error } = useSearch(initialQuery, types === undefined ? { limit } : { limit, types });
  const groups = groupHits(hits);
  const empty = query.trim() === '';

  // "/" focuses the box from anywhere (BLUEPRINT 5, PC at night), unless typing in another field.
  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key !== '/' || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (typingElsewhere(event.target)) return;
      event.preventDefault();
      input.current?.focus();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (focusOnOpen) input.current?.focus({ preventScroll: true });
  }, [focusOnOpen]);

  // Arrow keys move through the result buttons (BLUEPRINT 5, PC at night); Up from the first goes back to the box.
  useEffect(() => {
    const box = results.current;
    if (box === null) return undefined;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const buttons = Array.from(box?.querySelectorAll<HTMLButtonElement>('button') ?? []);
      const at = buttons.findIndex((b) => b === document.activeElement);
      if (at < 0) return;
      event.preventDefault();
      if (event.key === 'ArrowDown') buttons[Math.min(at + 1, buttons.length - 1)]?.focus();
      else if (at === 0) input.current?.focus();
      else buttons[at - 1]?.focus();
    }
    box.addEventListener('keydown', onKey);
    return () => box.removeEventListener('keydown', onKey);
  }, []);

  function change(next: string) {
    setQuery(next);
    onQueryChange?.(next);
  }

  function resultButtons(): HTMLButtonElement[] {
    return Array.from(results.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
  }

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const q = query.trim();
      if (q === '') return;
      // Fresh answer for exactly what is typed, so a fast Enter never opens a stale result.
      const fresh = searchNow(q, types === undefined ? { limit } : { limit, types });
      const top = firstShown(fresh ?? hits);
      if (top !== undefined) opener.open(top);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (query !== '') change('');
      else input.current?.blur();
    } else if (event.key === 'ArrowDown') {
      const first = resultButtons()[0];
      if (first !== undefined) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const cards = empty && showEmptyState ? topCards(getItemsByType('quickcard')) : [];
  const words = loading ? 'Searching' : resultsWords(query, hits.length);

  return (
    <div className="sr-box">
      <label className="sr-box__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={input}
        id={inputId}
        className="sr-box__input"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="Type or say a word"
        aria-describedby={hintId}
        value={query}
        onChange={(event) => change(event.target.value)}
        onKeyDown={onInputKey}
      />
      <p id={hintId} className="sr-box__hint ui-muted">
        Tap the mic on your keyboard to say it.
      </p>
      <p className="ui-visually-hidden" aria-live="polite">
        {words}
      </p>
      <div ref={results} className="sr-results">
        {error !== null ? <p className="mc-status">{error}</p> : null}
        {!empty && !loading && hits.length === 0 && error === null ? <p className="sr-results__none">{words}</p> : null}
        {groups.map((group) => (
          <section key={group.type} className="sr-results__group">
            <h2 className="sr-results__heading">{group.label}</h2>
            <RowList label={group.label}>
              {group.hits.map((hit) => (
                <Row
                  key={hit.id}
                  as="li"
                  title={
                    <>
                      {hit.title}
                      <UnverifiedBadge show={hit.status === 'verify'} />
                    </>
                  }
                  detail={TYPE_SINGULAR[hit.type]}
                  trailing="Open"
                  onClick={() => opener.open(hit)}
                />
              ))}
            </RowList>
          </section>
        ))}
        {cards.length > 0 ? (
          <section className="sr-results__group">
            <h2 className="sr-results__heading">Top cards</h2>
            <RowList label="Top cards">
              {cards.map((card) => (
                <Row key={card.id} as="li" title={card.title} detail="Quick Card" trailing="Open" onClick={() => opener.open(card)} />
              ))}
            </RowList>
          </section>
        ) : null}
      </div>
      {opener.sheet}
    </div>
  );
}
