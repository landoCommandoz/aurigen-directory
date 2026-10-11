/**
 * The content contract: every content type, the ContentItem union, where each file lives,
 * and the Customer View rule the build and the app both use.
 * Owner: architect. Layout and rules for writers: src/schemas/README.md.
 * BLUEPRINT section 7 is the plan; where it and this file differ, this file wins.
 */
import * as z from 'zod';
import type { ContentTypeName, StatusName } from './common';
import { Drill, Flashcard, Lesson, QuizQuestion } from './content-academy';
import { Policy, PriceItem, Script } from './content-business';
import { Equipment, FixNode, GlossaryTerm, Product, QuickCard, SOP } from './content-shop';

export * from './common';
export * from './content-academy';
export * from './content-business';
export * from './content-shop';

/** Any content item, told apart by its "type" field. SignOffCriteria is not one (it is a criteria file). */
export const ContentItem = z.discriminatedUnion('type', [
  Lesson,
  SOP,
  QuickCard,
  FixNode,
  Product,
  Equipment,
  PriceItem,
  Policy,
  Script,
  Drill,
  QuizQuestion,
  Flashcard,
  GlossaryTerm,
]);
export type ContentItemValue = z.infer<typeof ContentItem>;
/** What a file holds before defaults are applied. */
export type ContentItemInput = z.input<typeof ContentItem>;

/** The schema for one type, for the build's per-type messages. */
export const SCHEMA_BY_TYPE = {
  lesson: Lesson,
  sop: SOP,
  quickcard: QuickCard,
  fixnode: FixNode,
  product: Product,
  equipment: Equipment,
  priceitem: PriceItem,
  policy: Policy,
  script: Script,
  drill: Drill,
  quizquestion: QuizQuestion,
  flashcard: Flashcard,
  glossaryterm: GlossaryTerm,
} as const satisfies Record<ContentTypeName, z.ZodType>;

/* ---------- File layout (README "Where files go") ---------- */

/** The folder under content/ for each type. One owner per folder (docs/OWNERSHIP.md). */
export const CONTENT_DIR_BY_TYPE = {
  lesson: 'lessons',
  sop: 'sops',
  quickcard: 'cards',
  fixnode: 'fixit',
  product: 'products',
  equipment: 'products',
  priceitem: 'business',
  policy: 'business',
  script: 'customer',
  drill: 'academy/drills',
  quizquestion: 'academy/quizzes',
  flashcard: 'academy/flashcards',
  glossaryterm: 'glossary',
} as const satisfies Record<ContentTypeName, string>;

/** Sign-off criteria files: content/academy/signoff/<skillId>.yaml. */
export const SIGNOFF_DIR = 'academy/signoff';
/** The synonym map: content/search/synonyms.yaml (troubleshooter). */
export const SYNONYMS_FILE = 'search/synonyms.yaml';
/** The search cases, outside content/: tests/search-cases.yaml (troubleshooter). */
export const SEARCH_CASES_FILE = 'tests/search-cases.yaml';

/** Prose types are Markdown with YAML front matter; table types are YAML. */
export const CONTENT_FORMAT_BY_TYPE = {
  lesson: 'md',
  sop: 'md',
  fixnode: 'md',
  policy: 'md',
  script: 'md',
  drill: 'md',
  quickcard: 'yaml',
  product: 'yaml',
  equipment: 'yaml',
  priceitem: 'yaml',
  quizquestion: 'yaml',
  flashcard: 'yaml',
  glossaryterm: 'yaml',
} as const satisfies Record<ContentTypeName, 'md' | 'yaml'>;

/** For a Markdown file, the field its body fills. The front matter must not set this field too. */
export const MARKDOWN_BODY_FIELD = {
  lesson: 'why',
  sop: 'body',
  fixnode: 'body',
  policy: 'text',
  script: 'text',
  drill: 'body',
} as const;

/** The path a content file must have, relative to masterclass/: content/<dir>/<id>.<md|yaml>. */
export function expectedContentPath(type: ContentTypeName, id: string): string {
  return `content/${CONTENT_DIR_BY_TYPE[type]}/${id}.${CONTENT_FORMAT_BY_TYPE[type]}`;
}

