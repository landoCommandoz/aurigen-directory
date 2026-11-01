// Adds aurigendirectory.com to the Cloudflare account (Free plan) if it is not there yet, and prints the two nameservers
// to set at the registrar. Safe to run again. Needs CLOUDFLARE_API_TOKEN with permission to edit zones; if it is
// refused the log says what to do by hand. Never prints the token.
//   CLOUDFLARE_API_TOKEN=... node domain/create-zone.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = (process.env.CF_API || 'https://api.cloudflare.com/client/v4').replace(/\/$/, '');
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const req = JSON.parse(fs.readFileSync(path.join(ROOT, 'domain', 'zone.json'), 'utf8'));
if (!TOKEN) { console.error('CLOUDFLARE_API_TOKEN is empty or missing'); process.exit(1); }

async function cf(method, p, body) {
  const res = await fetch(API + p, { method, headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let j = null;
  try { j = JSON.parse(text); } catch { /* not json */ }
  return { status: res.status, ok: res.ok && j && j.success !== false, json: j, text };
}
const errors = (r) => (r.json && r.json.errors ? r.json.errors.map((e) => `${e.code}: ${e.message}`).join('; ') : r.text.slice(0, 300));

const MANUAL = `If Cloudflare refused this, add the domain by hand: Cloudflare dashboard > Add a domain > ${req.domain} > Free plan > continue. It then shows the two nameservers to use.`;

let r = await cf('GET', `/zones?name=${encodeURIComponent(req.domain)}`);
if (!r.ok) { console.error(`Could not look up the zone (HTTP ${r.status}): ${errors(r)}\n${MANUAL}`); process.exit(1); }
let zone = (r.json.result || [])[0];
if (!zone) {
  r = await cf('POST', '/zones', { name: req.domain, account: { id: req.accountId }, type: 'full' });
  if (!r.ok) { console.error(`Could not add the zone (HTTP ${r.status}): ${errors(r)}\n${MANUAL}`); process.exit(1); }
  zone = r.json.result;
  console.log('added the domain to Cloudflare (Free plan)');
} else console.log('the domain is already in this Cloudflare account');

const out = {
  domain: req.domain, zoneId: zone.id, status: zone.status, plan: zone.plan && zone.plan.name,
  nameservers: zone.name_servers, currentNameservers: zone.original_name_servers, registrar: zone.original_registrar || null,
};
console.log(JSON.stringify(out, null, 1));
if (!Array.isArray(out.nameservers) || out.nameservers.length < 2) { console.error('Cloudflare returned no nameservers'); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'domain', 'NAMESERVERS.md'), `# Nameservers for ${req.domain}\n\nSet exactly these two at the registrar (checked ${new Date().toISOString().slice(0, 10)}, zone status "${out.status}"):\n\n${out.nameservers.map((n) => `- ${n}`).join('\n')}\n\nBefore the change the domain used: ${(out.currentNameservers || []).join(', ') || 'unknown'}.\n`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '```\n' + out.nameservers.join('\n') + '\n```\n');
