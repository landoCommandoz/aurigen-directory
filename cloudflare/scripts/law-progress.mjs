// Updates the law-audit progress files after a state: PROGRESS.json, SUMMARY.md and the chain file.
//   node scripts/law-progress.mjs <st> <todo|in_progress|done|blocked>
//   node scripts/law-progress.mjs            (just rebuild SUMMARY.md and the chain file)
// Counts come from the state's ledger. Only mark a state done after check-law.mjs --state <st> passes.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadLedger } from './law-pieces.mjs';

const OUT = path.join(ROOT, 'foundry', 'out', 'law-audit');
const PROG = path.join(OUT, 'PROGRESS.json');
const prog = JSON.parse(fs.readFileSync(PROG, 'utf8'));
const [st, status] = process.argv.slice(2);

function counts(code) {
  const L = loadLedger(code);
  const c = { claims: 0, supported: 0, corrected: 0, flagged: 0, unreachable: 0, trimmed: 0 };
  if (!L) return c;
  for (const x of L.claims) { c.claims++; c[x.status] = (c[x.status] || 0) + 1; if (x.pass2 && x.pass2 !== 'ok') c.trimmed++; }
  return c;
}

if (st) {
  const code = st.toUpperCase();
  if (!prog.states[code]) { console.error(`unknown state ${code}`); process.exit(1); }
  if (!['todo', 'in_progress', 'done', 'blocked'].includes(status)) { console.error('status must be todo, in_progress, done or blocked'); process.exit(1); }
  prog.states[code] = { status, date: new Date().toISOString().slice(0, 10), ...counts(code) };
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 1) + '\n');
}

const done = prog.order.filter((s) => prog.states[s].status === 'done');
fs.mkdirSync(path.join(ROOT, 'foundry', 'out', 'chain'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'foundry', 'out', 'chain', 'aurigen-law-audit.json'), JSON.stringify({ total: 51, done: done.length }) + '\n');

const conflicts = [], unreachable = [];
const lines = ['| State | Status | Date | Claims | Supported | Corrected | Flagged | Unreachable | Pass 2 trims | Report |', '|---|---|---|---|---|---|---|---|---|---|'];
for (const s of prog.order) {
  const p = prog.states[s];
  const rep = fs.existsSync(path.join(OUT, `${s.toLowerCase()}.md`)) ? `[${s.toLowerCase()}.md](${s.toLowerCase()}.md)` : '';
  lines.push(`| ${s} | ${p.status} | ${p.date || ''} | ${p.claims || 0} | ${p.supported || 0} | ${p.corrected || 0} | ${p.flagged || 0} | ${p.unreachable || 0} | ${p.trimmed || 0} | ${rep} |`);
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
