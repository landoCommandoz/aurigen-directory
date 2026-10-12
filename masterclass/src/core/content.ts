/**
 * The content bundle, as the app reads it. Built by `npm run content` into
 * src/generated/content.json (gitignored) and inlined into the app at build time, so it is in
 * the offline copy. import.meta.glob is used instead of a plain import so a fresh checkout that
 * has not run the content build still typechecks and boots with an empty bundle and a status.
 */
import type { ContentItemValue, ContentTypeName, PriceItemItem, SignOffCriteriaItem } from '../schemas';
import { CONTENT_BUNDLE_VERSION, emptyBundle, type ContentBundle } from './contentBundle';
import { customerSafe } from './customerSafe';

const generated = import.meta.glob<ContentBundle>('../generated/content.json', { eager: true, import: 'default' });

function pickBundle(): { bundle: ContentBundle; built: boolean; problem: string | null } {
  const found = Object.values(generated)[0];
  if (found === undefined) {
    return { bundle: emptyBundle(), built: false, problem: 'The content bundle was not built. Run npm run content.' };
  }
  if (found.version !== CONTENT_BUNDLE_VERSION || !Array.isArray(found.items)) {
    return { bundle: emptyBundle(), built: false, problem: 'The content bundle is from another app version. Run npm run content.' };
  }
  return { bundle: found, built: true, problem: null };
}

let state = pickBundle();
/** False once a test swaps in its own bundle: the prebuilt search index then no longer matches it. */
let generatedInUse = true;
let byId = new Map<string, ContentItemValue>(state.bundle.items.map((item) => [item.id, item]));

/** Whether a bundle was found, how many items it holds, and why not if not. */
export function contentStatus(): { built: boolean; items: number; signOffs: number; problem: string | null } {
  return { built: state.built, items: state.bundle.items.length, signOffs: state.bundle.signOffs.length, problem: state.problem };
}

export function getContentBundle(): ContentBundle {
  return state.bundle;
}

/**
 * True when the bundle in use is the one the content build wrote, so the prebuilt search index
 * (written by the same build) matches it. Search builds its index from the bundle otherwise.
 */
export function usingGeneratedBundle(): boolean {
  return generatedInUse && state.built;
}

export type ItemOfType<T extends ContentTypeName> = Extract<ContentItemValue, { type: T }>;

export interface ContentQuery {
  /** True in Customer View: only items that pass customerSafe() come back. */
  customerView?: boolean;
}

/** One item by id. In Customer View an item that may not render comes back undefined. */
export function getItem(id: string, query: ContentQuery = {}): ContentItemValue | undefined {
  const item = byId.get(id);
  if (item === undefined) return undefined;
  if (query.customerView === true) return customerSafe([item])[0];
  return item;
}

/** Every item of one type, in id order. */
export function getItemsByType<T extends ContentTypeName>(type: T, query: ContentQuery = {}): ItemOfType<T>[] {
  const items = state.bundle.items.filter((item): item is ItemOfType<T> => item.type === type);
  return query.customerView === true ? customerSafe(items) : items;
}

/** Every item, in id order. */
export function getAllItems(query: ContentQuery = {}): ContentItemValue[] {
  return query.customerView === true ? customerSafe(state.bundle.items) : state.bundle.items;
}

export function getPriceItems(): PriceItemItem[] {
  return getItemsByType('priceitem');
}

export function getSignOffCriteria(skillId: string): SignOffCriteriaItem | undefined {
  return state.bundle.signOffs.find((c) => c.skillId === skillId);
}

/** The one skill whose sign-off opens the polish stage for crew (D11), if the content names it. */
export function polishGateSkillId(): string | null {
  return state.bundle.signOffs.find((c) => c.gates.includes('polish-stage'))?.skillId ?? null;
}

/** Tests only: swap in a bundle (null restores the generated one). */
export function __setContentBundleForTests(bundle: ContentBundle | null): void {
  state = bundle === null ? pickBundle() : { bundle, built: true, problem: null };
  generatedInUse = bundle === null;
  byId = new Map(state.bundle.items.map((item) => [item.id, item]));
}
