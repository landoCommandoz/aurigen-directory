/**
 * The brand config shape (D7). src/app/config.ts (app-engineer) exports one object that must
 * parse with this schema at boot. Strict: an unknown field fails, so a home address cannot slip
 * in under a new name. Every value here ships in the public build. Owner: architect.
 */
import * as z from 'zod';

export const AppConfigSchema = z.strictObject({
  brandName: z.string().trim().min(1).max(60),
  /** Public phone, written (801) 680-5090. */
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, { error: 'Phone is written (801) 680-5090' }),
  email: z.email(),
  /** Empty means hidden: the review QR does not show until a link is set (BLUEPRINT 2.5). https only. */
  reviewLink: z.union([z.literal(''), z.url({ protocol: /^https$/ })]),
  /** Towns without a travel fee (knowledge base 1 and 15.1). */
  serviceArea: z.array(z.string().trim().min(1)).min(1),
  /** From package.json at build time. */
  version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, { error: 'version is semver, like 0.1.0' }),
});
export type AppConfigValue = z.infer<typeof AppConfigSchema>;

/** Parse the config at boot. Throws with every problem named, so the boot fallback can show it. */
export function parseAppConfig(input: unknown): AppConfigValue {
  const result = AppConfigSchema.safeParse(input);
  if (!result.success) throw new Error(`Config is not valid: ${z.prettifyError(result.error)}`);
  return result.data;
}
