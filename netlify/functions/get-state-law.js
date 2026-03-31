// ============================================================
// AURIGEN — get-state-law.js
// Public GET endpoint for state law data from Supabase.
// GET /.netlify/functions/get-state-law?state_code=FL
// ============================================================

var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: getCorsHeaders(event), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var stateCode = (event.queryStringParameters || {}).state_code;
  if (!stateCode || !/^[A-Z]{2}$/.test(stateCode)) {
    return { statusCode: 400, headers: getCorsHeaders(event), body: JSON.stringify({ error: 'Invalid state_code' }) };
  }

  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { statusCode: 500, headers: getCorsHeaders(event), body: JSON.stringify({ error: 'Server config error' }) };
  }

  var supabase = createClient(url, key);
  var { data, error } = await supabase
    .from('state_laws')
    .select('state_code,state_name,auction_type,interest_rate_pct,redemption_period_months,bid_method,statute_citation,official_url')
    .eq('state_code', stateCode)
    .maybeSingle();

  if (error) {
    return { statusCode: 500, headers: getCorsHeaders(event), body: JSON.stringify({ error: 'Database error' }) };
  }

  return {
    statusCode: 200,
    headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' }, getCorsHeaders(event)),
    body: JSON.stringify({ law: data || null })
  };
};
