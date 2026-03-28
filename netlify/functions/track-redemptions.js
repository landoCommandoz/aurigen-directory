// ============================================================
// AURIGEN — track-redemptions.js
// Detects property status changes and calculates redemption rates.
// Queries past auctions + properties, compares against recorded
// events, inserts new transitions, recalculates county rates.
// Protected by SCRAPER_SECRET header.
// ============================================================

var { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

exports.handler = async function(event) {
  // Auth check
  var secret = (event.headers || {})['x-scraper-secret'];
  if (secret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  var supabase = getSupabase();
  var now = new Date().toISOString();
  var today = now.split('T')[0];

  try {
    // 1. Get past auctions (auction_date < today)
    var { data: pastAuctions, error: aErr } = await supabase
      .from('auctions')
      .select('id, state_code, county')
      .lt('auction_date', today);

    if (aErr) throw new Error('Failed to fetch past auctions: ' + aErr.message);
    if (!pastAuctions || pastAuctions.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'No past auctions to track', events: 0 })
      };
    }

    // Build set of (state_code, county) pairs from past auctions
    var countyPairs = {};
    var auctionsByCounty = {};
    pastAuctions.forEach(function(a) {
      var key = a.state_code + '|' + a.county;
      countyPairs[key] = { state_code: a.state_code, county: a.county };
      if (!auctionsByCounty[key]) auctionsByCounty[key] = [];
      auctionsByCounty[key].push(a.id);
    });

    // 2. Get properties for these counties
    var { data: properties, error: pErr } = await supabase
      .from('properties')
      .select('id, state_code, county, parcel_id, status');

    if (pErr) throw new Error('Failed to fetch properties: ' + pErr.message);

    // 3. Get existing redemption events to avoid duplicates
    var { data: existingEvents, error: eErr } = await supabase
      .from('redemption_events')
      .select('state_code, county, parcel_id, new_status');

    if (eErr) throw new Error('Failed to fetch existing events: ' + eErr.message);

    // Build lookup set
    var existingSet = {};
    (existingEvents || []).forEach(function(e) {
      existingSet[e.state_code + '|' + e.county + '|' + e.parcel_id + '|' + e.new_status] = true;
    });

    // 4. Detect status changes
    var newEvents = [];
    (properties || []).forEach(function(p) {
      if (!p.state_code || !p.county || !p.parcel_id || !p.status) return;
      var key = p.state_code + '|' + p.county;
      if (!countyPairs[key]) return; // Not a past-auction county

      var statusLower = p.status.toLowerCase();
      // Only track non-active statuses as transitions
      if (statusLower === 'active') return;

      var eventKey = p.state_code + '|' + p.county + '|' + p.parcel_id + '|' + statusLower;
      if (existingSet[eventKey]) return; // Already recorded

      var auctionId = auctionsByCounty[key] && auctionsByCounty[key].length > 0
        ? auctionsByCounty[key][0] : null;

      newEvents.push({
        state_code: p.state_code,
        county: p.county,
        auction_id: auctionId,
        parcel_id: p.parcel_id,
        previous_status: 'active',
        new_status: statusLower,
        detected_at: now,
        redemption_confirmed: statusLower === 'redeemed'
      });
    });

    // 5. Insert new events in batches
    var eventsInserted = 0;
    var eventErrors = 0;
    for (var b = 0; b < newEvents.length; b += 100) {
      var batch = newEvents.slice(b, b + 100);
      var { error: iErr } = await supabase
        .from('redemption_events')
        .upsert(batch, { onConflict: 'state_code,county,parcel_id,new_status', ignoreDuplicates: true });
      if (iErr) {
        console.error('[track-redemptions] Insert error:', iErr.message);
        eventErrors++;
      } else {
        eventsInserted += batch.length;
      }
    }

    // 6. Recalculate redemption rates per county
    // Count all tracked properties (non-active status) per county
    var countyStats = {};
    (properties || []).forEach(function(p) {
      if (!p.state_code || !p.county) return;
      var key = p.state_code + '|' + p.county;
      if (!countyPairs[key]) return;
      if (!countyStats[key]) {
        countyStats[key] = { state_code: p.state_code, county: p.county, total: 0, redeemed: 0 };
      }
      countyStats[key].total++;
      if ((p.status || '').toLowerCase() === 'redeemed') {
        countyStats[key].redeemed++;
      }
    });

    var rateRecords = [];
    Object.keys(countyStats).forEach(function(key) {
      var cs = countyStats[key];
      rateRecords.push({
        state_code: cs.state_code,
        county: cs.county,
        total_tracked: cs.total,
        total_redeemed: cs.redeemed,
        redemption_rate: cs.total > 0 ? parseFloat((cs.redeemed / cs.total).toFixed(4)) : 0,
        calculated_at: now
      });
    });

    var ratesUpserted = 0;
    for (var r = 0; r < rateRecords.length; r += 100) {
      var rateBatch = rateRecords.slice(r, r + 100);
      var { error: rErr } = await supabase
        .from('county_redemption_rates')
        .upsert(rateBatch, { onConflict: 'state_code,county' });
      if (rErr) {
        console.error('[track-redemptions] Rate upsert error:', rErr.message);
      } else {
        ratesUpserted += rateBatch.length;
      }
    }

    // 7. Log to scrape_log
    await supabase.from('scrape_log').insert({
      platform: 'redemption_tracker',
      records_found: newEvents.length,
      records_added: eventsInserted,
      errors: eventErrors > 0 ? eventErrors + ' batch errors' : null,
      success: eventErrors === 0,
      run_at: now
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        new_events: eventsInserted,
        rates_updated: ratesUpserted,
        event_errors: eventErrors,
        calculated_at: now
      })
    };
  } catch (e) {
    console.error('[track-redemptions] Fatal error:', e.message);

    try {
      await supabase.from('scrape_log').insert({
        platform: 'redemption_tracker',
        records_found: 0,
        records_added: 0,
        errors: e.message,
        success: false,
        run_at: now
      });
    } catch (logErr) {
      console.error('[track-redemptions] Failed to log error:', logErr.message);
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
