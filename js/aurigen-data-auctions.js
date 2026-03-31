// === AUCTIONS TAB — LIVE INVENTORY ===
var _auctionsInvData = [];
var _auctionsInvFilters = { type: 'all', status: 'all', absentee: false, equity: 0 };

function initAuctionsInventory() {
  var sel = document.getElementById('auctions-inv-state');
  if (!sel) return;
  // Populate state dropdown from auction data
  var states = {};
  (typeof AUCTION_ENTRIES !== 'undefined' ? AUCTION_ENTRIES : []).forEach(function(a) {
    if (a.state_code && a.state) states[a.state_code] = a.state;
  });
  // Also pull from STATES_EN if available
  if (typeof STATES_EN !== 'undefined') {
    STATES_EN.forEach(function(s) { if (s.id) states[s.id] = s.name; });
  }
  var sorted = Object.keys(states).sort(function(a, b) { return states[a].localeCompare(states[b]); });
  sel.innerHTML = '<option value="">Select a State</option>';
  sorted.forEach(function(sc) {
    sel.innerHTML += '<option value="' + sc + '">' + escapeHtml(states[sc]) + ' (' + sc + ')</option>';
  });
}

function auctionsInvStateChange() {
  var stateCode = document.getElementById('auctions-inv-state').value;
  var countySel = document.getElementById('auctions-inv-county');
  var body = document.getElementById('auctions-inv-body');
  var filtersEl = document.getElementById('auctions-inv-filters');
  countySel.style.display = 'none';
  countySel.innerHTML = '<option value="">All Counties</option>';
  if (filtersEl) filtersEl.style.display = 'none';
  if (body) body.innerHTML = '';
  var countEl = document.getElementById('auctions-inv-count');
  if (countEl) countEl.textContent = '';

  if (!stateCode) return;

  // Populate counties from auction data
  var counties = {};
  (typeof AUCTION_ENTRIES !== 'undefined' ? AUCTION_ENTRIES : []).forEach(function(a) {
    if (a.state_code === stateCode && a.county) counties[a.county] = true;
  });
  // Also check STATES_EN for county lists
  if (typeof STATES_EN !== 'undefined') {
    var stObj = STATES_EN.find(function(s) { return s.id === stateCode; });
    if (stObj && stObj.counties) {
      stObj.counties.forEach(function(c) {
        var cName = typeof c === 'string' ? c : (c.name || c.county || '');
        if (cName) counties[cName] = true;
      });
    }
  }
  var sorted = Object.keys(counties).sort();
  if (sorted.length > 0) {
    sorted.forEach(function(c) {
      countySel.innerHTML += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
    });
  }
  countySel.style.display = '';
  // Auto-trigger inventory load for all counties immediately
  auctionsInvCountyChange();
}

