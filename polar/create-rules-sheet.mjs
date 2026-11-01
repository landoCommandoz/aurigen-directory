// Creates (or finds) the Polar product, license-key benefit and checkout link for the Aurigen Rules Sheet and writes
// their ids to under-review/sheet-config.json. Safe to run again: it looks for each thing by name before creating it.
//   POLAR_ACCESS_TOKEN=... node polar/create-rules-sheet.mjs
// Never prints the token. POLAR_API can point at another base URL (the tests use a local stand-in server).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = (process.env.POLAR_API || 'https://api.polar.sh').replace(/\/$/, '');
const TOKEN = process.env.POLAR_ACCESS_TOKEN || '';
const req = JSON.parse(fs.readFileSync(path.join(ROOT, 'polar', 'rules-sheet.json'), 'utf8'));
const cfgPath = path.join(ROOT, 'under-review', 'sheet-config.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
if (!TOKEN) { console.error('POLAR_ACCESS_TOKEN is empty or missing'); process.exit(1); }

async function call(method, p, body) {
  const res = await fetch(API + p, { method, headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json', accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  if (!res.ok) {
    const detail = (text || '').replace(/Bearer\s+\S+/g, 'Bearer [x]').slice(0, 600);
    throw new Error(`${method} ${p} answered HTTP ${res.status}: ${detail}`);
  }
  return json;
}
const q = (o) => Object.entries(o).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
const items = (r) => (r && Array.isArray(r.items) ? r.items : []);
const org = req.organizationId;

// 1. License-key benefit
let benefit = items(await call('GET', `/v1/benefits/?${q({ organization_id: org, type: 'license_keys', query: req.benefit.description, limit: 50 })}`))
  .find((b) => b.description === req.benefit.description && b.type === 'license_keys');
if (!benefit) {
  benefit = await call('POST', '/v1/benefits/', {
    type: 'license_keys', description: req.benefit.description, organization_id: org,
    properties: { prefix: req.benefit.prefix, expires: { ttl: req.benefit.ttlMonths, timeframe: 'month' }, activations: null, limit_usage: null },
  });
  console.log('created benefit');
} else console.log('found benefit');

// 2. Product (one-time, fixed price, private = not on the storefront)
let product = items(await call('GET', `/v1/products/?${q({ organization_id: org, query: req.productName, limit: 50 })}`))
  .find((p) => p.name === req.productName && !p.is_archived);
if (!product) {
  product = await call('POST', '/v1/products/', {
    name: req.productName, description: req.description, organization_id: org, visibility: req.visibility,
    prices: [{ amount_type: 'fixed', price_amount: req.priceCents, price_currency: 'usd' }],
  });
  console.log('created product');
} else console.log('found product');
const attached = (product.benefits || []).map((b) => b.id);
if (!attached.includes(benefit.id)) {
  await call('POST', `/v1/products/${product.id}/benefits`, { benefits: [...attached, benefit.id] });
  console.log('attached benefit to product');
}

// 3. Checkout link
let link = items(await call('GET', `/v1/checkout-links/?${q({ organization_id: org, product_id: product.id, limit: 50 })}`))
  .find((l) => l.success_url === req.successUrl);
if (!link) {
  link = await call('POST', '/v1/checkout-links/', {
    payment_processor: 'stripe', products: [product.id], success_url: req.successUrl, label: req.checkoutLabel, allow_discount_codes: true, require_billing_address: false,
  });
  console.log('created checkout link');
} else console.log('found checkout link');
if (!link.url || !/^https:\/\//.test(link.url)) throw new Error('the checkout link has no https url');

// 4. Write the ids the Worker needs (none of them is a secret).
const out = { ...cfg, orgId: org, productId: product.id, benefitId: benefit.id, checkoutUrl: link.url, priceUsd: req.priceCents / 100, createdAt: cfg.createdAt || new Date().toISOString().slice(0, 10) };
fs.writeFileSync(cfgPath, JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${path.relative(ROOT, cfgPath)}: product ${product.id}, benefit ${benefit.id}, checkout ${link.url}`);
