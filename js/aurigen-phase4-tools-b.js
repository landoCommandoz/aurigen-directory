// === DOSSIER ===
var _dossierInited = false;

function initDossier() {
  if (_dossierInited || !IS_PAID) return;
  _dossierInited = true;
  var stateSel = document.getElementById('dossier-state');
  var countySel = document.getElementById('dossier-county');
  if (!stateSel || !countySel) return;
  var states = typeof STATES_EN !== 'undefined' ? STATES_EN : [];
  states.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.id + ' \u2014 ' + s.name;
    stateSel.appendChild(opt);
  });
  stateSel.addEventListener('change', function() {
    countySel.innerHTML = '<option value="">Select county...</option>';
    var st = states.find(function(s) { return s.id === stateSel.value; });
    if (st && st.counties) {
      st.counties.forEach(function(c) {
        var cName = typeof c === 'string' ? c : (c.name || c.county || '');
        if (cName) {
          var opt = document.createElement('option');
          opt.value = cName;
          opt.textContent = cName;
          countySel.appendChild(opt);
        }
      });
    }
  });
  // Pre-select from DNA
  var archKey = getArchetypeKey();
  var archCfg = archKey ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  if (archCfg && archCfg.daStates && archCfg.daStates[0]) stateSel.value = archCfg.daStates[0];
  stateSel.dispatchEvent(new Event('change'));
}

function dossierGenerate() {
  var stateSel = document.getElementById('dossier-state');
  var countySel = document.getElementById('dossier-county');
  var output = document.getElementById('dossier-output');
  if (!stateSel || !countySel || !output) return;
  var stateCode = stateSel.value;
  var county = countySel.value;
  if (!stateCode || !county) { output.innerHTML = '<div class="dossier-loading">Please select both a state and county.</div>'; output.style.display = 'block'; return; }

  output.style.display = 'block';
  output.innerHTML = '<div class="dossier-loading"><div class="warbook-loading-spinner"></div>Generating dossier\u2026</div>';

  var states = typeof STATES_EN !== 'undefined' ? STATES_EN : [];
  var st = states.find(function(s) { return s.id === stateCode; });

  // Fetch data in parallel
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}

  Promise.all([
    fetch('/.netlify/functions/auctions?state_code=' + stateCode).then(function(r) { return r.json(); }).catch(function() { return {}; }),
    fetch('/.netlify/functions/auctions/properties?state_code=' + stateCode + '&county=' + encodeURIComponent(county), {
      headers: { 'Authorization': 'Bearer ' + jwt }
    }).then(function(r) { return r.json(); }).catch(function() { return {}; })
  ]).then(function(results) {
    var auctionData = results[0];
    var propData = results[1];
    dossierRender(stateCode, county, st, auctionData, propData);
    // Mark First Deal step 3 complete
    try { localStorage.setItem('aurigen_fd_dossier', '1'); } catch(e) {}
  });
}