function auctionsInvCountyChange() {
  var stateCode = document.getElementById('auctions-inv-state').value;
  var county = document.getElementById('auctions-inv-county').value;
  var body = document.getElementById('auctions-inv-body');
  var filtersEl = document.getElementById('auctions-inv-filters');
  if (!stateCode || !body) return;

  // Reset filters
  _auctionsInvFilters = { type: 'all', status: 'all', absentee: false, equity: 0 };
  _auctionsInvData = [];

  // Show loading
  body.innerHTML = buildPropSkeletons();
  if (filtersEl) filtersEl.style.display = 'none';

  if (!getIsPaid()) {
    renderAuctionsInvLocked(body, county);
    return;
  }

  var localAccess = '';
  try { localAccess = localStorage.getItem('aurigen_access') || ''; } catch(e) {}
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  if (!jwt && localAccess !== 'paid') {
    body.innerHTML = '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128274;</span><span class="propfeed-empty-title">VERIFYING ACCESS</span><span class="propfeed-empty-hint">Checking your account status...</span><div class="propfeed-empty-actions"><button type="button" class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="(function(){var e=localStorage.getItem(\'aurigen_email\');if(e){fetch(\'/.netlify/functions/check-access?email=\'+encodeURIComponent(e)).then(function(r){return r.json()}).then(function(d){if(d.paid){try{localStorage.setItem(\'aurigen_access\',\'paid\');}catch(x){}window.location.reload();}else{window.location.href=\'/\';}});}else{window.location.href=\'/\';}})()">Refresh Access</button></div></div>';
    return;
  }

  // If admin with no JWT, fetch it first then proceed
  var jwtReady = jwt
    ? Promise.resolve(jwt)
    : (function() {
        var isAdmin = false;
        try { isAdmin = localStorage.getItem('aurigen_admin_override') === 'true'; } catch(e) {}
        if (!isAdmin) return Promise.resolve('');
        return fetch('/.netlify/functions/admin-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: localStorage.getItem('aurigen_email') || '' })
        })
          .then(function(r) { return r.json(); })
          .then(function(d) {
            if (d.jwt) { try { localStorage.setItem('aurigen_jwt', d.jwt); } catch(x) {} return d.jwt; }
            return '';
          })
          .catch(function() { return ''; });
      })();

  Promise.resolve(jwtReady).then(function(token) {
    var fetchUrl = '/.netlify/functions/auctions/properties?state_code=' + encodeURIComponent(stateCode);
    if (county) fetchUrl += '&county=' + encodeURIComponent(county);
    console.log('[auctions] fetching:', fetchUrl, 'jwt:', token ? 'YES' : 'NO');
    var controller = new AbortController();
    var timeoutId = setTimeout(function() { controller.abort(); }, 15000);
    return fetch(fetchUrl, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      signal: controller.signal
    }).then(function(r) { clearTimeout(timeoutId); return r; });
  })
    .then(function(r) {
      console.log('[auctions] response:', r.status);
      if (r.status === 401 || r.status === 403) throw new Error('access');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      console.log('[auctions] loaded', (data.properties || []).length, 'properties');
      _auctionsInvData = data.properties || [];
      if (filtersEl) {
        filtersEl.style.display = 'flex';
        filtersEl.style.flexWrap = 'wrap';
        filtersEl.style.gap = '6px';
        filtersEl.style.marginBottom = '16px';
        filtersEl.innerHTML = buildAuctionsInvFilterBtns();
      }
      renderAuctionsInvCards(body, county);
    })
    .catch(function(err) {
      console.error('[auctions] error:', err.message || err);
      if (err.message === 'access' && !getIsPaid()) {
        renderAuctionsInvLocked(body, county);
      } else if (err.message === 'access') {
        body.innerHTML = '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128274;</span><span class="propfeed-empty-title">SESSION EXPIRED</span><span class="propfeed-empty-hint">Your session credentials need to be refreshed.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="try{localStorage.removeItem(\'aurigen_jwt\');}catch(x){}auctionsInvCountyChange()">Refresh &amp; Retry</button></div></div>';
      } else if (err.name === 'AbortError') {
        body.innerHTML = '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#9203;</span><span class="propfeed-empty-title">REQUEST TIMED OUT</span><span class="propfeed-empty-hint">The server took too long to respond. Try again.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="auctionsInvCountyChange()">Retry</button></div></div>';
      } else {
        body.innerHTML = '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#9888;</span><span class="propfeed-empty-title">CONNECTION ERROR</span><span class="propfeed-empty-hint">Unable to load inventory. Check your connection and try again.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="auctionsInvCountyChange()">Retry</button></div></div>';
      }
    });
}

function buildAuctionsInvFilterBtns() {
  var f = _auctionsInvFilters;
  var html = '';
  html += '<span class="propfeed-filter-label">TYPE</span>';
  var types = [['all','All Types'],['residential','Residential'],['commercial','Commercial'],['vacant','Vacant Land']];
  types.forEach(function(t) { html += '<button class="propfeed-filter-btn' + (f.type === t[0] ? ' active' : '') + '" onclick="auctionsInvFilter(\'type\',\'' + t[0] + '\')">' + t[1] + '</button>'; });
  html += '<span class="propfeed-filter-label">STATUS</span>';
  var statuses = [['all','All Status'],['active','Active'],['redeemed','Redeemed']];
  statuses.forEach(function(s) { html += '<button class="propfeed-filter-btn' + (f.status === s[0] ? ' active' : '') + '" onclick="auctionsInvFilter(\'status\',\'' + s[0] + '\')">' + s[1] + '</button>'; });
  html += '<span class="propfeed-filter-label">FILTERS</span>';
  html += '<button class="propfeed-filter-toggle' + (f.absentee ? ' active' : '') + '" onclick="auctionsInvFilter(\'absentee\')">Absentee Owner</button>';
  var equities = [[0,'Any Equity'],[100,'100%+'],[200,'200%+']];
  equities.forEach(function(e) { html += '<button class="propfeed-filter-btn' + (f.equity === e[0] ? ' active' : '') + '" onclick="auctionsInvFilter(\'equity\',' + e[0] + ')">' + e[1] + '</button>'; });
  return html;
}

