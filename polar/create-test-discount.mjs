// Creates one single-use 100% discount code for the Platbook Rules Sheet product only, valid for ttlHours.
//   POLAR_ACCESS_TOKEN=... node polar/create-test-discount.mjs
// Reuses an unexpired code of the same name instead of making a second one. Prints the code and its expiry (the code
// is meant to be read from the log by the person testing the checkout; the Polar token is never printed).
// An organization token is used, so organization_id is never sent in a request body.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = (process.env.POLAR_API || 'https://api.polar.sh').replace(/\/$/, '');
const TOKEN = process.env.POLAR_ACCESS_TOKEN || '';
const req = JSON.parse(fs.readFileSync(path.join(ROOT, 'polar', 'test-discount.json'), 'utf8'));
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'under-review', 'sheet-config.json'), 'utf8'));
if (!TOKEN) { console.error('POLAR_ACCESS_TOKEN is empty or missing'); process.exit(1); }
if (!cfg.productId) { console.error('the Rules Sheet product does not exist yet (under-review/sheet-config.json has no productId)'); process.exit(1); }

async function call(method, p, body) {
  const res = await fetch(API + p, { method, headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json', accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 403 && /insufficient_scope/.test(text)) {
      throw new Error(`${method} ${p}: the stored Polar token is not allowed to use discounts. In Polar, edit the organization access token (or make a new one) and tick the scopes discounts:read and discounts:write, update the POLAR_ACCESS_TOKEN repository secret, then push a change to polar/test-discount.json (for example bump "run"). Or create the code by hand in Polar: Products, Discounts, New (100%, applies to Platbook Rules Sheet only, one redemption, an end date).`);
    }
    throw new Error(`${method} ${p} answered HTTP ${res.status}: ${text.replace(/Bearer\s+\S+/g, 'Bearer [x]').slice(0, 500)}`);
  }
  return JSON.parse(text);
}

const now = Date.now();
const found = (await call('GET', `/v1/discounts/?query=${encodeURIComponent(req.name)}&limit=50`)).items
  .find((d) => d.name === req.name && d.code && (!d.ends_at || Date.parse(d.ends_at) > now) && (d.redemptions_count || 0) < (req.maxRedemptions || 1));
let d = found;
if (!d) {
  // 10 characters from an alphabet without look-alikes (no 0/O, 1/I).
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code = 'AUR-' + [...crypto.randomBytes(10)].map((b) => alphabet[b % alphabet.length]).join('');
  d = await call('POST', '/v1/discounts/', {
    type: 'percentage', basis_points: req.basisPoints, duration: 'once', name: req.name, code,
    ends_at: new Date(now + req.ttlHours * 3600 * 1000).toISOString(), max_redemptions: req.maxRedemptions, products: [cfg.productId],
  });
  console.log('created a new code');
} else console.log('an unexpired, unused code already exists');
const out = [
  `CODE: ${d.code}`,
  `Valid until: ${d.ends_at}`,
  `Uses allowed: ${d.max_redemptions}`,
  `Applies to: Platbook Rules Sheet only (product ${cfg.productId})`,
  `Checkout link: ${cfg.checkoutUrl}`,
].join('\n');
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '```\n' + out + '\n```\n');
