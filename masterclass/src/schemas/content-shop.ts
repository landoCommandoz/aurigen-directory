/**
 * Shop content: what Lando and the crew read with a polisher in hand.
 * FixNode (troubleshooter), SOP, QuickCard, Product, Equipment, GlossaryTerm (content-curator).
 * Owner of this file: architect. Layout and rules: src/schemas/README.md.
 */
import * as z from 'zod';
import { Base, Line, Row, StageId, Status, idWithPrefix } from './common';

/** Fix It groups, the tiles of the symptom grid. */
export const FIX_GROUPS = [
  'machine',
  'paint',
  'wash-dry',
  'clay',
  'protect',
  'glass',
  'interior',
  'gauge',
  'setup-time',
  'customer',
  'bike',
  'tesla',
] as const;
export const FixGroup = z.enum(FIX_GROUPS);

/** A Fix It entry: knowledge base section 21 format. Markdown file; the body goes in `body`. */
export const FixNode = Base.extend({
  id: idWithPrefix('fix'),
  type: z.literal('fixnode'),
  group: FixGroup,
  /** The words a person says when this happens. Also fed to search. */
  sayIt: z.array(z.string().min(1)).min(1),
  /** Rendered first, as the red STOP band. */
  stopIf: z.array(Line).default([]),
  /** 30-second checks. */
  checks: z.array(Line).default([]),
  /** Most likely first. */
  causes: z.array(Line).min(1),
  /** Numbered "do this" steps. */
  steps: z.array(Line).min(1),
  /** The "still happening?" escalation. */
  stillHappening: z.array(Line).default([]),
  /** Notes such as knowledge base FIX-01's "some float is normal". A note may carry its own status. */
  notes: z.array(Line).default([]),
  lessonId: idWithPrefix('lesson').optional(),
  productIds: z.array(idWithPrefix('product')).default([]),
  equipmentIds: z.array(idWithPrefix('equipment')).default([]),
  /** Optional Markdown below the steps. Written as the file body, never in the front matter. */
  body: z.string().default(''),
});
export type FixNodeItem = z.infer<typeof FixNode>;

export const TIMER_KINDS = ['dwell', 'section', 'setup', 'stage', 'cure'] as const;

/** One SOP step. A step may carry its own status, so one verify step does not mark the whole SOP. */
export const SopStep = z.strictObject({
  text: z.string().min(1),
  status: Status.optional(),
  /**
   * stage: the 30 minute ceramic wax stage plan (knowledge base 17.2).
   * cure: tire shine set time only (knowledge base 9.2); never a ceramic wax haze timer
   * (superseded, knowledge base 9.1 and 23).
   */
  timer: z
    .strictObject({ kind: z.enum(TIMER_KINDS), seconds: z.number().int().positive() })
    .optional(),
  stopIf: z.string().min(1).optional(),
  panelRoute: z.enum(['wash', 'polish', 'measure', 'wax', 'glass']).optional(),
  quickCardId: idWithPrefix('card').optional(),
});
export type SopStepValue = z.infer<typeof SopStep>;

/**
 * A procedure for one stage. Markdown file; the body goes in `body` (shown above the steps).
 * `hand-polish` is bike only (2026-10-11 [HOUSE default]): the test spot and Level 4 guards check
 * machine polishing (`polish`) only, so a car SOP may never route around them by hand.
 */
export const SOP = Base.extend({
  id: idWithPrefix('sop'),
  type: z.literal('sop'),
  stage: StageId,
  steps: z.array(SopStep).min(1),
  plannedMinutes: z.number().int().positive().optional(),
  vehicleBranch: z.enum(['any', 'tesla', 'bike']).default('any'),
  body: z.string().default(''),
}).refine((s) => s.stage !== 'hand-polish' || s.vehicleBranch === 'bike', {
  error: 'Stage hand-polish is for bikes only: set vehicleBranch: bike (cars are machine polished, stage polish)',
  path: ['vehicleBranch'],
});
export type SopItem = z.infer<typeof SOP>;

/** One tap from the run: bucket mix, clay tub, IPA mix, machine settings, pad ladder, bands, stop rules. YAML file. */
export const QuickCard = Base.extend({
  id: idWithPrefix('card'),
  type: z.literal('quickcard'),
  kind: z.enum(['mix', 'settings', 'table', 'list', 'stop']),
  rows: z.array(Row).min(1),
});
export type QuickCardItem = z.infer<typeof QuickCard>;

/** A product Lando owns or uses. YAML file in content/products/. */
export const Product = Base.extend({
  id: idWithPrefix('product'),
  type: z.literal('product'),
  brand: z.string().min(1),
  /** What it is for, in a few words each. */
  jobs: z.array(z.string().min(1)).min(1),
  /** Ratios as the label or the knowledge base writes them, each with its own status. */
  dilutions: z
    .array(z.strictObject({ use: z.string().min(1), ratio: z.string().min(1), status: Status }))
    .default([]),
  neverFor: z.array(z.string().min(1)).default([]),
  /** On the never-on-customer-paint list (knowledge base 3.4). */
  neverOnPaint: z.boolean().default(false),
  labelNotes: z.string().min(1).optional(),
});
export type ProductItem = z.infer<typeof Product>;

/** A tool or machine. YAML file in content/products/. */
export const Equipment = Base.extend({
  id: idWithPrefix('equipment'),
  type: z.literal('equipment'),
  model: z.string().min(1).optional(),
  /** Each spec row carries its own status ("HF item 56367", "M8 x 1.25"). */
  specs: z.array(Row.required({ status: true })).default([]),
  checks: z.array(Line).default([]),
  /** On the never-on-customer-paint list (knowledge base 3.4). */
  neverOnPaint: z.boolean().default(false),
});
export type EquipmentItem = z.infer<typeof Equipment>;

/** A glossary term (knowledge base 22). YAML file in content/glossary/. */
export const GlossaryTerm = Base.extend({
  id: idWithPrefix('term'),
  type: z.literal('glossaryterm'),
  term: z.string().min(1),
  definition: z.string().min(1),
  alsoCalled: z.array(z.string().min(1)).default([]),
});
export type GlossaryTermItem = z.infer<typeof GlossaryTerm>;
