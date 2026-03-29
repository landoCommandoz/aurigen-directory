// Aurigen — Referral Tracking Engine
// Actions:
//   generate       — create referral code for paid user
//   track          — record that a referred user visited with a code
//   convert        — mark a referred user as converted after payment
//   stats          — get referral stats + earnings for a user
//   set-payout-email — save PayPal email for commission payouts
//   mark-paid      — admin: mark a commission as paid

var crypto = require('crypto');
var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { verifyBearer, requirePaid, requireAdmin } = require('./utils/jwt');

var COMMISSION_AMOUNT = 100.47;

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
      var auth = requirePaid(event);
      if (!auth) {
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
        code = crypto.randomBytes(6).toString('hex');
        var { error: insertErr } = await supabase
          .from('referrals')
          .insert({ referrer_email: auth.email, referral_code: code });
        if (insertErr) {
          console.error('[referral] Generate error:', insertErr.message);
          return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to generate code' }) };
        }
      }

      var baseUrl = process.env.URL || 'https://directory.theaurigen.com';
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

      var { data: referrer } = await supabase
        .from('referrals')
        .select('referrer_email')
        .eq('referral_code', refCode)
        .maybeSingle();

      if (!referrer) {
        return { statusCode: 200, headers, body: JSON.stringify({ tracked: false, error: 'Invalid referral code' }) };
      }

      if (refEmail && refEmail === referrer.referrer_email) {
        return { statusCode: 200, headers, body: JSON.stringify({ tracked: false, error: 'Self-referral' }) };
      }

      if (refEmail) {
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
        .update({
          converted: true,
          converted_at: new Date().toISOString(),
          commission_amount: COMMISSION_AMOUNT,
          commission_status: 'pending'
        })
        .eq('referred_email', convEmail)
        .eq('converted', false);

      if (convErr) console.error('[referral] Convert error:', convErr.message);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ converted: true })
      };
    }

    // === STATS: get referral stats + earnings for authenticated user ===
    if (action === 'stats') {
      var statsAuth = requirePaid(event);
      if (!statsAuth) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Paid access required' }) };
      }

      var { data: refs, error: statsErr } = await supabase
        .from('referrals')
        .select('referred_email, converted, converted_at, commission_amount, commission_status, commission_paid_at')
        .eq('referrer_email', statsAuth.email)
        .not('referred_email', 'is', null);

      if (statsErr) {
        console.error('[referral] Stats error:', statsErr.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch stats' }) };
      }

      var referred = (refs || []).length;
      var convertedRefs = (refs || []).filter(function(r) { return r.converted; });
      var converted = convertedRefs.length;
      var totalEarned = converted * COMMISSION_AMOUNT;
      var pendingAmount = convertedRefs.filter(function(r) { return r.commission_status === 'pending'; }).length * COMMISSION_AMOUNT;
      var payouts = convertedRefs.map(function(r) {
        return {
          referred_email: (r.referred_email || '').replace(/^[^@]*(@.*)$/, '***$1'),
          converted_at: r.converted_at,
          amount: r.commission_amount || COMMISSION_AMOUNT,
          status: r.commission_status || 'pending'
        };
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          referred: referred,
          converted: converted,
          total_earned: totalEarned,
          pending_amount: pendingAmount,
          commission_rate: COMMISSION_AMOUNT,
          payouts: payouts
        })
      };
    }

    // === SET-PAYOUT-EMAIL: save PayPal email for payouts ===
    if (action === 'set-payout-email') {
      var payoutAuth = requirePaid(event);
      if (!payoutAuth) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Paid access required' }) };
      }

      var paypalEmail = (body.paypal_email || '').trim().toLowerCase();
      if (!paypalEmail || paypalEmail.indexOf('@') < 1) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
      }

      var { error: payoutErr } = await supabase
        .from('referrals')
        .update({ paypal_email: paypalEmail })
        .eq('referrer_email', payoutAuth.email);

      if (payoutErr) {
        console.error('[referral] Set payout error:', payoutErr.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save payout email' }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ saved: true })
      };
    }

    // === MARK-PAID: admin marks a commission as paid ===
    if (action === 'mark-paid') {
      var adminAuth = requireAdmin(event);
      if (!adminAuth) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: 'Admin access required' }) };
      }

      var referralId = body.referral_id;
      if (!referralId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'referral_id required' }) };
      }

      var { error: markErr } = await supabase
        .from('referrals')
        .update({
          commission_status: 'paid',
          commission_paid_at: new Date().toISOString()
        })
        .eq('id', referralId)
        .eq('converted', true);

      if (markErr) {
        console.error('[referral] Mark paid error:', markErr.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to update' }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ marked: true })
      };
    }

    // === ADMIN-STATS: admin gets all pending commissions ===
    if (action === 'admin-stats') {
      var adminStatsAuth = requireAdmin(event);
      if (!adminStatsAuth) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: 'Admin access required' }) };
      }

      var { data: pending, error: pendErr } = await supabase
        .from('referrals')
        .select('id, referrer_email, referred_email, converted_at, commission_amount, commission_status, paypal_email')
        .eq('converted', true)
        .order('converted_at', { ascending: false });

      if (pendErr) {
        console.error('[referral] Admin stats error:', pendErr.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch' }) };
      }

      var totalPending = (pending || []).filter(function(r) { return r.commission_status === 'pending'; })
        .reduce(function(sum, r) { return sum + (r.commission_amount || COMMISSION_AMOUNT); }, 0);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          commissions: pending || [],
          total_pending: totalPending
        })
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action: ' + action }) };

  } catch (err) {
    console.error('[referral] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
