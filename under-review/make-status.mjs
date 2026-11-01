// Builds status.json from STATUS.md (repo root) for the live Worker's /status.json.
//   node under-review/make-status.mjs [--status STATUS.md] [--out under-review/status.json]
// STATUS.md is at most 10 lines of plain text. This refuses to write if it is longer, empty, or looks like it
// holds a secret, so a bad status can never be published.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => (args.includes(name) ? args[args.indexOf(name) + 1] : dflt);
const src = path.resolve(opt('--status', path.join(here, '..', 'STATUS.md')));
const out = path.resolve(opt('--out', path.join(here, 'status.json')));

const text = fs.readFileSync(src, 'utf8').replace(/\r/g, '').trim();
const lines = text.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim() !== '');
if (!lines.length) { console.error('STATUS.md is empty'); process.exit(1); }
if (lines.length > 10) { console.error(`STATUS.md has ${lines.length} lines; the limit is 10`); process.exit(1); }
const SECRET = /sk-ant-|pit-[0-9a-f]{8}-|polar_(oat|cl)_|gh[pousr]_[A-Za-z0-9]{20,}|Bearer\s+[A-Za-z0-9._-]{20,}|[A-Za-z0-9_-]{40,}/;
for (const l of lines) if (SECRET.test(l)) { console.error('STATUS.md looks like it contains a secret; not published'); process.exit(1); }

const m = text.match(/Updated:\s*([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9:]{5} UTC)/);
// rev: an opaque fingerprint of everything the Worker bundles, so a redeploy is skipped only when nothing changed.
const h = crypto.createHash('sha256');
for (const f of ['sheet.json', 'sheet-config.json', 'sheet-listing.json', 'worker.js', 'sheet.js']) { try { h.update(fs.readFileSync(path.join(here, f))); } catch { /* file not there */ } }
const doc = { site: 'aurigen', updated: m ? m[1].trim() : new Date().toISOString(), rev: h.digest('hex').slice(0, 10), lines, source: 'STATUS.md in the aurigen-directory repo' };
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(doc, null, 1) + '\n');
console.log(`wrote ${out} (${lines.length} lines)`);
