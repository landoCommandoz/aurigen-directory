import fs from 'node:fs';
export const R='/home/runner/work/aurigen-directory/aurigen-directory';
const { statePieces } = await import(R+'/cloudflare/scripts/law-pieces.mjs');
export const snapOf = (st, slug) => { const m = JSON.parse(fs.readFileSync(`${R}/foundry/out/law-audit/sources/${st}/${slug}.json`,'utf8')); return { url: m.url, snapshot: `foundry/out/law-audit/sources/${st}/${slug}.json`, checked: m.fetched_at.slice(0,10) }; };
export function build(code, Q, D, ES, added, meta) {
  const st = JSON.parse(fs.readFileSync(`${R}/cloudflare/data/states/${code}.json`,'utf8'));
const claims = [];
const byId = {};
for (const p of statePieces(st)) {
  let cl;
  if (p.lang === 'en') {
    const d = D[p.id]; if (!d) throw new Error('no decision for ' + p.id);
    const [status, shown, cite, pass2, extra = {}] = d;
    cl = { id: p.id, lang: 'en', field: p.field, shown, original: p.text };
    if (status !== 'unreachable') Object.assign(cl, Q[cite]);
    Object.assign(cl, { status, pass2 }, extra);
    if (status === 'unreachable') cl.checked = extra.attemptedAt;
    if (status === 'supported' && shown !== p.text) throw new Error('supported but changed ' + p.id);
  } else {
    const e = ES[p.id]; if (!e) throw new Error('no ES decision for ' + p.id);
    const en = byId[e[0]];
    cl = { id: p.id, lang: 'es', enId: e[0], field: p.field, shown: e[1], original: p.text };
    for (const k of ['statute', 'url', 'sourceKind', 'quote', 'snapshot', 'checked', 'status', 'attempts', 'attemptedAt', 'flagReason']) if (en[k] !== undefined) cl[k] = en[k];
    if (cl.status === 'supported' && cl.shown !== p.text) cl.status = 'corrected';
    cl.pass2 = cl.shown === '' ? 'removed with English claim' : (p.text === cl.shown ? 'ok: matches English claim' : 'ok: rewritten to match English claim, adds nothing');
  }
  byId[p.id] = cl; claims.push(cl);
}
  for (const [after, a] of added) { const cl = { lang: 'en', original: null, added: true, ...Q[a.cite], ...a, status: a.status || 'corrected', pass2: a.pass2 || 'ok' }; delete cl.cite; claims.splice(claims.findIndex((x) => x.id === after) + 1, 0, cl); }
  const ledger = { state: code.toUpperCase(), auditedAt: new Date().toISOString().slice(0,10), spec: 'foundry/aurigen-law-audit.md', ...meta, claims };
  fs.writeFileSync(`${R}/cloudflare/data/law/${code}.json`, JSON.stringify(ledger, null, 1) + '\n');
  console.log(code, 'claims', claims.length);
}
