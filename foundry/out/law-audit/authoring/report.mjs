// node report.mjs <st> <name> <notes.md>   notes.md holds the header finding, law search, unreachable, watch sections
import fs from 'node:fs';
const R='/home/runner/work/aurigen-directory/aurigen-directory';
const [st, name, notesPath] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(`${R}/cloudflare/data/law/${st}.json`,'utf8'));
const notes = fs.readFileSync(notesPath,'utf8');
const esc = (s) => String(s ?? '').replace(/\|/g, '/');
const rows = L.claims.map(c => `| ${c.id} | ${esc(c.shown || '(removed)')} | ${esc(c.statute || '')} | ${c.url ? `[link](${c.url})` : ''} | ${c.status} |`).join('\n');
const en = L.claims.filter(c => c.lang === 'en');
const corr = en.filter(c => c.status === 'corrected').map(c => `- \`${c.id}\`: “${c.original ?? '(new)'}” → “${c.shown || '(removed)'}”`).join('\n');
const p2 = en.filter(c => c.pass2 && !/^ok/.test(c.pass2)).map(c => `- \`${c.id}\`: ${c.pass2}`).join('\n');
const fl = en.filter(c => c.status === 'flagged').map(c => `- \`${c.id}\`: ${c.flagReason}`).join('\n') || 'None.';
const md = `# ${name} (${st.toUpperCase()}) law audit

Checked ${L.auditedAt}. Status: done. Ledger: \`cloudflare/data/law/${st}.json\`.

Official code access: ${L.codeAccess}

${notes.trim()}

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
${rows}

## Corrections (before → after)

${corr || 'None.'}

## Pass 2 trims, removals and notes

${p2 || 'None.'}

## Conflicts (flagged)

${fl}
`;
fs.writeFileSync(`${R}/foundry/out/law-audit/${st}.md`, md);
console.log('wrote', st + '.md');
