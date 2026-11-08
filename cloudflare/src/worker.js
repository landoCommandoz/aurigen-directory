// Platbook Worker. Pages run through this script first (see wrangler.jsonc) so a request on the
// wrong hostname can be sent to the real one; /assets/* still bypasses the Worker entirely.
//
// Paid extras are behind PAID_EXTRAS ("off" by default). While off, /extras/ is a 404
// unless the URL has ?preview=1. License keys are checked with Polar's PUBLIC endpoint;
// no Polar token is stored here.

// The free Rules Sheet lives in one module shared with the under-review page, so there is only
// one copy of the sheet text and one copy of its data. wrangler.jsonc routes /rules-sheet* here.
import { handleSheet } from '../../under-review/sheet.js';

// The Rules Sheet page is drawn by the Worker, not by scripts/build-site.mjs, so it is the one
// page the beacon in the page builder cannot reach. Same token, read from the same file, so
// there is still exactly one place to change it. The under-review Worker does not import this
// module, so hiding the site stays free of any third-party script.
//
// It is also the one page that sets a Content-Security-Policy - "default-src 'none'" - because
// it is the page that takes a licence key. That policy blocks every third-party script,
// including this one: tested against the live page on 2026-11-08, and the browser refuses the
// load outright ("violates ... default-src 'none'"). So the beacon is NOT added to a response
// that carries a policy, rather than shipping a tag that provably cannot run. Counting visits
// to that page would mean loosening the policy on the page that handles keys, which is Lando's
// call, not a side effect of adding analytics. If he says yes, the policy needs
// "script-src https://static.cloudflareinsights.com" and
// "connect-src https://cloudflareinsights.com", and this skip can go.
import BEACON_CFG from '../data/beacon.json' with { type: 'json' };

const BEACON = /^[A-Za-z0-9]{8,64}$/.test(String(BEACON_CFG.token || '').trim())
  ? `<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${String(BEACON_CFG.token).trim()}"}'></script><!-- End Cloudflare Web Analytics -->`
  : '';

/** Put the beacon on an HTML response from the sheet. Anything else is passed straight back. */
async function withBeacon(res) {
  if (!BEACON || !res || !res.ok) return res;
  if (!String(res.headers.get('content-type') || '').includes('text/html')) return res;
  if (res.headers.get('content-security-policy')) return res;
  const html = await res.text();
  if (!html.includes('</body>') || html.includes('static.cloudflareinsights.com')) {
    return new Response(html, res);
  }
  const headers = new Headers(res.headers);
  // The body just changed length, so a copied content-length would be a lie.
  headers.delete('content-length');
  return new Response(html.replace('</body>', BEACON + '</body>'), { status: res.status, statusText: res.statusText, headers });
}

const POLAR_VALIDATE = 'https://api.polar.sh/v1/customer-portal/license-keys/validate';
const CACHE_SECONDS = 600;

// The one address the site answers on. Everything else that reaches this Worker - www, the old
// workers.dev address, any future preview name - is sent to the matching path here, so a link
// anyone has already shared keeps working and search engines index one site, not three.
// Localhost is exempt so `wrangler dev` still works.
// Not exported: the Workers runtime refuses any named export from the entrypoint that is not
// a function or a handler, and 'wrangler dev' will not start if this is one. Tests read it
// through canonicalHost().
const CANONICAL_HOST = 'theplatbook.com';
const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/i;

// Returns where this request should be sent instead, or null if it is already in the right
// place. Exported and kept pure because `wrangler dev` answers on 127.0.0.1 whatever Host
// header you send, so this rule cannot be exercised locally through the server - only by
// calling it directly. See under-review/test/canonical.test.mjs.
export const canonicalHost = () => CANONICAL_HOST;

export function canonicalRedirect(urlString) {
  const url = new URL(urlString);
  if (url.hostname === CANONICAL_HOST || LOCAL.test(url.hostname)) return null;
  const to = new URL(urlString);
  to.protocol = 'https:';
  to.hostname = CANONICAL_HOST;
  to.port = '';
  return to.toString();
}

// ---------------------------------------------------------------------------------------
// Counting arrivals from a tagged link, e.g. https://theplatbook.com/?from=reddit
//
// What is stored: a day, a source and a number. That is the whole table. No IP address, no
// user agent, no cookie, no path, no time of day - nothing that could point at a person, so
// there is nothing to leak and nothing to ask consent for.
//
// The page is served exactly as it would be without the tag: same bytes, same headers, same
// canonical link (which is baked into the HTML at build time and never carries the tag). The
// count is written after the response has gone, through ctx.waitUntil, and every error is
// swallowed - a counter must never make a page slow or make it fail.
// ---------------------------------------------------------------------------------------

// Letters, numbers and dashes, up to 30. Anything else is ignored: the page still loads, it
// is simply not counted. This is also what keeps the value safe to put in the database.
const SOURCE_OK = /^[A-Za-z0-9-]{1,30}$/;

