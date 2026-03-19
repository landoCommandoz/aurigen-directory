// Aurigen — Serverless API
// Netlify Function: /.netlify/functions/aurigen
//
// ARCHITECTURE RULE: ZERO top-level require() for heavy SDKs.
// All SDK requires MUST be lazy-loaded inside their handler.
// This prevents one broken SDK from killing all handlers.
//
// Env vars (Netlify only — never hardcode):
//   VALID_CODES      — comma-separated access codes
//   TOKEN_SECRET     — HMAC signing key for access tokens
//   GHL_ACCESS_TOKEN — GoHighLevel CRM API token
//   ANTHROPIC_API_KEY — Claude API key for Sage advisor

const crypto = require('crypto');

// ── CORS ────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://aurigen-directory.netlify.app',
  'https://statuesque-bublanina-330b9d.netlify.app',
  'https://hilarious-llama-2933ac.netlify.app',
  'http://localhost:8888',
  'http://localhost:3000'
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
}

// ── Rate Limiting ───────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Timing-safe code comparison ─────────────────────────────
function safeCodeMatch(submitted, validCodes) {
  let match = false;
  for (const code of validCodes) {
    if (submitted.length === code.length) {
      const a = Buffer.from(submitted);
      const b = Buffer.from(code);
      if (crypto.timingSafeEqual(a, b)) match = true;
    }
  }
  return match;
}

// ── HMAC access token ───────────────────────────────────────
function createAccessToken(secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'aurigen',
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret)
    .update(header + '.' + payload).digest('base64url');
  return header + '.' + payload + '.' + sig;
}

// ── Handlers ────────────────────────────────────────────────

async function handleValidateCode(body, event, headers) {
  console.log('[VALIDATE] Handler entered');

  const clientIp = (event.headers['x-forwarded-for'] || event.headers['client-ip']) || 'unknown';
  console.log('[VALIDATE] ip=' + clientIp);

  if (isRateLimited(clientIp)) {
    console.log('[VALIDATE] Rate limited');
    return { statusCode: 429, headers, body: JSON.stringify({ valid: false, message: 'Too many attempts. Please wait a minute and try again.' }) };
  }

  const submitted = (body.code || '').trim().toUpperCase();
  console.log('[VALIDATE] code_len=' + submitted.length);

  if (!submitted) {
    return { statusCode: 400, headers, body: JSON.stringify({ valid: false, message: 'No code provided.' }) };
  }

  const rawCodes = process.env.VALID_CODES || '';
  const validCodes = rawCodes.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
  console.log('[VALIDATE] valid_count=' + validCodes.length);

  if (safeCodeMatch(submitted, validCodes)) {
    console.log('[VALIDATE] MATCH');
    const response = { valid: true, level: 2 };
    const secret = process.env.TOKEN_SECRET;
    if (secret) response.token = createAccessToken(secret);
    return { statusCode: 200, headers, body: JSON.stringify(response) };
  }

  console.log('[VALIDATE] NO MATCH');
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ valid: false, message: "That code didn't match. Please check your code and try again." })
  };
}

async function handleCaptureEmail(body, headers) {
  const email = (body.email || '').trim().toLowerCase();
  console.log('[EMAIL] Attempt: ' + email);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid email.' }) };
  }

  const lang = body.lang || 'en';
  console.log('[EMAIL] Captured email=' + email + ' lang=' + lang);

  // Push to GoHighLevel CRM
  const ghlToken = process.env.GHL_ACCESS_TOKEN;
  let ghlResult = null;

  if (ghlToken) {
    try {
      const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + ghlToken,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          locationId: 'SF8klkCZPOA9Axfzesf3',
          email: email,
          tags: ['Aurigen Directory Lead'],
          source: 'Aurigen Directory',
          customFields: [{ field_key: 'preferred_language', value: lang }]
        })
      });
      const ghlData = await ghlRes.json();
      if (ghlRes.ok) {
        console.log('[GHL] Upserted id=' + (ghlData.contact && ghlData.contact.id));
        ghlResult = { success: true };
      } else {
        console.error('[GHL] Error ' + ghlRes.status);
        ghlResult = { success: false };
      }
    } catch (err) {
      console.error('[GHL] Network error: ' + err.message);
      ghlResult = { success: false };
    }
  } else {
    console.warn('[GHL] Token not set — skipping');
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true, email, ghl: ghlResult }) };
}

async function handleAdvisor(body, headers) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Advisor not configured.' }) };
  }

  console.log('[ADVISOR] Request received');

  // Lazy-load SDK — NEVER at top level
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const messages = history.length > 0 ? history : [{ role: 'user', content: body.message || '' }];

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: 'You are Sage, an AI research assistant for the Aurigen County Resource Directory — a tax lien and tax deed investing research tool. You help investors understand state laws, auction processes, due diligence strategies, and investment research across all 50 states + DC. Be direct, specific, and practical. Always lead with statute references and plain-English explanations. Every response must include: "This is for educational purposes only and does not constitute investment, legal, or financial advice. Always verify data with official county sources before acting." Never mention any seminar brand or instructor name.',
    messages
  });

  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
  console.log('[ADVISOR] Response generated, len=' + text.length);
  return { statusCode: 200, headers, body: JSON.stringify({ response: text }) };
}

async function handleValuation(body, headers) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Valuation agent not configured.' }) };
  }

  console.log('[VALUATION] Request received');

  // Lazy-load SDK — NEVER at top level
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const messages = history.length > 0 ? history : [{ role: 'user', content: body.message || '' }];

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: 'You are Atlas, a business valuation advisor inside the Aurigen Directory platform. You help entrepreneurs and digital product owners understand what their business is worth and how to increase its value. Your expertise: SaaS/freemium valuation (ARR x multiple), CLV, MRR, churn, LTV:CAC, growth levers, exit strategy, comparable multiples (3x-7x ARR for niche education/SaaS). When a user shares numbers: 1) Calculate valuation range (low/mid/high), 2) Identify #1 lever, 3) Give specific recommendation. Be direct, use real numbers, format with $. Frame as educational — not financial advice. Never guarantee outcomes.',
    messages
  });

  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
  console.log('[VALUATION] Response generated, len=' + text.length);
  return { statusCode: 200, headers, body: JSON.stringify({ response: text }) };
}

// ── Main Handler ────────────────────────────────────────────

exports.handler = async (event) => {
  const origin = (event.headers && (event.headers['origin'] || event.headers['Origin'])) || '';
  const headers = corsHeaders(origin);

  console.log('[AURIGEN] method=' + event.httpMethod + ' origin=' + origin);

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // POST only
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    console.error('[AURIGEN] Invalid JSON');
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const action = body.action || '';
  console.log('[AURIGEN] action=' + action);

  // Route to handler — every handler wrapped in try/catch
  try {
    switch (action) {
      case 'validate-code':
        return await handleValidateCode(body, event, headers);
      case 'capture-email':
        return await handleCaptureEmail(body, headers);
      case 'advisor':
        return await handleAdvisor(body, headers);
      case 'valuation':
        return await handleValuation(body, headers);
      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action: ' + action }) };
    }
  } catch (err) {
    console.error('[AURIGEN] Handler error: ' + err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error. Please try again.' }) };
  }
};
