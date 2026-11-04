// Rebuilds corrections-summary.md from the ledgers. Run from anywhere: node corrections.mjs
import fs from 'node:fs';
const R = '/home/runner/work/aurigen-directory/aurigen-directory';
const prog = JSON.parse(fs.readFileSync(`${R}/foundry/out/law-audit/PROGRESS.json`, 'utf8'));
const K = [['substantive', 'Substantive'], ['wording', 'Wording or citation only'], ['removed-opinion', 'Removed opinion']];
const tot = { substantive: 0, wording: 0, 'removed-opinion': 0 };
const rows = [], ex = [];
for (const s of prog.order) {
  const f = `${R}/cloudflare/data/law/${s.toLowerCase()}.json`;
  if (!fs.existsSync(f) || prog.states[s].status === 'todo') continue;
  const L = JSON.parse(fs.readFileSync(f, 'utf8'));
  const c = { substantive: 0, wording: 0, 'removed-opinion': 0 };
  for (const x of L.claims) if (x.status === 'corrected' && c[x.correctionKind] !== undefined) c[x.correctionKind]++;
  for (const k in c) tot[k] += c[k];
  rows.push(`| ${s} | ${c.substantive} | ${c.wording} | ${c['removed-opinion']} | ${c.substantive + c.wording + c['removed-opinion']} |`);
  const e = ['### ' + s, ''];
  for (const [k, label] of K) { const x = L.claims.find((y) => y.lang === 'en' && y.status === 'corrected' && y.correctionKind === k); if (x) e.push(`- ${label} (\`${x.id}\`): ${x.original} → ${x.shown || '(removed)'}`); }
  ex.push(e.join('\n'));
}
const all = tot.substantive + tot.wording + tot['removed-opinion'];
const pct = (n) => Math.round(100 * n / (all || 1)) + '%';
fs.writeFileSync(`${R}/foundry/out/law-audit/corrections-summary.md`, `# Corrections summary, law audit (${rows.length} states checked so far; rebuilt ${new Date().toISOString().slice(0, 10)})

Generated from the ledgers in \`cloudflare/data/law/\` by \`foundry/out/law-audit/authoring/corrections.mjs\`. Each corrected claim carries \`correctionKind\` and \`correctionBasis\`.

## What the three kinds mean

- **Substantive**: a rule, number, rate, date, deadline, process, who runs the sale, or whether something is available changed. Also counts a claim removed because it stated a rule or figure the official source does not support.
- **Wording or citation only**: the same rule restated in plainer or more exact words, or the citation or link swapped.
- **Removed opinion**: a claim taken out because it was advice, a comparison, a prediction or a "tip" that no official source states.

Spanish claims inherit the label of the English claim they mirror. English and Spanish are counted separately.

## Totals

| Kind | Claims | Share |
|---|---:|---:|
| Substantive | ${tot.substantive} | ${pct(tot.substantive)} |
| Wording or citation only | ${tot.wording} | ${pct(tot.wording)} |
| Removed opinion | ${tot['removed-opinion']} | ${pct(tot['removed-opinion'])} |
| **All corrected** | **${all}** | |

## By state

| State | Substantive | Wording or citation only | Removed opinion | Total |
|---|---:|---:|---:|---:|
${rows.join('\n')}

## One example of each kind, per state

${ex.join('\n\n')}
`);
console.log('corrections-summary.md', rows.length, 'states', all, 'corrected');
