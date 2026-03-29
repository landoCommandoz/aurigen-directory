// === WARBOOK ===
var _warbookLoaded = false;
var _warbookData = null;

function warbookGetStars(count) {
  if (count <= 5) return 1;
  if (count <= 15) return 2;
  if (count <= 30) return 3;
  if (count <= 60) return 4;
  return 5;
}

function warbookGetCompLabel(stars) {
  var labels = ['', 'Low', 'Low-Moderate', 'Moderate', 'High', 'Institutional'];
  return labels[stars] || '';
}

function warbookRenderStars(n) {
  var out = '';
  for (var i = 0; i < 5; i++) {
    out += i < n ? '<span class="warbook-stars">&#9733;</span>' : '<span class="warbook-stars warbook-stars-dim">&#9734;</span>';
  }
  return out;
}

function initWarbook() {
  if (_warbookLoaded || !getIsPaid()) return;
  _warbookLoaded = true;
  var loading = document.getElementById('warbook-loading');
  var content = document.getElementById('warbook-content');
  if (loading) loading.style.display = 'block';

  var localAccess = '';
  try { localAccess = localStorage.getItem('aurigen_access') || ''; } catch(e) {}
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  if (!jwt && localAccess !== 'paid') {
    if (loading) loading.style.display = 'none';
    if (content) content.innerHTML = '<div class="warbook-empty">Sign in to view competition data.</div>';
    return;
  }

  fetch('/.netlify/functions/auctions?type=warbook', {
    headers: jwt ? { 'Authorization': 'Bearer ' + jwt } : {}
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (loading) loading.style.display = 'none';
      if (!data.states || data.states.length === 0) {
        if (content) content.innerHTML = '<div class="warbook-empty">No competition data available yet.</div>';
        return;
      }
      _warbookData = data.states;
      warbookRender(data.states);
    })
    .catch(function() {
      if (loading) loading.style.display = 'none';
      if (content) content.innerHTML = '<div class="warbook-empty">Could not load competition data.</div>';
    });
}

function warbookRender(states) {
  var content = document.getElementById('warbook-content');
  if (!content) return;

  var archKey = getArchetypeKey();
  var archCfg = archKey ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  var archStates = archCfg ? archCfg.daStates : [];

  var html = '<table class="warbook-table"><thead><tr>';
  html += '<th>State</th><th><span class="warbook-tip-wrap">Competition <span class="warbook-tip-icon" tabindex="0">?</span><span class="warbook-tip-card">Rating based on auction volume per state. Higher volume = more bidders. 1 star = low, 5 stars = high. Does not directly measure institutional buyer participation. Not a guarantee of returns.</span></span></th><th>Auctions</th><th>Avg Bid</th><th>Avg Equity</th><th>Top County</th><th></th>';
  html += '</tr></thead><tbody>';

  states.forEach(function(s) {
    var stars = warbookGetStars(s.auction_count);
    var compLabel = warbookGetCompLabel(stars);
    var isArch = archStates.indexOf(s.state_code) >= 0;
    var bid = s.avg_opening_bid != null ? '$' + s.avg_opening_bid.toLocaleString() : '&mdash;';
    var eqCls = s.avg_equity_cushion != null ? (s.avg_equity_cushion >= 0 ? 'positive' : 'negative') : '';
    var eq = s.avg_equity_cushion != null ? (s.avg_equity_cushion >= 0 ? '+' : '') + s.avg_equity_cushion + '%' : '&mdash;';
    var county = s.top_county ? escapeHtml(s.top_county) : '&mdash;';

    html += '<tr>';
    html += '<td><span class="warbook-state-code">' + escapeHtml(s.state_code) + '</span>';
    if (isArch) html += ' <span style="font-size:9px;color:var(--teal)">DNA</span>';
    html += '</td>';
    html += '<td>' + warbookRenderStars(stars) + ' <span style="font-size:10px;color:var(--text2)">' + compLabel + '</span></td>';
    html += '<td>' + s.auction_count + '</td>';
    html += '<td class="warbook-bid">' + bid + '</td>';
    html += '<td class="warbook-equity ' + eqCls + '">' + eq + '</td>';
    html += '<td class="warbook-county">' + county + '</td>';
    html += '<td><button class="warbook-explore" data-action="warbook-explore" data-state="' + escapeHtml(s.state_code) + '">EXPLORE</button></td>';
    html += '</tr>';
  });

  html += '</tbody></table>';
  content.innerHTML = html;
}

