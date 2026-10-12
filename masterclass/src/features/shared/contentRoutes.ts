/**
 * Where each content item opens (Phase 2). One rule for search results, related links, and the
 * Fix It tiles, so every link lands on a real page:
 *
 *   fixnode       /fixit/<id>      the fix page
 *   quickcard     /cards/<id>      the card page
 *   lesson        /academy/<id>    the lesson page (read-only until the Phase 5 Academy)
 *   sop           /sops/<id>       the procedure page (read-only until the Phase 3 Job Runner)
 *   product, equipment, glossaryterm   /items/<id>   the item page
 *
 * Drills, quiz questions, flashcards, price items, policies, and scripts have no page in this
 * build (Phase 4 and 5 bring them), so pageRoute returns null and no link to them is drawn.
 * Pure: no React, no DOM.
 */
import type { ContentTypeName } from '../../schemas';

export const PAGE_BASE: Readonly<Partial<Record<ContentTypeName, string>>> = {
  fixnode: '/fixit',
  quickcard: '/cards',
  lesson: '/academy',
  sop: '/sops',
  product: '/items',
  equipment: '/items',
  glossaryterm: '/items',
};

/** True when the type has a page in this build. */
export function hasPage(type: ContentTypeName): boolean {
  return PAGE_BASE[type] !== undefined;
}

/** The page for one item, or null when its type has none yet. */
export function pageRoute(target: { id: string; type: ContentTypeName }): string | null {
  const base = PAGE_BASE[target.type];
  return base === undefined ? null : `${base}/${encodeURIComponent(target.id)}`;
}

/** The order related links are listed in: the lesson first, then what you reach for at the cart. */
export const RELATED_TYPE_ORDER: readonly ContentTypeName[] = ['lesson', 'quickcard', 'sop', 'fixnode', 'product', 'equipment', 'glossaryterm'];

/** Ids in the order given, each once, empty strings and the item's own id left out. */
export function uniqueIds(ids: ReadonlyArray<string | undefined>, selfId?: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (id === undefined || id === '' || id === selfId || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}
