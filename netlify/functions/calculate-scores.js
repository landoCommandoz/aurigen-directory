// ============================================================
// AURIGEN — calculate-scores.js
// Calculates Opportunity Scores for all counties.
// Reads auction + property data, applies scoring formula,
// upserts results to county_scores table.
// Protected by SCRAPER_SECRET header.
// ============================================================

var { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

// Redemption period scoring by state (months)
// Source: statutory maximums from states-en.js
var REDEMPTION_MONTHS = {
  AL:36, AK:12, AZ:36, AR:30, CA:60, CO:36, CT:12, DE:18, DC:6,
  FL:24, GA:12, HI:12, ID:14, IL:30, IN:12, IA:21, KS:36, KY:12,
  LA:36, ME:18, MD:6, MA:6, MI:12, MN:12, MS:24, MO:12, MT:36,
  NE:36, NV:0, NH:24, NJ:24, NM:36, NY:48, NC:0, ND:36, OH:12,
  OK:24, OR:24, PA:12, RI:12, SC:12, SD:48, TN:12, TX:6, UT:0,
  VT:12, VA:12, WA:0, WV:18, WI:24, WY:48
};

function getRedemptionDelta(stateCode) {
  var months = REDEMPTION_MONTHS[stateCode];
  if (months === undefined || months === null) return 0;
  if (months <= 6) return 15;
  if (months <= 12) return 5;
  if (months <= 24) return -5;
  return -10;
}

exports.handler = async function(event) {
  // Auth check
  var secret = (event.headers || {})['x-scraper-secret'];
  if (secret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  var supabase = getSupabase();
  var now = new Date().toISOString();

  try {
    // 1. Get all counties from auctions table (active auctions)
    var { data: auctions, error: aErr } = await supabase
      .from('auctions')
      .select('state_code, county')
      .eq('active', true);

    if (aErr) throw new Error('Failed to fetch auctions: ' + aErr.message);

    // Build county map: { "FL|Broward": { state_code, county, auctionCount } }
    var countyMap = {};
    (auctions || []).forEach(function(a) {
      if (!a.state_code || !a.county) return;
      var key = a.state_code + '|' + a.county;
      if (!countyMap[key]) {
        countyMap[key] = { state_code: a.state_code, county: a.county, auctionCount: 0 };
      }
      countyMap[key].auctionCount++;
    });

    // 2. Get property stats grouped by state_code + county
    var { data: properties, error: pErr } = await supabase
      .from('properties')
      .select('state_code, county, equity_cushion_pct, absentee_owner');

    if (pErr) throw new Error('Failed to fetch properties: ' + pErr.message);

    // Aggregate property stats per county
    var propStats = {};
    (properties || []).forEach(function(p) {
      if (!p.state_code || !p.county) return;
      var key = p.state_code + '|' + p.county;
      if (!propStats[key]) {
        propStats[key] = { equitySum: 0, equityCount: 0, absenteeCount: 0, totalCount: 0 };
      }
      propStats[key].totalCount++;
      if (p.equity_cushion_pct !== null && p.equity_cushion_pct !== undefined) {
        propStats[key].equitySum += p.equity_cushion_pct;
        propStats[key].equityCount++;
      }
      if (p.absentee_owner) propStats[key].absenteeCount++;
    });

    // 3. Calculate scores
    var scores = [];
    var keys = Object.keys(countyMap);

    for (var i = 0; i < keys.length; i++) {
      var c = countyMap[keys[i]];
      var ps = propStats[keys[i]] || { equitySum: 0, equityCount: 0, absenteeCount: 0, totalCount: 0 };

      var score = 50; // Base
      var components = {};

      // Auction volume delta
      if (c.auctionCount === 0) { score -= 20; components.auction_volume = { count: 0, delta: -20 }; }
      else if (c.auctionCount <= 2) { components.auction_volume = { count: c.auctionCount, delta: 0 }; }
      else if (c.auctionCount <= 5) { score += 10; components.auction_volume = { count: c.auctionCount, delta: 10 }; }
      else { score += 20; components.auction_volume = { count: c.auctionCount, delta: 20 }; }

      // Average equity cushion delta
      if (ps.equityCount > 0) {
        var avgEquity = ps.equitySum / ps.equityCount;
        if (avgEquity < 10) { score -= 10; components.avg_equity = { avg: Math.round(avgEquity), delta: -10 }; }
        else if (avgEquity <= 30) { score += 10; components.avg_equity = { avg: Math.round(avgEquity), delta: 10 }; }
        else { score += 20; components.avg_equity = { avg: Math.round(avgEquity), delta: 20 }; }
      } else {
        components.avg_equity = { avg: null, delta: 0 };
      }

      // Absentee owner rate delta
      if (ps.totalCount > 0) {
        var absenteeRate = ps.absenteeCount / ps.totalCount;
        if (absenteeRate > 0.5) { score += 15; components.absentee_rate = { rate: Math.round(absenteeRate * 100), delta: 15 }; }
        else if (absenteeRate >= 0.2) { score += 5; components.absentee_rate = { rate: Math.round(absenteeRate * 100), delta: 5 }; }
        else { score -= 5; components.absentee_rate = { rate: Math.round(absenteeRate * 100), delta: -5 }; }
      } else {
        components.absentee_rate = { rate: null, delta: 0 };
      }

      // Redemption period delta
      var redemptionDelta = getRedemptionDelta(c.state_code);
      score += redemptionDelta;
      components.redemption = { state_code: c.state_code, months: REDEMPTION_MONTHS[c.state_code] || null, delta: redemptionDelta };

      // Cap
      score = Math.max(1, Math.min(100, score));

      scores.push({
        state_code: c.state_code,
        county: c.county,
        score: score,
        score_components: components,
        calculated_at: now
      });
    }

    // 4. Upsert scores in batches of 100
    var upserted = 0;
    var batchErrors = 0;
    for (var b = 0; b < scores.length; b += 100) {
      var batch = scores.slice(b, b + 100);
      var { error: uErr } = await supabase
        .from('county_scores')
        .upsert(batch, { onConflict: 'state_code,county' });
      if (uErr) {
        console.error('[calculate-scores] Upsert error:', uErr.message);
        batchErrors++;
      } else {
        upserted += batch.length;
      }
    }

    // 5. Log to scrape_log
    await supabase.from('scrape_log').insert({
      platform: 'opportunity_score',
      records_found: keys.length,
      records_added: upserted,
      errors: batchErrors > 0 ? batchErrors + ' batch errors' : null,
      success: batchErrors === 0,
      run_at: now
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        counties_scored: upserted,
        batch_errors: batchErrors,
        calculated_at: now
      })
    };
  } catch (e) {
    console.error('[calculate-scores] Fatal error:', e.message);

    // Log failure
    try {
      await supabase.from('scrape_log').insert({
        platform: 'opportunity_score',
        records_found: 0,
        records_added: 0,
        errors: e.message,
        success: false,
        run_at: now
      });
    } catch (logErr) {
      console.error('[calculate-scores] Failed to log error:', logErr.message);
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
