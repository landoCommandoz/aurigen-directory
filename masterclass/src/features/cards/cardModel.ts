/**
 * Pure helpers for Quick Cards: grouping for the list, and the read-aloud text for one card.
 *
 * Grouping: by the card's kind (stop, settings, mix, table, list), the schema's own five values.
 * Tags overlap (a card carries four to six), so grouping by tag would list one card several
 * times; the tags still show on each row and feed search.
 */
import type { QuickCardItem } from '../../schemas';
import { visibleRows } from '../search/contentViews';

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

/**
 * Words a voice reads well: units spelled out, "2 x 2" as "2 by 2". Applied only to the spoken
 * text; the screen keeps the knowledge base's own wording.
 */
export function speakable(text: string): string {
  return text
    .replace(/(\d)\s*µm\b/g, '$1 microns')
    .replace(/\bµm\b/g, 'microns')
    .replace(/(\d)\s*x\s*(\d)/g, '$1 by $2')
    .replace(/(\d)\s*oz\b/g, '$1 ounces')
    .replace(/(\d)\s*gal\b/g, '$1 gallons')
    .replace(/(\d)\s*ft\b/g, '$1 feet')
    .replace(/(\d)\s*lb\b/g, '$1 pounds')
    .replace(/(\d)\s*%/g, '$1 percent')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentence(text: string): string {
  const t = text.trim();
  if (t === '') return '';
  return /[.!?:]$/.test(t) ? t : `${t}.`;
}

/** The whole card as one block to read aloud: the title, then each row as "label: value." */
export function cardSpeechText(card: Pick<QuickCardItem, 'title' | 'rows'>): string {
  const parts = [sentence(card.title)];
  for (const row of visibleRows(card.rows)) {
    const prefix = row.status === 'verify' ? 'Unverified. ' : '';
    parts.push(`${prefix}${row.label}: ${sentence(row.value)}`);
  }
  return speakable(parts.join(' '));
}
