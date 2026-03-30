// === LIVE PROPERTY FEED ===
var _propFeedState = null;
var _propFeedCounty = null;
var _propFeedData = [];
var _propFeedFilters = { type: 'all', status: 'all', absentee: false, equity: 0 };

function loadPropertyFeed(stateCode, countyName) {
  _propFeedState = stateCode;
  _propFeedCounty = countyName;
  _propFeedFilters = { type: 'all', status: 'all', absentee: false, equity: 0 };
  // Track journey milestone
  saveJourneyState({ countyOpened: true });
  updateJourneyBar();
  var container = document.getElementById('panel-properties');
  if (!container) return;

  // Show skeleton loading
  container.innerHTML = buildPropFeedShell(countyName) + buildPropSkeletons();

  // Fetch Opportunity Score + Redemption Rate (parallel, non-blocking)
  fetchOpportunityScore(stateCode, countyName);
  fetchRedemptionRate(stateCode, countyName);

  // Scroll into view
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (!getIsPaid()) {
    // Free users see blurred sample cards
    renderPropFeedLocked(container, countyName);
    return;
  }

  // Fetch properties — requires paid JWT
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  if (!jwt && localStorage.getItem('aurigen_access') !== 'paid' && localStorage.getItem('aurigen_admin_override') !== 'true') { renderPropFeedEmpty(container, countyName, 'Sign in to view live inventory.'); return; }

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
    return fetch('/.netlify/functions/auctions/properties?state_code=' + encodeURIComponent(stateCode) + '&county=' + encodeURIComponent(countyName), {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
  })
    .then(function(r) {
      if (r.status === 401 || r.status === 403) throw new Error('access');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      _propFeedData = data.properties || [];
      renderPropFeed(container, countyName);
    })
    .catch(function(err) {
      if (err.message === 'access' && !getIsPaid()) {
        renderPropFeedLocked(container, countyName);
      } else if (err.message === 'access') {
        renderPropFeedEmpty(container, countyName, 'Session expired. Please refresh the page to continue.');
      } else {
        renderPropFeedEmpty(container, countyName, 'Unable to load inventory. Try again later.');
      }
    });
}

function fetchOpportunityScore(stateCode, countyName) {
  var slot = document.getElementById('opp-score-slot');
  if (!slot) return;
  fetch('/.netlify/functions/county-score?state_code=' + encodeURIComponent(stateCode) + '&county=' + encodeURIComponent(countyName))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data || data.score === null || data.score === undefined) {
        slot.innerHTML = '<div class="opp-score-pending">Score pending \u2014 check back after next weekly update</div>';
        return;
      }
      var s = data.score;
      var tier, tierClass, barColor;
      if (s >= 80) { tier = 'ELITE'; tierClass = 'opp-tier-elite'; barColor = '#c9a84c'; }
      else if (s >= 60) { tier = 'STRONG'; tierClass = 'opp-tier-strong'; barColor = '#2DD4C0'; }
      else if (s >= 40) { tier = 'MODERATE'; tierClass = 'opp-tier-moderate'; barColor = 'rgba(232,228,220,0.5)'; }
      else if (s >= 20) { tier = 'WEAK'; tierClass = 'opp-tier-weak'; barColor = '#c97a2d'; }
      else { tier = 'CAUTION'; tierClass = 'opp-tier-caution'; barColor = '#FF2D55'; }
      slot.innerHTML = '<div class="opp-score-card">' +
        '<div class="opp-score-num">' + s + '</div>' +
        '<div class="opp-score-body">' +
        '<div class="opp-score-label">OPPORTUNITY SCORE</div>' +
        '<div class="opp-score-tier ' + tierClass + '">' + tier + '</div>' +
        '<div class="opp-score-bar"><div class="opp-score-bar-fill" style="width:' + s + '%;background:' + barColor + '"></div></div>' +
        '<div style="font-size:10px;color:#9898b0;margin-top:4px">Scores reflect publicly available data and are not investment recommendations.</div>' +
        '</div></div>';
    })
    .catch(function() {
      slot.innerHTML = '<div class="opp-score-pending">Score pending \u2014 check back after next weekly update</div>';
    });
}

