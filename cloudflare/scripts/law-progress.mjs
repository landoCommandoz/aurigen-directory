// Updates the law-audit progress files after a state: PROGRESS.json, SUMMARY.md and the chain file.
//   node scripts/law-progress.mjs <st> <todo|in_progress|done|blocked>
//   node scripts/law-progress.mjs            (just rebuild SUMMARY.md and the chain file)
//   node scripts/law-progress.mjs --gaps-closed <st>   (record that the state's queued gap work was done; see cloudflare/data/law/gaps.json)
// Counts come from the state's ledger. Only mark a state done after check-law.mjs --state <st> passes.
// A done state needs an entry in cloudflare/data/law/gaps.json: "checked" (no gaps) or "checked with gaps" (each gap listed).
// The chain total is 51 states plus one queue item per state that has gaps; a blocked state counts as finished for the chain only.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadLedger } from './law-pieces.mjs';

const OUT = path.join(ROOT, 'foundry', 'out', 'law-audit');
const PROG = path.join(OUT, 'PROGRESS.json');
const prog = JSON.parse(fs.readFileSync(PROG, 'utf8'));
const GAPS = path.join(ROOT, 'cloudflare', 'data', 'law', 'gaps.json');
const gaps = JSON.parse(fs.readFileSync(GAPS, 'utf8'));
const [st, status] = process.argv.slice(2);
const STATUSES = ['checked', 'checked with gaps', "Couldn't reach source"];

function counts(code) {
  const L = loadLedger(code);
  const c = { claims: 0, supported: 0, corrected: 0, flagged: 0, unreachable: 0, trimmed: 0 };
  if (!L) return c;
  for (const x of L.claims) { c.claims++; c[x.status] = (c[x.status] || 0) + 1; if (x.pass2 && x.pass2 !== 'ok') c.trimmed++; }
  return c;
}

if (st === '--gaps-closed') {
  const code = (status || '').toUpperCase();
  const g = gaps.states[code];
  if (!g || !g.gaps.length) { console.error(`${code} has no gap queue item`); process.exit(1); }
  const today = new Date().toISOString().slice(0, 10);
  for (const x of g.gaps) if (x.closed && !x.closedAt) x.closedAt = today;
  g.attemptedAt = today;
  if (g.gaps.every((x) => x.closed)) g.checkStatus = 'checked';
  fs.writeFileSync(GAPS, JSON.stringify(gaps, null, 1) + '\n');
  console.log(`${code}: gap queue item recorded, status now "${g.checkStatus}"`);
} else if (st) {
  const code = st.toUpperCase();
  if (!prog.states[code]) { console.error(`unknown state ${code}`); process.exit(1); }
  if (!['todo', 'in_progress', 'done', 'blocked'].includes(status)) { console.error('status must be todo, in_progress, done or blocked'); process.exit(1); }
  const entry = gaps.states[code];
  if (status === 'done' && (!entry || !STATUSES.includes(entry.checkStatus) || (entry.checkStatus === 'checked with gaps' && !entry.gaps.length))) {
    console.error(`${code}: add a gaps.json entry first ("checked", or "checked with gaps" with each gap listed)`); process.exit(1);
  }
  prog.states[code] = { status, date: new Date().toISOString().slice(0, 10), ...counts(code), ...(entry ? { checkStatus: entry.checkStatus } : {}) };
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 1) + '\n');
}

const done = prog.order.filter((s) => prog.states[s].status === 'done');
fs.mkdirSync(path.join(ROOT, 'foundry', 'out', 'chain'), { recursive: true });
const queue = Object.values(gaps.states).filter((g) => g.gaps.length && (g.checkStatus === 'checked with gaps' || g.attemptedAt));
const queueDone = queue.filter((g) => g.attemptedAt).length;
const finished = prog.order.filter((s) => ['done', 'blocked'].includes(prog.states[s].status)).length;
fs.writeFileSync(path.join(ROOT, 'foundry', 'out', 'chain', 'aurigen-law-audit.json'), JSON.stringify({ total: 51 + queue.length, done: finished + queueDone }) + '\n');

const conflicts = [], unreachable = [];
const lines = ['| State | Status | Check status | Date | Claims | Supported | Corrected | Flagged | Unreachable | Pass 2 trims | Report |', '|---|---|---|---|---|---|---|---|---|---|---|'];
for (const s of prog.order) {
  const p = prog.states[s];
  const rep = fs.existsSync(path.join(OUT, `${s.toLowerCase()}.md`)) ? `[${s.toLowerCase()}.md](${s.toLowerCase()}.md)` : '';
  lines.push(`| ${s} | ${p.status} | ${gaps.states[s]?.checkStatus || ''} | ${p.date || ''} | ${p.claims || 0} | ${p.supported || 0} | ${p.corrected || 0} | ${p.flagged || 0} | ${p.unreachable || 0} | ${p.trimmed || 0} | ${rep} |`);
  const L = loadLedger(s);
  for (const c of L?.claims || []) {
    if (c.lang !== 'en') continue;
    if (c.status === 'flagged') conflicts.push(`- ${s} \`${c.id}\`: ${c.flagReason || c.pass2}`);
    if (c.status === 'unreachable') unreachable.push(`- ${s} \`${c.id}\`: ${(c.attempts || []).join(', ')}`);
  }
}
const md = `# Law audit summary

Spec: \`foundry/aurigen-law-audit.md\`. Gate: \`cloudflare/scripts/check-law.mjs\`. Ledgers: \`cloudflare/data/law/<st>.json\`.
States done: ${done.length} of 51${done.length ? ` (${done.join(', ')})` : ''}.

${lines.join('\n')}

## Conflicts (flagged claims)

${conflicts.length ? conflicts.join('\n') : 'None yet.'}

## Unreachable sources ("Couldn't reach source")

${unreachable.length ? unreachable.join('\n') : 'None yet.'}
`;
fs.writeFileSync(path.join(OUT, 'SUMMARY.md'), md);
console.log(`progress: ${done.length} of 51 done`);
