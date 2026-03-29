// Aurigen — Sage v2 API Backend
// POST { message, history[], archetype }
// JWT validated. Paid users unlimited. Free users: 3 queries per session (enforced client-side).
// Rate limit: 20 req/min per IP.

var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { verifyBearer } = require('./utils/jwt');

// Rate limiting: 20 requests per IP per minute
var _sageRateMap = {};
function checkSageRate(ip) {
  var now = Date.now();
  // Lazy cleanup
  if (Math.random() < 0.05) {
    for (var k in _sageRateMap) {
      if (now - _sageRateMap[k].start > 120000) delete _sageRateMap[k];
    }
  }
  if (!_sageRateMap[ip] || now - _sageRateMap[ip].start > 60000) {
    _sageRateMap[ip] = { start: now, count: 1 };
    return true;
  }
  _sageRateMap[ip].count++;
  return _sageRateMap[ip].count <= 20;
}

// Archetype context map — mirrors client-side ARCHETYPE_TOOL_CONFIG.sageContext
var ARCHETYPE_SAGE = {
  'yield-maximizer': 'Yield Maximizer \u2014 prioritizes highest statutory interest rates with shorter redemption periods, moderate risk tolerance.',
  'hunter': 'Deal Hunter \u2014 targets property acquisition through tax deed sales, higher capital, aggressive positioning.',
  'patient': 'Patient Capitalist \u2014 long-view deployment into higher-rate liens with multi-year redemption, conservative risk.',
  'diversifier': 'Portfolio Diversifier \u2014 spreads capital across multiple lien states and types for balanced risk/return.',
  'explorer': 'New Explorer \u2014 beginner-friendly approach, looking for safe entry points with strong documentation and online platforms.'
};

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Rate limit
  var ip = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  ip = ip.split(',')[0].trim();
  if (!checkSageRate(ip)) {
    return {
      statusCode: 429,
      headers: Object.assign({}, headers, { 'Retry-After': '60' }),
      body: JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' })
    };
  }

  // Auth — allow both free and paid users (free limit enforced client-side via sessionStorage)
  var auth = verifyBearer(event);
  if (!auth) {
    return { statusCode: 401, headers: headers, body: JSON.stringify({ error: 'Authentication required.' }) };
  }

  // Parse body
  var body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  var message = (body.message || '').trim();
  var history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  var archetype = (body.archetype || '').trim();

  if (!message && history.length === 0) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Message required.' }) };
  }

  // Build system prompt with archetype context
  var systemPrompt = 'You are Sage, an AI research assistant for the Aurigen County Resource Directory \u2014 a tax lien and tax deed investing research tool. You help investors understand state laws, auction processes, due diligence strategies, and investment research across all 50 states + DC.\n\nBe direct, specific, and practical. Lead with statute references and plain-English explanations. Keep responses concise (under 300 words). Use markdown formatting for readability.\n\nIMPORTANT RULES:\n- Never mention any seminar brand or instructor name\n- Never fabricate statistics, auction dates, or county-specific data\n- Always recommend verifying with official county sources\n- End every substantive response with the disclaimer';

  if (archetype && ARCHETYPE_SAGE[archetype]) {
    systemPrompt += '\n\nThe investor\'s profile: ' + ARCHETYPE_SAGE[archetype] + ' Tailor your advice to their investing style when relevant.';
  }

  systemPrompt += '\n\nDisclaimer to append: "This is for educational purposes only and does not constitute investment, legal, or financial advice. Always verify data with official county sources before acting."';

  // Build messages array
  var messages = [];
  if (history.length > 0) {
    history.forEach(function(h) {
      if (h.role === 'user' || h.role === 'assistant') {
        messages.push({ role: h.role, content: String(h.content || h.text || '') });
      }
    });
  }
  if (message) {
    messages.push({ role: 'user', content: message });
  }

  if (messages.length === 0) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'No valid messages.' }) };
  }

  // Ensure messages alternate correctly (Claude API requirement)
  // If first message isn't user, prepend a user message
  if (messages[0].role !== 'user') {
    messages.unshift({ role: 'user', content: '(continuing conversation)' });
  }

  // Call Anthropic API
  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: 'Advisor not configured.' }) };
  }

  try {
    var Anthropic = require('@anthropic-ai/sdk');
    var client = new Anthropic({ apiKey: apiKey });

    var msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    });

    var text = msg.content.filter(function(b) { return b.type === 'text'; }).map(function(b) { return b.text; }).join('');

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ response: text, tier: auth.tier })
    };
  } catch (err) {
    console.error('[SAGE] API error:', err.message);
    return {
      statusCode: 502,
      headers: headers,
      body: JSON.stringify({ error: 'Sage is temporarily unavailable. Please try again.' })
    };
  }
};
