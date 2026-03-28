// === PROFILE HELPERS ===
function getProfile() {
  try {
    var raw = localStorage.getItem('aurigen_profile');
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

function saveProfile(updates) {
  try {
    var current = getProfile() || {};
    var keys = Object.keys(updates);
    for (var i = 0; i < keys.length; i++) {
      current[keys[i]] = updates[keys[i]];
    }
    current.lastUpdated = Date.now();
    localStorage.setItem('aurigen_profile', JSON.stringify(current));
    return current;
  } catch(e) { return null; }
}

function profileTopStateCodes() {
  var p = getProfile();
  if (!p || !p.topStates || !p.topStates.length) return null;
  return p.topStates.map(function(s) { return s.code; });
}

function getArchetype() {
  var p = getProfile();
  if (!p || !p.archetype) return null;
  return p.archetype; // e.g. 'yield-maximizer', 'deal-hunter', 'patient-capitalist', 'local-operator', 'portfolio-builder'
}

function getArchetypeKey() {
  var arch = getArchetype();
  if (!arch) return null;
  // Map archetype slug to strategy key
  if (arch.indexOf('yield') >= 0) return 'yield';
  if (arch.indexOf('hunter') >= 0 || arch.indexOf('deal') >= 0) return 'hunter';
  if (arch.indexOf('patient') >= 0) return 'patient';
  if (arch.indexOf('local') >= 0) return 'local';
  if (arch.indexOf('portfolio') >= 0) return 'portfolio';
  return null;
}

// Archetype → tool defaults mapping
var ARCHETYPE_TOOL_CONFIG = {
  yield: { label: 'YIELD MAXIMIZER', daStates: ['FL', 'IA'], vsWeight: 'rate', sageContext: 'Yield Maximizer — prioritizes consistent returns through tax lien certificates, statutory interest rates, online auctions' },
  hunter: { label: 'DEAL HUNTER', daStates: ['TX', 'GA'], vsWeight: 'deed', sageContext: 'Deal Hunter — targets property acquisition through tax deed sales, higher capital, aggressive positioning' },
  patient: { label: 'PATIENT CAPITALIST', daStates: ['IA', 'IN'], vsWeight: 'redemption', sageContext: 'Patient Capitalist — long-view deployment into higher-rate liens with multi-year redemption, conservative risk' },
  local: { label: 'LOCAL OPERATOR', daStates: ['FL', 'AZ'], vsWeight: 'platform', sageContext: 'Local Operator — boots-on-ground investing, county auctions in person, local relationships' },
  portfolio: { label: 'PORTFOLIO BUILDER', daStates: ['FL', 'TX'], vsWeight: 'all', sageContext: 'Portfolio Builder — structured portfolio allocation, diversified across types and geographies' }
};

// === ITEM 3: DNA PROFILE PERSISTENCE ===
// Wrap dnaFinish to save profile
var _origDnaFinishForProfile = typeof dnaFinish === 'function' ? dnaFinish : null;

function dnaSaveToProfile() {
  var arch = dnaGetArchetype();
  var top3 = dnaScoreStates();
  var topStates = top3.map(function(m) {
    return { code: m.code, name: m.name, rate: m.rate, match: m.pct };
  });
  saveProfile({
    archetype: arch.name.toLowerCase().replace(/\s+/g, '-'),
    archetypeLabel: arch.name,
    strategyLabel: arch.strategy,
    topStates: topStates,
    dnaComplete: true
  });
  saveJourneyState({ quiz: true });
  updateJourneyBar();
}

// === ITEM 4: ANALYZER PRE-LOADS DNA ===
function daPreloadFromDna() {
  var profile = getProfile();
  var bannerArea = document.getElementById('da-dna-banner-area');
  if (!bannerArea) return;

  if (profile && profile.topStates && profile.topStates.length >= 2) {
    var codeA = profile.topStates[0].code;
    var codeB = profile.topStates[1].code;
    var selA = document.getElementById('da-select-a');
    var selB = document.getElementById('da-select-b');
    if (selA && selB) {
      selA.value = codeA;
      selB.value = codeB;
      daCalculate();
    }
    bannerArea.innerHTML = '<div class="da-dna-banner">' +
      '<span class="da-dna-banner-icon">\uD83E\uDDEC</span>' +
      '<span class="da-dna-banner-text">Your DNA profile matched you to <strong>' + escapeHtml(profile.topStates[0].name) + '</strong> and <strong>' + escapeHtml(profile.topStates[1].name) + '</strong>. Pre-loaded for you.</span>' +
      '<button class="da-dna-banner-btn" onclick="this.parentElement.remove()">Change States</button>' +
    '</div>';
  } else {
    bannerArea.innerHTML = '<div class="da-dna-banner" style="border-color:var(--border);background:rgba(255,255,255,0.02)">' +
      '<span class="da-dna-banner-icon">\uD83E\uDDEC</span>' +
      '<span class="da-dna-banner-text">Take the DNA quiz to get personalized state matches \u2192</span>' +
      '<button class="da-dna-banner-btn" onclick="switchTab(\'dna\')">Take Quiz</button>' +
    '</div>';
  }
}

function daTrackUsage() {
  var selA = document.getElementById('da-select-a');
  var selB = document.getElementById('da-select-b');
  if (!selA || !selB) return;
  var rA = daCalcState(selA.value);
  var rB = daCalcState(selB.value);
  var winner = (rA && rB && !rA.isDeed && !rB.isDeed) ? (rA.interest >= rB.interest ? rA : rB) : (rA && !rA.isDeed ? rA : rB);
  var bestReturn = null;
  if (winner && !winner.isDeed) {
    bestReturn = {
      state: winner.stateName,
      interest: Math.round(winner.interest),
      total: Math.round(winner.total),
      yield: winner.effectiveYield.toFixed(1) + '%'
    };
  }
  saveProfile({
    analyzerAmount: daAmount,
    analyzerScenario: daScenario,
    analyzerBestReturn: bestReturn,
    analyzerUsed: true
  });
  // Show summary tab
  var summaryBtn = document.getElementById('summary-tab-btn');
  if (summaryBtn) summaryBtn.style.display = '';
}

// === ITEM 5: VERSUS PRE-LOADS DNA ===
function vsPreloadFromDna() {
  var profile = getProfile();
  var selA = document.getElementById('vs-select-a');
  var selB = document.getElementById('vs-select-b');
  if (!selA || !selB) return;
  // localStorage override from Analyzer or map click takes priority
  try {
    if (localStorage.getItem('versus_state_a')) return;
  } catch(e) {}
  // Map click: pre-load State A from lastClickedState
  if (profile && profile.lastClickedState) {
    selA.value = profile.lastClickedState;
    // Clear it so it doesn't persist across sessions
    saveProfile({ lastClickedState: null });
    return;
  }
  // DNA profile: pre-load both from top states
  if (!profile || !profile.topStates || profile.topStates.length < 2) return;
  selA.value = profile.topStates[0].code;
  selB.value = profile.topStates[1].code;
}

function vsShowDnaTags() {
  var profile = getProfile();
  if (!profile || !profile.topStates) return;
  var codes = profile.topStates.map(function(s) { return s.code; });
  ['a', 'b'].forEach(function(side) {
    var sel = document.getElementById('vs-select-' + side);
    var nameEl = document.getElementById('vs-name-' + side);
    if (!sel || !nameEl) return;
    var existing = nameEl.parentElement.querySelector('.dna-profile-tag');
    if (existing) existing.remove();
    if (codes.indexOf(sel.value) >= 0) {
      var tag = document.createElement('div');
      tag.className = 'dna-profile-tag';
      tag.textContent = '\u2713 From your DNA profile';
      nameEl.parentElement.appendChild(tag);
    }
  });
}

function vsTrackUsage() {
  var selA = document.getElementById('vs-select-a');
  var selB = document.getElementById('vs-select-b');
  if (!selA || !selB) return;
  saveProfile({
    statesCompared: [selA.value, selB.value]
  });
}

// === ITEM 6: SAGE READS DNA ARCHETYPE ===
function getSageProfileContext() {
  var profile = getProfile();
  if (!profile || !profile.dnaComplete || !profile.archetypeLabel) return '';
  var stateList = '';
  if (profile.topStates) {
    stateList = profile.topStates.map(function(s) {
      return escapeHtml(s.name) + ' (' + escapeHtml(s.rate) + ')';
    }).join(', ');
  }
  return '\n\nINVESTOR PROFILE CONTEXT:\nThis investor has completed the DNA quiz. Their profile:\n' +
    '- Archetype: ' + escapeHtml(profile.archetypeLabel) + '\n' +
    '- Strategy: ' + escapeHtml(profile.strategyLabel) + '\n' +
    '- Top States: ' + stateList + '\n' +
    'Reference this profile naturally when relevant. Do not announce it immediately.';
}

// === ITEM 7: PULSE READS FROM PROFILE ===
// Override pulseGetDnaStates to read from profile
pulseGetDnaStates = function() {
  var codes = profileTopStateCodes();
  if (codes) return codes;
  // Fallback to live quiz
  if (typeof dnaScoreStates === 'function') {
    try {
      var top = dnaScoreStates();
      if (top && top.length > 0) return top.map(function(m) { return m.code; });
    } catch(e) {}
  }
  return null;
};

// === ITEM 8: AUCTIONS SORTS DNA STATES FIRST ===
var _origRenderAuctions = typeof renderAuctions === 'function' ? renderAuctions : null;
renderAuctions = function() {
  if (_origRenderAuctions) _origRenderAuctions();
  // After render, mark DNA matches
  var codes = profileTopStateCodes();
  if (!codes) return;
  document.querySelectorAll('.auction-card').forEach(function(card) {
    // Check card text for state code match
    var titleEl = card.querySelector('.auction-card-title');
    if (!titleEl) return;
    var text = titleEl.textContent;
    var matched = codes.some(function(c) {
      var state = ALL_STATES.find(function(s) { return (s.abbr || s.c) === c; });
      return state && text.indexOf(state.name) >= 0;
    });
    if (matched) {
      var pills = card.querySelector('.auction-card-pills');
      if (pills && !pills.querySelector('.auction-dna-match')) {
        var tag = document.createElement('span');
        tag.className = 'auction-pill auction-dna-match';
        tag.style.cssText = 'background:rgba(74,222,128,0.12);color:var(--green);border:1px solid rgba(74,222,128,0.15)';
        tag.textContent = '\uD83C\uDFAF Your Match';
        pills.appendChild(tag);
      }
    }
  });
  applyAuctionLock();
};

// === MAP EXPLORATION TRACKING ===
function trackMapExploration(stateCode) {
  var profile = getProfile() || {};
  var viewed = profile.statesViewed || [];
  if (viewed.indexOf(stateCode) === -1) {
    viewed.push(stateCode);
  }
  saveProfile({ statesViewed: viewed });
  saveJourneyState({ mapExplored: true });
  updateJourneyBar();
}

// === ITEM 9: PRE-CALL SUMMARY PAGE ===
function renderSummaryPage() {
  var panel = document.getElementById('tools-panel-summary');
  if (!panel) return;
  var profile = getProfile();

  // Show/hide tab button
  var btn = document.getElementById('summary-tab-btn');
  if (btn) {
    btn.style.display = (profile && (profile.dnaComplete || profile.analyzerUsed)) ? '' : 'none';
  }

  if (!profile || (!profile.dnaComplete && !profile.analyzerUsed)) {
    panel.innerHTML = '<div class="summary-empty">' +
      'Your summary builds as you explore.<br>Start with the DNA quiz to see your investor profile here.' +
      '<br><button class="summary-empty-btn" onclick="switchTab(\'dna\')">Take DNA Quiz \u2192</button>' +
    '</div>';
    return;
  }

  var html = '<div class="summary-container">';
  html += '<div class="summary-header"><div class="summary-eyebrow">Pre-Call Summary</div><div class="summary-title">YOUR INVESTOR BRIEF</div></div>';
  html += '<div class="summary-cards">';

  // Card 1 — Archetype
  html += '<div class="summary-card"><div class="summary-card-head">' +
    '<span class="summary-card-icon">\uD83E\uDDEC</span>' +
    '<span class="summary-card-badge ' + (profile.dnaComplete ? 'teal' : 'muted') + '">' + (profile.dnaComplete ? 'Profile Complete' : 'In Progress') + '</span>' +
    '</div>' +
    '<div class="summary-card-label">Your Archetype</div>' +
    '<div class="summary-card-value">' + escapeHtml(profile.archetypeLabel || '\u2014') + '</div>' +
    '<div class="summary-card-sub">' + escapeHtml(profile.strategyLabel || '') + '</div></div>';

  // Card 2 — Top States
  var stateNames = (profile.topStates || []).map(function(s) { return escapeHtml(s.name); }).join(' \u00b7 ');
  var matchPcts = (profile.topStates || []).map(function(s) { return escapeHtml(s.name) + ' ' + s.match + '%'; }).join(', ');
  html += '<div class="summary-card"><div class="summary-card-head">' +
    '<span class="summary-card-icon">\uD83D\uDDFA\uFE0F</span>' +
    '<span class="summary-card-badge teal">' + (profile.topStates ? profile.topStates.length + ' States' : '0') + '</span>' +
    '</div>' +
    '<div class="summary-card-label">Top Matched States</div>' +
    '<div class="summary-card-value">' + (stateNames || '\u2014') + '</div>' +
    '<div class="summary-card-sub">' + matchPcts + '</div></div>';

  // Card 3 — Best Return
  if (profile.analyzerUsed && profile.analyzerBestReturn) {
    var br = profile.analyzerBestReturn;
    html += '<div class="summary-card"><div class="summary-card-head">' +
      '<span class="summary-card-icon">\uD83D\uDCC8</span>' +
      '<span class="summary-card-badge green">Analyzed</span>' +
      '</div>' +
      '<div class="summary-card-label">Best Return Scenario</div>' +
      '<div class="summary-card-value">$' + (br.interest || 0).toLocaleString() + ' on $' + (profile.analyzerAmount || 0).toLocaleString() + '</div>' +
      '<div class="summary-card-sub">' + escapeHtml(br.state || '') + ' \u00b7 ' + escapeHtml(profile.analyzerScenario || '') + ' \u00b7 ' + escapeHtml(br.yield || '') + '/yr</div>' +
      '<div class="da-inline-disclaimer" style="margin-top:6px;padding-top:4px;font-size:10px">Estimate only \u2014 not a guarantee of returns.</div></div>';
  } else {
    html += '<div class="summary-card" style="opacity:0.5"><div class="summary-card-head">' +
      '<span class="summary-card-icon">\uD83D\uDCC8</span>' +
      '<span class="summary-card-badge muted">Not Yet</span>' +
      '</div>' +
      '<div class="summary-card-label">Best Return Scenario</div>' +
      '<div class="summary-card-value">\u2014</div>' +
      '<div class="summary-card-sub">Run the Deal Analyzer to see projected returns</div></div>';
  }

  // Card 4 — Next Auction
  var nextAuction = null;
  var now = Date.now();
  var codes = profileTopStateCodes();
  if (codes && typeof PULSE_ALERTS !== 'undefined') {
    var candidates = PULSE_ALERTS.filter(function(a) {
      if (a.type !== 'upcoming' || !a.date) return false;
      return a.dnaStates.some(function(s) { return codes.indexOf(s) >= 0; });
    }).sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
    if (candidates.length > 0) {
      var d = new Date(candidates[0].date);
      var days = Math.max(0, Math.ceil((d - now) / 86400000));
      nextAuction = { alert: candidates[0], days: days };
    }
  }
  if (nextAuction) {
    var badgeCls = nextAuction.days < 30 ? 'pink' : 'muted';
    html += '<div class="summary-card"><div class="summary-card-head">' +
      '<span class="summary-card-icon">\uD83D\uDCC5</span>' +
      '<span class="summary-card-badge ' + badgeCls + '">' + nextAuction.days + ' Days</span>' +
      '</div>' +
      '<div class="summary-card-label">Next Auction in Your States</div>' +
      '<div class="summary-card-value">' + escapeHtml(nextAuction.alert.title) + '</div>' +
      '<div class="summary-card-sub">' + nextAuction.days + ' days away \u00b7 ' + escapeHtml(nextAuction.alert.location) + '</div></div>';
  } else {
    html += '<div class="summary-card"><div class="summary-card-head">' +
      '<span class="summary-card-icon">\uD83D\uDCC5</span>' +
      '<span class="summary-card-badge muted">Pending</span>' +
      '</div>' +
      '<div class="summary-card-label">Next Auction</div>' +
      '<div class="summary-card-value">\u2014</div>' +
      '<div class="summary-card-sub">Check the Auctions tab for upcoming dates</div></div>';
  }

  html += '</div>'; // close summary-cards

  // Share block
  html += '<div class="summary-cta">' +
    '<button class="summary-share-btn" onclick="shareSummary()">\uD83D\uDCF8 Share your summary</button>' +
  '</div>';

  html += '</div>'; // close summary-container
  panel.innerHTML = html;
}

function shareSummary() {
  var profile = getProfile();
  if (!profile) return;
  var stateList = (profile.topStates || []).map(function(s) { return s.name + ' (' + s.rate + ')'; }).join(', ');
  var text = 'My Aurigen Investor Profile\n' +
    '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n' +
    'Archetype: ' + (profile.archetypeLabel || 'N/A') + '\n' +
    'Strategy: ' + (profile.strategyLabel || 'N/A') + '\n' +
    'Top States: ' + (stateList || 'N/A') + '\n';
  if (profile.analyzerBestReturn) {
    text += 'Best Return: $' + profile.analyzerBestReturn.interest + ' projected on $' + profile.analyzerAmount + ' \u2014 ' + profile.analyzerBestReturn.state + ', ' + profile.analyzerScenario + '\n';
  }
  text += '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n' +
    'Rates are statutory maximums. Not financial advice.\n' +
    'Built with Aurigen \u00b7 aurigen-directory.netlify.app';
  try {
    navigator.clipboard.writeText(text).then(function() {
      var btn = document.querySelector('.summary-share-btn');
      if (btn) { var orig = btn.innerHTML; btn.textContent = 'Copied!'; setTimeout(function() { btn.innerHTML = orig; }, 2000); }
    });
  } catch(e) {}
}

// === WIRING — Hook into existing functions ===

// Wire: showDetail → track map exploration + render map next step
var _origShowDetail = showDetail;
showDetail = function(s) {
  _origShowDetail(s);
  var code = s.abbr || s.c;
  trackMapExploration(code);
  applyCountyLock();
};

// Wire: DNA finish → save profile
var _origDnaFinishIdx = null;
// Find the function that shows "Profile Complete" and hook into it
// dnaNext handles the finish when idx === DNA_QUESTIONS.length - 1
var _origDnaNext = typeof dnaNext === 'function' ? dnaNext : null;
if (_origDnaNext) {
  var _origDnaNextFn = dnaNext;
  dnaNext = function() {
    var wasDone = document.getElementById('dna-card-completion');
    var wasDoneVisible = wasDone && wasDone.style.display === 'block';
    _origDnaNextFn();
    var isDoneNow = wasDone && wasDone.style.display === 'block';
    if (!wasDoneVisible && isDoneNow) {
      dnaSaveToProfile();
    }
  };
}

// Wire: daCalculate → track usage (debounced)
var _daCalcCount = 0;
var _origDaCalculate = daCalculate;
daCalculate = function() {
  _origDaCalculate();
  _daCalcCount++;
  if (_daCalcCount >= 2) { // Track after at least one user interaction
    daTrackUsage();
  }
};

// Wire: initVersusTab → pre-load DNA states
var _origInitVersus = initVersusTab;
initVersusTab = function() {
  _origInitVersus();
  vsPreloadFromDna();
};

// Wire: runVersusCompare → track + show tags
var _origRunVersus = runVersusCompare;
runVersusCompare = function() {
  _origRunVersus();
  vsShowDnaTags();
  vsTrackUsage();
};

// Wire: Sage → inject DNA context
var _origGetAdvisorResponse = getAdvisorResponse;
getAdvisorResponse = function(text) {
  var response = _origGetAdvisorResponse(text);
  // Add profile-aware responses for specific questions
  var lower = text.toLowerCase();
  var profile = getProfile();
  if (profile && profile.dnaComplete && profile.topStates) {
    if (/which state|best state|where should|recommend/i.test(lower)) {
      var stateList = profile.topStates.map(function(s) { return s.name + ' (' + s.rate + ')'; }).join(', ');
      return 'Based on your DNA profile as a ' + profile.archetypeLabel + ', your top matched states are: ' + stateList + '. ' + response;
    }
  }
  return response;
};

// Wire: Tab switching hooks
var _origSwitchTabPhase3 = switchTab;
switchTab = function(name) {
  _origSwitchTabPhase3(name);
  if (name === 'tools') {
    switchToolsPanel('analyzer');
    setTimeout(function() { daPreloadFromDna(); renderSummaryPage(); }, 100);
  }
};

// === INIT PHASE 3 ===
// Show summary tab if profile exists
(function() {
  var p = getProfile();
  var btn = document.getElementById('summary-tab-btn');
  if (btn && p && (p.dnaComplete || p.analyzerUsed)) {
    btn.style.display = '';
  }
})();