function fetchRedemptionRate(stateCode, countyName) {
  var slot = document.getElementById('redemption-rate-slot');
  if (!slot) return;
  fetch('/.netlify/functions/county-redemption?state_code=' + encodeURIComponent(stateCode) + '&county=' + encodeURIComponent(countyName))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data || data.redemption_rate === null || data.redemption_rate === undefined) {
        slot.innerHTML = '<div class="opp-score-pending">Redemption data pending \u2014 updates weekly</div>';
        return;
      }
      var rate = Math.round(data.redemption_rate * 1000) / 10; // 1 decimal place
      var colorClass;
      if (rate > 70) colorClass = 'redemption-high';
      else if (rate >= 40) colorClass = 'redemption-mid';
      else colorClass = 'redemption-low';
      slot.innerHTML = '<div class="redemption-card">' +
        '<div class="redemption-pct ' + colorClass + '">' + rate.toFixed(1) + '%</div>' +
        '<div class="redemption-body">' +
        '<div class="redemption-label">REDEMPTION RATE</div>' +
        '<div class="redemption-sub">Based on ' + (data.total_tracked || 0) + ' tracked auction' + ((data.total_tracked || 0) !== 1 ? 's' : '') + '</div>' +
        '</div></div>';
    })
    .catch(function() {
      slot.innerHTML = '<div class="opp-score-pending">Redemption data pending \u2014 updates weekly</div>';
    });
}

function buildPropFeedShell(countyName) {
  var activeCount = countActiveFilters(_propFeedFilters);
  var countBadge = activeCount > 0 ? '<span class="propfeed-active-count">' + activeCount + ' active</span>' : '';
  return '<div id="opp-score-slot"></div>' +
    '<div id="redemption-rate-slot"></div>' +
    '<div class="propfeed-header">' +
    '<div class="propfeed-title"><span class="propfeed-dot"></span><span class="propfeed-title-text">LIVE INVENTORY</span>' + countBadge + '</div>' +
    '<span class="propfeed-count" id="propfeed-count">Loading...</span>' +
    '</div>' +
    '<div class="propfeed-filters" id="propfeed-filters">' +
    buildFilterButtons() +
    '</div>';
}

function countActiveFilters(f) {
  var count = 0;
  if (f.type !== 'all') count++;
  if (f.status !== 'all') count++;
  if (f.absentee) count++;
  if (f.equity > 0) count++;
  return count;
}

function buildFilterButtons() {
  var f = _propFeedFilters;
  var html = '';
  // Type filters
  html += '<span class="propfeed-filter-label">TYPE</span>';
  var types = [['all','All Types'],['residential','Residential'],['commercial','Commercial'],['vacant','Vacant Land']];
  types.forEach(function(t) {
    html += '<button class="propfeed-filter-btn' + (f.type === t[0] ? ' active' : '') + '" onclick="propFilterType(\'' + t[0] + '\')">' + t[1] + '</button>';
  });
  // Status filters
  html += '<span class="propfeed-filter-label">STATUS</span>';
  var statuses = [['all','All Status'],['active','Active'],['redeemed','Redeemed'],['struck','Struck Off']];
  statuses.forEach(function(s) {
    html += '<button class="propfeed-filter-btn' + (f.status === s[0] ? ' active' : '') + '" onclick="propFilterStatus(\'' + s[0] + '\')">' + s[1] + '</button>';
  });
  // Absentee + equity
  html += '<span class="propfeed-filter-label">FILTERS</span>';
  html += '<button class="propfeed-filter-toggle' + (f.absentee ? ' active' : '') + '" onclick="propFilterAbsentee()">Absentee Owner</button>';
  var equities = [[0,'Any Equity'],[100,'100%+'],[200,'200%+'],[300,'300%+']];
  equities.forEach(function(e) {
    html += '<button class="propfeed-filter-btn' + (f.equity === e[0] ? ' active' : '') + '" onclick="propFilterEquity(' + e[0] + ')">' + e[1] + '</button>';
  });
  return html;
}

function propFilterType(val) { _propFeedFilters.type = val; applyPropFilters(); }
function propFilterStatus(val) { _propFeedFilters.status = val; applyPropFilters(); }
function propFilterAbsentee() { _propFeedFilters.absentee = !_propFeedFilters.absentee; applyPropFilters(); }
function propFilterEquity(val) { _propFeedFilters.equity = val; applyPropFilters(); }

function applyPropFilters() {
  var container = document.getElementById('panel-properties');
  if (!container) return;
  // Update filter bar
  var filtersEl = document.getElementById('propfeed-filters');
  if (filtersEl) filtersEl.innerHTML = buildFilterButtons();
  renderPropFeed(container, _propFeedCounty);
}

