// Aurigen — Referral Tracking Engine
// Actions:
//   generate — create referral code for paid user
//   track    — record that a referred user visited with a code
//   convert  — mark a referred user as converted after payment
//   stats    — get referral stats for a user

var crypto = require('crypto');
var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { verifyBearer } = require('./utils/jwt');

// Rate limiting
var _refRateMap = {};
function checkRefRate(ip) {
  var now = Date.now();
  if (!_refRateMap[ip] || now - _refRateMap[ip].start > 60000) {
    _refRateMap[ip] = { start: now, count: 1 };
    return true;
  }
  _refRateMap[ip].count++;
  return _refRateMap[ip].count <= 20;
}

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  if (!checkRefRate(clientIp.split(',')[0].trim())) {
    return { statusCode: 429, headers: { ...headers, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  try {
    var body;
    try { body = JSON.parse(event.body || '{}'); } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var action = (body.action || '').trim();
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // === GENERATE: create referral code for authenticated paid user ===
    if (action === 'generate') {
      var auth = verifyBearer(event);
      if (!auth || (auth.tier !== 'paid' && !auth.isAdmin)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Paid access required' }) };
      }

      // Check if user already has a code
      var { data: existing } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_email', auth.email)
        .is('referred_email', null)
        .maybeSingle();

      var code;
      if (existing && existing.referral_code) {
        code = existing.referral_code;
      } else {
        // Generate crypto-random code
        code = crypto.randomBytes(6).toString('hex');
        var { error: insertErr } = await supabase
          .from('referrals')
          .insert({ referrer_email: auth.email, referral_code: code });
        if (insertErr) {
          console.error('[referral] Generate error:', insertErr.message);
          return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to generate code' }) };
        }
      }

      var baseUrl = process.env.URL || 'https://aurigendirectory.com';
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ code: code, referral_url: baseUrl + '/?ref=' + code })
      };
    }

    // === TRACK: record visit from referred user ===
    if (action === 'track') {
      var refCode = (body.ref_code || '').trim();
      var refEmail = (body.email || '').toLowerCase().trim();
      if (!refCode) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'ref_code required' }) };
      }

      // Find the referrer by code
      var { data: referrer } = await supabase
        .from('referrals')
        .select('referrer_email')
        .eq('referral_code', refCode)
        .maybeSingle();

      if (!referrer) {
        return { statusCode: 200, headers, body: JSON.stringify({ tracked: false, error: 'Invalid referral code' }) };
      }

      // Don't let someone refer themselves
      if (refEmail && refEmail === referrer.referrer_email) {
        return { statusCode: 200, headers, body: JSON.stringify({ tracked: false, error: 'Self-referral' }) };
      }

      if (refEmail) {
        // Upsert the referral record
        var { error: trackErr } = await supabase
          .from('referrals')
          .upsert({
            referrer_email: referrer.referrer_email,
            referred_email: refEmail,
            referral_code: refCode,
            created_at: new Date().toISOString()
          }, { onConflict: 'referrer_email,referred_email' });
        if (trackErr) console.error('[referral] Track error:', trackErr.message);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ tracked: true })
      };
    }

    // === CONVERT: mark referral as converted after payment ===
    if (action === 'convert') {
      // Internal only — requires internal key or JWT
      var convAuth = verifyBearer(event);
      var convInternal = (event.headers || {})['x-internal-key'] || '';
      var isConvInternal = convInternal && process.env.SUPABASE_SERVICE_ROLE_KEY && convInternal === process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!convAuth && !isConvInternal) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Auth required' }) };
      }

      var convEmail = (body.email || '').toLowerCase().trim();
      if (!convEmail) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
      }

      var { error: convErr } = await supabase
        .from('referrals')
        .update({ converted: true, converted_at: new Date().toISOString() })
        .eq('referred_email', convEmail)
        .eq('converted', false);

      if (convErr) console.error('[referral] Convert error:', convErr.message);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ converted: true })
      };
    }

    // === STATS: get referral counts for authenticated user ===
    if (action === 'stats') {
      var statsAuth = verifyBearer(event);
      if (!statsAuth) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Auth required' }) };
      }

      var { data: refs, error: statsErr } = await supabase
        .from('referrals')
        .select('referred_email, converted')
        .eq('referrer_email', statsAuth.email)
        .not('referred_email', 'is', null);

      if (statsErr) {
        console.error('[referral] Stats error:', statsErr.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch stats' }) };
      }

      var referred = (refs || []).length;
      var converted = (refs || []).filter(function(r) { return r.converted; }).length;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ referred: referred, converted: converted })
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action: ' + action }) };

  } catch (err) {
    console.error('[referral] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