function warbookExplore(stateCode) {
  switchTab('map');
  var st = (typeof STATES_EN !== 'undefined' ? STATES_EN : []).find(function(s) { return s.id === stateCode; });
  if (st && typeof openStateDetail === 'function') {
    setTimeout(function() { openStateDetail(st); }, 200);
  }
}

// === DEADLINES ===
var _deadlinesLoaded = false;
var _deadlinesData = null;
var _deadlinesFilter = 'all';

function initDeadlines() {
  if (_deadlinesLoaded || !getIsPaid()) return;
  _deadlinesLoaded = true;
  var loading = document.getElementById('deadlines-loading');
  var grid = document.getElementById('deadlines-grid');
  var empty = document.getElementById('deadlines-empty');
  if (loading) loading.style.display = 'block';
  if (grid) grid.innerHTML = '';
  if (empty) empty.style.display = 'none';

  var savedStates = getSavedStates();

  // Default filter to DNA states if archetype exists
  var dnaCodes = typeof profileTopStateCodes === 'function' ? profileTopStateCodes() : null;
  if (dnaCodes && dnaCodes.length > 0 && _deadlinesFilter === 'all') {
    _deadlinesFilter = 'dna';
  }

  fetch('/.netlify/functions/auctions')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (loading) loading.style.display = 'none';
      var auctions = data.auctions || [];
      // Filter to future auctions only
      var now = new Date();
      now.setHours(0,0,0,0);
      _deadlinesData = auctions.filter(function(a) {
        return a.auction_date && new Date(a.auction_date) >= now;
      }).sort(function(a, b) {
        return new Date(a.auction_date) - new Date(b.auction_date);
      });
      deadlinesBuildFilters(savedStates);
      deadlinesRender();
    })
    .catch(function() {
      if (loading) loading.style.display = 'none';
      if (empty) { empty.style.display = 'block'; empty.textContent = 'Could not load deadline data.'; }
    });
}

function deadlinesBuildFilters(savedStates) {
  var container = document.getElementById('deadlines-filter');
  if (!container || !_deadlinesData) return;

  // DNA top states
  var dnaCodes = typeof profileTopStateCodes === 'function' ? profileTopStateCodes() : null;

  // Collect unique state codes from data
  var codes = {};
  _deadlinesData.forEach(function(a) { if (a.state_code) codes[a.state_code] = true; });
  var codeList = Object.keys(codes).sort();

  var html = '<span class="deadlines-filter-label">FILTER:</span>';
  html += '<button class="deadlines-filter-btn' + (_deadlinesFilter === 'all' ? ' active' : '') + '" data-action="deadlines-filter" data-filter="all">All</button>';

  if (dnaCodes && dnaCodes.length > 0) {
    html += '<button class="deadlines-filter-btn' + (_deadlinesFilter === 'dna' ? ' active' : '') + '" data-action="deadlines-filter" data-filter="dna">DNA States</button>';
  }

  if (savedStates.length > 0) {
    html += '<button class="deadlines-filter-btn' + (_deadlinesFilter === 'saved' ? ' active' : '') + '" data-action="deadlines-filter" data-filter="saved">Saved States</button>';
  }

  codeList.forEach(function(c) {
    html += '<button class="deadlines-filter-btn' + (_deadlinesFilter === c ? ' active' : '') + '" data-action="deadlines-filter" data-filter="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
  });

  container.innerHTML = html;
}

function deadlinesSetFilter(val) {
  _deadlinesFilter = val;
  deadlinesBuildFilters(getSavedStates());
  deadlinesRender();
}

