// Aurigen Worker. Static pages are served by Workers static assets (free, no Worker
// invocation). This script only runs for /extras* and /api/* (see wrangler.jsonc).
//
// Paid extras are behind PAID_EXTRAS ("off" by default). While off, /extras/ is a 404
// unless the URL has ?preview=1. License keys are checked with Polar's PUBLIC endpoint;
// no Polar token is stored here.

const POLAR_VALIDATE = 'https://api.polar.sh/v1/customer-portal/license-keys/validate';
const CACHE_SECONDS = 600;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    try {
      if (p === '/extras' || p.startsWith('/extras/')) return await extras(request, env, url);
      if (p === '/api/license' && request.method === 'POST') return await apiLicense(request, env);
      if (p === '/api/follow' && request.method === 'POST') return await apiFollow(request, env);
      if (p === '/api/calendar.ics') return await apiCalendar(request, env, url);
      if (p === '/api/export.csv') return await apiExport(request, env, url);
      return notFound(env, request);
    } catch (err) {
      console.error('worker error', err && err.message);
      return json({ error: 'Something went wrong. Please try again.' }, 500);
    }
  },

  // Cron: drop expired cached validations so D1 stays tiny.
  async scheduled(_event, env) {
    if (env.DB) await env.DB.prepare('DELETE FROM license_cache WHERE checked_at < ?').bind(now() - 86400).run();
  },
};

const now = () => Math.floor(Date.now() / 1000);
const isOn = (env) => String(env.PAID_EXTRAS || 'off').toLowerCase() === 'on';
const json = (obj, status = 200, headers = {}) => new Response(JSON.stringify(obj), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
});

async function notFound(env, request) {
  const r = await env.ASSETS.fetch(new URL('/404.html', request.url));
  return new Response(r.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

async function extras(request, env, url) {
  const preview = url.searchParams.get('preview') === '1';
  if (!isOn(env) && !preview) return notFound(env, request);
  // Files behind the license key are never served directly as static assets.
  if (url.pathname.startsWith('/extras/files/')) return notFound(env, request);
  const r = await env.ASSETS.fetch(new URL('/extras/index.html', request.url));
  const html = (await r.text()).replace('__POLAR_CONFIG__', JSON.stringify({
    preview: !isOn(env),
    checkout: { pack: env.POLAR_CHECKOUT_PACK || '', calMonthly: env.POLAR_CHECKOUT_CAL_MONTHLY || '', calYearly: env.POLAR_CHECKOUT_CAL_YEARLY || '' },
  }).replace(/</g, '\\u003c'));
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
}

async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Returns { valid, benefitId, hash }.
async function validate(env, key) {
  key = String(key || '').trim();
  if (!key || key.length > 200) return { valid: false };
  const hash = await sha256(key);
  if (env.DB) {
    const row = await env.DB.prepare('SELECT valid, benefit_id, checked_at FROM license_cache WHERE key_hash = ?').bind(hash).first();
    if (row && row.checked_at > now() - CACHE_SECONDS) return { valid: !!row.valid, benefitId: row.benefit_id, hash };
  }
  let valid = false; let benefitId = '';
  const res = await fetch(POLAR_VALIDATE, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'AurigenDirectory/2.0' },
    body: JSON.stringify({ key, organization_id: env.POLAR_ORG_ID }),
  });
  if (res.ok) {
    const d = await res.json();
    benefitId = d.benefit_id || '';
    const expired = d.expires_at && Date.parse(d.expires_at) < Date.now();
    valid = d.status === 'granted' && !expired;
  } else if (res.status >= 500) {
    throw new Error('license service unavailable');
  }
  if (env.DB) {
    await env.DB.prepare('INSERT INTO license_cache (key_hash, valid, benefit_id, checked_at) VALUES (?, ?, ?, ?) ON CONFLICT(key_hash) DO UPDATE SET valid = excluded.valid, benefit_id = excluded.benefit_id, checked_at = excluded.checked_at')
      .bind(hash, valid ? 1 : 0, benefitId, now()).run();
  }
  return { valid, benefitId, hash };
}