function dossierRender(stateCode, county, stObj, auctionData, propData) {
  var output = document.getElementById('dossier-output');
  if (!output) return;

  var type = stObj ? stObj.type : '\u2014';
  var rate = stObj ? (stObj.rate || '\u2014') : '\u2014';
  var redemption = stObj ? (stObj.redemption || '\u2014') : '\u2014';
  var score = stObj ? (stObj.score || '\u2014') : '\u2014';
  var scoreTier = '\u2014';
  if (typeof score === 'number') {
    if (score >= 80) scoreTier = 'Strong';
    else if (score >= 60) scoreTier = 'Moderate';
    else if (score >= 40) scoreTier = 'Fair';
    else scoreTier = 'Weak';
  }

  // Auctions for this county
  var auctions = (auctionData.auctions || []).filter(function(a) {
    return a.state_code === stateCode && (!a.county || a.county === county);
  });
  var now = new Date(); now.setHours(0,0,0,0);
  var upcoming = auctions.filter(function(a) { return a.auction_date && new Date(a.auction_date) >= now; })
    .sort(function(a,b) { return new Date(a.auction_date) - new Date(b.auction_date); })
    .slice(0, 3);

  // Properties for this county
  var props = propData.properties || [];
  var propCount = props.length;
  var avgBid = 0; var avgEquity = 0;
  if (propCount > 0) {
    var bidSum = 0; var eqSum = 0; var eqCount = 0;
    props.forEach(function(p) {
      if (p.opening_bid) bidSum += p.opening_bid;
      if (p.equity_cushion_pct != null) { eqSum += p.equity_cushion_pct; eqCount++; }
    });
    avgBid = Math.round(bidSum / propCount);
    avgEquity = eqCount > 0 ? Math.round(eqSum / eqCount) : 0;
  }

  var dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  var html = '<div class="dossier-output">';
  html += '<div style="text-align:center;margin-bottom:20px"><div style="font-family:\'Bebas Neue\',sans-serif;font-size:24px;color:var(--accent);letter-spacing:0.04em">COUNTY DOSSIER</div>';
  html += '<div style="font-size:12px;color:var(--text2)">' + escapeHtml(county) + ', ' + escapeHtml(stateCode) + ' &mdash; ' + dateStr + '</div></div>';

  // Section 1: County Overview
  html += '<div class="dossier-section"><div class="dossier-section-title">COUNTY OVERVIEW</div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">State</span><span class="dossier-row-value">' + escapeHtml(stateCode) + '</span></div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Type</span><span class="dossier-row-value">' + escapeHtml(type) + '</span></div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Interest Rate</span><span class="dossier-row-value">' + escapeHtml(rate) + '</span></div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Redemption Period</span><span class="dossier-row-value">' + escapeHtml(redemption) + '</span></div>';
  html += '</div>';

  // Section 2: Opportunity Score
  html += '<div class="dossier-section"><div class="dossier-section-title">OPPORTUNITY SCORE</div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Score</span><span class="dossier-row-value">' + score + '</span></div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Tier</span><span class="dossier-row-value">' + scoreTier + '</span></div>';
  html += '</div>';

  // Section 3: Live Inventory
  html += '<div class="dossier-section"><div class="dossier-section-title">LIVE INVENTORY SNAPSHOT</div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Active Properties</span><span class="dossier-row-value">' + propCount + '</span></div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Avg Opening Bid</span><span class="dossier-row-value">' + (avgBid > 0 ? '$' + avgBid.toLocaleString() : '\u2014') + '</span></div>';
  html += '<div class="dossier-row"><span class="dossier-row-label">Avg Equity Cushion</span><span class="dossier-row-value">' + (avgEquity !== 0 ? avgEquity + '%' : '\u2014') + '</span></div>';
  html += '</div>';

  // Section 4: Upcoming Auctions
  html += '<div class="dossier-section"><div class="dossier-section-title">UPCOMING AUCTIONS</div>';
  if (upcoming.length === 0) {
    html += '<div style="font-size:12px;color:var(--text2)">No upcoming auctions found for this county.</div>';
  } else {
    upcoming.forEach(function(a) {
      var aDate = new Date(a.auction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      html += '<div class="dossier-row"><span class="dossier-row-label">' + aDate + '</span><span class="dossier-row-value">' + escapeHtml(a.auction_type || a.type || 'Auction') + '</span></div>';
    });
  }
  html += '</div>';

  // Section 5: Investor Profile (from DNA)
  var _dossierProfile = typeof getProfile === 'function' ? getProfile() : null;
  if (_dossierProfile && _dossierProfile.dnaComplete) {
    html += '<div class="dossier-section"><div class="dossier-section-title">YOUR INVESTOR PROFILE</div>';
    html += '<div class="dossier-row"><span class="dossier-row-label">Archetype</span><span class="dossier-row-value">' + escapeHtml(_dossierProfile.archetypeLabel || '\u2014') + '</span></div>';
    html += '<div class="dossier-row"><span class="dossier-row-label">Strategy</span><span class="dossier-row-value">' + escapeHtml(_dossierProfile.strategyLabel || '\u2014') + '</span></div>';
    var topNames = (_dossierProfile.topStates || []).map(function(s) { return escapeHtml(s.name); }).join(', ');
    if (topNames) html += '<div class="dossier-row"><span class="dossier-row-label">Top States</span><span class="dossier-row-value">' + topNames + '</span></div>';
    html += '</div>';
  }

  // Section 6: Strategy Notes
  html += '<div class="dossier-section"><div class="dossier-section-title">YOUR STRATEGY NOTES</div>';
  html += '<textarea class="dossier-notes" id="dossier-notes" placeholder="Add your notes for this county\u2026"></textarea>';
  html += '</div>';

  html += '</div>';

  // Actions
  html += '<div class="dossier-actions">';
  html += '<button class="dossier-print-btn" data-action="dossier-print">PRINT DOSSIER</button>';
  html += '<button class="dossier-copy-btn" data-action="dossier-copy" data-state="' + escapeHtml(stateCode) + '" data-county="' + escapeHtml(county) + '">COPY SUMMARY</button>';
  html += '</div>';

  output.innerHTML = html;
  output.style.display = 'block';
}

function dossierCopyText(stateCode, county) {
  var states = typeof STATES_EN !== 'undefined' ? STATES_EN : [];
  var st = states.find(function(s) { return s.id === stateCode; });
  var notes = '';
  var notesEl = document.getElementById('dossier-notes');
  if (notesEl) notes = notesEl.value;

  var text = 'AURIGEN COUNTY DOSSIER\n';
  text += county + ', ' + stateCode + '\n';
  text += 'Generated: ' + new Date().toLocaleDateString() + '\n\n';
  text += 'Type: ' + (st ? st.type : 'N/A') + '\n';
  text += 'Rate: ' + (st ? (st.rate || 'N/A') : 'N/A') + '\n';
  text += 'Redemption: ' + (st ? (st.redemption || 'N/A') : 'N/A') + '\n';
  text += 'Score: ' + (st ? (st.score || 'N/A') : 'N/A') + '\n';
  if (notes) text += '\nNotes:\n' + notes + '\n';
  text += '\nFor informational purposes only. Not investment advice.';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      var btn = document.querySelector('[data-action="dossier-copy"]');
      if (btn) { btn.textContent = 'COPIED'; setTimeout(function() { btn.textContent = 'COPY SUMMARY'; }, 2000); }
    });
  }
}