function getFilteredProps() {
  var f = _propFeedFilters;
  return _propFeedData.filter(function(p) {
    if (f.type !== 'all') {
      var pt = (p.property_type || '').toLowerCase();
      if (f.type === 'vacant' && pt.indexOf('vacant') === -1 && pt.indexOf('land') === -1) return false;
      if (f.type === 'residential' && pt.indexOf('resident') === -1) return false;
      if (f.type === 'commercial' && pt.indexOf('commerc') === -1) return false;
    }
    if (f.status !== 'all') {
      var st = (p.status || '').toLowerCase();
      if (f.status === 'struck' && st.indexOf('struck') === -1 && st.indexOf('withdrawn') === -1) return false;
      if (f.status !== 'struck' && st !== f.status) return false;
    }
    if (f.absentee && !p.absentee_owner) return false;
    if (f.equity > 0 && (p.equity_cushion_pct === null || p.equity_cushion_pct < f.equity)) return false;
    return true;
  });
}

function renderPropFeed(container, countyName) {
  var filtered = getFilteredProps();
  var countEl = document.getElementById('propfeed-count');
  if (countEl) countEl.textContent = filtered.length + ' ACTIVE LIEN' + (filtered.length !== 1 ? 'S' : '');

  // Remove old list
  var oldList = container.querySelector('.propfeed-list');
  if (oldList) oldList.remove();
  var oldEmpty = container.querySelector('.propfeed-empty');
  if (oldEmpty) oldEmpty.remove();
  // Remove skeletons
  var oldSkel = container.querySelectorAll('.prop-skeleton');
  oldSkel.forEach(function(s) { s.remove(); });

  if (filtered.length === 0) {
    if (_propFeedData.length === 0) {
      container.insertAdjacentHTML('beforeend', '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128197;</span><span class="propfeed-empty-title">NO ACTIVE AUCTIONS</span><span class="propfeed-empty-hint">No properties are currently listed for ' + escapeHtml(countyName) + '. Auction inventory updates regularly.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="switchTab(\'map\')">Browse Map</button><button class="propfeed-empty-btn propfeed-empty-btn-ghost" onclick="togglePulseDrawer()">Set Up Alerts</button></div></div>');
    } else {
      container.insertAdjacentHTML('beforeend', '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128270;</span><span class="propfeed-empty-title">NO MATCHES</span><span class="propfeed-empty-hint">No properties match your current filters.</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="_propFeedFilters={type:\'all\',status:\'all\',absentee:false,equity:0};applyPropFilters()">Reset Filters</button></div></div>');
    }
    return;
  }

  var html = '<div class="propfeed-list">';
  filtered.forEach(function(p) {
    var addr = escapeHtml(p.address || 'Address unavailable');
    var typeLower = (p.property_type || '').toLowerCase();
    var typeClass = typeLower.indexOf('resident') >= 0 ? 'residential' : typeLower.indexOf('commerc') >= 0 ? 'commercial' : 'vacant';
    var typeLabel = typeLower.indexOf('resident') >= 0 ? 'Residential' : typeLower.indexOf('commerc') >= 0 ? 'Commercial' : typeLower.indexOf('vacant') >= 0 || typeLower.indexOf('land') >= 0 ? 'Vacant Land' : (p.property_type || 'Unknown');

    var pills = '<span class="prop-pill prop-pill-' + typeClass + '">' + escapeHtml(typeLabel) + '</span>';
    if (p.absentee_owner) pills += '<span class="prop-pill prop-pill-absentee">ABSENTEE</span>';

    var bid = p.opening_bid !== null ? '$' + Number(p.opening_bid).toLocaleString('en-US', {maximumFractionDigits:0}) : '--';
    var assessed = p.assessed_value !== null ? '$' + Number(p.assessed_value).toLocaleString('en-US', {maximumFractionDigits:0}) : '--';
    var eqPct = p.equity_cushion_pct !== null ? Math.round(p.equity_cushion_pct) + '%' : '--';
    var eqClass = p.equity_cushion_pct === null ? '' : p.equity_cushion_pct > 200 ? ' equity-high' : p.equity_cushion_pct >= 100 ? ' equity-mid' : ' equity-low';

    var statusLower = (p.status || '').toLowerCase();
    var statusClass = statusLower === 'active' ? 'prop-status-active' : statusLower === 'redeemed' ? 'prop-status-redeemed' : 'prop-status-struck';
    var statusLabel = statusLower === 'active' ? 'ACTIVE' : statusLower === 'redeemed' ? 'REDEEMED' : 'STRUCK OFF';

    // Encode property data for Deal Analyzer pre-population
    var propData = encodeURIComponent(JSON.stringify({
      address: p.address, opening_bid: p.opening_bid, assessed_value: p.assessed_value,
      lien_amount: p.lien_amount, state_code: p.state_code, county: p.county, parcel_id: p.parcel_id
    }));

    var lienAmt = p.lien_amount !== null && p.lien_amount !== undefined ? '$' + Number(p.lien_amount).toLocaleString('en-US', {maximumFractionDigits:0}) : '--';
    var lienYr = escapeHtml(String(p.lien_year || '\u2014'));
    var delYrs = p.delinquency_years !== null && p.delinquency_years !== undefined ? escapeHtml(String(p.delinquency_years)) + 'yr' : '--';

    html += '<div class="prop-card">';
    html += '<div class="prop-card-top"><div class="prop-card-address">' + addr + '</div><div class="prop-card-pills">' + pills + '</div></div>';
    html += '<div class="prop-card-stats-6">';
    html += '<div class="prop-stat"><div class="prop-stat-label">OPENING BID</div><div class="prop-stat-value">' + bid + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-label">ASSESSED</div><div class="prop-stat-value">' + assessed + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-label">EQUITY</div><div class="prop-stat-value' + eqClass + '">' + eqPct + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-label">LIEN AMT</div><div class="prop-stat-value">' + lienAmt + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-label">LIEN YEAR</div><div class="prop-stat-value">' + lienYr + '</div></div>';
    html += '<div class="prop-stat"><div class="prop-stat-label">DELINQUENT</div><div class="prop-stat-value">' + delYrs + '</div></div>';
    html += '</div>';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">';
    if (statusLower !== 'active') {
      html += '<span class="prop-card-status ' + statusClass + '">' + statusLabel + '</span>';
    }
    html += '<div class="prop-card-actions">';
    html += '<button class="prop-action-btn prop-action-primary" onclick="event.stopPropagation();openDealFromProp(\'' + propData + '\')">Analyze</button>';
    html += '<button class="prop-action-btn prop-action-ghost" onclick="event.stopPropagation();openScoutFromProp(\'' + propData + '\')">Scout</button>';
    html += '<button class="prop-action-btn prop-action-ghost" onclick="event.stopPropagation();viewPropDetail(\'' + propData + '\')">Details</button>';
    html += '</div></div>';
    html += '</div>';
  });
  html += '</div>';
  container.insertAdjacentHTML('beforeend', html);
}

