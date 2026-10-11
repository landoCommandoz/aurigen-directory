/**
 * Business and customer content (business-customer): PriceItem and Policy in content/business/,
 * Script in content/customer/.
 * Owner of this file: architect. Layout and rules: src/schemas/README.md.
 * Money is in dollars exactly as knowledge base 15 and 12.2 write them: whole dollars everywhere
 * except travel at 1.50 per mile.
 */
import * as z from 'zod';
import { Base, idWithPrefix } from './common';

export const PRICE_KINDS = ['service', 'addon', 'fee', 'deposit', 'plan'] as const;
export const PRICE_UNITS = ['flat', 'per-mile', 'per-pair', 'from', 'per-month', 'quote'] as const;
export const PriceUnit = z.enum(PRICE_UNITS);

/** What renders where an amount would be when the unit is quote and no quoteText is set. */
export const DEFAULT_QUOTE_TEXT = 'Quoted after the test spot';

const CAR_SIZES = ['sedan', 'suv'] as const;
const BIKE_SIZES = ['standard', 'bagger'] as const;

/**
 * One price line. YAML file in content/business/.
 * unit "quote": no amount exists (two-step correction, smoke odor, heavy chrome pitting). It never
 * renders a number anywhere; it renders quoteText, or DEFAULT_QUOTE_TEXT.
 * touchesPaint: true for a service package with an exterior paint stage (wash, decon, polish,
 * protection). It drives the 25-car count (BLUEPRINT 3.3, [HOUSE] 2026-10-10). Add-ons never count.
 */
export const PriceItem = Base.extend({
  id: idWithPrefix('price'),
  type: z.literal('priceitem'),
  kind: z.enum(PRICE_KINDS),
  vehicleType: z.enum(['car', 'bike', 'any']).default('any'),
  size: z.enum(['sedan', 'suv', 'standard', 'bagger', 'any']).default('any'),
  /** Dollars. Required unless unit is quote, and forbidden when it is. */
  amount: z.number().min(0).optional(),
  unit: PriceUnit,
  /** Words shown instead of a number when unit is quote: "Quoted on inspection". */
  quoteText: z.string().min(1).optional(),
  /** The founder's rate on the first machine-polish jobs (knowledge base 2 rule 3, 15.1). */
  founderRate: z
    .strictObject({ amount: z.number().positive(), slots: z.number().int().positive() })
    .optional(),
  /** Hidden in the quote builder until cars logged reaches this number (two-step: 25). */
  unlockAtCars: z.number().int().positive().optional(),
  /** Drop-off only until cars logged reaches this number, then mobile is allowed (polish: 25). */
  mobileUnlockAtCars: z.number().int().positive().optional(),
  mobileOnly: z.boolean().default(false),
  dropOffOnly: z.boolean().default(false),
  touchesPaint: z.boolean().default(false),
}).superRefine((p, ctx) => {
  if (p.unit === 'quote' && p.amount !== undefined) {
    ctx.addIssue({ code: 'custom', path: ['amount'], message: 'A quote item has no amount. Remove it.' });
  }
  if (p.unit !== 'quote' && p.amount === undefined) {
    ctx.addIssue({ code: 'custom', path: ['amount'], message: 'amount is required unless unit is quote' });
  }
  if (p.unit !== 'quote' && p.quoteText !== undefined) {
    ctx.addIssue({ code: 'custom', path: ['quoteText'], message: 'quoteText is only for unit quote' });
  }
  if ((CAR_SIZES as readonly string[]).includes(p.size) && p.vehicleType !== 'car') {
    ctx.addIssue({ code: 'custom', path: ['vehicleType'], message: 'sedan and suv sizes need vehicleType car' });
  }
  if ((BIKE_SIZES as readonly string[]).includes(p.size) && p.vehicleType !== 'bike') {
    ctx.addIssue({ code: 'custom', path: ['vehicleType'], message: 'standard and bagger sizes need vehicleType bike' });
  }
  if (p.touchesPaint && p.kind !== 'service' && p.kind !== 'plan') {
    ctx.addIssue({ code: 'custom', path: ['touchesPaint'], message: 'Only a service package or plan touches paint; add-ons never count' });
  }
  if (p.mobileOnly && p.dropOffOnly) {
    ctx.addIssue({ code: 'custom', path: ['mobileOnly'], message: 'An item cannot be both mobile only and drop-off only' });
  }
});
export type PriceItemItem = z.infer<typeof PriceItem>;

/** The words that render where a price would. Never invents a number for a quote item. */
export function priceDisplayText(p: Pick<PriceItemItem, 'unit' | 'quoteText'>): string | null {
  return p.unit === 'quote' ? (p.quoteText ?? DEFAULT_QUOTE_TEXT) : null;
}

/** A booking policy (knowledge base 15.2). Markdown file; the body is `text`. */
export const Policy = Base.extend({
  id: idWithPrefix('policy'),
  type: z.literal('policy'),
  order: z.number().int().min(1),
  text: z.string().min(1),
  sayOutLoud: z.boolean().default(true),
});
export type PolicyItem = z.infer<typeof Policy>;

/** Words said or shown to a customer. Markdown file in content/customer/; the body is `text`. */
export const SCRIPT_MOMENTS = ['booking', 'walkaround', 'pickup', 'damage', 'paint-report', 'aftercare'] as const;
export const Script = Base.extend({
  id: idWithPrefix('script'),
  type: z.literal('script'),
  when: z.enum(SCRIPT_MOMENTS),
  text: z.string().min(1),
  /** The line the customer acknowledges or signs, when there is one (knowledge base 16 step 6). */
  acknowledgment: z.string().min(1).optional(),
});
export type ScriptItem = z.infer<typeof Script>;
