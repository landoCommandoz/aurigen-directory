/**
 * The content bundle as the browser suites see it (qa-adversary). Not imported by app code.
 *
 * Read lazily from src/generated/content.json: Playwright lists the tests before its web server
 * runs the build, so the tests are made per chunk and the chunk reads the bundle when it runs.
 * pageRoute is the app's own rule (src/features/shared/contentRoutes.ts), so a link the test
 * expects is a link the app draws.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pageRoute, uniqueIds } from '../../src/features/shared/contentRoutes';
import type { ContentTypeName } from '../../src/schemas';

export interface Loose {
  id: string;
  type: ContentTypeName;
  status: 'house' | 'sourced' | 'verify' | 'superseded';
  title: string;
  related: string[];
  [field: string]: unknown;
}

let cache: Loose[] | null = null;

export function bundleItems(): Loose[] {
  cache ??= (JSON.parse(readFileSync(fileURLToPath(new URL('../../src/generated/content.json', import.meta.url)), 'utf8')) as { items: Loose[] }).items;
  return cache;
}

export function itemById(id: string): Loose | undefined {
  return bundleItems().find((i) => i.id === id);
}

export function routeOf(item: Pick<Loose, 'id' | 'type'>): string | null {
  return pageRoute(item);
}

/** Every content page in the build, in id order. */
export function contentPages(): Array<{ id: string; path: string; title: string; type: ContentTypeName }> {
  return bundleItems().flatMap((i) => {
    const path = routeOf(i);
    return path === null ? [] : [{ id: i.id, path, title: i.title, type: i.type }];
  });
}

/** One of `count` even slices of the content pages. */
export function pagesChunk(index: number, count: number) {
  return contentPages().filter((_, i) => i % count === index);
}

/** The h1 of every "nothing here" screen. An internal link must never land on one. */
export const NOT_FOUND_TITLES = ['No screen here', 'Not found', 'Fix not found', 'Lesson not found', 'Procedure not found', 'Card not found'];

/** The ids a page's Related list should show: found, not itself, with a page (RelatedList's rule). */
export function relatedWithPages(item: Loose): string[] {
  const extra = item.type === 'fixnode' ? [item.lessonId as string | undefined, ...((item.productIds as string[]) ?? []), ...((item.equipmentIds as string[]) ?? [])] : [];
  return uniqueIds([...extra, ...item.related], item.id).filter((id) => {
    const target = itemById(id);
    return target !== undefined && routeOf(target) !== null;
  });
}

type LineLike = string | { text: string; status?: string };
const textOf = (l: LineLike) => (typeof l === 'string' ? l : l.text);
const statusOf = (l: LineLike, parent: string) => (typeof l === 'string' ? parent : (l.status ?? parent));
const pendingText = (t: string) => /\(pending\)/i.test(t);

export interface Mark {
  /** 'line' is a list item or band; 'row' is a label (the badge sits on the label); 'step' is an SOP step. */
  kind: 'line' | 'row' | 'step';
  text: string;
  badge: 'unverified' | 'pending';
}

/**
 * Every line or row on an item's page that must carry a badge, by the renderer's rule (badgeFor):
 * "pending" when the words say (pending), "unverified" when its own status is verify and the item's
 * is not. A verify item says so once at the top instead.
 */
export function marksFor(item: Loose): Mark[] {
  const marks: Mark[] = [];
  const own = item.status;
  const line = (l: LineLike, parent: string, kind: Mark['kind'] = 'line') => {
    const text = textOf(l);
    const status = statusOf(l, parent);
    if (status === 'superseded') return;
    if (pendingText(text)) marks.push({ kind, text, badge: 'pending' });
    else if (status === 'verify' && parent !== 'verify') marks.push({ kind, text, badge: 'unverified' });
  };
  const rows = (list: unknown, parent: string) => {
    for (const r of (list as Array<{ label: string; value: string; status?: string }>) ?? []) {
      if (r.status === 'superseded') continue;
      const status = r.status ?? parent;
      if (pendingText(`${r.label} ${r.value}`)) marks.push({ kind: 'row', text: r.label, badge: 'pending' });
      else if (status === 'verify' && parent !== 'verify') marks.push({ kind: 'row', text: r.label, badge: 'unverified' });
    }
  };
  const lists = (fields: string[]) => {
    for (const f of fields) for (const l of (item[f] as LineLike[] | undefined) ?? []) line(l, own);
  };
  switch (item.type) {
    case 'fixnode':
      lists(['stopIf', 'checks', 'causes', 'steps', 'stillHappening', 'notes']);
      break;
    case 'lesson':
      lists(['steps', 'mistakes']);
      rows(item.numbers, own);
      break;
    case 'quickcard':
      rows(item.rows, own);
      break;
    case 'equipment':
      rows(item.specs, own);
      lists(['checks']);
      break;
    case 'product':
      lists(['jobs', 'neverFor']);
      // ItemDetail draws dilutions with RowsList and no item status, so a verify dilution always gets the badge.
      for (const d of (item.dilutions as Array<{ use: string; ratio: string; status?: string }>) ?? []) {
        if (d.status === 'superseded') continue;
        if (pendingText(`${d.use} ${d.ratio}`)) marks.push({ kind: 'row', text: d.use, badge: 'pending' });
        else if (d.status === 'verify') marks.push({ kind: 'row', text: d.use, badge: 'unverified' });
      }
      break;
    case 'sop':
      for (const s of (item.steps as Array<{ text: string; status?: string; notes?: LineLike[] }>) ?? []) {
        const stepStatus = s.status ?? own;
        if (stepStatus === 'superseded') continue;
        line({ text: s.text, status: stepStatus }, own, 'step');
        for (const n of s.notes ?? []) line(n, stepStatus);
      }
      break;
    default:
      break;
  }
  return marks;
}