// Robots. The /i at the end is what makes this ignore upper and lower case, so REDDITBOT,
// Redditbot and redditbot are all the same thing to it; there are tests for that.
//
// "bot", "crawl", "spider" and "preview" do most of the work - "bot" alone already catches
// Slackbot, Discordbot, redditbot, Twitterbot, LinkedInBot, TelegramBot, Facebot, Applebot,
// Googlebot and bingbot - but the named ones are spelled out so this list reads as what it is
// to anyone who opens the file later.
//
// The four at the end are the ones no generic word catches:
//   whatsapp         - sends "WhatsApp/2.19", which contains none of the words above
//   snapchat         - its fetcher usually says "Snap URL Preview Service", but a second form
//                      reported in the wild is "Snapchat/1.0", which "preview" would miss
//   skype            - Skype and Teams unfurl through "SkypeUriPreview Preview/0.5"; the word
//                      "preview" already catches that exact string, and this catches it if
//                      Microsoft ever drops the word
//   meta-external    - Meta's newer agents, "meta-externalagent" and "meta-externalfetcher",
//                      have no "bot" in them at all
//
// Known cost of the whatsapp entry: if a person taps a link inside WhatsApp and it opens in an
// in-app browser that still says WhatsApp, that real visit is not counted. Under-counting a
// person is the safer way to be wrong than counting a robot as one.
const ROBOT = /bot|crawl|spider|preview|facebookexternalhit|slackbot|discordbot|redditbot|whatsapp|snapchat|skype|meta-external/i;

// The day in Mountain time, as YYYY-MM-DD. Mountain time, not UTC, so a click at 7pm in
// Montana is counted on the day it happened; en-CA gives the date in that order already, and
// the time zone database handles the switch to and from daylight saving.
const mountainDay = (at = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(at);

// The table is created from here because this machine cannot reach the database directly.
// It is attempted once per isolate, not once per request.
let tableReady = false;

/** The source to count for this request, or '' for anything that must not be counted. */
export function countableSource(request, url) {
  if (request.method !== 'GET') return '';
  const source = url.searchParams.get('from');
  if (!source || !SOURCE_OK.test(source)) return '';
  const ua = request.headers.get('user-agent') || '';
  // No user agent at all is not a browser, so it is not a visitor either.
  if (!ua || ROBOT.test(ua)) return '';
  return source;
}

async function countClick(env, source, day = mountainDay()) {
  if (!env.DB) return;
  // One statement at a time, on purpose. D1 wraps a batch in a transaction and refuses to
  // change the schema inside one, so putting the CREATE in a batch with the insert would fail
  // on the very first click and never be seen - the write is in the background and silent.
  if (!tableReady) {
    await env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS ref_clicks (day TEXT NOT NULL, source TEXT NOT NULL, clicks INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, source))'
    ).run();
    tableReady = true;
  }
  await env.DB.prepare(
    'INSERT INTO ref_clicks (day, source, clicks) VALUES (?1, ?2, 1) ON CONFLICT (day, source) DO UPDATE SET clicks = clicks + 1'
  ).bind(day, source).run();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;
    const moved = canonicalRedirect(request.url);
    if (moved) {
      return new Response(null, {
        status: 301,
        headers: {
          location: moved,
          'cache-control': 'public, max-age=3600',
          // Nothing should ever be indexed under a name that is not the canonical one.
          'x-robots-tag': 'noindex',
        },
      });
    }
    try {
      const sheet = await handleSheet(request, env);
      if (sheet) return await withBeacon(sheet);
      if (p === '/extras' || p.startsWith('/extras/')) return await extras(request, env, url);
      if (p === '/api/license' && request.method === 'POST') return await apiLicense(request, env);
      if (p === '/api/follow' && request.method === 'POST') return await apiFollow(request, env);
      if (p === '/api/calendar.ics') return await apiCalendar(request, env, url);
      if (p === '/api/export.csv') return await apiExport(request, env, url);
      // Everything else is a static page. The Worker now sees these requests (it has to, to catch
      // the wrong hostname above), so it must hand them to the assets itself; `not_found_handling`
      // in wrangler.jsonc still serves 404.html with a 404 for anything that does not exist.
      const page = await env.ASSETS.fetch(request);
      const source = countableSource(request, url);
      if (!source) return page;
      // After this point nothing may throw: the page is already built and has to go out.
      try {
        const write = countClick(env, source).catch((err) => console.error('ref_clicks', err && err.message));
        if (ctx && ctx.waitUntil) ctx.waitUntil(write);
        const counted = new Response(page.body, page);
        counted.headers.set('x-platbook-counted', 'yes');
        return counted;
      } catch (err) {
        console.error('ref_clicks', err && err.message);
        return page;
      }
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
    headers: { 'content-type': 'application/json', 'user-agent': 'PlatbookDirectory/2.0' },
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
  const which = url.searchParams.get('file') === 'states' ? 'platbook-states.csv' : 'platbook-counties.csv';
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
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Platbook//Sale Calendar//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Platbook tax sale dates', 'X-PUBLISHED-TTL:PT12H'];
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
