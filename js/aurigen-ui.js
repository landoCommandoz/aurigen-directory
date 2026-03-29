// === PULSE BELL DRAWER ===
// === SAVED STATES (5A) ===
function getSavedStates() {
  try {
    var raw = localStorage.getItem('aurigen_saved_states');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}
function setSavedStates(arr) {
  try { localStorage.setItem('aurigen_saved_states', JSON.stringify(arr)); } catch(e) {}
}
function toggleSaveState(code) {
  var saved = getSavedStates();
  var idx = saved.indexOf(code);
  if (idx >= 0) { saved.splice(idx, 1); } else { saved.push(code); }
  setSavedStates(saved);
  // Re-render save button
  var btn = document.querySelector('.save-state-btn');
  if (btn) {
    var isSaved = saved.indexOf(code) >= 0;
    btn.className = 'save-state-btn' + (isSaved ? ' saved' : '');
    btn.querySelector('.bookmark-icon').textContent = isSaved ? '\u2605' : '\u2606';
    btn.querySelector('span:last-child').textContent = isSaved ? 'STATE SAVED' : 'SAVE THIS STATE';
  }
  // Update map bookmark icons
  updateMapBookmarks();
  // Update journey bar
  updateJourneyBar();
}
function updateMapBookmarks() {
  if (!svgEl) return;
  var saved = getSavedStates();
  // Remove old bookmark icons
  svgEl.selectAll('.state-bookmark').remove();
  if (saved.length === 0) return;
  svgEl.selectAll('.state-path').each(function(d) {
    var s = getStateData(d);
    if (!s) return;
    var abbr = s.abbr || s.c;
    if (saved.indexOf(abbr) < 0) return;
    var c = pathGen.centroid(d);
    if (!c || isNaN(c[0])) return;
    svgEl.append('text')
      .attr('class', 'state-bookmark')
      .attr('x', c[0] + 8)
      .attr('y', c[1] - 6)
      .attr('font-size', '10px')
      .attr('fill', '#c9a84c')
      .attr('pointer-events', 'none')
      .text('\u2605');
  });
}

var PULSE_ALERTS = [
  {
    id: 'iowa-apr-2026',
    type: 'upcoming',
    icon: '\uD83D\uDCC5',
    title: 'Iowa statewide lien sale \u2014 14 days',
    body: 'Your #2 DNA match has a confirmed statewide auction April 14. Registration deadline April 10. Random selection \u2014 no competitive rate pressure.',
    state: 'IA',
    location: 'IA \u00B7 Statewide \u00B7 County Treasurer',
    action: 'View in Auctions',
    actionTab: 'auctions',
    dnaStates: ['IA'],
    date: '2026-04-14',
    regDeadline: '2026-04-10'
  },
  {
    id: 'louisiana-2026-system',
    type: 'critical',
    icon: '\u26A0\uFE0F',
    title: 'Louisiana: Entirely new system launched Jan 1, 2026',
    body: 'Bid-down interest replaces ownership bid-down. New foreclosure process now in effect. Verify all data before transacting.',
    state: 'LA',
    location: 'LA \u00B7 Statewide \u00B7 All parishes',
    action: 'View Statute',
    actionTab: null,
    dnaStates: [],
    date: '2026-01-01'
  },
  {
    id: 'pinal-otc-2026',
    type: 'match',
    icon: '\uD83C\uDFAF',
    title: 'Pinal County AZ \u2014 OTC liens available now',
    body: 'Matches your DNA profile. Direct purchase, no competitive bidding. 16% statutory rate. Confirmed Feb 2026.',
    state: 'AZ',
    location: 'AZ \u00B7 Pinal County \u00B7 RealAuction OTC',
    action: 'View County',
    actionTab: 'map',
    dnaStates: ['AZ'],
    date: null
  },
  {
    id: 'miami-dade-may-2026',
    type: 'intel',
    icon: '\uD83D\uDCCA',
    title: 'Miami-Dade FL \u2014 May 2026 sale confirmed',
    body: '1,200+ certificates expected. Highly competitive \u2014 bid-down rates averaged 3\u20136% in prime zip codes. Target smaller or inland certificates.',
    state: 'FL',
    location: 'FL \u00B7 Miami-Dade \u00B7 RealAuction',
    action: 'Open Auctions',
    actionTab: 'auctions',
    dnaStates: ['FL'],
    date: '2026-05-12'
  },
  {
    id: 'sedgwick-ks-alert',
    type: 'critical',
    icon: '\u26A0\uFE0F',
    title: 'Sedgwick County KS \u2014 CivicSource sale cancelled',
    body: 'The annual CivicSource sale has been cancelled. County is transitioning platforms. Verify before registering.',
    state: 'KS',
    location: 'KS \u00B7 Sedgwick County',
    action: 'View Alert',
    actionTab: null,
    dnaStates: [],
    date: null
  },
  {
    id: 'montgomery-md-2026',
    type: 'critical',
    icon: '\u26A0\uFE0F',
    title: 'Montgomery County MD \u2014 platform change',
    body: 'Montgomery County has switched auction platforms. Verify current registration process before the May sale.',
    state: 'MD',
    location: 'MD \u00B7 Montgomery County',
    action: 'View Alert',
    actionTab: null,
    dnaStates: [],
    date: null
  }
];

var _pulseOpen = false;
var _pulseFilter = 'all';
var PULSE_FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: '\u26A0 Critical' },
  { key: 'upcoming', label: '\uD83D\uDCC5 Upcoming' },
  { key: 'intel', label: '\uD83D\uDCCA Intel' },
  { key: 'match', label: '\uD83C\uDFAF Matches' }
];