function auctionsInvFilter(key, val) {
  if (key === 'absentee') { _auctionsInvFilters.absentee = !_auctionsInvFilters.absentee; }
  else if (key === 'equity') { _auctionsInvFilters.equity = val; }
  else { _auctionsInvFilters[key] = val; }
  var filtersEl = document.getElementById('auctions-inv-filters');
  if (filtersEl) filtersEl.innerHTML = buildAuctionsInvFilterBtns();
  var body = document.getElementById('auctions-inv-body');
  var county = document.getElementById('auctions-inv-county').value;
  if (body) renderAuctionsInvCards(body, county);
}

function getAuctionsInvFiltered() {
  var f = _auctionsInvFilters;
  return _auctionsInvData.filter(function(p) {
    if (f.type !== 'all') {
      var pt = (p.property_type || '').toLowerCase();
      if (f.type === 'vacant' && pt.indexOf('vacant') === -1 && pt.indexOf('land') === -1) return false;
      if (f.type === 'residential' && pt.indexOf('resident') === -1) return false;
      if (f.type === 'commercial' && pt.indexOf('commerc') === -1) return false;
    }
    if (f.status !== 'all' && (p.status || '').toLowerCase() !== f.status) return false;
    if (f.absentee && !p.absentee_owner) return false;
    if (f.equity > 0 && (p.equity_cushion_pct == null || p.equity_cushion_pct < f.equity)) return false;
    return true;
  });
}

