// node finish.mjs <st> <Name> <notes.md> <gaps.json-fragment-file>   then commits nothing; caller commits.
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const R='/home/runner/work/aurigen-directory/aurigen-directory';
const [st, name, notes, gapsFile] = process.argv.slice(2);
const A = `${R}/foundry/out/law-audit/authoring`;
const g = JSON.parse(fs.readFileSync(`${R}/cloudflare/data/law/gaps.json`,'utf8'));
g.states[st.toUpperCase()] = JSON.parse(fs.readFileSync(gapsFile,'utf8'));
fs.writeFileSync(`${R}/cloudflare/data/law/gaps.json`, JSON.stringify(g,null,1)+'\n');
const sh = (c) => console.log(execSync(c,{cwd:R}).toString().trim());
sh(`node ${A}/report.mjs ${st} "${name}" ${notes}`);
sh(`node cloudflare/scripts/check-law.mjs --state ${st} | tail -3`);
sh(`node cloudflare/scripts/law-sources.mjs`);
sh(`node cloudflare/scripts/law-progress.mjs ${st} done | tail -3`);
sh(`node ${A}/corrections.mjs`);
sh(`node -e "const l=require('./cloudflare/data/law/${st}.json');const c=l.claims;const n=(s)=>c.filter(x=>x.status===s).length;console.log('Law audit: ${st.toUpperCase()} done ('+c.length+' claims, '+n('corrected')+' corrected, '+n('flagged')+' flagged, '+n('unreachable')+' unreachable)')"`);