function pulseGetDnaStates() {
  // Try to get DNA top states from the live quiz results
  if (typeof dnaScoreStates === 'function') {
    try {
      var top = dnaScoreStates();
      if (top && top.length > 0) {
        return top.map(function(m) { return m.code; });
      }
    } catch(e) { /* not initialized */ }
  }
  return null;
}

function pulseGetUnreadCount() {
  var lastSeen = null;
  try { lastSeen = localStorage.getItem('pulse_last_seen'); } catch(e) {}
  if (!lastSeen) return PULSE_ALERTS.length;
  // Count alerts created after last seen
  var ts = parseInt(lastSeen, 10);
  var count = 0;
  PULSE_ALERTS.forEach(function(a) {
    if (a.date) {
      var alertTs = new Date(a.date).getTime();
      if (alertTs > ts) count++;
    }
  });
  return count;
}

function pulseUpdateBadge() {
  var badge = document.getElementById('pulse-badge');
  if (!badge) return;
  var count = pulseGetUnreadCount();
  if (count > 0) {
    badge.textContent = count > 9 ? '9+' : String(count);
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function pulseMarkSeen() {
  try { localStorage.setItem('pulse_last_seen', String(Date.now())); } catch(e) {}
  var badge = document.getElementById('pulse-badge');
  if (badge) badge.classList.add('hidden');
}

function togglePulseDrawer() {
  if (_pulseOpen) {
    closePulseDrawer();
  } else {
    openPulseDrawer();
  }
}

function openPulseDrawer() {
  _pulseOpen = true;
  document.getElementById('pulse-overlay').classList.add('open');
  document.getElementById('pulse-drawer').classList.add('open');
  document.getElementById('pulse-bell').classList.add('active');
  // Show Pulse lock for free users
  var pulseLock = document.getElementById('lock-pulse');
  if (pulseLock) pulseLock.style.display = getIsPaid() ? 'none' : 'flex';
  pulseMarkSeen();
  pulseUpdateHeaderCount();
  pulseRenderFilters();
  pulseRenderProfile();
  pulseRenderFeed();
  pulseRenderCta();
  initPulseCreateBtn();
  // Trap focus
  if (typeof trapFocus === 'function') trapFocus(document.getElementById('pulse-drawer'));
}

function closePulseDrawer() {
  _pulseOpen = false;
  document.getElementById('pulse-overlay').classList.remove('open');
  document.getElementById('pulse-drawer').classList.remove('open');
  document.getElementById('pulse-bell').classList.remove('active');
  if (typeof releaseFocusTrap === 'function') releaseFocusTrap();
}

function pulseUpdateHeaderCount() {
  var el = document.getElementById('pulse-new-count');
  if (el) el.textContent = PULSE_ALERTS.length + ' New';
}

function pulseRenderFilters() {
  var cont = document.getElementById('pulse-filters');
  if (!cont) return;
  var html = '';
  PULSE_FILTER_TABS.forEach(function(tab) {
    html += '<button class="pulse-filter-tab' + (tab.key === _pulseFilter ? ' active' : '') + '" onclick="pulseSetFilter(\'' + tab.key + '\')">' + escapeHtml(tab.label) + '</button>';
  });
  cont.innerHTML = html;
}

function pulseSetFilter(key) {
  _pulseFilter = key;
  pulseRenderFilters();
  pulseRenderFeed();
}

function pulseRenderProfile() {
  var el = document.getElementById('pulse-profile');
  if (!el) return;
  var saved = getSavedStates();
  var dnaStates = pulseGetDnaStates();
  // Prefer saved states, fall back to DNA
  var displayStates = saved.length > 0 ? saved : (dnaStates && dnaStates.length > 0 ? dnaStates : null);
  var source = saved.length > 0 ? 'saved' : 'dna';
  if (displayStates && displayStates.length > 0) {
    el.innerHTML = '<span class="pulse-profile-dot"></span>Showing alerts for ' +
      displayStates.map(function(s) { return '<span class="pulse-state-name">' + escapeHtml(s) + '</span>'; }).join(' \u00B7 ') +
      ' \u2014 your ' + (source === 'saved' ? 'saved' : 'DNA matched') + ' states';
  } else {
    el.innerHTML = '<span class="pulse-profile-dot"></span>Showing all alerts \u2014 <a onclick="pulseGoToDna()">take the DNA quiz</a> or save states from the map to personalize';
  }
}

function pulseGoToDna() {
  closePulseDrawer();
  switchTab('dna');
}

function pulseFilteredAlerts() {
  var saved = getSavedStates();
  var dnaStates = pulseGetDnaStates();
  var matchStates = saved.length > 0 ? saved : (dnaStates && dnaStates.length > 0 ? dnaStates : null);
  var alerts = PULSE_ALERTS.slice();

  // If user has saved states, filter to only those states (+ stateless alerts)
  if (saved.length > 0) {
    alerts = alerts.filter(function(a) {
      if (!a.state && (!a.dnaStates || a.dnaStates.length === 0)) return true;
      if (a.state && saved.indexOf(a.state) >= 0) return true;
      if (a.dnaStates && a.dnaStates.some(function(s) { return saved.indexOf(s) >= 0; })) return true;
      return false;
    });
  }

  // Sort matching alerts to top
  if (matchStates && matchStates.length > 0) {
    alerts.sort(function(a, b) {
      var aMatch = a.dnaStates && a.dnaStates.some(function(s) { return matchStates.indexOf(s) >= 0; }) ? 0 : 1;
      var bMatch = b.dnaStates && b.dnaStates.some(function(s) { return matchStates.indexOf(s) >= 0; }) ? 0 : 1;
      return aMatch - bMatch;
    });
  }

  // Apply type filter
  if (_pulseFilter !== 'all') {
    alerts = alerts.filter(function(a) { return a.type === _pulseFilter; });
  }

  return alerts;
}

function pulseRenderFeed() {
  var cont = document.getElementById('pulse-feed');
  if (!cont) return;
  var saved = getSavedStates();

  // First Deal auto-trigger: if fd_pulse_pending, auto-open create alert
  try {
    if (localStorage.getItem('aurigen_fd_pulse_pending') === '1' && getIsPaid()) {
      localStorage.removeItem('aurigen_fd_pulse_pending');
      var lastState = localStorage.getItem('aurigen_last_state') || '';
      if (lastState) {
        var sel = document.getElementById('pulse-alert-state');
        if (sel) sel.value = lastState;
      }
      setTimeout(function() { if (typeof toggleCreateAlert === 'function') toggleCreateAlert(); }, 300);
    }
  } catch(e) {}

  // DNA state suggestion card when no saved states but archetype exists
  var archKey = typeof getArchetypeKey === 'function' ? getArchetypeKey() : null;
  var archCfg = archKey && typeof ARCHETYPE_TOOL_CONFIG !== 'undefined' ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  if (saved.length === 0 && archCfg) {
    // Archetype-specific state suggestions
    var DNA_PULSE_STATES = {
      yield: ['AZ', 'FL', 'IA'], hunter: ['TX', 'GA', 'OH'],
      patient: ['IA', 'NE', 'IN'], local: ['FL', 'AZ', 'IL'], portfolio: ['FL', 'TX', 'IA']
    };
    var suggestCodes = DNA_PULSE_STATES[archKey] || [];
    if (suggestCodes.length > 0) {
      var suggestNames = suggestCodes.map(function(c) {
        var st = window.STATES_V2 ? window.STATES_V2.find(function(s) { return s.code === c; }) : null;
        return st ? st.name : c;
      });
      var suggestDismissed = false;
      try { suggestDismissed = localStorage.getItem('aurigen_pulse_dna_dismissed') === '1'; } catch(e) {}
      if (!suggestDismissed) {
        var oldSuggest = document.getElementById('pulse-dna-suggest');
        if (oldSuggest) oldSuggest.remove();
        var suggestDiv = document.createElement('div');
        suggestDiv.id = 'pulse-dna-suggest';
        suggestDiv.className = 'pulse-dna-suggest';
        suggestDiv.innerHTML = '<div class="pulse-dna-suggest-text">Based on your <strong>' + escapeHtml(archCfg.label) + '</strong> profile, investors like you track <strong>' + suggestNames.join(', ') + '</strong>. Save them?</div>' +
          '<div class="pulse-dna-suggest-actions">' +
            '<button class="pulse-dna-suggest-yes" data-action="pulse-dna-yes" data-codes="' + escapeHtml(suggestCodes.join(',')) + '">YES \u2014 Save These</button>' +
            '<button class="pulse-dna-suggest-skip" data-action="pulse-dna-skip">SKIP</button>' +
          '</div>';
        cont.parentNode.insertBefore(suggestDiv, cont);
      }
    }
  }

  // Onboarding prompt if no saved states and no DNA
  if (saved.length === 0 && !pulseGetDnaStates()) {
    cont.innerHTML = '<div class="pulse-onboard">' +
      '<span class="pulse-onboard-icon">\uD83D\uDD14</span>' +
      'Save states from the map to personalize your Pulse feed.<br>' +
      '<a onclick="pulseAction(\'map\')">Open Map \u2192</a>' +
    '</div>';
    applyPulseLock();
    return;
  }
  var alerts = pulseFilteredAlerts();
  if (alerts.length === 0) {
    if (saved.length > 0 && _pulseFilter === 'all') {
      cont.innerHTML = '<div class="pulse-empty-week">No alerts for your saved states this week. Check back after Sunday\'s update.</div>';
    } else {
      cont.innerHTML = '<div class="pulse-empty">No alerts match this filter.</div>';
    }
    applyPulseLock();
    return;
  }
  var html = '';
  alerts.forEach(function(a, i) {
    var typeLabel = (a.type || 'general').toUpperCase().replace('_', ' ');
    html += '<div class="pulse-alert type-' + escapeHtml(a.type) + '" style="animation:fadeUp 200ms ease-out ' + (i * 50) + 'ms both">' +
      '<div class="pulse-alert-head">' +
        '<span class="pulse-alert-icon">' + a.icon + '</span>' +
        '<span class="pulse-alert-title">' + (a.state ? escapeHtml(a.state) + ' \u2014 ' : '') + escapeHtml(a.title) + '</span>' +
        '<span class="pulse-alert-badge ' + escapeHtml(a.type) + '">' + escapeHtml(typeLabel) + '</span>' +
      '</div>' +
      '<div class="pulse-alert-body">' + escapeHtml(a.body) + '</div>' +
      '<div class="pulse-alert-footer">' +
        '<span class="pulse-alert-location">' + escapeHtml(a.location) + '</span>' +
        (a.date ? '<span class="pulse-alert-location" style="margin-left:8px">' + escapeHtml(a.date) + '</span>' : '') +
        (a.actionTab ? '<button class="pulse-alert-action" onclick="pulseAction(\'' + escapeHtml(a.actionTab) + '\')">' + escapeHtml(a.action) + '</button>' : '<span class="pulse-alert-action" style="opacity:0.5">' + escapeHtml(a.action) + '</span>') +
      '</div>' +
    '</div>';
  });
  cont.innerHTML = html;
  applyPulseLock();
}

function pulseAction(tab) {
  closePulseDrawer();
  switchTab(tab);
}

function pulseRenderCta() {
  var cont = document.getElementById('pulse-cta');
  if (!cont) return;
  var dnaStates = pulseGetDnaStates();
  var upcoming = null;
  var now = Date.now();
  // Find earliest upcoming auction in DNA matched states
  if (dnaStates && dnaStates.length > 0) {
    var candidates = PULSE_ALERTS.filter(function(a) {
      if (a.type !== 'upcoming' || !a.date) return false;
      return a.dnaStates.some(function(s) { return dnaStates.indexOf(s) >= 0; });
    }).sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    if (candidates.length > 0) {
      var d = new Date(candidates[0].date);
      var diff = Math.max(0, Math.ceil((d - now) / 86400000));
      upcoming = { alert: candidates[0], days: diff };
    }
  }

  if (upcoming) {
    cont.innerHTML =
      '<div class="pulse-cta-headline">' + escapeHtml(upcoming.alert.state) + ' auction in ' + upcoming.days + ' days</div>' +
      '<div class="pulse-cta-sub">Registration closes ' + escapeHtml(upcoming.alert.regDeadline || 'soon') + '. Open the Auctions tab to register.</div>' +
      '<button class="pulse-cta-btn" onclick="switchTab(\'auctions\')">View Auctions \u2192</button>';
  } else {
    cont.innerHTML =
      '<div class="pulse-cta-headline">Keep researching</div>' +
      '<div class="pulse-cta-sub">Use the tools above to compare states, run your numbers, and build your due diligence checklist.</div>';
  }
}

// === CREATE ALERT (paid users) ===
function initPulseCreateBtn() {
  var btn = document.getElementById('pulse-create-btn');
  if (btn && getIsPaid()) btn.style.display = 'inline-flex';
  // Populate state dropdown
  var sel = document.getElementById('pulse-alert-state');
  if (sel && window.STATES_V2) {
    var states = window.STATES_V2.slice().sort(function(a, b) { return a.name.localeCompare(b.name); });
    states.forEach(function(s) {
      sel.innerHTML += '<option value="' + escapeHtml(s.code) + '">' + escapeHtml(s.name) + '</option>';
    });
  }
}
function toggleCreateAlert() {
  var panel = document.getElementById('pulse-create-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}
function submitCreateAlert() {
  var stateCode = (document.getElementById('pulse-alert-state') || {}).value || '';
  var alertType = (document.getElementById('pulse-alert-type') || {}).value || 'general';
  var alertText = (document.getElementById('pulse-alert-text') || {}).value || '';
  var alertDate = (document.getElementById('pulse-alert-date') || {}).value || '';
  if (!stateCode || !alertText.trim()) return;
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  fetch('/.netlify/functions/create-alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
    body: JSON.stringify({ state_code: stateCode, alert_type: alertType, alert_text: alertText.trim(), alert_date: alertDate || undefined })
  })
  .then(function(r) { return r.ok ? r.json() : null; })
  .then(function(data) {
    if (data && data.created) {
      var panel = document.getElementById('pulse-create-panel');
      if (panel) panel.style.display = 'none';
      // Clear form
      var textInput = document.getElementById('pulse-alert-text');
      if (textInput) textInput.value = '';
      // Reload alerts
      if (typeof pulseLoadAlerts === 'function') pulseLoadAlerts();
    }
  })
  .catch(function() {});
}
function deleteOwnAlert(alertId) {
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  fetch('/.netlify/functions/create-alert', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
    body: JSON.stringify({ alert_id: alertId })
  })
  .then(function(r) { return r.ok ? r.json() : null; })
  .then(function(data) {
    if (data && data.deleted && typeof pulseLoadAlerts === 'function') pulseLoadAlerts();
  })
  .catch(function() {});
}

// Pulse DNA suggestion actions
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-action');
  if (action === 'pulse-dna-yes') {
    var codes = (btn.getAttribute('data-codes') || '').split(',').filter(Boolean);
    codes.forEach(function(c) { toggleSaveState(c); });
    var suggest = document.getElementById('pulse-dna-suggest');
    if (suggest) suggest.remove();
    try { localStorage.setItem('aurigen_pulse_dna_dismissed', '1'); } catch(e2) {}
    // Mark First Deal step 5 complete
    try { localStorage.setItem('aurigen_fd_pulse', '1'); } catch(e2) {}
    pulseRenderFeed();
  } else if (action === 'pulse-dna-skip') {
    var suggest2 = document.getElementById('pulse-dna-suggest');
    if (suggest2) suggest2.remove();
    try { localStorage.setItem('aurigen_pulse_dna_dismissed', '1'); } catch(e2) {}
  }
});

