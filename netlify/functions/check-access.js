// Aurigen — Access Verification Endpoint
// Netlify Function: /.netlify/functions/check-access
//
// Receives POST { email } and checks Supabase paid_users table.
// Returns { access: 'paid' } or { access: 'free' }.
//
// Env vars (Netlify only — never hardcode):
//   SUPABASE_URL             — Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (bypasses RLS)

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
var RATE_LIMIT_WINDOW = 60000; // 1 minute
var RATE_LIMIT_MAX = 10;       // 10 requests per minute per IP

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

    var email = (body.email || '').toLowerCase().trim();

    // Validate email format (basic check — not exhaustive)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    // Lazy-load Supabase
    var createClient = require('@supabase/supabase-js').createClient;
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    var { data, error } = await supabase
      .from('paid_users')
      .select('active')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      return { statusCode: 500, headers: headers, body: JSON.stringify({ error: 'Database error' }) };
    }

    // Return paid only if record exists AND active is true
    var access = (data && data.active === true) ? 'paid' : 'free';

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ access: access })
    };

  } catch (err) {
    console.error('check-access error:', err.message || err);
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
