// Aurigen — JWT Session Validation
// Netlify Function: /.netlify/functions/validate-session
//
// Validates a JWT issued by verify-session.js.
// Returns { valid: true, email, tier } or { valid: false, reason }.
//
// Env vars:
//   SUPABASE_SERVICE_ROLE_KEY — used as HMAC-SHA256 signing key

var crypto = require('crypto');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');

function base64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;
  var parts = token.split('.');
  if (parts.length !== 3) return null;

  // Verify signature
  var sigInput = parts[0] + '.' + parts[1];
  var expectedSig = base64url(crypto.createHmac('sha256', secret).update(sigInput).digest());
  if (expectedSig !== parts[2]) return null;

  // Decode payload
  try {
    var payload = JSON.parse(base64urlDecode(parts[1]).toString('utf8'));
    // Check expiration
    var now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Rate limiting
var rateLimitMap = new Map();
var RATE_LIMIT_WINDOW = 60000;
var RATE_LIMIT_MAX = 30;

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

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ valid: false, reason: 'Method not allowed' }) };
  }

  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  clientIp = clientIp.split(',')[0].trim();
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, headers: { ...headers, 'Retry-After': '60' }, body: JSON.stringify({ valid: false, reason: 'Too many requests' }) };
  }

  try {
    var body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ valid: false, reason: 'Invalid JSON' }) };
    }

    var jwt = (body.jwt || '').trim();
    if (!jwt) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ valid: false, reason: 'Missing JWT' }) };
    }

    var secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
      console.error('[VALIDATE-SESSION] Missing SUPABASE_SERVICE_ROLE_KEY');
      return { statusCode: 500, headers: headers, body: JSON.stringify({ valid: false, reason: 'Server configuration error' }) };
    }

    var payload = verifyJwt(jwt, secret);
    if (!payload) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ valid: false, reason: 'Invalid or expired token' }) };
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ valid: true, email: payload.email || '', tier: payload.tier || 'free' })
    };

  } catch (err) {
    console.error('[VALIDATE-SESSION] Error:', err.message || err);
    return { statusCode: 500, headers: headers, body: JSON.stringify({ valid: false, reason: 'Internal server error' }) };
  }
};