// Keyboard: Escape closes drawer
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && _pulseOpen) closePulseDrawer();
});

// === MOBILE DISCLAIMER TOGGLE ===
function toggleDisclaimer() {
  var panel = document.getElementById('disclaimer-panel');
  var toggle = document.getElementById('disclaimer-toggle');
  if (!panel || !toggle) return;
  var isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    toggle.innerHTML = 'Legal &uarr;';
  } else {
    panel.classList.add('open');
    toggle.innerHTML = 'Legal &darr;';
  }
}

// === MOBILE HAMBURGER NAV ===
var _mobileNavOpen = false;
var MOBILE_NAV_LABELS = {
  map: 'Map', tools: 'Tools', dna: 'DNA', advisor: 'Advisor',
  auctions: 'Auctions', versus: 'Versus', account: 'Account',
  warbook: 'Warbook', deadlines: 'Deadlines', recon: 'Recon', dossier: 'Dossier'
};

function toggleMobileNav() {
  if (_mobileNavOpen) closeMobileNav();
  else openMobileNav();
}

function openMobileNav() {
  _mobileNavOpen = true;
  document.getElementById('mobile-nav-overlay').classList.add('open');
  document.getElementById('mobile-nav-drawer').classList.add('open');
  document.getElementById('hamburger-btn').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  _mobileNavOpen = false;
  document.getElementById('mobile-nav-overlay').classList.remove('open');
  document.getElementById('mobile-nav-drawer').classList.remove('open');
  document.getElementById('hamburger-btn').classList.remove('active');
  document.body.style.overflow = '';
}

