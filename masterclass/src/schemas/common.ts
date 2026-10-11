/**
 * Common content fields: the shared contract every content file is checked against.
 * Owner: architect. Change only through the architect with the lead's approval
 * (docs/OWNERSHIP.md rule 3). Content layout and rules: src/schemas/README.md.
 * Rendering and build rules: docs/BLUEPRINT.md section 7.
 */
import * as z from 'zod';

/** Kebab-case: lowercase letters and digits, single hyphens, no leading or trailing hyphen. */
export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Any content id, whatever its type. Used for cross references (related, supersedes). */
export const ContentId = z
  .string()
  .min(3)
  .max(80)
  .regex(ID_PATTERN, { error: 'Ids are kebab-case: lowercase letters, digits, single hyphens (fix-01)' });

/** The status tags of the knowledge base, lowercased: [HOUSE], [SOURCED date], [VERIFY], [SUPERSEDED]. */
export const STATUSES = ['house', 'sourced', 'verify', 'superseded'] as const;
export const Status = z.enum(STATUSES);
export type StatusName = z.infer<typeof Status>;

export const VISIBILITIES = ['internal', 'customer-safe'] as const;
export const Visibility = z.enum(VISIBILITIES);
export type VisibilityName = z.infer<typeof Visibility>;

export const AUDIENCES = ['owner', 'ops', 'crew', 'customer'] as const;
export const Audience = z.enum(AUDIENCES);
export type AudienceName = z.infer<typeof Audience>;

export const CONTENT_TYPES = [
  'lesson',
  'sop',
  'quickcard',
  'fixnode',
  'product',
  'equipment',
  'priceitem',
  'policy',
  'script',
  'drill',
  'quizquestion',
  'flashcard',
  'glossaryterm',
] as const;
export const ContentType = z.enum(CONTENT_TYPES);
export type ContentTypeName = z.infer<typeof ContentType>;

/** Every id starts with its type's prefix, so two types never share an id. */
export const ID_PREFIX = {
  lesson: 'lesson',
  sop: 'sop',
  quickcard: 'card',
  fixnode: 'fix',
  product: 'product',
  equipment: 'equipment',
  priceitem: 'price',
  policy: 'policy',
  script: 'script',
  drill: 'drill',
  quizquestion: 'quiz',
  flashcard: 'flash',
  glossaryterm: 'term',
} as const satisfies Record<ContentTypeName, string>;

/** Prefix for skill ids (sign-off criteria files) and quiz ids (a quiz is the set of questions sharing a quizId). */
export const SKILL_ID_PREFIX = 'skill';
export const QUIZ_ID_PREFIX = 'quiz';

/** An id that must start with "<prefix>-", for example idWithPrefix('fix') accepts fix-01. */
export function idWithPrefix(prefix: string) {
  return ContentId.refine((id) => id.startsWith(`${prefix}-`), {
    error: `This id must start with "${prefix}-"`,
  });
}

export const SkillId = idWithPrefix(SKILL_ID_PREFIX);
export const QuizId = idWithPrefix(QUIZ_ID_PREFIX);

/**
 * Job stages, shared by SOP files (content) and the Job Runner records (runtime).
 * Order on a job comes from the SOP files, not from this list. Knowledge base 5.1, 17.2, 18.3, 12.1.
 * "polish" is machine polishing: the one stage the test spot and Level 4 guards check (D11).
 * Bikes are hand polished (knowledge base 12.1), so they use "hand-polish", which no guard checks.
 */
export const STAGE_IDS = [
  'setup',
  'walkaround',
  'wheels',
  'wash',
  'clay',
  'dry',
  'measure',
  'tape',
  'test-spot',
  'polish',
  'hand-polish',
  'protect',
  'tires-trim',
  'chain',
  'interior',
  'glass',
  'final-walkaround',
  'cleanup',
] as const;
export const StageId = z.enum(STAGE_IDS);
export type StageIdName = z.infer<typeof StageId>;

/** A date written as YYYY-MM-DD. Quote it in YAML only if your editor complains; the yaml parser keeps it a string. */
export const IsoDate = z.iso.date();

/** A knowledge base section number, always quoted in YAML: kbRef: "7.3". */
export const KbRef = z.string().regex(/^\d{1,2}(?:\.\d{1,2}){0,2}$/, {
  error: 'kbRef is a knowledge base section number in quotes, like "7.3"',
});

/**
 * Where a fact came from. label is required ("HF product page", "Lando", "Knowledge base 8.3").
 * confirmedOn and confirmedBy are written only by the fact-checker's findings, and always together.
 * A customer-safe item with status sourced needs at least one confirmed source.
 */
export const Source = z
  .strictObject({
    label: z.string().min(1),
    url: z.url({ protocol: /^https?$/ }).optional(),
    date: IsoDate,
    note: z.string().min(1).optional(),
    confirmedOn: IsoDate.optional(),
    confirmedBy: z.literal('fact-checker').optional(),
  })
  .refine((s) => (s.confirmedOn === undefined) === (s.confirmedBy === undefined), {
    error: 'confirmedOn and confirmedBy go together (the fact-checker sets both)',
    path: ['confirmedOn'],
  });
export type SourceRecord = z.infer<typeof Source>;

/**
 * One line of a fix, a step, a check, or a mistake. Plain text, or an object when that one line
 * carries its own status (a verify line inside a house item, as in knowledge base FIX-01).
 */
export const Line = z.union([
  z.string().min(1),
  z.strictObject({ text: z.string().min(1), status: Status.optional() }),
]);
export type LineValue = z.infer<typeof Line>;

/** A labeled value with its own optional status: Quick Card rows, lesson numbers, specs, dilutions. */
export const Row = z.strictObject({
  label: z.string().min(1),
  value: z.string().min(1),
  status: Status.optional(),
  kbRef: KbRef.optional(),
});
export type RowValue = z.infer<typeof Row>;

/** The common fields every content item carries (BUILD_PROMPT section 5, BLUEPRINT section 7). */
export const Base = z.strictObject({
  id: ContentId,
  type: ContentType,
  title: z.string().min(1).max(120),
  tags: z.array(z.string().min(1)).default([]),
  /** The "say it" words: what a person types or dictates. Fed to search. */
  synonyms: z.array(z.string().min(1)).default([]),
  audience: z.array(Audience).min(1),
  visibility: Visibility,
  status: Status,
  sources: z.array(Source).default([]),
  /** Starts at 1. Raise it when the meaning changes; crew then see "this changed, re-read". */
  version: z.number().int().min(1).default(1),
  /** The id of the item this one replaces. That item must have status superseded. */
  supersedes: ContentId.optional(),
  related: z.array(ContentId).default([]),
  kbRef: KbRef.optional(),
});
export type BaseItem = z.infer<typeof Base>;

/** The text of a line, whichever form it was written in. */
export function lineText(line: LineValue): string {
  return typeof line === 'string' ? line : line.text;
}

/** A line's own status, falling back to its item's status. */
export function lineStatus(line: LineValue, itemStatus: StatusName): StatusName {
  if (typeof line === 'string') return itemStatus;
  return line.status ?? itemStatus;
}

/** Lines that may render at all: a superseded line never renders anywhere (BLUEPRINT 7). */
export function visibleLines<T extends LineValue>(lines: readonly T[], itemStatus: StatusName): T[] {
  return lines.filter((line) => lineStatus(line, itemStatus) !== 'superseded');
}