// === PRE-CALL SUMMARY ===
function generatePreCallSummary() {
  var profile = typeof getProfile === 'function' ? getProfile() : null;
  var saved = getSavedStates();
  var archLabel = (profile && profile.archetypeLabel) ? profile.archetypeLabel : 'Not taken';
  var lastCounty = '';
  try { lastCounty = localStorage.getItem('aurigen_last_county') || ''; } catch(e) {}
  var score = '';
  try { score = localStorage.getItem('aurigen_last_score') || 'N/A'; } catch(e) {}

  // Scout checklist progress
  var scoutPct = 'Not started';
  if (lastCounty) {
    try {
      var deals = JSON.parse(localStorage.getItem('aurigen_scout_deals') || '[]');
      if (deals.length > 0) {
        var d = deals[0];
        var checked = d.checked || {};
        var total = 10;
        var done = Object.keys(checked).filter(function(k) { return checked[k]; }).length;
        scoutPct = Math.round((done / total) * 100) + '% (' + done + '/' + total + ')';
      }
    } catch(e) {}
  }

  var dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  var text = 'AURIGEN PRE-CALL SUMMARY \u2014 ' + dateStr + '\n';
  text += '---\n';
  text += 'Archetype: ' + archLabel + '\n';
  text += 'Saved States: ' + (saved.length > 0 ? saved.join(', ') : 'None') + '\n';
  text += 'Target County: ' + (lastCounty || 'None') + '\n';
  text += 'Opportunity Score: ' + score + '\n';
  text += 'Scout Checklist: ' + scoutPct + '\n';
  text += '---\n';
  text += 'Generated from Aurigen Directory. For informational purposes only.\n';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      var btn = document.querySelector('[data-action="precall-summary"]');
      if (btn) {
        var origText = btn.innerHTML;
        btn.innerHTML = '<span class="acct-quick-link-icon">\u2713</span>Copied to clipboard';
        setTimeout(function() { btn.innerHTML = origText; }, 2000);
      }
    });
  }
}

