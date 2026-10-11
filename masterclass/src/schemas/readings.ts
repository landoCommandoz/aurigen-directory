/**
 * Paint gauge readings (BLUEPRINT 2.3 gauge entry rules; knowledge base 7.2 and 7.3 [HOUSE]).
 * The record, the accepted range, the bands, and the repaint and thin flags, as pure code so
 * the gauge screen (app-engineer) and the paint report (business-customer) agree.
 * Owner: architect.
 */
import * as z from 'zod';
import { ID_PATTERN } from './common';
import { At, RecordId, recordShape } from './records';

export const MIN_READING_UM = 20;
export const MAX_READING_UM = 999;
/** Knowledge base 7.2: 3 to 5 readings per panel. One saves; the screen says "take 3" until 3. */
export const MAX_READINGS_PER_PANEL = 5;
export const TARGET_READINGS_PER_PANEL = 3;
/** Knowledge base 7.3, "about 220+". */
export const REPAINT_AT_UM = 220;
/** More than this far below the rest of the car is thin. [HOUSE proposal], BLUEPRINT section 12 item 16. */
export const THIN_BELOW_REST_UM = 40;
/** The refusal for anything outside the range, with a link to the gauge fix. */
export const GAUGE_REFUSAL = { message: 'Check the gauge', fixId: 'fix-21' } as const;

/** One reading in microns: 20 to 999. 0, 19, 1000, 9999, NaN, and Infinity are refused. */
export const Micron = z
  .number()
  .min(MIN_READING_UM, { error: GAUGE_REFUSAL.message })
  .max(MAX_READING_UM, { error: GAUGE_REFUSAL.message });

/** Knowledge base 7.3 rows, from the lowest reading on the panel. */
export const THICKNESS_BANDS = [
  'full-ladder',
  'polish-only',
  'tell-customer-light',
  'tell-customer-finishing',
  'no-machine',
] as const;
export const ThicknessBand = z.enum(THICKNESS_BANDS);
export type ThicknessBandName = z.infer<typeof ThicknessBand>;

/**
 * 100 or more: full ladder permitted. 90 to 99: polish only. 85 to 89: tell the customer, yellow +
 * M210, light. 75 to 84: tell the customer, finishing polish only. Under 75: no machine.
 */
export function bandFor(lowestUm: number): ThicknessBandName {
  if (lowestUm >= 100) return 'full-ladder';
  if (lowestUm >= 90) return 'polish-only';
  if (lowestUm >= 85) return 'tell-customer-light';
  if (lowestUm >= 75) return 'tell-customer-finishing';
  return 'no-machine';
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const hi = sorted[mid];
  const lo = sorted[mid - 1];
  if (hi === undefined) return null;
  return sorted.length % 2 === 1 || lo === undefined ? hi : (lo + hi) / 2;
}

/**
 * Repaint and thin flags. "The rest of the car" is the median of the lowest readings of the
 * other measured panels; with fewer than 2 of them there is no rest yet, so neither flag is set.
 * Repaint: lowest 220 or more. Thin: more than 40 below the rest (41 is thin; 40 and 39 are not).
 */
export function panelFlags(lowestUm: number, otherPanelsLowestUm: readonly number[]): { repaint: boolean; thin: boolean } {
  const rest = otherPanelsLowestUm.length >= 2 ? median(otherPanelsLowestUm) : null;
  if (rest === null) return { repaint: false, thin: false };
  return { repaint: lowestUm >= REPAINT_AT_UM, thin: rest - lowestUm > THIN_BELOW_REST_UM };
}

/**
 * What the gauge screen does with a typed value. Empty, text, negative, 0, 19, 1000, and 9999 are
 * refused with "Check the gauge" and the FIX-21 link, and nothing is saved.
 */
export function parseGaugeInput(raw: unknown):
  | { ok: true; value: number }
  | { ok: false; message: typeof GAUGE_REFUSAL.message; fixId: typeof GAUGE_REFUSAL.fixId } {
  const text = typeof raw === 'number' ? String(raw) : typeof raw === 'string' ? raw.trim() : '';
  const value = /^\d+(\.\d+)?$/.test(text) ? Number(text) : Number.NaN;
  const parsed = Micron.safeParse(value);
  return parsed.success ? { ok: true, value: parsed.data } : { ok: false, ...GAUGE_REFUSAL };
}

export const PanelReading = z
  .strictObject({
    ...recordShape,
    jobId: RecordId,
    /** Kebab-case panel id: hood, lf-fender, rr-quarter, liftgate. */
    panelId: z.string().regex(ID_PATTERN),
    readings: z.array(Micron).min(1).max(MAX_READINGS_PER_PANEL),
    /** The door jamb baseline, entered first (knowledge base 7.2). */
    jambBaseline: Micron.nullable().default(null),
    band: ThicknessBand,
    flags: z.strictObject({ repaint: z.boolean(), thin: z.boolean() }),
    takenAt: At,
  })
  .refine((p) => p.band === bandFor(Math.min(...p.readings)), {
    error: 'band must match the lowest reading (knowledge base 7.3)',
    path: ['band'],
  });
export type PanelReadingValue = z.infer<typeof PanelReading>;