function buildPropSkeletons() {
  var html = '';
  for (var i = 0; i < 3; i++) {
    html += '<div class="prop-skeleton"><div class="prop-skel-line w80"></div><div class="prop-skel-line w40"></div><div class="prop-skel-stats"><div class="prop-skel-stat"></div><div class="prop-skel-stat"></div><div class="prop-skel-stat"></div></div></div>';
  }
  return html;
}

function renderPropFeedLocked(container, countyName) {
  container.innerHTML = buildPropFeedShell(countyName);
  var countEl = document.getElementById('propfeed-count');
  if (countEl) countEl.textContent = 'LOCKED';
  // Shimmer bars + blur overlay (4B enhanced preview)
  var sampleHtml = '<div class="propfeed-blur-wrap"><div class="propfeed-list">';
  for (var i = 0; i < 3; i++) {
    sampleHtml += '<div class="prop-card">';
    sampleHtml += '<div class="propfeed-shimmer-bar w85"></div>';
    sampleHtml += '<div style="display:flex;gap:6px;margin-bottom:8px"><div class="propfeed-shimmer-bar w40" style="flex:1"></div><div class="propfeed-shimmer-bar" style="width:60px"></div></div>';
    sampleHtml += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px"><div class="propfeed-shimmer-bar" style="height:40px;width:100%"></div><div class="propfeed-shimmer-bar" style="height:40px;width:100%"></div><div class="propfeed-shimmer-bar" style="height:40px;width:100%"></div></div>';
    sampleHtml += '</div>';
  }
  sampleHtml += '</div>';
  sampleHtml += '<div class="propfeed-lock"><span class="propfeed-lock-icon">&#128274;</span><span class="propfeed-lock-title">UNLOCK FULL ACCESS</span><span class="propfeed-lock-sub">See live property inventory, equity analysis, and absentee owner data for every county.</span><a class="propfeed-lock-btn" href="' + STRIPE_URL + '" target="_blank" rel="noopener noreferrer">UNLOCK — $197 ONE TIME</a><a class="propfeed-lock-dna" onclick="switchTab(\'dna\');return false" href="#">Not ready yet? Take the DNA quiz first &rarr;</a></div></div>';
  container.insertAdjacentHTML('beforeend', sampleHtml);
}

