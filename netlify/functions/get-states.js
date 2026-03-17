// Aurigen — Server-side State Data Gating
// Returns state data only after validating access token
// Free-tier users receive only FL, IL, AZ
//
// Env var required: TOKEN_SECRET (shared with aurigen.js for HMAC signing)

const crypto = require('crypto');
const path = require('path');

const FREE_IDS = new Set(['FL', 'IL', 'AZ']);

const ALLOWED_ORIGINS = [
  'https://statuesque-bublanina-330b9d.netlify.app',
  'https://hilarious-llama-2933ac.netlify.app'
];

function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, sigB64] = parts;

  // Verify signature
  const expected = crypto
    .createHmac('sha256', secret)
    .update(headerB64 + '.' + payloadB64)
    .digest('base64url');

  if (expected.length !== sigB64.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigB64))) return false;

  // Check expiry
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return false;
    return true;
  } catch (e) {
    return false;
  }
}

exports.handler = async (event) => {
  const origin = (event.headers && (event.headers['origin'] || event.headers['Origin'])) || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/javascript',
    'Vary': 'Origin',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    headers['Content-Type'] = 'application/json';
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const lang = (event.queryStringParameters && event.queryStringParameters.lang) || 'en';
  const file = lang === 'es' ? 'states-es.js' : 'states-en.js';
  const globalVar = lang === 'es' ? 'STATES_ES' : 'STATES_EN';

  // Check for access token
  const authHeader = event.headers && (event.headers['authorization'] || event.headers['Authorization']);
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null;
  const secret = process.env.TOKEN_SECRET;
  const hasAccess = verifyToken(token, secret);

  // Load the data file
  let allStates;
  try {
    // In Netlify functions, require the file relative to the function
    // The data files are bundled by esbuild from project root
    allStates = require('../../' + file);
  } catch (e) {
    headers['Content-Type'] = 'application/json';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to load state data.' })
    };
  }

  // Filter to free states only if no valid token
  const states = hasAccess ? allStates : allStates.filter(s => FREE_IDS.has(s.id));

  // Return as JavaScript that sets the global variable (same format as static files)
  const body = 'var ' + globalVar + ' = ' + JSON.stringify(states) + ';\n';

  return { statusCode: 200, headers, body };
};
