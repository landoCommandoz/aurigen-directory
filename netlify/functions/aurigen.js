// Aurigen — Access Code Validator
// Netlify Function: /.netlify/functions/validate-code
//
// Env var required: VALID_CODES
// Format: comma-separated list of valid codes, e.g. AUG-XXXX-XXXX,AUG-YYYY-YYYY
//
// Also handles Advisor (AI) requests when action=advisor

const Anthropic = require('@anthropic-ai/sdk');
const crypto = require('crypto');

// ── CORS: Restrict to production domains only ─────────────────
const ALLOWED_ORIGINS = [
  'https://statuesque-bublanina-330b9d.netlify.app',
  'https://hilarious-llama-2933ac.netlify.app'
];

// ── Rate limiting: in-memory store for code validation ────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5;        // 5 attempts per window

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// ── Constant-time code comparison ─────────────────────────────
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

// ── HMAC-signed access token ──────────────────────────────────
function createAccessToken(secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'aurigen',
    iat: Date.now(),
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(header + '.' + payload).digest('base64url');
  return header + '.' + payload + '.' + sig;
}

exports.handler = async (event) => {
  const origin = (event.headers && (event.headers['origin'] || event.headers['Origin'])) || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // ── Email Capture ────────────────────────────────────────
  if (body.action === 'capture-email') {
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid email.' })
      };
    }

    const lang = body.lang || 'en';
    const timestamp = body.timestamp || new Date().toISOString();

    // Log to Netlify function logs (visible in Netlify dashboard > Functions > Logs)
    console.log(`[LEAD CAPTURED] email=${email} lang=${lang} ts=${timestamp}`);

    // ── Push to GoHighLevel CRM ──────────────────────────
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
            customFields: [
              { field_key: 'preferred_language', value: lang }
            ]
          })
        });
        const ghlData = await ghlRes.json();
        if (ghlRes.ok) {
          console.log(`[GHL] Upserted contact id=${ghlData.contact && ghlData.contact.id} email=${email}`);
          ghlResult = { success: true, contactId: ghlData.contact && ghlData.contact.id };
        } else {
          console.error(`[GHL] Error ${ghlRes.status}: ${JSON.stringify(ghlData)}`);
          ghlResult = { success: false, status: ghlRes.status };
        }
      } catch (err) {
        console.error(`[GHL] Network error: ${err.message}`);
        ghlResult = { success: false, error: err.message };
      }
    } else {
      console.warn('[GHL] GHL_ACCESS_TOKEN not set — skipping CRM push');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, email, ghl: ghlResult })
    };
  }

  // ── Code Validation ───────────────────────────────────────
  if (body.action === 'validate-code') {
    // Rate limit by IP
    const clientIp = (event.headers && (event.headers['x-forwarded-for'] || event.headers['client-ip'])) || 'unknown';
    if (isRateLimited(clientIp)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ valid: false, message: 'Too many attempts. Please wait a minute and try again.' })
      };
    }

    const submitted = (body.code || '').trim().toUpperCase();

    if (!submitted) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ valid: false, message: 'No code provided.' })
      };
    }

    const rawCodes = process.env.VALID_CODES || '';
    const validCodes = rawCodes
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(Boolean);

    if (safeCodeMatch(submitted, validCodes)) {
      const tokenSecret = process.env.TOKEN_SECRET;
      const response = { valid: true };
      if (tokenSecret) {
        response.token = createAccessToken(tokenSecret);
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: false,
          message: "That code didn't match. Please check your code and try again."
        })
      };
    }
  }

  // ── AI Advisor ────────────────────────────────────────────
  if (body.action === 'advisor') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Advisor not configured.' })
      };
    }

    const client = new Anthropic({ apiKey });

    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const messages = history.length > 0 ? history : [{ role: 'user', content: body.message || '' }];

    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `You are Sage, an expert AI advisor inside the Aurigen County Resource Directory — a tax lien and tax deed investing research tool. You help investors understand state laws, auction processes, due diligence requirements, and investment strategy across all 50 states. Be direct, specific, and practical. Never give legal or financial advice — always frame responses as educational information. If asked about a specific state, lead with statute references and plain-English explanations. Never mention Saen Higgins, Tax Lien Method, or TLM.`,
        messages
      });

      const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ response: text })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Advisor temporarily unavailable.' })
      };
    }
  }

  // ── Valuation Agent (Atlas) ──────────────────────────────────
  if (body.action === 'valuation') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Valuation agent not configured.' })
      };
    }

    const client = new Anthropic({ apiKey });
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const messages = history.length > 0 ? history : [{ role: 'user', content: body.message || '' }];

    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: `You are Atlas, a business valuation advisor inside the Aurigen Directory platform. You help entrepreneurs and digital product owners understand what their business is worth and how to increase its value.

Your expertise covers:
- SaaS/freemium business valuation using revenue multiples (ARR x multiple)
- Customer Lifetime Value (CLV = ARPU / churn rate)
- Key metrics: MRR, ARR, churn, LTV:CAC ratio, conversion rates
- Growth levers: reducing churn, increasing ARPU, expanding TAM, adding revenue streams
- Exit strategy guidance: what buyers look for, how to position for acquisition
- Comparable multiples for niche education/SaaS products (typically 3x-7x ARR)

When a user shares their numbers, always:
1. Calculate their current valuation range (low/mid/high using different multiples)
2. Identify the #1 lever to increase value
3. Give a specific, actionable recommendation

Be direct and use real numbers. Format currency with $ signs. Use bullet points for clarity.
Frame everything as educational — not financial advice. Never guarantee outcomes.
If the user asks "how do I get to $X valuation" — reverse-engineer the ARR needed and show what subscriber/price changes would get there.`,
        messages
      });

      const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ response: text })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Atlas is temporarily unavailable.' })
      };
    }
  }

  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error: 'Unknown action.' })
  };
};