function mobileNavTo(tab) {
  closeMobileNav();
  switchTab(tab);
}

function updateMobileNavState(tab) {
  var label = document.getElementById('nav-active-label');
  if (label) label.textContent = MOBILE_NAV_LABELS[tab] || tab;
  document.querySelectorAll('.mobile-nav-item').forEach(function(item) {
    item.classList.toggle('active', item.getAttribute('data-tab') === tab);
  });
}

// Wrap switchTab to update mobile nav state
var _origSwitchTabMobile = switchTab;
switchTab = function(name) {
  _origSwitchTabMobile(name);
  updateMobileNavState(name);
};

// Escape key closes mobile nav
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && _mobileNavOpen) closeMobileNav();
});

// Init badge on load
pulseUpdateBadge();

// === JOURNEY BAR (5C) ===
function getJourneyState() {
  try {
    var raw = localStorage.getItem('aurigen_journey');
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}
function saveJourneyState(updates) {
  try {
    var current = getJourneyState();
    var keys = Object.keys(updates);
    for (var i = 0; i < keys.length; i++) { current[keys[i]] = updates[keys[i]]; }
    localStorage.setItem('aurigen_journey', JSON.stringify(current));
  } catch(e) {}
}
function updateJourneyBar() {
  var j = getJourneyState();
  var profile = typeof getProfile === 'function' ? getProfile() : null;
  // Compute milestones
  var mapDone = !!(j.mapExplored || (profile && profile.statesViewed && profile.statesViewed.length > 0));
  var countyDone = !!j.countyOpened;
  var pulseDone = getSavedStates().length > 0;
  var quizDone = !!(profile && profile.dnaComplete);
  var accessDone = (typeof getIsPaid !== 'undefined' && getIsPaid()) || (typeof APP !== 'undefined' && APP.tier >= 2);

  var dots = [
    { id: 'jb-dot-map', done: mapDone },
    { id: 'jb-dot-county', done: countyDone },
    { id: 'jb-dot-pulse', done: pulseDone },
    { id: 'jb-dot-quiz', done: quizDone },
    { id: 'jb-dot-access', done: accessDone }
  ];
  var lines = ['jb-line-1', 'jb-line-2', 'jb-line-3', 'jb-line-4'];
  dots.forEach(function(d) {
    var el = document.getElementById(d.id);
    if (el) el.classList.toggle('complete', d.done);
  });
  // Line is complete if both adjacent dots are complete
  for (var i = 0; i < lines.length; i++) {
    var el = document.getElementById(lines[i]);
    if (el) el.classList.toggle('complete', dots[i].done && dots[i + 1].done);
  }

  // Next Step Card
  var nextCard = document.getElementById('journey-next-card');
  var nextText = document.getElementById('journey-next-text');
  var nextClose = document.getElementById('journey-next-close');
  if (!nextCard || !nextText) return;

  var dismissed = {};
  try { dismissed = JSON.parse(localStorage.getItem('aurigen_journey_dismissed') || '{}'); } catch(e) {}

  var nextStep = null;
  var nextAction = null;
  if (!mapDone && !dismissed.map) {
    nextStep = 'Explore the map \u2014 click any state to begin \u2192';
    nextAction = function() { switchTab('map'); };
  } else if (mapDone && !countyDone && !dismissed.county) {
    nextStep = 'Now find a county. Click any state to explore counties \u2192';
    nextAction = function() { switchTab('map'); };
  } else if (countyDone && !pulseDone && !dismissed.pulse) {
    nextStep = 'Set up Pulse Alerts for this state to track upcoming auctions \u2192';
    nextAction = function() { if (typeof togglePulseDrawer === 'function') togglePulseDrawer(); };
  } else if (pulseDone && !quizDone && !dismissed.quiz) {
    nextStep = 'Take the DNA Quiz to personalize your strategy \u2192';
    nextAction = function() { switchTab('dna'); };
  } else if (quizDone && !accessDone && !dismissed.access) {
    nextStep = 'Explore full access \u2014 see live inventory for all 51 states \u2192';
    nextAction = function() { window.open(STRIPE_URL, '_blank', 'noopener,noreferrer'); };
  } else if (accessDone && !dismissed.warbook) {
    nextStep = 'Start with the Warbook to find your best target state \u2192';
    nextAction = function() { switchTab('warbook'); };
  }

  if (nextStep) {
    nextText.textContent = nextStep;
    nextCard.classList.add('visible');
    nextText.onclick = nextAction;
    nextClose.onclick = function() {
      nextCard.classList.remove('visible');
      var key = !mapDone ? 'map' : (!countyDone ? 'county' : (!pulseDone ? 'pulse' : (!quizDone ? 'quiz' : (!accessDone ? 'access' : 'warbook'))));
      try { dismissed[key] = true; localStorage.setItem('aurigen_journey_dismissed', JSON.stringify(dismissed)); } catch(e) {}
    };
  } else {
    nextCard.classList.remove('visible');
  }
}

// Hook into map exploration to update journey
var _origTrackMapExploration = typeof trackMapExploration === 'function' ? trackMapExploration : null;

// Hook into county open to update journey
var _origLoadPropertyFeed = typeof loadPropertyFeed === 'function' ? loadPropertyFeed : null;