// === FIRST DEAL — 5-Step Guided Flow ===
var _firstDealInited = false;
var FD_STEPS = [
  { key: 'state', icon: '\uD83D\uDDFA\uFE0F', i18nTitle: 'fd_step1', i18nDesc: 'fd_step1_desc', action: 'map' },
  { key: 'county', icon: '\uD83C\uDFD8\uFE0F', i18nTitle: 'fd_step2', i18nDesc: 'fd_step2_desc', action: 'map' },
  { key: 'dossier', icon: '\uD83D\uDCC4', i18nTitle: 'fd_step3', i18nDesc: 'fd_step3_desc', action: 'dossier' },
  { key: 'scout', icon: '\uD83D\uDD0D', i18nTitle: 'fd_step4', i18nDesc: 'fd_step4_desc', action: 'scout' },
  { key: 'pulse', icon: '\uD83D\uDD14', i18nTitle: 'fd_step5', i18nDesc: 'fd_step5_desc', action: 'account' }
];

function getFirstDealStep() {
  var step = 1;
  try { step = parseInt(localStorage.getItem('aurigen_first_deal_step') || '1', 10); } catch(e) {}
  if (isNaN(step) || step < 1) step = 1;
  if (step > 5) step = 5;
  return step;
}

function setFirstDealStep(step) {
  try { localStorage.setItem('aurigen_first_deal_step', String(step)); } catch(e) {}
}

function advanceFirstDeal(stepNum) {
  var current = getFirstDealStep();
  if (stepNum > current) {
    setFirstDealStep(stepNum);
  }
  renderFirstDeal();
}

function initFirstDeal() {
  if (_firstDealInited) return;
  _firstDealInited = true;
  renderFirstDeal();
}

