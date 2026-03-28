// Aurigen — Access Verification
// Now validates JWT from Authorization: Bearer header.
// Legacy fallback: still accepts POST { email } for pre-JWT clients.
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { verifyBearer } = require('./utils/jwt');

// Rate limiting
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

  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  clientIp = clientIp.split(',')[0].trim();
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  try {
    // Primary: JWT Bearer token
    var auth = verifyBearer(event);
    if (auth) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ access: auth.tier === 'paid' ? 'paid' : 'free', email: auth.email })
      };
    }

    // Legacy fallback: POST { email } — check paid_users table
    var body;
    try { body = JSON.parse(event.body || '{}'); } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var email = (body.email || '').toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    var createClient = require('@supabase/supabase-js').createClient;
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    var { data, error } = await supabase
      .from('paid_users')
      .select('active')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    var access = (data && data.active === true) ? 'paid' : 'free';

    return { statusCode: 200, headers, body: JSON.stringify({ access: access }) };

  } catch (err) {
    console.error('[check-access] Error:', err.message || err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
