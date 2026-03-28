// Aurigen — Skool Community Sync
// Called after payment verification or email capture to sync user to Skool group.
// JWT-gated — requires valid paid-tier or admin JWT to process.
// When SKOOL_API_KEY and SKOOL_GROUP_ID are configured: activates live Skool API call.
//
// Expected Skool API (when activated):
//   POST https://api.skool.com/v1/groups/{SKOOL_GROUP_ID}/members
//   Headers: Authorization: Bearer {SKOOL_API_KEY}
//   Body: { email, role: 'member' }
//   Response: 200 { id, email, role } or 409 if already a member

var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { verifyBearer } = require('./utils/jwt');

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Auth gate: JWT Bearer token OR internal function-to-function secret
  var auth = verifyBearer(event);
  var internalKey = (event.headers || {})['x-internal-key'] || '';
  var isInternal = internalKey && process.env.SUPABASE_SERVICE_ROLE_KEY && internalKey === process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!auth && !isInternal) {
    // Log unauthorized attempt
    try {
      var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('scrape_log').insert({
        platform: 'skool_sync',
        state_code: 'unknown',
        records_found: 0,
        records_added: 0,
        errors: 'Unauthorized sync attempt',
        scraped_at: new Date().toISOString()
      });
    } catch(e) {}
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Valid JWT required' }) };
  }

  try {
    var body;
    try { body = JSON.parse(event.body || '{}'); } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var email = (body.email || auth.email || '').toLowerCase().trim();
    var tier = body.tier || auth.tier || 'free';
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    var skoolApiKey = process.env.SKOOL_API_KEY || '';
    var skoolGroupId = process.env.SKOOL_GROUP_ID || '';
    var synced = false;
    var errorMsg = '';

    if (skoolApiKey && skoolGroupId) {
      // Live Skool API call
      try {
        var skoolRes = await fetch(
          'https://api.skool.com/v1/groups/' + skoolGroupId + '/members',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + skoolApiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, role: 'member' })
          }
        );
        if (skoolRes.ok || skoolRes.status === 409) {
          synced = true;
          console.log('[skool-sync] Synced:', skoolRes.status);
        } else {
          errorMsg = 'Skool API error: ' + skoolRes.status;
          console.error('[skool-sync] Error:', skoolRes.status);
        }
      } catch (skoolErr) {
        errorMsg = 'Skool API network error';
        console.error('[skool-sync] Network error:', skoolErr.message);
      }
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
