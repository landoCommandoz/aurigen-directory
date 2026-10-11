/**
 * The Customer View content filter (BLUEPRINT 3.4 and 7). Pure, no React, so the content loader,
 * search, and tests share it with customerView.tsx.
 * An item passes only when it is customer-safe AND its status is house, or sourced with a
 * fact-checker confirmation, AND no text, line, row, or step inside it is verify or superseded.
 * The rule itself is isCustomerRenderable in src/schemas (the build enforces the same rule).
 */
import { isCustomerRenderable, needsUnverifiedBadge, type ContentItemValue } from '../schemas';

export function customerSafe<T extends ContentItemValue>(items: readonly T[]): T[] {
  return items.filter((item) => isCustomerRenderable(item));
}

/** The internal "unverified" badge: shown on a verify item, never in Customer View. */
export function showUnverifiedBadge(item: ContentItemValue, customerViewOn: boolean): boolean {
  return !customerViewOn && needsUnverifiedBadge(item);
}