function deadlinesRender() {
  var grid = document.getElementById('deadlines-grid');
  var empty = document.getElementById('deadlines-empty');
  if (!grid || !_deadlinesData) return;

  var saved = getSavedStates();
  var filtered = _deadlinesData;

  if (_deadlinesFilter === 'dna') {
    var dnaCodes = typeof profileTopStateCodes === 'function' ? profileTopStateCodes() : [];
    filtered = filtered.filter(function(a) { return dnaCodes && dnaCodes.indexOf(a.state_code) >= 0; });
  } else if (_deadlinesFilter === 'saved') {
    filtered = filtered.filter(function(a) { return saved.indexOf(a.state_code) >= 0; });
  } else if (_deadlinesFilter !== 'all') {
    filtered = filtered.filter(function(a) { return a.state_code === _deadlinesFilter; });
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  var now = new Date();
  now.setHours(0,0,0,0);

  var html = '';
  filtered.forEach(function(a) {
    var aDate = new Date(a.auction_date);
    var diff = Math.ceil((aDate - now) / (1000 * 60 * 60 * 24));
    var urgency = diff <= 7 ? 'urgent' : (diff <= 30 ? 'soon' : '');
    var daysCls = diff <= 7 ? 'urgent' : (diff <= 30 ? 'soon' : 'muted');
    var dateStr = aDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var county = a.county ? escapeHtml(a.county) : '';
    var stCode = a.state_code ? escapeHtml(a.state_code) : '';
    var aType = a.auction_type || a.type || '';
    var isSaved = saved.indexOf(a.state_code) >= 0;

    html += '<div class="deadline-card ' + urgency + '">';
    html += '<div class="deadline-card-top">';
    html += '<div><span class="deadline-card-state">' + stCode + '</span>';
    if (county) html += '<span class="deadline-card-county">' + county + '</span>';
    if (isSaved) html += ' <span style="font-size:9px;color:var(--teal)">&#9733; SAVED</span>';
    html += '</div>';
    html += '<div style="text-align:right"><div class="deadline-card-days ' + daysCls + '">' + diff + '</div><div class="deadline-card-days-label">DAYS LEFT</div></div>';
    html += '</div>';
    html += '<div class="deadline-card-date">' + dateStr + '</div>';
    if (aType) html += '<div class="deadline-card-type">' + escapeHtml(aType) + '</div>';
    html += '<div class="deadline-card-actions">';
    html += '<button class="deadline-remind-btn" data-action="deadlines-remind" data-date="' + escapeHtml(a.auction_date) + '" data-state="' + stCode + '" data-county="' + escapeHtml(a.county || '') + '">SET REMINDER</button>';
    html += '</div>';
    html += '</div>';
  });

  grid.innerHTML = html;
}

function deadlinesRemind(dateStr, state, county) {
  var d = new Date(dateStr);
  var title = 'Auction: ' + state + (county ? ' - ' + county : '');
  var startStr = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  var end = new Date(d.getTime() + 3600000);
  var endStr = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Try Google Calendar link (most compatible cross-platform)
  var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + startStr + '/' + endStr + '&details=' + encodeURIComponent('Tax auction reminder from Aurigen Directory. Verify details with the official county authority.');
  window.open(gcalUrl, '_blank', 'noopener,noreferrer');
}

// === RECON ===
var _reconInited = false;

function initRecon() {
  if (_reconInited || !getIsPaid()) return;
  _reconInited = true;
  var sel = document.getElementById('recon-state');
  if (!sel) return;
  var states = typeof STATES_EN !== 'undefined' ? STATES_EN : [];
  states.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.id + ' \u2014 ' + s.name;
    sel.appendChild(opt);
  });
  // Pre-select from DNA if available
  var archKey = getArchetypeKey();
  var archCfg = archKey ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  if (archCfg && archCfg.daStates && archCfg.daStates[0]) sel.value = archCfg.daStates[0];
  // Auto-set auction type from state
  sel.addEventListener('change', function() {
    var rules = SCOUT_STATE_RULES[sel.value];
    if (rules) {
      var typeSel = document.getElementById('recon-type');
      if (typeSel) typeSel.value = rules.type;
    }
  });
  sel.dispatchEvent(new Event('change'));
}

