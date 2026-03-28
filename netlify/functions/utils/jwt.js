// Shared JWT verification for all Netlify functions
// Validates HMAC-SHA256 signed tokens from verify-session.js
var crypto = require('crypto');

var ADMIN_EMAILS = ['landon@theaurigen.com', 'lando@theaurigen.com'];

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

function base64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Verify a JWT from Authorization: Bearer <token> header.
 * Returns { email, tier } on success, null on failure.
 */
function verifyBearer(event) {
  var authHeader = (event.headers || {}).authorization || (event.headers || {}).Authorization || '';
  var token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  var secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;

  var parts = token.split('.');
  if (parts.length !== 3) return null;

  // Verify HMAC-SHA256 signature
  var sigInput = parts[0] + '.' + parts[1];
  var expectedSig = base64url(crypto.createHmac('sha256', secret).update(sigInput).digest());
  if (expectedSig !== parts[2]) return null;

  // Decode payload
  try {
    var payload = JSON.parse(base64urlDecode(parts[1]).toString('utf8'));
    var now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return { email: (payload.email || '').toLowerCase().trim(), tier: payload.tier || 'free' };
  } catch (e) {
    return null;
  }
}

/**
 * Check if the authenticated user has paid access.
 * Returns { email, tier, isAdmin } or null if not authorized.
 */
function requirePaid(event) {
  var auth = verifyBearer(event);
  if (!auth) return null;
  var isAdmin = ADMIN_EMAILS.indexOf(auth.email) >= 0;
  if (auth.tier !== 'paid' && !isAdmin) return null;
  return { email: auth.email, tier: auth.tier, isAdmin: isAdmin };
}

/**
 * Check if the authenticated user is an admin.
 */
function requireAdmin(event) {
  var auth = verifyBearer(event);
  if (!auth) return null;
  if (ADMIN_EMAILS.indexOf(auth.email) < 0) return null;
  return { email: auth.email, tier: auth.tier, isAdmin: true };
}

module.exports = { verifyBearer, requirePaid, requireAdmin, ADMIN_EMAILS };
