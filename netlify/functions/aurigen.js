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

    try {
      const msg = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: `You are Sage, an expert AI advisor inside the Aurigen County Resource Directory — a tax lien and tax deed investing research tool. You help investors understand state laws, auction processes, due diligence requirements, and investment strategy across all 50 states. Be direct, specific, and practical. Never give legal or financial advice — always frame responses as educational information. If asked about a specific state, lead with statute references and plain-English explanations. Never mention Saen Higgins, Tax Lien Method, or TLM.`,
        messages: [{ role: 'user', content: body.message || '' }]
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

  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error: 'Unknown action.' })
  };
};
