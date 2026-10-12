/**
 * Pure helpers for Fix It (BLUEPRINT 2.2): plain names for the symptom groups, the grid grouping,
 * the one STOP symptom drawn as a red band, the related ids of a fix in reading order, and the
 * read-aloud text (STOP lines first, then the steps). No React, no DOM.
 */
import { FIX_GROUPS, visibleLines, type FixNodeItem } from '../../schemas';
import { uniqueIds } from '../shared/contentRoutes';
import { sentence, speakable, spokenLine } from '../shared/speechText';

export type FixGroupName = FixNodeItem['group'];

/** Plain names for FIX_GROUPS, in sentence case. */
export const GROUP_LABELS: Record<FixGroupName, string> = {
  machine: 'Machine',
  paint: 'Paint',
  'wash-dry': 'Wash and dry',
  clay: 'Clay',
  protect: 'Protect',
  glass: 'Glass',
  interior: 'Interior',
  gauge: 'Gauge',
  'setup-time': 'Setup and time',
  customer: 'Customer',
  bike: 'Bike',
  tesla: 'Tesla',
};

/** "STOP" in capitals marks the symptom that is itself a stop (knowledge base FIX-09). The design rule: STOP is the only word in capitals. */
const STOP_WORD = /\bSTOP\b/;

export function isStopSymptom(fix: Pick<FixNodeItem, 'title'>): boolean {
  return STOP_WORD.test(fix.title);
}

/** The words on the red band: the title without the word STOP and the punctuation around it. */
export function stopBandText(title: string): string {
  const words = title
    .replace(STOP_WORD, ' ')
    .replace(/\s*[:,.;]\s*(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return words === '' ? title : words;
}

export interface FixGroup<T> {
  group: FixGroupName;
  label: string;
  /** Symptoms drawn as tiles, in id order. */
  tiles: T[];
  /** Symptoms that are themselves a STOP, drawn as full-width red bands after the tiles. */
  stops: T[];
}

/** Groups in FIX_GROUPS order, fixes by id inside each, empty groups left out. */
export function groupFixes<T extends Pick<FixNodeItem, 'id' | 'group' | 'title'>>(fixes: readonly T[]): FixGroup<T>[] {
  return FIX_GROUPS.map((group) => {
    const inGroup = fixes.filter((fix) => fix.group === group).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
    return {
      group,
      label: GROUP_LABELS[group],
      tiles: inGroup.filter((fix) => !isStopSymptom(fix)),
      stops: inGroup.filter((fix) => isStopSymptom(fix)),
    };
  }).filter((g) => g.tiles.length + g.stops.length > 0);
}

/** Everything a fix points to, in reading order: its lesson, products, tools, then the rest. */
export function fixRelatedIds(fix: Pick<FixNodeItem, 'id' | 'lessonId' | 'productIds' | 'equipmentIds' | 'related'>): string[] {
  return uniqueIds([fix.lessonId, ...fix.productIds, ...fix.equipmentIds, ...fix.related], fix.id);
}

/**
 * The fix as one block to read aloud: the title, every STOP line first, then the numbered steps.
 * Superseded lines are never read. A verify line inside a settled fix is read with "Unverified."
 * first; a fix that is itself unverified says so once, after the title.
 */
export function fixSpeechText(fix: Pick<FixNodeItem, 'title' | 'status' | 'stopIf' | 'steps'>): string {
  const parts = [sentence(fix.title)];
  if (fix.status === 'verify') parts.push('This fix is unverified. Check it against the label.');
  for (const line of visibleLines(fix.stopIf, fix.status)) parts.push(`Stop. ${spokenLine(line, fix.status)}`);
  const steps = visibleLines(fix.steps, fix.status);
  if (steps.length > 0) parts.push('Do this.');
  steps.forEach((line, index) => parts.push(`Step ${index + 1}. ${spokenLine(line, fix.status)}`));
  return speakable(parts.join(' '));
}