const can = (env, v, what) => v.valid && (what === 'pack' ? v.benefitId === env.POLAR_BENEFIT_PACK : v.benefitId === env.POLAR_BENEFIT_CAL);

function gate(env, url) {
  // Extras APIs work in preview so Lando can test, but only with a real key.
  return isOn(env) || url.searchParams.get('preview') === '1';
}

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

async function apiLicense(request, env) {
  const b = await readBody(request);
  const v = await validate(env, b.key);
  return json({ valid: v.valid, pack: can(env, v, 'pack'), calendar: can(env, v, 'cal') });
}

async function apiFollow(request, env) {
  const b = await readBody(request);
  const v = await validate(env, b.key);
  if (!can(env, v, 'cal')) return json({ error: 'This key does not include the calendar feed.' }, 403);
  const list = (Array.isArray(b.follow) ? b.follow : []).map(String).filter((x) => /^[A-Z]{2}(:[a-z0-9-]{1,60})?$/.test(x)).slice(0, 200);
  await env.DB.prepare('INSERT INTO follows (key_hash, follow, updated_at) VALUES (?, ?, ?) ON CONFLICT(key_hash) DO UPDATE SET follow = excluded.follow, updated_at = excluded.updated_at')
    .bind(v.hash, JSON.stringify(list), now()).run();
  return json({ ok: true, count: list.length });
}

async function loadFile(env, request, name) {
  const r = await env.ASSETS.fetch(new URL(`/extras/files/${name}`, request.url));
  if (!r.ok) throw new Error(`missing ${name}`);
  return r;
}

async function apiExport(request, env, url) {
  if (!gate(env, url)) return notFound(env, request);
  const v = await validate(env, url.searchParams.get('key'));
  if (!can(env, v, 'pack')) return json({ error: 'A valid Spreadsheet Pack key is required.' }, 403);
  const which = url.searchParams.get('file') === 'states' ? 'aurigen-states.csv' : 'aurigen-counties.csv';
  const r = await loadFile(env, request, which);
  return new Response(r.body, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${which}"`, 'cache-control': 'private, no-store' } });
}

const icsEsc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const fold = (line) => { const out = []; let s = line; while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); } out.push(s); return out.join('\r\n'); };

async function apiCalendar(request, env, url) {
  if (!gate(env, url)) return notFound(env, request);
  const v = await validate(env, url.searchParams.get('key'));
  if (!can(env, v, 'cal')) return new Response('A valid Sale Calendar key is required.', { status: 403 });
  const row = await env.DB.prepare('SELECT follow FROM follows WHERE key_hash = ?').bind(v.hash).first();
  const follow = row ? JSON.parse(row.follow) : [];
  const events = await (await loadFile(env, request, 'sales.json')).json();
  const want = (e) => follow.some((f) => f === e.s || f === `${e.s}:${e.c}`);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aurigen//Sale Calendar//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Aurigen tax sale dates', 'X-PUBLISHED-TTL:PT12H'];
  for (const e of events.filter(want)) {
    const d = e.d.replace(/-/g, '');
    const next = new Date(Date.parse(e.d) + 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    lines.push('BEGIN:VEVENT', `UID:${e.s}-${e.c}-${d}@aurigen`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next}`,
      fold(`SUMMARY:${icsEsc(`${e.n}, ${e.s} tax sale (confirm date)`)}`),
      fold(`DESCRIPTION:${icsEsc(`Directory text: "${e.t}". Dates come from the directory's research and may be approximate. Confirm with the county before you bid. Not legal or financial advice.`)}`),
      ...(e.u ? [fold(`URL:${e.u}`)] : []), 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return new Response(lines.join('\r\n') + '\r\n', { headers: { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'private, max-age=3600' } });
}