function renderAuctionsInvCards(container, countyName) {
  var filtered = getAuctionsInvFiltered();
  var countEl = document.getElementById('auctions-inv-count');
  if (countEl) { countEl.textContent = filtered.length + ' PROPERT' + (filtered.length !== 1 ? 'IES' : 'Y'); countEl.style.display = ''; }

  if (filtered.length === 0) {
    if (_auctionsInvData.length === 0) {
      container.innerHTML = '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128197;</span><span class="propfeed-empty-title">NO ACTIVE AUCTIONS</span><span class="propfeed-empty-hint">No properties listed for ' + escapeHtml(countyName) + ' right now. Inventory updates regularly.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-ghost" onclick="togglePulseDrawer()">Set Up Alerts</button></div></div>';
    } else {
      container.innerHTML = '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128270;</span><span class="propfeed-empty-title">NO MATCHES</span><span class="propfeed-empty-hint">No properties match your current filters.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="_auctionsInvFilters={type:\'all\',status:\'all\',absentee:false,equity:0};auctionsInvFilter(\'type\',\'all\')">Reset Filters</button></div></div>';
    }
    return;
  }

  var html = '<div class="propfeed-list">';
  var filteredIndex = 0;
  filtered.forEach(function(p) {
    filteredIndex++;
    var addr = escapeHtml(p.address || 'Address unavailable');
    var typeLower = (p.property_type || '').toLowerCase();
    var typeClass = typeLower.indexOf('commerc') >= 0 ? 'commercial' : typeLower.indexOf('vacant') >= 0 || typeLower.indexOf('land') >= 0 ? 'vacant' : 'residential';
    var typeLabel = typeLower.indexOf('commerc') >= 0 ? 'COMMERCIAL' : typeLower.indexOf('vacant') >= 0 || typeLower.indexOf('land') >= 0 ? 'VACANT LAND' : 'RESIDENTIAL';
    var statusLower = (p.status || '').toLowerCase();
    var statusClass = statusLower === 'redeemed' ? 'redeemed' : 'active';
    var statusLabel = statusLower === 'redeemed' ? 'REDEEMED' : 'ACTIVE';
    var platform = escapeHtml(p.source || p.platform || 'GovEase');
    var bid = p.opening_bid != null ? '$' + Number(p.opening_bid).toLocaleString() : '\u2014';
    var assessed = p.assessed_value != null ? '$' + Number(p.assessed_value).toLocaleString() : '\u2014';
    var lienAmt = p.lien_amount != null ? '$' + Number(p.lien_amount).toLocaleString() : '\u2014';
    var lienYear = p.lien_year || p.tax_year || '\u2014';
    var delinquent = p.years_delinquent != null ? p.years_delinquent + 'yr' : (p.delinquency_years != null ? p.delinquency_years + 'yr' : '\u2014');
    var eqRaw = null;
    if (p.equity_cushion_pct != null && isFinite(p.equity_cushion_pct)) {
      eqRaw = Math.round(p.equity_cushion_pct);
    } else if (p.assessed_value != null && p.opening_bid != null && p.assessed_value > 0) {
      eqRaw = Math.round(((p.assessed_value - p.opening_bid) / p.assessed_value) * 100);
    }
    var eqPct = eqRaw !== null ? eqRaw + '%' : '\u2014';
    var eqClass = eqRaw === null ? 'dim' : eqRaw >= 80 ? 'green' : eqRaw >= 50 ? 'yellow' : 'red';
    var eqColor = eqRaw === null ? '#6b7280' : eqRaw >= 80 ? '#3ecf8e' : eqRaw >= 50 ? '#fbbf24' : '#f87171';
    var ringOffset = eqRaw !== null ? Math.round(138.2 - (Math.min(eqRaw, 100) / 100) * 138.2) : 138.2;
    var county = escapeHtml(p.county || '');
    var state = escapeHtml(p.state || p.state_code || '');
    var location = state ? state : '';
    var propData = encodeURIComponent(JSON.stringify({address:p.address,opening_bid:p.opening_bid,assessed_value:p.assessed_value,equity:eqRaw,lien_amount:p.lien_amount,year:lienYear,county:p.county,state_code:p.state_code||p.state,state:p.state||p.state_code}));
    html += '<div class="prop-card">';
    html += '<div class="prop-card-head">';
    html += '<div class="prop-card-num">' + filteredIndex + '</div>';
    html += '<div class="prop-card-head-main">';
    html += '<div class="prop-card-address">' + addr + '</div>';
    html += '<div class="prop-card-pills">';
    html += '<span class="prop-pill prop-pill-' + typeClass + '">' + typeLabel + '</span>';
    html += '<span class="prop-pill prop-pill-' + statusClass + '">' + statusLabel + '</span>';
    html += '<span class="prop-pill prop-pill-platform">' + platform + '</span>';
    if (location) html += '<span class="prop-pill prop-pill-platform">' + location + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="prop-card-score">';
    html += '<div class="prop-score-ring">';
    html += '<svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/><circle cx="26" cy="26" r="22" fill="none" stroke="' + eqColor + '" stroke-width="3" stroke-dasharray="138.2" stroke-dashoffset="' + ringOffset + '" stroke-linecap="round"/></svg>';
    html += '<div class="prop-score-num" style="color:' + eqColor + '">' + (eqRaw !== null ? eqRaw : '\u2014') + '</div>';
    html += '</div>';
    html += '<div class="prop-score-lbl">EQUITY %</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="prop-card-stats">';
    html += '<div class="prop-stat"><div class="prop-stat-lbl">OPENING BID</div><div class="prop-stat-val gold">' + bid + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-lbl">ASSESSED</div><div class="prop-stat-val neutral">' + assessed + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-lbl">LIEN AMT</div><div class="prop-stat-val neutral">' + lienAmt + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-lbl">LIEN YEAR</div><div class="prop-stat-val neutral">' + lienYear + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-lbl">DELINQUENT</div><div class="prop-stat-val neutral">' + delinquent + '</div></div>';
    html += '</div>';
    html += '<div class="prop-card-footer">';
    html += '<div class="prop-footer-data">';
    html += '<span>' + state + ' \u00B7 TAX ' + (typeClass === 'vacant' ? 'DEED' : 'LIEN') + '</span>';
    html += '</div>';
    html += '<div class="prop-card-actions">';
    html += '<button class="prop-action-btn prop-action-primary" onclick="event.stopPropagation();openDealFromProp(\'' + propData + '\')">ANALYZE</button>';
    html += '<button class="prop-action-btn prop-action-ghost" onclick="event.stopPropagation();openScoutFromProp(\'' + propData + '\')">SCOUT</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderAuctionsInvLocked(container, countyName) {
  var html = '<div class="propfeed-blur-wrap"><div class="propfeed-list">';
  for (var i = 0; i < 3; i++) {
    html += '<div class="prop-card">';
    html += '<div class="propfeed-shimmer-bar w85"></div>';
    html += '<div style="display:flex;gap:6px;margin-bottom:8px"><div class="propfeed-shimmer-bar w40" style="flex:1"></div><div class="propfeed-shimmer-bar" style="width:60px"></div></div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px"><div class="propfeed-shimmer-bar" style="height:40px;width:100%"></div><div class="propfeed-shimmer-bar" style="height:40px;width:100%"></div><div class="propfeed-shimmer-bar" style="height:40px;width:100%"></div></div>';
    html += '</div>';
  }
  html += '</div><div class="propfeed-lock"><span class="propfeed-lock-icon">&#128274;</span><span class="propfeed-lock-title">UNLOCK FULL ACCESS</span><span class="propfeed-lock-sub">See live property inventory, equity analysis, and absentee owner data for every county.</span><a class="propfeed-lock-btn" href="' + STRIPE_URL + '" target="_blank" rel="noopener noreferrer">UNLOCK — $197 ONE TIME</a><a class="propfeed-lock-dna" onclick="switchTab(\'dna\');return false" href="#">Not ready yet? Take the DNA quiz first &rarr;</a></div></div>';
  container.innerHTML = html;
  var countEl = document.getElementById('auctions-inv-count');
  if (countEl) countEl.textContent = 'LOCKED';
}

// === LIVE AUCTION DATA FETCH ===
// Replaces AUCTION_ENTRIES with live Supabase data via Netlify function.
// Falls back to the static array from auctions-data.js on any failure.

// County name cleanup — shared by fetch and any future ingest
function cleanCountyName(raw) {
  if (!raw) return 'Statewide';
  var s = String(raw).trim();
  s = s.replace(/^https?:\/\/\S+\s*/i, '');
  s = s.replace(/^com\s+/i, '');
  s = s.replace(/^s\s+/i, '');
  s = s.replace(/^(Municipality|Opens?\s+URL|View\s+Details?|Click\s+Here)\s+/gi, '');
  s = s.replace(/^\S*\.\S+\s+/g, '');
  s = s.replace(/\bCounty\b/gi, '').trim();
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s || 'Statewide';
}

function fetchLiveAuctionData() {
  var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function normPlatform(raw) {
    if (!raw) return 'Unknown';
    var s = String(raw);
    if (/realauction/i.test(s)) return 'RealAuction';
    if (/govease/i.test(s)) return 'GovEase';
    if (/bid4assets/i.test(s)) return 'Bid4Assets';
    if (/sri/i.test(s)) return 'SRI';
    if (/civicsource/i.test(s)) return 'CivicSource';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function normType(raw) {
    if (!raw) return 'lien';
    var s = String(raw).toLowerCase();
    if (s === 'redeemable deed' || s === 'redeemable') return 'redeemable';
    if (s === 'hybrid' || s === 'deed' || s === 'lien' || s === 'forfeiture') return s;
    return 'lien';
  }

  function parseDate(isoStr, status) {
    if (!isoStr) return null;
    var parts = isoStr.split('-');
    if (parts.length !== 3) return null;
    var year = parseInt(parts[0], 10);
    var mi = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    var month = MONTH_NAMES[mi] || 'January';
    var confirmed = (status || '').toLowerCase() !== 'estimated';
    if (confirmed && day > 0) {
      return { month: month, day: day, year: year, sortKey: year * 10000 + mi * 100 + day, confirmed: true, display: month.substring(0,3) + ' ' + day };
    }
    return { month: month, day: day || 0, year: year, sortKey: year * 10000 + mi * 100 + (day || 0), confirmed: false, display: 'Est. ' + month.substring(0,3) + ' ' + year };
  }

  // Show loading states
  var loadingEl = document.getElementById('auctions-loading');
  if (loadingEl) loadingEl.style.display = '';
  var pulseLoadingEl = document.getElementById('pulse-feed-loading');
  if (pulseLoadingEl) pulseLoadingEl.style.display = '';

  // Pass saved states for server-side Pulse filtering
  var _pulseUrl = '/.netlify/functions/auctions';
  var _savedForPulse = getSavedStates();
  if (_savedForPulse.length > 0) {
    _pulseUrl += '?state_codes=' + encodeURIComponent(_savedForPulse.join(','));
  }
  return fetch(_pulseUrl)
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      var liveAuctions = data.auctions || [];
      var liveAlerts = data.alerts || [];

      // --- Replace AUCTION_ENTRIES with live data ---
      if (liveAuctions.length > 0) {
        var entries = [];
        var dedup = {};

        liveAuctions.forEach(function(a) {
          var county = cleanCountyName(a.county);
          var platform = normPlatform(a.platform);
          var dedupKey = (a.state_code || '') + '|' + county + '|' + platform;
          if (dedup[dedupKey]) return;
          dedup[dedupKey] = true;

          entries.push({
            stateCode: a.state_code || '',
            stateName: a.state || a.state_code || '',
            county: county,
            type: normType(a.bid_method),
            rate: null,
            platform: platform,
            platformUrl: a.platform_url || '',
            date: parseDate(a.auction_date, a.status),
            dateRaw: a.auction_date || null,
            note: '',
            alert: null,
            verified: false,
            source: 'live'
          });
        });

        // Sort: confirmed dates first, then estimated, then no-date
        entries.sort(function(a, b) {
          var aKey = a.date ? a.date.sortKey : 99999999;
          var bKey = b.date ? b.date.sortKey : 99999999;
          if (aKey !== bKey) return aKey - bKey;
          if (a.stateName < b.stateName) return -1;
          if (a.stateName > b.stateName) return 1;
          return 0;
        });

        // Rebuild AUCTION_META from live data
        var monthCounts = {};
        var platformSet = {};
        var typeSet = {};
        entries.forEach(function(e) {
          if (e.date && e.date.month) {
            var mk = e.date.month.substring(0, 3);
            monthCounts[mk] = (monthCounts[mk] || 0) + 1;
          }
          if (e.platform && e.platform !== 'Unknown') {
            platformSet[e.platform] = (platformSet[e.platform] || 0) + 1;
          }
          typeSet[e.type] = (typeSet[e.type] || 0) + 1;
        });

        window.AUCTION_ENTRIES = entries;
        window.AUCTION_META = {
          total: entries.length,
          monthCounts: monthCounts,
          platforms: platformSet,
          types: typeSet,
          alerts: 0
        };

        console.log('[live] Replaced AUCTION_ENTRIES with ' + entries.length + ' live records');
      }

      // --- Replace PULSE_ALERTS: live first, then static (dedup by alert_text) ---
      if (liveAlerts.length > 0) {
        var TYPE_ICONS = { critical: '\u26A0\uFE0F', upcoming: '\uD83D\uDCC5', intel: '\uD83D\uDCA1', match: '\uD83C\uDFAF', info: '\uD83D\uDCC5', warning: '\u26A0\uFE0F' };
        var seenTexts = {};
        var merged = [];

        // Live alerts go first
        liveAlerts.forEach(function(a, i) {
          var text = a.alert_text || '';
          if (!text) return;
          var key = text.toLowerCase();
          if (seenTexts[key]) return;
          seenTexts[key] = true;

          var alertType = a.type || 'upcoming';
          var loc = a.state_code || '';

          merged.push({
            id: 'live-' + (a.id || i),
            type: alertType,
            icon: TYPE_ICONS[alertType] || TYPE_ICONS.info,
            title: text,
            body: '',
            state: a.state_code || '',
            location: loc ? loc + ' \u00B7 Live Alert' : 'Live Alert',
            action: alertType === 'upcoming' ? 'View in Auctions' : 'View',
            actionTab: alertType === 'upcoming' ? 'auctions' : null,
            dnaStates: a.state_code ? [a.state_code] : [],
            date: a.auction_date || a.date || null
          });
        });

        // Append static alerts that don't duplicate live ones
        if (typeof PULSE_ALERTS !== 'undefined') {
          PULSE_ALERTS.forEach(function(a) {
            var key = (a.title || '').toLowerCase();
            if (!key || seenTexts[key]) return;
            seenTexts[key] = true;
            merged.push(a);
          });
        }

        PULSE_ALERTS = merged;
        console.log('[live] Pulse: ' + liveAlerts.length + ' live + static deduped = ' + PULSE_ALERTS.length + ' total');
      }

      // Re-render Pulse badge with updated count
      if (typeof pulseUpdateBadge === 'function') pulseUpdateBadge();
    })
    .catch(function(err) {
      console.warn('[live] Fetch failed, using static data:', err.message);
    })
    .then(function() {
      // Hide loading states regardless of success/failure
      if (loadingEl) loadingEl.style.display = 'none';
      var pulseLoading = document.getElementById('pulse-feed-loading');
      if (pulseLoading) pulseLoading.style.display = 'none';
    });
}

