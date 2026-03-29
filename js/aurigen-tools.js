// ═══════════════════════════════════════════════════════════
// DEAL ANALYZER (Concept C)
// ═══════════════════════════════════════════════════════════

function switchToolsPanel(panel) {
  document.querySelectorAll('.tools-subnav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.tools-subpanel').forEach(function(p) { p.classList.remove('active'); });
  var btn = document.querySelector('.tools-subnav-btn[onclick*="' + panel + '"]');
  if (btn) btn.classList.add('active');
  var pnl = document.getElementById('tools-panel-' + panel);
  if (pnl) pnl.classList.add('active');
}

var daScenario = 'realistic';
var daAmount = 10000;

function daInit() {
  if (!window.STATES_V2) return;
  var states = window.STATES_V2.slice().sort(function(a, b) { return a.name.localeCompare(b.name); });
  var selA = document.getElementById('da-select-a');
  var selB = document.getElementById('da-select-b');
  if (!selA || !selB) return;
  var html = states.map(function(s) {
    return '<option value="' + escapeHtml(s.code) + '">' + escapeHtml(s.name) + '</option>';
  }).join('');
  selA.innerHTML = html;
  selB.innerHTML = html;
  // DNA archetype defaults
  var archKey = getArchetypeKey();
  var archCfg = archKey ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  if (archCfg && archCfg.daStates) {
    selA.value = archCfg.daStates[0] || 'FL';
    selB.value = archCfg.daStates[1] || 'IA';
  } else {
    selA.value = 'FL';
    selB.value = 'IA';
  }
  // Show strategy badge
  var daHeader = document.querySelector('.da-header');
  if (daHeader) {
    var oldBadge = document.getElementById('da-arch-badge');
    if (oldBadge) oldBadge.remove();
    if (archCfg) {
      var badgeEl = document.createElement('div');
      badgeEl.id = 'da-arch-badge';
      badgeEl.style.cssText = 'font-family:"Space Mono",monospace;font-size:11px;letter-spacing:0.1em;color:#c9a84c;margin-bottom:6px';
      badgeEl.innerHTML = 'Strategy Mode: ' + escapeHtml(archCfg.label) + ' <a onclick="switchTab(\'dna\')" style="color:rgba(201,168,76,0.6);cursor:pointer;font-size:10px;margin-left:6px">Change \u2192</a><div style="font-size:9px;color:var(--text2);letter-spacing:0;margin-top:2px">Projections are illustrative only based on your selected strategy. Not investment advice.</div>';
      daHeader.insertBefore(badgeEl, daHeader.firstChild);
    }
  }
  daCalculate();
}

function daUpdateAmountFromInput(val) {
  var n = parseInt(val);
  if (isNaN(n) || n < 1000) n = 1000;
  daAmount = n;
  daHighlightQuickPick();
  daCalculate();
}

function daQuickPick(val) {
  daAmount = val;
  var input = document.getElementById('da-amount-input');
  if (input) input.value = val;
  daHighlightQuickPick();
  daCalculate();
}

function daHighlightQuickPick() {
  var btns = document.querySelectorAll('.da-quick-btn');
  btns.forEach(function(b) {
    b.classList.toggle('active', parseInt(b.getAttribute('data-amt')) === daAmount);
  });
}

function daSetScenario(s) {
  daScenario = s;
  document.querySelectorAll('.da-scenario-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-scenario') === s);
  });
  daCalculate();
}

// === RATE & REDEMPTION PARSING (from STATES_V2 data) ===

function daParseRate(rateStr) {
  if (!rateStr || rateStr === 'N/A') return 0;
  var m = String(rateStr).match(/(\d+\.?\d*)%/);
  return m ? parseFloat(m[1]) / 100 : 0;
}

