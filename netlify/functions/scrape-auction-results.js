// ============================================================
// AURIGEN — scrape-auction-results.js
// Scrapes post-auction results to capture sale prices and overbids.
// Targets auctions that closed 3-10 days ago.
// Updates properties with sale_price, overbid_pct, sold_at.
// Protected by SCRAPER_SECRET header.
// Runs Wednesdays via GitHub Actions (3 days after Sunday auctions).
// ============================================================

var { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

// Rate-limited fetch with timeout
function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

async function fetchWithTimeout(url, timeoutMs) {
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, timeoutMs || 15000);
  try {
    var resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    clearTimeout(timer);
    return resp;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ── Parse dollar amounts from scraped text ──────────────────
function parseDollar(val) {
  if (!val) return null;
  var cleaned = String(val).replace(/[$,\s]/g, '').trim();
  var num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// ── Extract results from RealAuction results page ───────────
// RealAuction results pages use table layouts with parcel, address,
// assessed value, winning bid columns
function parseRealAuctionResults(html) {
  var results = [];
  // Match table rows with at least 4 cells
  var rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  var cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  var rowMatch;

  while ((rowMatch = rowPattern.exec(html)) !== null) {
    var rowHtml = rowMatch[1];
    var cells = [];
    var cellMatch;
    cellPattern.lastIndex = 0;
    while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    if (cells.length < 4) continue;
    // Skip header rows
    if (/parcel|certificate|property/i.test(cells[0]) && /address|owner/i.test(cells[1])) continue;
    // Need a parcel-like ID
    if (!/\d{2,}/.test(cells[0])) continue;

    // RealAuction typically: Parcel, Address, Assessed, Winning Bid, Buyer
    var parcelId = cells[0].trim();
    var salePrice = null;
    var buyer = null;

    // Find the dollar amount that looks like a winning bid (usually last dollar column)
    for (var i = cells.length - 1; i >= 2; i--) {
      var val = parseDollar(cells[i]);
      if (val !== null && val > 0) {
        salePrice = val;
        // If there's a non-numeric cell after this, it might be buyer name
        if (i + 1 < cells.length && !/^\$?[\d,]+/.test(cells[i + 1])) {
          buyer = cells[i + 1].trim() || null;
        }
        break;
      }
    }

    if (parcelId && salePrice) {
      results.push({
        parcel_id: parcelId,
        sale_price: salePrice,
        sold_to: buyer
      });
    }
  }

  return results;
}

// ── Extract results from GovEase results page ───────────────
function parseGovEaseResults(html) {
  var results = [];
  var rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  var cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  var rowMatch;

  while ((rowMatch = rowPattern.exec(html)) !== null) {
    var rowHtml = rowMatch[1];
    var cells = [];
    var cellMatch;
    cellPattern.lastIndex = 0;
    while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    if (cells.length < 3) continue;
    if (/parcel|pin|lot/i.test(cells[0]) && /address|property/i.test(cells[1])) continue;
    if (!/\d{2,}/.test(cells[0])) continue;

    var parcelId = cells[0].trim();
    var salePrice = null;
    var buyer = null;

    for (var i = cells.length - 1; i >= 1; i--) {
      var val = parseDollar(cells[i]);
      if (val !== null && val > 0) {
        salePrice = val;
        if (i + 1 < cells.length && !/^\$?[\d,]+/.test(cells[i + 1])) {
          buyer = cells[i + 1].trim() || null;
        }
        break;
      }
    }

    if (parcelId && salePrice) {
      results.push({ parcel_id: parcelId, sale_price: salePrice, sold_to: buyer });
    }
  }

  return results;
}

// ── Extract results from Bid4Assets results page ────────────
function parseBid4AssetsResults(html) {
  var results = [];
  // Bid4Assets uses card-based layouts with "Winning Bid" labels
  var cardPattern = /<(?:div|tr)[^>]*class="[^"]*(?:result|item|card|lot)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|tr)>/gi;
  var cardMatch;

  while ((cardMatch = cardPattern.exec(html)) !== null) {
    var text = cardMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    var parcelMatch = text.match(/(?:parcel|lot|cert)\s*#?\s*:?\s*([A-Z0-9\-\.]+)/i);
    if (!parcelMatch) continue;

    var bidMatch = text.match(/(?:winning|final|sold|sale)\s*(?:bid|price|amount)?\s*:?\s*\$?([\d,]+\.?\d*)/i);
    var buyerMatch = text.match(/(?:winner|buyer|purchaser)\s*:?\s*(.+?)(?:\s*(?:parcel|lot|\$|winning|amount))/i);

    if (parcelMatch && bidMatch) {
      results.push({
        parcel_id: parcelMatch[1],
        sale_price: parseDollar(bidMatch[1]),
        sold_to: buyerMatch ? buyerMatch[1].trim() : null
      });
    }
  }

  // Fallback: table rows
  if (results.length === 0) {
    var tableResults = parseRealAuctionResults(html);
    results = results.concat(tableResults);
  }

  return results;
}

// ── Build results URL per platform ──────────────────────────
function buildResultsUrl(auction) {
  var platform = (auction.platform || '').toLowerCase();
  var baseUrl = auction.platform_url || '';
  var dateStr = auction.auction_date || '';

  if (platform === 'realauction' && baseUrl) {
    var encodedDate = encodeURIComponent(dateStr.replace(/-/g, '/'));
    // Strip trailing path and append results endpoint
    var base = baseUrl.replace(/\/index\.cfm.*$/i, '');
    return base + '/index.cfm?zaction=AUCTION&zmethod=RESULTS&AUCTIONDATE=' + encodedDate;
  }

  if (platform === 'govease' && baseUrl) {
    // GovEase results are typically at the same URL with /results suffix or tab
    return baseUrl.replace(/\/?$/, '/results');
  }

  if (platform === 'bid4assets' && baseUrl) {
    return baseUrl.replace(/\/?$/, '?tab=results');
  }

  return null;
}

// ── Select parser by platform ───────────────────────────────
function getParser(platform) {
  var p = (platform || '').toLowerCase();
  if (p === 'realauction') return parseRealAuctionResults;
  if (p === 'govease') return parseGovEaseResults;
  if (p === 'bid4assets') return parseBid4AssetsResults;
  // SRI uses similar table layout to RealAuction
  if (p === 'sri') return parseRealAuctionResults;
  return null;
}

exports.handler = async function(event) {
  // Auth check
  var secret = (event.headers || {})['x-scraper-secret'];
  if (secret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  var supabase = getSupabase();
  var now = new Date().toISOString();

  // Date window: 3-10 days ago
  var today = new Date();
  var daysAgo3 = new Date(today);
  daysAgo3.setDate(today.getDate() - 3);
  var daysAgo10 = new Date(today);
  daysAgo10.setDate(today.getDate() - 10);
  var dateFrom = daysAgo10.toISOString().split('T')[0];
  var dateTo = daysAgo3.toISOString().split('T')[0];

  console.log('[auction-results] Scanning auctions from ' + dateFrom + ' to ' + dateTo);

  var totalMatched = 0;
  var totalUpdated = 0;
  var totalErrors = 0;
  var auctionsProcessed = 0;

  try {
    // 1. Get recently closed auctions
    var { data: auctions, error: aErr } = await supabase
      .from('auctions')
      .select('id, state_code, county, auction_date, platform, platform_url')
      .gte('auction_date', dateFrom)
      .lte('auction_date', dateTo)
      .order('auction_date', { ascending: true })
      .limit(100);

    if (aErr) throw new Error('Failed to fetch auctions: ' + aErr.message);

    if (!auctions || auctions.length === 0) {
      console.log('[auction-results] No recently closed auctions found.');
      await logRun(supabase, now, 0, 0, 0, null);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, message: 'No recently closed auctions', matched: 0, updated: 0 }) };
    }

    console.log('[auction-results] Found ' + auctions.length + ' recently closed auctions');

    // 2. Process each auction
    for (var i = 0; i < auctions.length; i++) {
      var auction = auctions[i];
      var resultsUrl = buildResultsUrl(auction);
      var parser = getParser(auction.platform);

      if (!resultsUrl || !parser) {
        console.log('[auction-results] Skipping ' + auction.county + ' (' + auction.platform + '): no results URL or parser');
        continue;
      }

      console.log('[auction-results] Fetching: ' + auction.county + ', ' + auction.state_code + ' → ' + resultsUrl);

      try {
        var resp = await fetchWithTimeout(resultsUrl, 15000);
        if (!resp.ok) {
          console.log('[auction-results] HTTP ' + resp.status + ' for ' + auction.county);
          continue;
        }

        var html = await resp.text();
        var results = parser(html);
        console.log('[auction-results] ' + auction.county + ': parsed ' + results.length + ' results');

        if (results.length === 0) continue;
        auctionsProcessed++;

        // 3. Get existing properties for this county to match parcel IDs
        var { data: properties, error: pErr } = await supabase
          .from('properties')
          .select('id, parcel_id, opening_bid')
          .eq('state_code', auction.state_code)
          .eq('county', auction.county);

        if (pErr) {
          console.error('[auction-results] Properties query error for ' + auction.county + ':', pErr.message);
          totalErrors++;
          continue;
        }

        // Build parcel lookup
        var parcelMap = {};
        (properties || []).forEach(function(p) {
          if (p.parcel_id) parcelMap[p.parcel_id] = p;
        });

        // 4. Match and update
        for (var r = 0; r < results.length; r++) {
          var res = results[r];
          var prop = parcelMap[res.parcel_id];
          if (!prop) continue;

          totalMatched++;

          var overbidPct = null;
          if (prop.opening_bid && prop.opening_bid > 0 && res.sale_price) {
            overbidPct = Math.round(((res.sale_price - prop.opening_bid) / prop.opening_bid) * 10000) / 100;
          }

          var { error: uErr } = await supabase
            .from('properties')
            .update({
              sale_price: res.sale_price,
              overbid_pct: overbidPct,
              sold_at: auction.auction_date + 'T00:00:00Z',
              sold_to: res.sold_to,
              updated_at: now
            })
            .eq('id', prop.id);

          if (uErr) {
            console.error('[auction-results] Update error for parcel ' + res.parcel_id + ':', uErr.message);
            totalErrors++;
          } else {
            totalUpdated++;
          }
        }

        // Rate limit: 2s between auction pages
        if (i < auctions.length - 1) await delay(2000);

      } catch (fetchErr) {
        console.error('[auction-results] Fetch error for ' + auction.county + ':', fetchErr.message);
        totalErrors++;
      }
    }

    // 5. Log results
    await logRun(supabase, now, totalMatched, totalUpdated, totalErrors, null);

    console.log('[auction-results] COMPLETE: auctions=' + auctionsProcessed + ' matched=' + totalMatched + ' updated=' + totalUpdated + ' errors=' + totalErrors);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        auctions_processed: auctionsProcessed,
        results_matched: totalMatched,
        properties_updated: totalUpdated,
        errors: totalErrors,
        date_range: { from: dateFrom, to: dateTo },
        calculated_at: now
      })
    };

  } catch (e) {
    console.error('[auction-results] Fatal error:', e.message);
    await logRun(supabase, now, totalMatched, totalUpdated, totalErrors, e.message);
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: e.message }) };
  }
};

async function logRun(supabase, now, found, added, errors, errorMsg) {
  try {
    await supabase.from('scrape_log').insert({
      platform: 'auction_results',
      records_found: found,
      records_added: added,
      errors: errorMsg || (errors > 0 ? errors + ' update errors' : null),
      success: !errorMsg && errors === 0,
      run_at: now
    });
  } catch (e) {
    console.error('[auction-results] Failed to write scrape_log:', e.message);
  }
}