function reconBuildSteps(stateCode, county, platform, auctionType) {
  var steps = [];
  var plat = platform || 'other';
  var isLien = auctionType === 'lien';

  // Platform-specific registration
  if (plat === 'realauction') {
    steps.push({ title: 'Create account on RealAuction', desc: 'Register at realtaxdeed.com or realauction.com. Approval is usually instant.' });
  } else if (plat === 'govease') {
    steps.push({ title: 'Register on GovEase', desc: 'Register at govease.com \u2014 approval may take up to 48 hours. Start early.' });
  } else if (plat === 'sri') {
    steps.push({ title: 'Contact county for SRI auction details', desc: 'SRI auctions vary by jurisdiction. Contact the county tax collector for registration instructions.' });
  } else if (plat === 'bid4assets') {
    steps.push({ title: 'Register on Bid4Assets', desc: 'Create your account at bid4assets.com. Verify the deposit requirement on the auction page.' });
  } else {
    steps.push({ title: 'Register for the auction', desc: 'Contact the county tax collector or visit the auction platform to register.' });
  }

  steps.push({ title: 'Verify registration deadline', desc: 'Confirm the exact registration deadline with the county. Missing it means waiting for the next cycle.' });
  steps.push({ title: 'Confirm deposit requirements', desc: 'Check the required deposit amount, accepted payment methods, and submission deadline.' });
  steps.push({ title: 'Research the property', desc: 'Look up the parcel on the county assessor site. Review tax history, liens, and property condition. Drive by if local.' });

  if (isLien) {
    steps.push({ title: 'Check for IRS federal tax liens', desc: 'IRS liens survive tax lien sales in most states. Search the federal lien index before bidding.' });
  } else {
    steps.push({ title: 'Assess quiet title requirement', desc: 'Determine if this state requires a quiet title action after deed acquisition. Budget for attorney fees if so (costs vary \u2014 verify locally).' });
  }

  steps.push({ title: 'Set your maximum bid', desc: 'Calculate your maximum bid before auction day. Include all costs: deposit, recording fees, title search, potential quiet title. Never bid emotionally.' });
  steps.push({ title: 'Attend or log in to auction', desc: 'Be ready 15 minutes early. Have your bidder number, deposit confirmation, and ID accessible.' });
  steps.push({ title: 'If won: confirm payment deadline', desc: 'Verify the exact payment deadline and accepted methods. Late payment forfeits your deposit.' });
  steps.push({ title: 'Record the certificate or deed', desc: 'File with the county recorder\u2019s office. Keep certified copies. This is your proof of ownership or lien position.' });

  if (isLien) {
    steps.push({ title: 'Monitor for redemption notices', desc: 'Track whether the owner redeems the lien. Set calendar reminders for the redemption period expiration date.' });
  } else {
    steps.push({ title: 'Secure the property', desc: 'Change locks, check insurance, inspect for occupants. Consult a real estate attorney before taking physical possession.' });
  }

  steps.push({ title: 'Set calendar reminder for next deadline', desc: 'Whether redemption expiration or next payment due, set a reminder now so you never miss a critical date.' });

  return steps;
}

function reconRender(stateCode, county, platform, auctionType) {
  var container = document.getElementById('recon-steps');
  if (!container) return;
  var steps = reconBuildSteps(stateCode, county, platform, auctionType);
  var storageKey = 'aurigen_recon_' + stateCode + '_' + (county || '').replace(/\s+/g, '_');
  var checked = {};
  try {
    var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object') checked = saved;
  } catch(e) {}

  var html = '';
  steps.forEach(function(step, i) {
    var num = i + 1;
    var isDone = !!checked[num];
    html += '<div class="recon-step' + (isDone ? ' checked' : '') + '" data-step="' + num + '" data-storage-key="' + escapeHtml(storageKey) + '">';
    html += '<div class="recon-step-check" data-action="recon-check" data-step="' + num + '" data-storage-key="' + escapeHtml(storageKey) + '">' + (isDone ? '\u2713' : '') + '</div>';
    html += '<div class="recon-step-body">';
    html += '<div class="recon-step-num">STEP ' + num + '</div>';
    html += '<div class="recon-step-title">' + escapeHtml(step.title) + '</div>';
    html += '<div class="recon-step-desc">' + escapeHtml(step.desc) + '</div>';
    html += '</div></div>';
  });
  container.innerHTML = html;
}

function reconToggleStep(stepNum, storageKey) {
  var checked = {};
  try {
    var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object') checked = saved;
  } catch(e) {}
  if (checked[stepNum]) { delete checked[stepNum]; }
  else { checked[stepNum] = true; }
  try { localStorage.setItem(storageKey, JSON.stringify(checked)); } catch(e) {}
  // Re-render UI
  var stepEl = document.querySelector('.recon-step[data-step="' + stepNum + '"]');
  if (stepEl) {
    var checkEl = stepEl.querySelector('.recon-step-check');
    if (checked[stepNum]) {
      stepEl.classList.add('checked');
      if (checkEl) checkEl.textContent = '\u2713';
    } else {
      stepEl.classList.remove('checked');
      if (checkEl) checkEl.textContent = '';
    }
  }
}