function daParseRedemptionYears(rStr) {
  if (!rStr || rStr === 'N/A') return 1;
  var s = String(rStr).toLowerCase();
  if (/none|no redempt/i.test(s)) return 0;
  var mo = s.match(/(\d+)\s*months?/i);
  if (mo) return parseInt(mo[1]) / 12;
  var yr = s.match(/([\d.]+)\s*years?/i);
  if (yr) return parseFloat(yr[1]);
  var dy = s.match(/(\d+)\s*days?/i);
  if (dy) return parseInt(dy[1]) / 365;
  return 1;
}

function daIsBidDown(state) {
  var bm = (state.bidMethod || state.rateNote || '').toLowerCase();
  return /bid.?down/i.test(bm);
}

// === MATH ENGINE ===
// Pulls all values from states-data-v2.js fields — not hardcoded

var DA_PENALTY_STATES = {
  TX: function(principal, scenario) {
    var rates = {conservative: {penalty:0.25, redemption:0.50}, realistic: {penalty:0.25, redemption:0.80}, optimistic: {penalty:0.50, redemption:0.95}};
    var r = rates[scenario];
    return {interest: principal * r.penalty * r.redemption, holdYears: 2, note: 'Penalty structure \u2014 not annual interest. Homestead/ag 2yr window.'};
  },
  GA: function(principal, scenario) {
    var rates = {conservative: {penalty:0.20, redemption:0.50}, realistic: {penalty:0.20, redemption:0.80}, optimistic: {penalty:0.30, redemption:0.95}};
    var r = rates[scenario];
    return {interest: principal * r.penalty * r.redemption, holdYears: 1, note: 'Penalty structure \u2014 not annual interest.'};
  },
  TN: function(principal, scenario) {
    var rates = {conservative: {penalty:0.10, redemption:0.50}, realistic: {penalty:0.10, redemption:0.80}, optimistic: {penalty:0.15, redemption:0.95}};
    var r = rates[scenario];
    return {interest: principal * r.penalty * r.redemption, holdYears: 1, note: 'Penalty structure \u2014 not annual interest.'};
  },
  IL: function(principal, scenario) {
    var redemptionRates = {conservative:0.50, realistic:0.80, optimistic:0.95};
    var interest = principal * 0.36 * redemptionRates[scenario];
    return {interest: interest, holdYears: 2.5, note: '36% penalty structure \u2014 not annual interest.'};
  }
};

function daCalcState(stateCode) {
  var sv2 = window.STATES_V2 ? window.STATES_V2.find(function(s) { return s.code === stateCode; }) : null;
  if (!sv2) return null;

  var type = sv2.type;
  var principal = daAmount;

  // Deed states — no interest calculation
  if (type === 'deed' || type === 'forfeiture') {
    return {
      isDeed: true,
      type: type,
      stateName: sv2.name,
      rate: sv2.rate,
      redemption: sv2.redemption,
      bidMethod: sv2.bidMethod,
      code: stateCode
    };
  }

  // Special penalty states
  if (DA_PENALTY_STATES[stateCode]) {
    var pen = DA_PENALTY_STATES[stateCode](principal, daScenario);
    var totalRecovered = principal + pen.interest;
    var effYield = pen.holdYears > 0 ? (pen.interest / principal / pen.holdYears) * 100 : 0;
    return {
      isDeed: false,
      type: type,
      stateName: sv2.name,
      rate: sv2.rate,
      redemption: sv2.redemption,
      bidMethod: sv2.bidMethod,
      code: stateCode,
      interest: pen.interest,
      total: totalRecovered,
      effectiveYield: effYield,
      holdYears: pen.holdYears,
      note: pen.note,
      isPenalty: true,
      isBidDown: false
    };
  }

  // Standard lien / hybrid / redeemable
  var statRate = daParseRate(sv2.rate);
  var holdYears = daParseRedemptionYears(sv2.redemption);
  if (holdYears <= 0) holdYears = 1;
  var bidDown = daIsBidDown(sv2);

  // Scenario multipliers
  var rateMultiplier, redemptionRate;
  if (bidDown) {
    var rm = {conservative:0.40, realistic:0.75, optimistic:1.0};
    rateMultiplier = rm[daScenario];
  } else {
    var rm2 = {conservative:0.80, realistic:0.95, optimistic:1.0};
    rateMultiplier = rm2[daScenario];
  }
  var rr = {conservative:0.50, realistic:0.80, optimistic:0.95};
  redemptionRate = rr[daScenario];

  var effectiveRate = statRate * rateMultiplier;
  var interest = principal * effectiveRate * holdYears * redemptionRate;
  var totalRecovered = principal + interest;
  var effYield = holdYears > 0 ? (interest / principal / holdYears) * 100 : 0;

  return {
    isDeed: false,
    type: type,
    stateName: sv2.name,
    rate: sv2.rate,
    redemption: sv2.redemption,
    bidMethod: sv2.bidMethod,
    code: stateCode,
    interest: interest,
    total: totalRecovered,
    effectiveYield: effYield,
    holdYears: holdYears,
    note: bidDown ? 'Bid-down \u2014 actual rate varies by county competition' : null,
    isPenalty: false,
    isBidDown: bidDown
  };
}

