// AURIGEN — Auctions Data Layer
// Extracts auction entries from COUNTY_DATA + STATES_EN + STATES_V2
// Builds window.AUCTION_ENTRIES[] for the Auctions tab
// Dependencies: states-en.js, states-data-v2.js, county verified files (all loaded before this)

(function() {
  'use strict';

  var entries = [];
  var CD = (typeof window !== 'undefined' && window.COUNTY_DATA) ? window.COUNTY_DATA : {};
  var enMap = {};
  if (typeof STATES_EN !== 'undefined') {
    STATES_EN.forEach(function(s) { enMap[s.id] = s; });
  }
  var v2Map = {};
  if (typeof STATES_V2 !== 'undefined') {
    STATES_V2.forEach(function(s) { v2Map[s.code] = s; });
  }

  // Critical alerts keyed by stateCode+county
  var CRITICAL_ALERTS = {
    'KS|Sedgwick': 'CivicSource contract cancelled Dec 2025 — 2026 platform TBD',
    'MD|Montgomery': 'Platform change pending 2026',
    'PA|Philadelphia': 'Tax sale reform legislation pending',
    'LA|_state': 'New tax lien system launched Jan 1, 2026 — verify all procedures'
  };

  // Month name → index for sorting
  var MONTH_IDX = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
    January:0,February:1,March:2,April:3,June:5,July:6,August:7,September:8,October:9,November:10,December:11};

  // Parse a date string into {month, day, year, sortKey, confirmed, display}
  function parseAuctionDate(raw) {
    if (!raw) return null;
    var s = String(raw).trim();
    // Try "Month DD, YYYY" or "Month DD–DD, YYYY" or "Month YYYY"
    var m, month, day, year;

    // "February 18, 2026"
    m = s.match(/^(\w+)\s+(\d{1,2})(?:\s*[\u2013\-]\s*\d{1,2})?,?\s*(\d{4})/);
    if (m) {
      month = m[1]; day = parseInt(m[2], 10); year = parseInt(m[3], 10);
      var mi = MONTH_IDX[month];
      if (mi !== undefined) {
        return { month: month, day: day, year: year, sortKey: year * 10000 + mi * 100 + day, confirmed: true, display: month.substring(0,3) + ' ' + day };
      }
    }

    // "April 18–21, 2026 (Auction 2026A)" — multi-day
    m = s.match(/^(\w+)\s+(\d{1,2})\s*[\u2013\-]\s*(\d{1,2}),?\s*(\d{4})/);
    if (m) {
      month = m[1]; day = parseInt(m[2], 10); year = parseInt(m[4], 10);
      var mi2 = MONTH_IDX[month];
      if (mi2 !== undefined) {
        return { month: month, day: day, year: year, sortKey: year * 10000 + mi2 * 100 + day, confirmed: true, display: month.substring(0,3) + ' ' + day + '\u2013' + m[3] };
      }
    }

    // "February 2026" (no day — estimated)
    m = s.match(/^(\w+)\s+(\d{4})$/);
    if (m) {
      month = m[1]; year = parseInt(m[2], 10);
      var mi3 = MONTH_IDX[month];
      if (mi3 !== undefined) {
        return { month: month, day: 0, year: year, sortKey: year * 10000 + mi3 * 100, confirmed: false, display: 'Est. ' + month.substring(0,3) + ' ' + year };
      }
    }

    // "Dec 2026" short month
    m = s.match(/^(\w{3})\s+(\d{4})$/);
    if (m) {
      month = m[1]; year = parseInt(m[2], 10);
      var mi4 = MONTH_IDX[month];
      if (mi4 !== undefined) {
        return { month: month, day: 0, year: year, sortKey: year * 10000 + mi4 * 100, confirmed: false, display: 'Est. ' + month + ' ' + year };
      }
    }

    // Fallback — try to extract any month mention
    var months = Object.keys(MONTH_IDX);
    for (var i = 0; i < months.length; i++) {
      if (s.indexOf(months[i]) !== -1) {
        var mi5 = MONTH_IDX[months[i]];
        return { month: months[i], day: 0, year: 2026, sortKey: 2026 * 10000 + mi5 * 100, confirmed: false, display: 'Est. ' + months[i].substring(0,3) + ' 2026' };
      }
    }

    return null;
  }

  // Normalize platform name for filtering
  function normPlatform(raw) {
    if (!raw) return 'Unknown';
    // If platform is an object (e.g. {anchorage:"...", fnsb:"..."}), extract first string value
    if (typeof raw === 'object' && raw !== null) {
      var keys = Object.keys(raw);
      for (var k = 0; k < keys.length; k++) {
        if (typeof raw[keys[k]] === 'string' && raw[keys[k]].length > 0) {
          raw = raw[keys[k]];
          break;
        }
      }
      if (typeof raw === 'object') return 'In-Person';
    }
    var s = String(raw);
    if (/realauction/i.test(s)) return 'RealAuction';
    if (/govease/i.test(s)) return 'GovEase';
    if (/bid4assets/i.test(s)) return 'Bid4Assets';
    if (/lienhub/i.test(s)) return 'LienHub';
    if (/linebarger/i.test(s)) return 'Linebarger';
    if (/sri/i.test(s) && !/santa cruz/i.test(s)) return 'SRI';
    if (/civicsource/i.test(s)) return 'CivicSource';
    if (/in.person/i.test(s) || /courthouse/i.test(s) || /sealed.bid/i.test(s) || /public.auction/i.test(s)) return 'In-Person';
    if (/realtaxlien/i.test(s)) return 'RealTaxLien';
    if (/taxcertsale/i.test(s)) return 'TaxCertSale';
    return s.length > 20 ? s.substring(0,20) : s;
  }

  // Normalize type for display
  function normType(raw) {
    if (!raw) return 'lien';
    var s = String(raw).toLowerCase();
    if (s === 'redeemable deed' || s === 'redeemable') return 'redeemable';
    if (s === 'hybrid') return 'hybrid';
    if (s === 'deed') return 'deed';
    if (s === 'lien') return 'lien';
    if (s === 'forfeiture') return 'forfeiture';
    return s;
  }

  // Resolve alert for a state+county
  function getAlert(stateCode, county) {
    var key = stateCode + '|' + county;
    if (CRITICAL_ALERTS[key]) return CRITICAL_ALERTS[key];
    // State-level alert
    var stateKey = stateCode + '|_state';
    if (CRITICAL_ALERTS[stateKey]) return CRITICAL_ALERTS[stateKey];
    return null;
  }

  // 1) Extract from COUNTY_DATA (verified files — richest data)
  var stateKeys = Object.keys(CD);
  stateKeys.forEach(function(code) {
    if (code.indexOf('_') !== -1) return; // skip _STATE_RULES
    var counties = CD[code];
    if (!Array.isArray(counties)) return;

    var en = enMap[code] || {};
    var v2 = v2Map[code] || {};
    var stateType = normType(en.type || v2.type || 'lien');
    var stateName = en.name || v2.name || code;
    var stateRate = en.rate || v2.rate || null;

    counties.forEach(function(c) {
      var county = c.county || '';
      var auction = c.auction || {};
      var dateRaw = auction.saleDate2026 || null;
      var parsed = parseAuctionDate(dateRaw);
      var platform = normPlatform(auction.platform || c.platform || en.auctionSignup && en.auctionSignup.platform || '');
      var url = auction.saleUrl || auction.url || c.url || '';

      entries.push({
        stateCode: code,
        stateName: stateName,
        county: county,
        type: stateType,
        rate: stateRate,
        platform: platform,
        platformUrl: url,
        date: parsed,
        dateRaw: dateRaw,
        note: auction.note || c.note || '',
        alert: getAlert(code, county),
        verified: c.verified || false,
        source: 'county_data'
      });
    });
  });

  // 2) For states NOT in COUNTY_DATA, create a state-level entry from STATES_EN
  var coveredStates = {};
  entries.forEach(function(e) { coveredStates[e.stateCode] = true; });

  if (typeof STATES_EN !== 'undefined') {
    STATES_EN.forEach(function(s) {
      if (coveredStates[s.id]) return;
      var v2s = v2Map[s.id] || {};
      var signup = s.auctionSignup || {};
      var timing = v2s.auctionTiming || '';
      var parsed = parseAuctionDate(timing);

      entries.push({
        stateCode: s.id,
        stateName: s.name,
        county: 'Statewide',
        type: normType(s.type),
        rate: s.rate || null,
        platform: normPlatform(signup.platform || v2s.auctionPlatform || ''),
        platformUrl: signup.directLink || '',
        date: parsed,
        dateRaw: timing || null,
        note: '',
        alert: getAlert(s.id, '_state'),
        verified: false,
        source: 'states_en'
      });
    });
  }

  // Sort: confirmed dates first (by sortKey), then estimated, then no-date
  entries.sort(function(a, b) {
    var aKey = a.date ? a.date.sortKey : 99999999;
    var bKey = b.date ? b.date.sortKey : 99999999;
    if (aKey !== bKey) return aKey - bKey;
    if (a.stateName < b.stateName) return -1;
    if (a.stateName > b.stateName) return 1;
    if (a.county < b.county) return -1;
    if (a.county > b.county) return 1;
    return 0;
  });

  // Build month groups for sidebar filter
  var monthCounts = {};
  entries.forEach(function(e) {
    if (e.date && e.date.month) {
      var key = e.date.month.substring(0,3);
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    }
  });

  // Collect unique platforms for filter
  var platformSet = {};
  entries.forEach(function(e) {
    if (e.platform && e.platform !== 'Unknown') {
      platformSet[e.platform] = (platformSet[e.platform] || 0) + 1;
    }
  });

  // Collect unique types
  var typeSet = {};
  entries.forEach(function(e) {
    typeSet[e.type] = (typeSet[e.type] || 0) + 1;
  });

  window.AUCTION_ENTRIES = entries;
  window.AUCTION_META = {
    total: entries.length,
    monthCounts: monthCounts,
    platforms: platformSet,
    types: typeSet,
    alerts: Object.keys(CRITICAL_ALERTS).length
  };

  console.log('Auctions data loaded:', entries.length, 'entries across', Object.keys(coveredStates).length, 'states from county data');
})();
