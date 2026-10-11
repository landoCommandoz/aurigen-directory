import { version } from '../../package.json';

/**
 * Brand and business config: the one place these public values live (DECISIONS D7).
 * Renaming the business is one edit here. Every value in this file ships in the
 * public build, so it holds public values only.
 *
 * Never add the home address here, or anywhere in the repo (D7). If a later
 * phase needs it, it goes into on-device Settings behind the owner PIN.
 *
 * The zod schema for this object belongs in src/schemas/ (architect). Once it
 * lands, this object is validated against it at boot.
 */
export const config = {
  brandName: "Lando's Detailing",
  phone: '(801) 680-5090',
  email: 'LandonBrewington12@gmail.com',
  /** Google review link. Empty string means hidden: the review QR does not show until it is set. */
  reviewLink: '',
  serviceArea: ['Tooele', 'Stansbury', 'Grantsville'],
  /** App version, read from package.json at build time. */
  version,
} as const;

export type AppConfig = typeof config;
