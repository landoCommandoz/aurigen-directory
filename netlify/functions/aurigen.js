// Aurigen — Access Code Validator
// Netlify Function: /.netlify/functions/validate-code
//
// Env var required: VALID_CODES
// Format: comma-separated list of valid codes, e.g. AUG-XXXX-XXXX,AUG-YYYY-YYYY
//
// Also handles Advisor (AI) requests when action=advisor

const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, email })
    };
  }

  // ── Code Validation ───────────────────────────────────────
  if (body.action === 'validate-code') {
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

    if (validCodes.includes(submitted)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: true })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: false,
          message: "That code didn't match — reach out to Landon@theaurigen.com"
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