function daCalculate() {
  var selA = document.getElementById('da-select-a');
  var selB = document.getElementById('da-select-b');
  if (!selA || !selB) return;
  var codeA = selA.value;
  var codeB = selB.value;
  var rA = daCalcState(codeA);
  var rB = daCalcState(codeB);

  daRenderColumn('a', rA);
  daRenderColumn('b', rB);
  daRenderWinner(rA, rB);
  daRenderInsight(rA, rB);
}

function daRenderColumn(side, r) {
  if (!r) return;
  var metaEl = document.getElementById('da-col-meta-' + side);
  var resultEl = document.getElementById('da-result-' + side);
  var breakdownEl = document.getElementById('da-breakdown-' + side);
  var colEl = document.getElementById('da-col-' + side);

  // Type badge + stat pills
  var colors = {lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
  var typeLabels = {lien:'TAX LIEN',deed:'TAX DEED',redeemable:'RDBL DEED',hybrid:'HYBRID',forfeiture:'FORFEITURE'};
  var c = colors[r.type] || '#00D4FF';
  var tl = typeLabels[r.type] || r.type.toUpperCase();
  var rateShort = shortenRate(r.rate, r.type);
  var holdShort = shortenHold(r.redemption, r.type);
  var bidShort = r.bidMethod ? (r.bidMethod.length > 20 ? r.bidMethod.slice(0, 18) + '\u2026' : r.bidMethod) : 'N/A';

  metaEl.innerHTML =
    '<span class="da-meta-badge" style="color:' + c + ';border-color:' + c + '44;background:' + c + '15">' + escapeHtml(tl) + '</span>' +
    '<span class="da-winner-badge">HIGHER PROJECTED</span>' +
    '<span class="da-meta-pill">' + escapeHtml(rateShort) + '</span>' +
    '<span class="da-meta-pill">' + escapeHtml(holdShort) + '</span>' +
    '<span class="da-meta-pill">' + escapeHtml(bidShort) + '</span>';

  if (r.isDeed) {
    resultEl.innerHTML = '<div class="da-result-msg">' + escapeHtml(r.stateName) + ' is a ' + escapeHtml(tl) + ' state. Returns come from property resale, not interest payments. This calculator works with lien and redeemable deed states.</div>';
    breakdownEl.innerHTML = '';
    colEl.classList.remove('winner');
    return;
  }

  var dollarFmt = function(n) { return '$' + Math.round(n).toLocaleString(); };
  resultEl.innerHTML =
    '<div class="da-result-label">Projected Return</div>' +
    '<div class="da-result-value" id="da-return-' + side + '">' + dollarFmt(r.interest) + '</div>';

  var bHtml =
    '<div class="da-breakdown-row"><span class="da-breakdown-label">Interest Earned</span><span class="da-breakdown-value">' + dollarFmt(r.interest) + '</span></div>' +
    '<div class="da-breakdown-row"><span class="da-breakdown-label">Total Recovered</span><span class="da-breakdown-value">' + dollarFmt(r.total) + '</span></div>' +
    '<div class="da-breakdown-row"><span class="da-breakdown-label">Effective Annual Yield</span><span class="da-breakdown-value">' + r.effectiveYield.toFixed(1) + '%</span></div>' +
    '<div class="da-breakdown-row"><span class="da-breakdown-label">Hold Period</span><span class="da-breakdown-value">' + (r.holdYears < 1 ? Math.round(r.holdYears * 12) + ' mo' : r.holdYears.toFixed(1) + ' yr') + '</span></div>';
  if (r.note) {
    bHtml += '<div class="da-breakdown-note">' + escapeHtml(r.note) + '</div>';
  }
  bHtml += '<div class="da-inline-disclaimer">Projections are estimates only and do not guarantee returns. Conduct independent due diligence before investing.</div>';
  breakdownEl.innerHTML = bHtml;
}

function daRenderWinner(rA, rB) {
  var colA = document.getElementById('da-col-a');
  var colB = document.getElementById('da-col-b');
  colA.classList.remove('winner');
  colB.classList.remove('winner');

  if (!rA || !rB) return;
  // Both deed = no winner
  if (rA.isDeed && rB.isDeed) return;
  // One deed = other wins
  if (rA.isDeed && !rB.isDeed) { colB.classList.add('winner'); return; }
  if (rB.isDeed && !rA.isDeed) { colA.classList.add('winner'); return; }
  // Compare interest
  if (rA.interest > rB.interest) colA.classList.add('winner');
  else if (rB.interest > rA.interest) colB.classList.add('winner');
}

function daRenderInsight(rA, rB) {
  var el = document.getElementById('da-insight');
  if (!el || !rA || !rB) return;
  if (rA.isDeed && rB.isDeed) {
    el.textContent = 'Both states are deed states. Returns come from property resale \u2014 use the Versus tab for a full side-by-side comparison.';
    return;
  }
  if (rA.isDeed || rB.isDeed) {
    var lien = rA.isDeed ? rB : rA;
    var deed = rA.isDeed ? rA : rB;
    el.textContent = escapeHtml(lien.stateName) + ' offers statutory interest returns while ' + escapeHtml(deed.stateName) + ' is a deed state focused on property acquisition \u2014 different investment vehicles entirely.';
    return;
  }
  // Both calculable
  var winner = rA.interest >= rB.interest ? rA : rB;
  var loser = rA.interest >= rB.interest ? rB : rA;
  var holdComp = winner.holdYears > loser.holdYears ? 'longer' : (winner.holdYears < loser.holdYears ? 'shorter' : 'similar');
  var bidComp = winner.isBidDown ? 'competitive bidding' : 'less competitive bidding';
  el.textContent = escapeHtml(winner.stateName) + ' shows a higher statutory rate with ' + bidComp + ' \u2014 but requires a ' + holdComp + ' hold period.';
}

function daOpenInVersus() {
  var selA = document.getElementById('da-select-a');
  var selB = document.getElementById('da-select-b');
  if (!selA || !selB) return;
  try {
    localStorage.setItem('versus_state_a', selA.value);
    localStorage.setItem('versus_state_b', selB.value);
  } catch(e) { /* localStorage not available */ }
  switchTab('versus');
}

// ═══════════════════════════════════════════════════════════
// PROPERTY LOOKUP (Live Wire)
// ═══════════════════════════════════════════════════════════

function daInitLookup() {
  var card = document.getElementById('da-lookup-card');
  if (!card || !getIsPaid()) return;
  card.style.display = '';
  // Populate state select
  var sel = document.getElementById('da-lookup-state');
  if (!sel || sel.children.length > 1) return;
  sel.innerHTML = '<option value="">ST</option>';
  var states = window.STATES_V2 || [];
  states.slice().sort(function(a, b) { return a.code.localeCompare(b.code); }).forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s.code;
    opt.textContent = s.code;
    sel.appendChild(opt);
  });
}

