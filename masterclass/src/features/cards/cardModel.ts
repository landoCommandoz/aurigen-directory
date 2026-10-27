/**
 * Pure helpers for Quick Cards: grouping for the list, and the read-aloud text for one card.
 *
 * Grouping: by the card's kind (stop, settings, mix, table, list), the schema's own five values.
 * Tags overlap (a card carries four to six), so grouping by tag would list one card several
 * times; the tags still show on each row and feed search.
 */
import type { QuickCardItem } from '../../schemas';
import { visibleRows } from '../search/contentViews';
import { isPendingText, sentence, speakable } from '../shared/speechText';

/** Spoken units ("2 x 2 ft" as "2 by 2 feet"): shared with Fix It and the procedure pages. */
export { speakable };

export type CardKind = QuickCardItem['kind'];

export const KIND_ORDER: readonly CardKind[] = ['stop', 'settings', 'mix', 'table', 'list'];

export const KIND_LABELS: Record<CardKind, string> = {
  stop: 'Stop rules',
  settings: 'Settings',
  mix: 'Mixes',
  table: 'Tables',
  list: 'Lists',
};

export interface CardGroup<T> {
  kind: CardKind;
  label: string;
  cards: T[];
}

/** Groups in KIND_ORDER, cards by title inside each group, empty groups left out. */
export function groupCards<T extends Pick<QuickCardItem, 'kind' | 'title'>>(cards: readonly T[]): CardGroup<T>[] {
  return KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_LABELS[kind],
    cards: cards.filter((card) => card.kind === kind).sort((a, b) => a.title.localeCompare(b.title)),
  })).filter((group) => group.cards.length > 0);
}

/** The whole card as one block to read aloud: the title, then each row as "label: value." */
export function cardSpeechText(card: Pick<QuickCardItem, 'title' | 'rows'>): string {
  const parts = [sentence(card.title)];
  for (const row of visibleRows(card.rows)) {
    const prefix = row.status === 'verify' && !isPendingText(`${row.label} ${row.value}`) ? 'Unverified. ' : '';
    parts.push(`${prefix}${row.label}: ${sentence(row.value)}`);
  }
  return speakable(parts.join(' '));
}
