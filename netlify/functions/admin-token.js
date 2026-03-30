// Aurigen — Admin JWT Issuer
// Issues a signed JWT for admin-whitelisted emails without requiring Stripe payment.
// POST { email } → returns { jwt } if email is in ADMIN_EMAILS.
var crypto = require('crypto');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { ADMIN_EMAILS } = require('./utils/jwt');

function base64url(data) {
  return Buffer.from(typeof data === 'string' ? data : JSON.stringify(data))
    .toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

// Rate limiting
var rateLimitMap = new Map();
function isRateLimited(ip) {
  var now = Date.now();
  var entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > 60000) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
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
    var body;
    try { body = JSON.parse(event.body || '{}'); } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var email = (body.email || '').toLowerCase().trim();
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing email' }) };
    }

    if (ADMIN_EMAILS.indexOf(email) < 0) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Not authorized' }) };
    }

    var secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    var jwt = signJwt({ email: email, tier: 'paid', isAdmin: true }, secret);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ jwt: jwt, email: email, tier: 'paid', isAdmin: true })
    };

  } catch (err) {
    console.error('[ADMIN-TOKEN] Error:', err.message || err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