function renderPropFeedEmpty(container, countyName, msg) {
  container.innerHTML = buildPropFeedShell(countyName);
  var countEl = document.getElementById('propfeed-count');
  if (countEl) countEl.textContent = '0 PROPERTIES';
  container.insertAdjacentHTML('beforeend', '<div class="propfeed-empty"><span class="propfeed-empty-icon">&#128269;</span><span class="propfeed-empty-title">INVENTORY UNAVAILABLE</span><span class="propfeed-empty-hint">' + escapeHtml(msg) + '</span><div class="propfeed-empty-actions"><button class="propfeed-empty-btn propfeed-empty-btn-primary" onclick="switchTab(\'map\')">Browse Map</button></div></div>');
}

function openDealFromProp(encodedData) {
  try {
    var p = JSON.parse(decodeURIComponent(encodedData));
    // Store property data for Deal Analyzer pre-population
    try {
      localStorage.setItem('deal_prop_address', p.address || '');
      localStorage.setItem('deal_prop_bid', p.opening_bid || '');
      localStorage.setItem('deal_prop_assessed', p.assessed_value || '');
      localStorage.setItem('deal_prop_lien', p.lien_amount || '');
      localStorage.setItem('deal_prop_state', p.state_code || '');
      localStorage.setItem('deal_prop_county', p.county || '');
    } catch(le) { /* localStorage unavailable */ }
    // Switch to Tools tab and open Deal Analyzer
    if (typeof switchTab === 'function') switchTab('tools');
    // Pre-populate price input if it exists
    var priceInput = document.getElementById('da-amount-input') || document.getElementById('inp-price');
    if (priceInput && p.opening_bid) {
      priceInput.value = Math.round(p.opening_bid);
      priceInput.dispatchEvent(new Event('input'));
    }
    // Close detail panel
    closeDetail();
  } catch(e) {
    console.warn('[propfeed] Could not open deal analyzer:', e.message);
  }
}

function openScoutFromProp(encodedData) {
  try {
    var p = JSON.parse(decodeURIComponent(encodedData));
    try {
      localStorage.setItem('scout_prop_address', p.address || '');
      localStorage.setItem('scout_prop_state', p.state_code || '');
      localStorage.setItem('scout_prop_county', p.county || '');
    } catch(le) {}
    if (typeof switchTab === 'function') switchTab('scout');
    closeDetail();
  } catch(e) {
    console.warn('[propfeed] Could not open scout:', e.message);
  }
}

function viewPropDetail(encodedData) {
  try {
    var p = JSON.parse(decodeURIComponent(encodedData));
    var addr = p.address || 'Unknown Address';
    var bid = p.opening_bid !== null && p.opening_bid !== undefined ? '$' + Number(p.opening_bid).toLocaleString('en-US',{maximumFractionDigits:0}) : '--';
    var assessed = p.assessed_value !== null && p.assessed_value !== undefined ? '$' + Number(p.assessed_value).toLocaleString('en-US',{maximumFractionDigits:0}) : '--';
    var lien = p.lien_amount !== null && p.lien_amount !== undefined ? '$' + Number(p.lien_amount).toLocaleString('en-US',{maximumFractionDigits:0}) : '--';
    var html = '<div style="padding:24px;max-width:400px;background:#0d1220;border:1px solid rgba(201,168,76,0.2);border-radius:12px;color:#e8e4dc;font-family:\'Plus Jakarta Sans\',sans-serif">';
    html += '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:20px;color:#c9a84c;letter-spacing:0.08em;margin-bottom:12px">PROPERTY DETAIL</div>';
    html += '<div style="font-size:14px;font-weight:600;margin-bottom:16px">' + escapeHtml(addr) + '</div>';
    html += '<div style="font-size:12px;color:rgba(232,228,220,0.5);line-height:2">';
    html += 'State: ' + escapeHtml(p.state_code || '--') + '<br>';
    html += 'County: ' + escapeHtml(p.county || '--') + '<br>';
    html += 'Parcel ID: ' + escapeHtml(p.parcel_id || '--') + '<br>';
    html += 'Opening Bid: ' + bid + '<br>';
    html += 'Assessed Value: ' + assessed + '<br>';
    html += 'Lien Amount: ' + lien + '</div>';
    html += '<button onclick="this.closest(\'.prop-detail-modal\').remove()" style="margin-top:16px;background:rgba(201,168,76,0.15);color:#c9a84c;border:1px solid rgba(201,168,76,0.3);font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:0.08em;padding:10px 20px;border-radius:6px;cursor:pointer;min-height:44px">CLOSE</button></div>';
    var overlay = document.createElement('div');
    overlay.className = 'prop-detail-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:90000;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center';
    overlay.innerHTML = html;
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  } catch(e) {
    console.warn('[propfeed] Could not show detail:', e.message);
  }
}