function daLookupProperty() {
  var input = document.getElementById('da-lookup-input');
  var stateSel = document.getElementById('da-lookup-state');
  var resultsEl = document.getElementById('da-lookup-results');
  if (!input || !resultsEl) return;

  var query = input.value.trim();
  if (!query) { resultsEl.innerHTML = ''; return; }

  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  if (!jwt) { resultsEl.innerHTML = '<div style="color:var(--text2)">Sign in to search properties.</div>'; return; }

  var stateCode = stateSel ? stateSel.value : '';
  var url;
  // If it looks like a parcel ID (alphanumeric, dashes), use parcel lookup
  if (/^[\w\-]+$/.test(query) && query.length < 30) {
    url = '/.netlify/functions/property-lookup?parcel_id=' + encodeURIComponent(query);
  } else if (stateCode) {
    url = '/.netlify/functions/property-lookup?address=' + encodeURIComponent(query) + '&state_code=' + encodeURIComponent(stateCode);
  } else {
    resultsEl.innerHTML = '<div style="color:var(--text2)">Select a state for address search.</div>';
    return;
  }

  resultsEl.innerHTML = '<div style="color:var(--text2)">Searching\u2026</div>';

  fetch(url, {
    headers: { 'Authorization': 'Bearer ' + jwt }
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var props = data.properties || (data.property ? [data.property] : []);
      if (props.length === 0) {
        resultsEl.innerHTML = '<div style="color:var(--text2)">No properties found.</div>';
        return;
      }
      var html = props.map(function(p) {
        var bid = p.opening_bid ? '$' + Math.round(p.opening_bid).toLocaleString() : '\u2014';
        var eq = p.equity_cushion_pct != null ? p.equity_cushion_pct + '%' : '\u2014';
        return '<div class="da-lookup-result-item" onclick="daApplyLookup(\'' + escapeHtml(p.state_code || '') + '\',' + (p.opening_bid || 0) + ')">' +
          '<div class="da-lookup-result-addr">' + escapeHtml(p.address || p.parcel_id || 'Unknown') + '</div>' +
          '<div class="da-lookup-result-meta">' + escapeHtml(p.county || '') + ', ' + escapeHtml(p.state_code || '') + ' \u00b7 Bid: ' + bid + ' \u00b7 Equity: ' + eq + '</div>' +
        '</div>';
      }).join('');
      html += '<div style="font-size:10px;color:var(--text2);margin-top:6px;line-height:1.4">Equity figures are based on assessed value and do not account for superior liens, encumbrances, or market conditions. Verify with county records before bidding.</div>';
      resultsEl.innerHTML = html;
    })
    .catch(function() {
      resultsEl.innerHTML = '<div style="color:var(--text2)">Search failed. Please try again.</div>';
    });
}

function daApplyLookup(stateCode, openingBid) {
  if (stateCode) {
    var selA = document.getElementById('da-select-a');
    if (selA) { selA.value = stateCode; }
  }
  if (openingBid > 0) {
    daAmount = Math.round(openingBid);
    var input = document.getElementById('da-amount-input');
    if (input) input.value = daAmount;
    daHighlightQuickPick();
  }
  daCalculate();
  // Clear results
  var resultsEl = document.getElementById('da-lookup-results');
  if (resultsEl) resultsEl.innerHTML = '<div style="color:var(--accent);font-size:11px">Applied: ' + escapeHtml(stateCode) + ' \u00b7 $' + Math.round(openingBid).toLocaleString() + '</div>';
}

// ═══════════════════════════════════════════════════════════
// PHASE 3 — FUNNEL INTELLIGENCE
// ═══════════════════════════════════════════════════════════

