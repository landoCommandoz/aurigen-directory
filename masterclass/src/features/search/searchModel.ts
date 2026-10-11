/**
 * Pure helpers for the search screens: plain names per content type, grouping hits by type in the
 * order of their best hit (so the top result is in the first group), the empty-state cards, and
 * where a hit opens. No DOM, no React.
 */
import type { ContentItemValue, ContentTypeName } from '../../schemas';
import type { SearchHit } from '../../core/search';

export const TYPE_GROUP_LABELS: Record<ContentTypeName, string> = {
  fixnode: 'Fix It',
  quickcard: 'Quick Cards',
  sop: 'Procedures',
  lesson: 'Lessons',
  product: 'Products',
  equipment: 'Equipment',
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
  equipment: 'Equipment',
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

/** Group hits by type. Groups follow the rank of their first hit; hits keep their rank inside a group. */
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
  return Array.from(groups.values());
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

/** Where a result opens: Quick Cards have their own page; everything else opens in a sheet. */
export function hitRoute(hit: Pick<SearchHit, 'id' | 'type'>): string | null {
  return hit.type === 'quickcard' ? `/cards/${encodeURIComponent(hit.id)}` : null;
}

/** "3 results" or the empty message, for the live region. */
export function resultsWords(query: string, count: number): string {
  if (query.trim() === '') return '';
  if (count === 0) return `Nothing found for "${query.trim()}". Try fewer words, or open the Quick Cards.`;
  return count === 1 ? '1 result' : `${count} results`;
}