function renderFirstDeal() {
  var container = document.getElementById('firstdeal-steps');
  var completeEl = document.getElementById('firstdeal-complete');
  if (!container) return;

  var currentStep = getFirstDealStep();
  var allDone = currentStep > 5;

  // Check completion conditions from localStorage
  // Step 1: state clicked (aurigen_last_state)
  // Step 2: county viewed (aurigen_last_county)
  // Step 3: dossier generated (aurigen_fd_dossier)
  // Step 4: scout started (aurigen_scout_deals has entries)
  // Step 5: pulse alert set (aurigen_fd_pulse)
  var conditions = [false, false, false, false, false];
  try {
    conditions[0] = !!localStorage.getItem('aurigen_last_state');
    conditions[1] = !!localStorage.getItem('aurigen_last_county');
    conditions[2] = !!localStorage.getItem('aurigen_fd_dossier');
    var scoutDeals = JSON.parse(localStorage.getItem('aurigen_scout_deals') || '[]');
    conditions[3] = scoutDeals.length > 0;
    conditions[4] = !!localStorage.getItem('aurigen_fd_pulse');
  } catch(e) {}

  // Auto-advance based on conditions
  for (var i = 0; i < 5; i++) {
    if (conditions[i] && currentStep <= i + 1) {
      currentStep = i + 2;
      setFirstDealStep(currentStep);
    }
  }

  allDone = currentStep > 5;

  var html = '';
  var tFn = typeof t === 'function' ? t : function(k) { return k; };

  for (var s = 0; s < FD_STEPS.length; s++) {
    var step = FD_STEPS[s];
    var num = s + 1;
    var isDone = num < currentStep;
    var isCurrent = num === currentStep && !allDone;
    var isLocked = num > currentStep;

    var statusClass = isDone ? 'fd-done' : (isCurrent ? 'fd-current' : 'fd-locked');
    var statusIcon = isDone ? '\u2713' : String(num);

    html += '<div class="fd-step ' + statusClass + '">';
    html += '<div class="fd-step-node"><span class="fd-step-num">' + statusIcon + '</span></div>';
    html += '<div class="fd-step-body">';
    html += '<div class="fd-step-title">' + tFn('fd_step') + ' ' + num + ': ' + tFn(step.i18nTitle) + '</div>';
    html += '<div class="fd-step-desc">' + tFn(step.i18nDesc) + '</div>';
    if (isCurrent) {
      html += '<button class="fd-step-go" data-action="fd-go" data-target="' + step.action + '">' + step.icon + ' GO</button>';
    }
    html += '</div></div>';
    if (s < FD_STEPS.length - 1) {
      html += '<div class="fd-connector ' + (isDone ? 'fd-connector-done' : '') + '"></div>';
    }
  }

  container.innerHTML = html;

  // Show completion card
  if (completeEl) {
    if (allDone) {
      completeEl.style.display = 'block';
      completeEl.innerHTML = '<div class="fd-complete-card">' +
        '<div class="fd-complete-icon">\uD83C\uDF89</div>' +
        '<div class="fd-complete-title">' + tFn('fd_complete') + '</div>' +
        '<div class="fd-complete-desc">You\'ve completed all 5 steps. Your research pipeline is set. Time to take action.</div>' +
        '<a class="fd-complete-cta" href="https://api.leadconnectorhq.com/widget/bookings/investor-clarity-call-5oVY4" target="_blank" rel="noopener noreferrer">BOOK YOUR STRATEGY SESSION \u2192</a>' +
        '</div>';
    } else {
      completeEl.style.display = 'none';
    }
  }
}

// Hook into dossier generation to mark First Deal step 3
var _origDossierGenerate = typeof dossierGenerate === 'function' ? dossierGenerate : null;
// Instead, we'll hook via the dossier-generate action below

// Delegated event listeners for dynamically generated Warbook + Deadlines + Recon + Dossier + First Deal buttons
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-action');
  if (action === 'warbook-explore') {
    warbookExplore(btn.getAttribute('data-state') || '');
  } else if (action === 'deadlines-filter') {
    deadlinesSetFilter(btn.getAttribute('data-filter') || 'all');
  } else if (action === 'deadlines-remind') {
    deadlinesRemind(btn.getAttribute('data-date') || '', btn.getAttribute('data-state') || '', btn.getAttribute('data-county') || '');
  } else if (action === 'recon-start') {
    var rs = document.getElementById('recon-state');
    var rc = document.getElementById('recon-county');
    var rp = document.getElementById('recon-platform');
    var rt = document.getElementById('recon-type');
    if (rs && rc) reconRender(rs.value, rc.value, rp ? rp.value : 'other', rt ? rt.value : 'lien');
  } else if (action === 'recon-check') {
    reconToggleStep(parseInt(btn.getAttribute('data-step'), 10), btn.getAttribute('data-storage-key') || '');
  } else if (action === 'dossier-generate') {
    dossierGenerate();
  } else if (action === 'dossier-print') {
    window.print();
  } else if (action === 'dossier-copy') {
    dossierCopyText(btn.getAttribute('data-state') || '', btn.getAttribute('data-county') || '');
  } else if (action === 'precall-summary') {
    generatePreCallSummary();
  } else if (action === 'da-lookup') {
    daLookupProperty();
  } else if (action === 'fd-go') {
    var target = btn.getAttribute('data-target') || 'map';
    if (typeof switchTab === 'function') switchTab(target);
  }
});
