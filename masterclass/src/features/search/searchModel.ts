/**
 * Pure helpers for the search screens: plain names per content type, grouping hits by type (the
 * top result's group first, then Fix It, then the rest by their best hit), the empty-state cards,
 * and where a hit opens. No DOM, no React.
 */
import type { ContentItemValue, ContentTypeName } from '../../schemas';
import type { SearchHit } from '../../core/search';
import { pageRoute } from '../shared/contentRoutes';

export const TYPE_GROUP_LABELS: Record<ContentTypeName, string> = {
  fixnode: 'Fix It',
  quickcard: 'Quick Cards',
  sop: 'Procedures',
  lesson: 'Lessons',
  product: 'Products',
  equipment: 'Tools',
  glossaryterm: 'Glossary',
  drill: 'Drills',
  policy: 'Policies',
  script: 'Scripts',
  priceitem: 'Prices',
  quizquestion: 'Quiz questions',
  flashcard: 'Flashcards',
};

export const TYPE_SINGULAR: Record<ContentTypeName, string> = {
  fixnode: 'Fix It',
  quickcard: 'Quick Card',
  sop: 'Procedure',
  lesson: 'Lesson',
  product: 'Product',
  equipment: 'Tool',
  glossaryterm: 'Glossary term',
  drill: 'Drill',
  policy: 'Policy',
  script: 'Script',
  priceitem: 'Price',
  quizquestion: 'Quiz question',
  flashcard: 'Flashcard',
};

export interface HitGroup {
  type: ContentTypeName;
  label: string;
  hits: SearchHit[];
}

/**
 * Group hits by type, Fix It first (Phase 2). The group holding the top result always leads, so
 * the first row on screen is the result Enter opens and the one the search cases test. Fix It
 * comes next whenever it is not already first; the other groups follow the rank of their best hit.
 * Hits keep their rank inside a group.
 */
export function groupHits(hits: readonly SearchHit[]): HitGroup[] {
  const groups = new Map<ContentTypeName, HitGroup>();
  for (const hit of hits) {
    let group = groups.get(hit.type);
    if (group === undefined) {
      group = { type: hit.type, label: TYPE_GROUP_LABELS[hit.type] ?? hit.type, hits: [] };
      groups.set(hit.type, group);
    }
    group.hits.push(hit);
  }
  const ordered = Array.from(groups.values());
  const fixAt = ordered.findIndex((group) => group.type === 'fixnode');
  if (fixAt > 1) {
    const [fixes] = ordered.splice(fixAt, 1);
    if (fixes !== undefined) ordered.splice(1, 0, fixes);
  }
  return ordered;
}

/** The first row on screen, the one Enter opens: the top hit, because its group leads. */
export function firstShown(hits: readonly SearchHit[]): SearchHit | undefined {
  return groupHits(hits)[0]?.hits[0];
}

/**
 * The cards shown when the box is empty: the ones reached for most at the cart. Ids are stable by
 * the content rules (never renamed), and any missing id is filled from the rest, so five show
 * whenever five exist.
 */
export const TOP_CARD_IDS = ['card-stop-rules', 'card-pad-ladder', 'card-machine-settings', 'card-thickness-bands', 'card-pad-priming'] as const;

export function topCards<T extends Pick<ContentItemValue, 'id'>>(cards: readonly T[], count = 5): T[] {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const picked: T[] = [];
  for (const id of TOP_CARD_IDS) {
    const card = byId.get(id);
    if (card !== undefined) picked.push(card);
  }
  for (const card of cards) {
    if (picked.length >= count) break;
    if (!picked.includes(card)) picked.push(card);
  }
  return picked.slice(0, count);
}

/** Where a result opens: every searchable type has its own page (contentRoutes.ts); null means none yet. */
export function hitRoute(hit: Pick<SearchHit, 'id' | 'type'>): string | null {
  return pageRoute(hit);
}

/** "3 results" or the empty message, for the live region. */
export function resultsWords(query: string, count: number): string {
  if (query.trim() === '') return '';
  if (count === 0) return `Nothing found for "${query.trim()}". Try fewer words, or open the Quick Cards.`;
  return count === 1 ? '1 result' : `${count} results`;
}
