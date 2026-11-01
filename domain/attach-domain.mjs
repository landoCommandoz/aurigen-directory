// Checks that the Cloudflare zone for the domain is active (the nameservers resolve to Cloudflare). Exit 0 and prints
// "active" when it is; exit 3 with a plain message and what the world currently sees when it is not yet.
//   CLOUDFLARE_API_TOKEN=... node domain/attach-domain.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = (process.env.CF_API || 'https://api.cloudflare.com/client/v4').replace(/\/$/, '');
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const req = JSON.parse(fs.readFileSync(path.join(ROOT, 'domain', 'zone.json'), 'utf8'));
if (!TOKEN) { console.error('CLOUDFLARE_API_TOKEN is empty or missing'); process.exit(1); }
const res = await fetch(`${API}/zones?name=${encodeURIComponent(req.domain)}`, { headers: { authorization: `Bearer ${TOKEN}` } });
const j = await res.json().catch(() => null);
if (!res.ok || !j || !j.success) { console.error(`Could not read the zone (HTTP ${res.status}): ${JSON.stringify(j && j.errors)}`); process.exit(1); }
const zone = (j.result || [])[0];
if (!zone) { console.error(`${req.domain} is not in this Cloudflare account yet. Run the "Domain zone" step first.`); process.exit(3); }
let seen = 'unknown';
try {
  const d = await (await fetch(`https://cloudflare-dns.com/dns-query?name=${req.domain}&type=NS`, { headers: { accept: 'application/dns-json' } })).json();
  seen = (d.Answer || []).map((a) => a.data).join(', ') || 'none';
} catch { /* DNS lookup is only for the message */ }
if (zone.status !== 'active') {
  console.error(`The zone is "${zone.status}", not active yet. Cloudflare wants these nameservers: ${zone.name_servers.join(', ')}. The internet currently sees: ${seen}. Change them at the registrar, wait until Cloudflare emails that the domain is active (usually minutes to a few hours), then run this again.`);
  process.exit(3);
}
console.log('active');
