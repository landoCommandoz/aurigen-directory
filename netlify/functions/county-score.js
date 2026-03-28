// ============================================================
// AURIGEN — county-score.js
// Public read endpoint for county Opportunity Scores.
// GET ?state_code=XX&county=NAME
// Returns { score, score_components, calculated_at } or { score: null }
// No auth required — scores are not sensitive data.
// ============================================================

var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');

function getSupabase() {
  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var params = event.queryStringParameters || {};
  var stateCode = (params.state_code || '').trim().toUpperCase();
  var county = (params.county || '').trim();

  if (!stateCode || !county) {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({ error: 'Missing state_code or county parameter' })
    };
  }

  try {
    var supabase = getSupabase();
    var { data, error } = await supabase
      .from('county_scores')
      .select('score, score_components, calculated_at')
      .eq('state_code', stateCode)
      .eq('county', county)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ score: null, message: 'No score available for this county' })
      };
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        score: data.score,
        score_components: data.score_components,
        calculated_at: data.calculated_at
      })
    };
  } catch (e) {
    console.error('[county-score] Error:', e.message);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: 'Internal error' })
    };
  }
};
