const { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { requireAdmin } = require('./utils/jwt');

// Rate limiting — 5 requests per IP per minute
var _adminRateMap = {};
function checkAdminRate(ip) {
  var now = Date.now();
  if (!_adminRateMap[ip] || now - _adminRateMap[ip].start > 60000) {
    _adminRateMap[ip] = { start: now, count: 1 };
    return true;
  }
  _adminRateMap[ip].count++;
  return _adminRateMap[ip].count <= 5;
}

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Rate limit
  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  if (!checkAdminRate(clientIp.split(',')[0].trim())) {
    return { statusCode: 429, headers: { ...headers, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  // JWT admin auth
  var auth = requireAdmin(event);
  if (!auth) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    var { count: paidCount, error: paidErr } = await supabase
      .from('paid_users')
      .select('*', { count: 'exact', head: true });
    if (paidErr) throw paidErr;

    var { count: totalEmails, error: emailErr } = await supabase
      .from('email_captures')
      .select('*', { count: 'exact', head: true });
    if (emailErr) throw emailErr;

    var freeCount = Math.max(0, (totalEmails || 0) - (paidCount || 0));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ free_count: freeCount, paid_count: paidCount || 0 })
    };
  } catch (err) {
    console.error('[admin-stats] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