/* ---------- Rendering rules (BLUEPRINT 7) ---------- */

/** A superseded item never renders anywhere. Everything else may render internally. */
export function isRenderable(item: { status: StatusName }): boolean {
  return item.status !== 'superseded';
}

/** An internal "unverified" badge shows on a verify item. */
export function needsUnverifiedBadge(item: { status: StatusName }): boolean {
  return item.status === 'verify';
}

/** Literal tag text that may never reach Customer View, in any string field. */
const FORBIDDEN_CUSTOMER_TEXT = /\[(VERIFY|SUPERSEDED)/i;

/** Every string anywhere inside a value, with its path, for the literal-tag scan. */
function collectStrings(value: unknown, path: string, out: Array<{ path: string; text: string }>): void {
  if (typeof value === 'string') {
    out.push({ path, text: value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collectStrings(v, path ? `${path}.${k}` : k, out);
  }
}

/** Every nested object that carries its own status (lines, rows, steps, numbers, specs, dilutions). */
function collectLineStatuses(value: unknown, path: string, out: Array<{ path: string; status: StatusName }>): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectLineStatuses(v, `${path}[${i}]`, out));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const child = path ? `${path}.${k}` : k;
      if (k === 'status' && path !== '' && typeof v === 'string') {
        out.push({ path, status: v as StatusName });
      } else if (k !== 'sources') {
        collectLineStatuses(v, child, out);
      }
    }
  }
}

/** True when at least one source carries the fact-checker's confirmation. */
export function hasConfirmedSource(item: { sources: ReadonlyArray<{ confirmedOn?: string | undefined }> }): boolean {
  return item.sources.some((s) => s.confirmedOn !== undefined);
}

/**
 * Every reason an item may not render in Customer View. Empty means it may.
 * Rule (BLUEPRINT 7): visibility customer-safe AND (status house OR status sourced with a
 * fact-checker confirmation); no "[VERIFY" or "[SUPERSEDED" text anywhere; no line, row, step,
 * number, spec, or dilution whose own status is verify or superseded; a line marked sourced needs
 * the item to carry a confirmed source.
 */
export function customerRenderProblems(item: ContentItemValue): string[] {
  const problems: string[] = [];
  if (item.visibility !== 'customer-safe') problems.push('visibility is internal');
  if (item.status === 'verify') problems.push('status is verify: [VERIFY] items never show to a customer');
  if (item.status === 'superseded') problems.push('status is superseded: [SUPERSEDED] items never show anywhere');
  if (item.status === 'sourced' && !hasConfirmedSource(item)) {
    problems.push('status is sourced but no source has confirmedOn from the fact-checker');
  }
  const strings: Array<{ path: string; text: string }> = [];
  collectStrings(item, '', strings);
  for (const s of strings) {
    if (FORBIDDEN_CUSTOMER_TEXT.test(s.text)) problems.push(`${s.path} contains the text "[VERIFY" or "[SUPERSEDED"`);
  }
  const statuses: Array<{ path: string; status: StatusName }> = [];
  collectLineStatuses(item, '', statuses);
  for (const s of statuses) {
    if (s.status === 'verify' || s.status === 'superseded') problems.push(`${s.path} has its own status ${s.status}`);
    if (s.status === 'sourced' && !hasConfirmedSource(item)) {
      problems.push(`${s.path} is marked sourced but the item has no confirmed source`);
    }
  }
  return problems;
}

/** True when the item may render in Customer View. The app's customerSafe(items) filter uses this. */
export function isCustomerRenderable(item: ContentItemValue): boolean {
  return customerRenderProblems(item).length === 0;
}

/**
 * Throws when the item may not render in Customer View, naming every reason.
 * The content build calls this on every item marked customer-safe and fails on a throw.
 */
export function assertCustomerRenderable(item: ContentItemValue): void {
  const problems = customerRenderProblems(item);
  if (problems.length > 0) {
    throw new Error(`${item.id} cannot render in Customer View: ${problems.join('; ')}`);
  }
}
