// Aurigen — Skool Community Sync
// Called after payment verification or email capture to sync user to Skool group.
// Currently logs the attempt only — actual Skool API call activates when
// SKOOL_API_KEY and SKOOL_GROUP_ID are configured in Netlify env vars.
var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    var body;
    try { body = JSON.parse(event.body || '{}'); } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var email = (body.email || '').toLowerCase().trim();
    var tier = body.tier || 'free';
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    var skoolApiKey = process.env.SKOOL_API_KEY || '';
    var skoolGroupId = process.env.SKOOL_GROUP_ID || '';
    var synced = false;
    var errorMsg = '';

    if (skoolApiKey && skoolGroupId) {
      // Future: actual Skool API call
      // POST https://api.skool.com/v1/groups/{groupId}/members
      // Headers: Authorization: Bearer {skoolApiKey}
      // Body: { email, role: 'member' }
      errorMsg = 'Skool API integration pending — keys configured but endpoint not yet implemented';
    } else {
      errorMsg = 'Skool API not yet configured';
    }

    // Log sync attempt to scrape_log for tracking
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from('scrape_log').insert({
      platform: 'skool_sync',
      state_code: tier,
      records_found: 1,
      records_added: synced ? 1 : 0,
      errors: errorMsg,
      scraped_at: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ synced: synced, message: errorMsg })
    };

  } catch (err) {
    console.error('[skool-sync] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
