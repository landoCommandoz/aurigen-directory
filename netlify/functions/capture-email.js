// Aurigen — Email Capture + Beehiiv Subscription
// Netlify Function: /.netlify/functions/capture-email
//
// Receives POST { email, language } from gate.html free access form.
// Subscribes to Beehiiv newsletter, upserts to Supabase free_users.
// Never blocks the user — Beehiiv failures still return success.
//
// Env vars (Netlify only — never hardcode):
//   BEEHIIV_API_KEY          — Beehiiv API key
//   BEEHIIV_PUBLICATION_ID   — Beehiiv publication ID
//   SUPABASE_URL             — Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (bypasses RLS)

var { getCorsHeaders, handlePreflight } = require('./utils/cors');

// ── Rate Limiting ───────────────────────────────────────────
var rateLimitMap = new Map();
var RATE_LIMIT_WINDOW = 60000;
var RATE_LIMIT_MAX = 10;

function isRateLimited(ip) {
  var now = Date.now();
  var entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Rate limit by IP
  var clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  clientIp = clientIp.split(',')[0].trim();
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, headers: headers, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  try {
    var body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseErr) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var email = (body.email || '').toLowerCase().trim();
    var language = (body.language || 'en').toLowerCase().trim();
    if (language !== 'en' && language !== 'es') language = 'en';

    // Referral code (passed from client localStorage)
    var refCode = (body.ref_code || '').trim().slice(0, 20);

    // UTM parameters (passed from client)
    var utmSource = (body.utm_source || '').slice(0, 100);
    var utmMedium = (body.utm_medium || '').slice(0, 100);
    var utmCampaign = (body.utm_campaign || '').slice(0, 100);
    var utmTerm = (body.utm_term || '').slice(0, 100);
    var utmContent = (body.utm_content || '').slice(0, 100);

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    // ── Beehiiv subscription ──────────────────────────────────
    var beehiivSynced = false;
    var beehiivApiKey = process.env.BEEHIIV_API_KEY;
    var beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID;

    if (beehiivApiKey && beehiivPubId) {
      try {
        var beehiivRes = await fetch(
          'https://api.beehiiv.com/v2/publications/' + beehiivPubId + '/subscriptions',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + beehiivApiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              reactivate_existing: false,
              send_welcome_email: true,
              utm_source: utmSource || 'aurigen-gate',
              utm_medium: utmMedium || language,
              utm_campaign: utmCampaign || undefined
            })
          }
        );
        if (beehiivRes.ok) {
          beehiivSynced = true;
          console.log('[BEEHIIV] Subscribed:', beehiivRes.status);
        } else {
          console.error('[BEEHIIV] Error:', beehiivRes.status);
        }
      } catch (beehiivErr) {
        console.error('[BEEHIIV] Network error:', beehiivErr.message);
      }
    } else {
      console.warn('[BEEHIIV] API key or publication ID not set — skipping');
    }

    // ── Supabase upsert (always, regardless of Beehiiv result) ─
    try {
      var createClient = require('@supabase/supabase-js').createClient;
      var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

      var upsertData = {
            email: email,
            language: language,
            source: 'gate',
            subscribed_at: new Date().toISOString(),
            beehiiv_synced: beehiivSynced,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null
          };
      if (refCode) upsertData.ref_code = refCode;

      var { error: upsertError } = await supabase
        .from('free_users')
        .upsert(upsertData, { onConflict: 'email' });

      if (upsertError) {
        console.error('[SUPABASE] Upsert error:', upsertError.message);
      }

      // Log full UTM data to separate table for attribution analysis
      if (utmSource || utmMedium || utmCampaign) {
        var { error: utmError } = await supabase
          .from('free_users_utm')
          .insert({
            email: email,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            utm_term: utmTerm || null,
            utm_content: utmContent || null,
            captured_at: new Date().toISOString()
          });
        if (utmError) console.error('[SUPABASE] UTM insert error:', utmError.message);
      }
    } catch (dbErr) {
      console.error('[SUPABASE] Error:', dbErr.message);
    }

    // Referral tracking — fire and forget
    if (refCode) {
      try {
        var httpsRef = require('https');
        var refBody = JSON.stringify({ action: 'track', ref_code: refCode, email: email });
        var refReq = httpsRef.request({
          hostname: (process.env.URL || 'aurigen-directory.netlify.app').replace(/^https?:\/\//, ''),
          path: '/.netlify/functions/referral',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(refBody) }
        });
        refReq.write(refBody);
        refReq.end();
      } catch(refErr) {
        console.error('[CAPTURE-EMAIL] Referral track fire failed:', refErr.message);
      }
    }

    // GHL sync for free users — fire and forget
    try {
      var https2 = require('https');
      var ghlBody = JSON.stringify({ email: email, tier: 'free', language: language, utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign });
      var ghlReq = https2.request({
        hostname: (process.env.URL || 'aurigen-directory.netlify.app').replace(/^https?:\/\//, ''),
        path: '/.netlify/functions/ghl-sync',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(ghlBody), 'x-internal-key': process.env.SUPABASE_SERVICE_ROLE_KEY }
      });
      ghlReq.write(ghlBody);
      ghlReq.end();
    } catch(ghlErr) {
      console.error('[CAPTURE-EMAIL] GHL sync fire failed:', ghlErr.message);
    }

    // Skool sync for free users — fire and forget
    try {
      var https = require('https');
      var syncBody = JSON.stringify({ email: email, tier: 'free' });
      var syncReq = https.request({
        hostname: (process.env.URL || 'aurigen-directory.netlify.app').replace(/^https?:\/\//, ''),
        path: '/.netlify/functions/skool-sync',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(syncBody), 'x-internal-key': process.env.SUPABASE_SERVICE_ROLE_KEY }
      });
      syncReq.write(syncBody);
      syncReq.end();
    } catch(syncErr) {
      console.error('[CAPTURE-EMAIL] Skool sync fire failed:', syncErr.message);
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('[CAPTURE-EMAIL] Error:', err.message || err);
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
