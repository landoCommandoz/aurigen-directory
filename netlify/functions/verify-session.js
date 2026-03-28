// Aurigen — Stripe Session Verification
// Netlify Function: /.netlify/functions/verify-session
//
// Called by success.html after Stripe payment redirect.
// Retrieves the checkout session from Stripe, confirms payment,
// and upserts paid_users record in Supabase.
//
// Env vars (Netlify only — never hardcode):
//   STRIPE_SECRET_KEY         — Stripe secret API key (sk_live_... or sk_test_...)
//   SUPABASE_URL              — Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (bypasses RLS)

var crypto = require('crypto');

function base64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signJwt(payload, secret) {
  var header = { alg: 'HS256', typ: 'JWT' };
  var now = Math.floor(Date.now() / 1000);
  payload.iat = now;
  payload.exp = now + 86400; // 24 hours
  var segments = [base64url(JSON.stringify(header)), base64url(JSON.stringify(payload))];
  var sigInput = segments.join('.');
  var sig = crypto.createHmac('sha256', secret).update(sigInput).digest();
  segments.push(base64url(sig));
  return segments.join('.');
}

const ALLOWED_ORIGINS = [
  'https://aurigen-directory.netlify.app',
  'https://statuesque-bublanina-330b9d.netlify.app',
  'https://hilarious-llama-2933ac.netlify.app',
  'https://aurigendirectory.com',
  'https://www.aurigendirectory.com',
  'http://localhost:8888',
  'http://localhost:3000'
];

function corsHeaders(origin) {
  var allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
}

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
  var origin = event.headers.origin || event.headers.Origin || '';
  var headers = corsHeaders(origin);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: headers, body: '' };
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

    var sessionId = (body.session_id || '').trim();

    // Validate session_id format (Stripe session IDs start with cs_)
    if (!sessionId || !/^cs_(test_|live_)[a-zA-Z0-9]+$/.test(sessionId)) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ verified: false, error: 'Invalid session ID' }) };
    }

    // Lazy-load Stripe SDK
    var Stripe = require('stripe');
    var stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    // Retrieve the checkout session from Stripe
    var session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeErr) {
      console.error('[VERIFY-SESSION] Stripe retrieve error:', stripeErr.message);
      return { statusCode: 400, headers: headers, body: JSON.stringify({ verified: false, error: 'Session not found' }) };
    }

    // Confirm payment was successful
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ verified: false, error: 'Payment not completed' })
      };
    }

    // Extract email
    var customerEmail = session.customer_email || (session.customer_details && session.customer_details.email) || null;
    if (!customerEmail) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ verified: false, error: 'No email associated with session' })
      };
    }

    customerEmail = customerEmail.toLowerCase().trim();

    // Lazy-load Supabase
    var createClient = require('@supabase/supabase-js').createClient;
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Check if session already consumed (one-time use)
    var { data: existingSession } = await supabase
      .from('consumed_sessions')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existingSession) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ verified: false, error: 'Session already verified' })
      };
    }

    // Mark session as consumed
    var { error: consumeError } = await supabase
      .from('consumed_sessions')
      .insert({ stripe_session_id: session.id, email: customerEmail, consumed_at: new Date().toISOString() });

    if (consumeError) {
      console.error('[VERIFY-SESSION] consumed_sessions insert error:', consumeError.message);
    }

    // Upsert into paid_users
    var { error: upsertError } = await supabase
      .from('paid_users')
      .upsert(
        {
          email: customerEmail,
          stripe_session_id: session.id,
          paid_at: new Date().toISOString(),
          active: true
        },
        { onConflict: 'email' }
      );

    if (upsertError) {
      console.error('[VERIFY-SESSION] Supabase upsert error:', upsertError.message);
      // Still return verified — payment was confirmed by Stripe
    }

    // Generate JWT for client-side session validation
    var jwt = signJwt({ email: customerEmail, tier: 'paid' }, process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('[VERIFY-SESSION] Payment verified for session:', session.id);
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ verified: true, email: customerEmail, jwt: jwt })
    };

  } catch (err) {
    console.error('[VERIFY-SESSION] Error:', err.message || err);
    return { statusCode: 500, headers: headers, body: JSON.stringify({ verified: false, error: 'Internal server error' }) };
  }
};
