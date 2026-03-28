// === ARCHETYPE SCORING ===
var DNA_ARCHETYPES = {
  yield: {name:'Yield Maximizer', desc:'You prioritize consistent returns through tax lien certificates. Online auctions and statutory interest rates are your primary tools. Mid-range capital deployed across multiple jurisdictions for diversified yield.', strategy:'Tax Lien \u00b7 Online \u00b7 Returns Focus'},
  hunter: {name:'Deal Hunter', desc:'You target property acquisition through tax deed sales. Higher capital, tolerance for travel, and aggressive positioning at auctions define your approach. You want the asset, not just the interest.', strategy:'Tax Deed \u00b7 Property Acquisition'},
  patient: {name:'Patient Capitalist', desc:'You take the long view \u2014 deploying capital into higher-rate liens with multi-year redemption periods. Conservative risk management with an emphasis on capital preservation and compounding statutory returns.', strategy:'Long Hold \u00b7 Conservative \u00b7 High Rate'},
  local: {name:'Local Operator', desc:'You prefer boots-on-the-ground investing \u2014 attending county auctions in person, building relationships with local officials, and developing deep expertise in specific jurisdictions.', strategy:'In-Person \u00b7 County Specific'},
  portfolio: {name:'Portfolio Builder', desc:'You approach tax investing as a structured portfolio allocation. High capital, diversified across investment types and geographies, with the experience to manage complexity at scale.', strategy:'Diversified \u00b7 High Capital \u00b7 Experienced'}
};

function dnaScoreArchetypes() {
  var a = dnaAnswers;
  var scores = {yield:0, hunter:0, patient:0, local:0, portfolio:0};

  // Yield Maximizer
  if (a.goal === 'A') scores.yield += 3;
  if (a.capital === 'B' || a.capital === 'C') scores.yield += 2;
  if (a.involvement === 'A') scores.yield += 3;
  if (a.timeline === 'B') scores.yield += 2;
  if (a.risk === 'B' || a.risk === 'C') scores.yield += 2;

  // Deal Hunter
  if (a.goal === 'B') scores.hunter += 3;
  if (a.capital === 'C' || a.capital === 'D') scores.hunter += 2;
  if (a.involvement === 'B' || a.involvement === 'C') scores.hunter += 1;
  if (a.timeline === 'D') scores.hunter += 3;
  if (a.risk === 'C') scores.hunter += 2;

  // Patient Capitalist
  if (a.goal === 'A') scores.patient += 2;
  if (a.capital === 'C' || a.capital === 'D') scores.patient += 2;
  if (a.involvement === 'A' || a.involvement === 'B') scores.patient += 1;
  if (a.timeline === 'C') scores.patient += 3;
  if (a.risk === 'A') scores.patient += 3;

  // Local Operator
  if (a.goal === 'C') scores.local += 2;
  if (a.capital === 'B' || a.capital === 'C') scores.local += 1;
  if (a.involvement === 'C') scores.local += 3;
  if (a.timeline === 'B' || a.timeline === 'C') scores.local += 2;
  if (a.experience === 'B' || a.experience === 'C') scores.local += 1;

  // Portfolio Builder
  if (a.goal === 'C') scores.portfolio += 1;
  if (a.capital === 'D') scores.portfolio += 3;
  if (a.involvement === 'A' || a.involvement === 'B') scores.portfolio += 2;
  if (a.timeline === 'B' || a.timeline === 'C') scores.portfolio += 2;
  if (a.experience === 'C') scores.portfolio += 3;

  return scores;
}

function dnaGetArchetype() {
  var scores = dnaScoreArchetypes();
  var best = 'yield';
  var bestScore = 0;
  Object.keys(scores).forEach(function(k) {
    if (scores[k] > bestScore) { bestScore = scores[k]; best = k; }
  });
  return DNA_ARCHETYPES[best];
}

// === STATE MATCHING ENGINE ===
// All scoring derived from STATES_V2 data fields — not hardcoded

var DNA_BEGINNER_STATES = ['FL', 'AZ', 'IA'];

function dnaParseRate(rateStr) {
  if (!rateStr || rateStr === 'N/A') return 0;
  // Extract first percentage number
  var m = String(rateStr).match(/(\d+\.?\d*)%/);
  return m ? parseFloat(m[1]) : 0;
}

function dnaParseRedemptionMonths(rStr) {
  if (!rStr || rStr === 'N/A') return 0;
  var s = String(rStr).toLowerCase();
  if (/none|no redempt/i.test(s)) return 0;
  var mo = s.match(/(\d+)\s*months?/i);
  if (mo) return parseInt(mo[1]);
  var yr = s.match(/([\d.]+)\s*years?/i);
  if (yr) return Math.round(parseFloat(yr[1]) * 12);
  var dy = s.match(/(\d+)\s*days?/i);
  if (dy) return Math.round(parseInt(dy[1]) / 30);
  return 12; // default fallback
}

function dnaIsOnline(platformStr) {
  if (!platformStr) return false;
  var s = platformStr.toLowerCase();
  return /online|realauction|govease|bid4assets|sri |civicsource/i.test(s);
}

function dnaHasOTC(stateCode) {
  // Check STATES_EN for OTC availability
  if (typeof STATES_EN !== 'undefined') {
    var found = STATES_EN.find(function(s) { return (s.id || s.abbr || s.c) === stateCode; });
    if (found && found.otc && found.otc.available) return true;
  }
  return false;
}

function dnaScoreStates() {
  var a = dnaAnswers;
  var results = [];
  var maxScore = 0;

  ALL_STATES.forEach(function(s) {
    var code = s.abbr || s.c;
    var t = s._v2type || s.type || '';
    var rate = dnaParseRate(s.rate);
    var redemptionMo = dnaParseRedemptionMonths(s.redemption);
    var score = 0;

    // ONLINE BONUS
    if (a.involvement === 'A' && dnaIsOnline(s.auctionPlatform)) score += 20;

    // RATE BONUS
    score += rate;

    // CAPITAL FIT
    if (a.capital === 'A' && dnaHasOTC(code)) score += 15;
    if (a.capital === 'D' && (t === 'deed' || t === 'redeemable')) score += 10;

    // TIMELINE FIT
    if (a.timeline === 'A' && redemptionMo > 0 && redemptionMo < 12) score += 20;
    if (a.timeline === 'C' && redemptionMo > 24) score += 10;

    // GOAL FIT
    if (a.goal === 'B' && (t === 'deed' || t === 'redeemable')) score += 25;
    if (a.goal === 'A' && t === 'lien') score += 20;

    // BEGINNER FIT
    if (a.experience === 'A' && DNA_BEGINNER_STATES.indexOf(code) >= 0) score += 15;

    results.push({code: code, name: s.name, rate: s.rate, type: t, score: score});
    if (score > maxScore) maxScore = score;
  });

  // Sort by score descending
  results.sort(function(a, b) { return b.score - a.score; });

  // Calculate percentages
  if (maxScore > 0) {
    results.forEach(function(r) {
      r.pct = Math.min(99, Math.round((r.score / maxScore) * 100));
    });
  }

  return results.slice(0, 3);
}

// === PROFILE CARD UPDATES ===

function dnaUpdateCard() {
  var answeredCount = Object.keys(dnaAnswers).length;
  var a = dnaAnswers;

  // Archetype — update after Q2
  var archEl = document.getElementById('dna-card-archetype');
  var stratEl = document.getElementById('dna-card-strategy');
  if (answeredCount >= 2) {
    var arch = dnaGetArchetype();
    archEl.textContent = arch.name;
    stratEl.textContent = arch.strategy;
    var mobArch = document.getElementById('dna-mobile-archetype');
    if (mobArch) mobArch.textContent = arch.name;
  } else {
    archEl.innerHTML = '&mdash;';
    stratEl.textContent = 'Answer questions to build your profile';
  }

  // Top state matches — update after each answer
  var matchesEl = document.getElementById('dna-card-matches');
  if (answeredCount >= 1) {
    var top3 = dnaScoreStates();
    var matchHtml = '<div class="dna-card-section-label">TOP MATCHES</div>';
    top3.forEach(function(m, i) {
      var rateShort = shortenRate(m.rate, m.type);
      matchHtml += '<div class="dna-match-row" style="transition:opacity 200ms ease-out">' +
        '<span class="dna-match-rank">#' + (i + 1) + '</span>' +
        '<span class="dna-match-name">' + escapeHtml(m.name) + '</span>' +
        '<span class="dna-match-rate">' + escapeHtml(rateShort) + '</span>' +
        '<span class="dna-match-pct">' + m.pct + '%</span>' +
      '</div>';
    });
    matchesEl.innerHTML = matchHtml;
  }

  // Profile signals (dot bars)
  dnaUpdateDots('risk', a.risk ? ({A:1,B:3,C:5})[a.risk] || 0 : 0);
  dnaUpdateDots('capital', a.capital ? ({A:1,B:2,C:4,D:5})[a.capital] || 0 : 0);
  dnaUpdateDots('timeline', a.timeline ? ({A:1,B:2,C:4,D:3})[a.timeline] || 0 : 0);
  dnaUpdateDots('strategy', answeredCount >= 2 ? (function() {
    var arch = dnaGetArchetype();
    if (arch.name === 'Yield Maximizer') return 2;
    if (arch.name === 'Deal Hunter') return 4;
    if (arch.name === 'Patient Capitalist') return 3;
    if (arch.name === 'Local Operator') return 5;
    if (arch.name === 'Portfolio Builder') return 4;
    return 0;
  })() : 0);
}

function dnaUpdateDots(signal, filled) {
  var el = document.getElementById('dna-dots-' + signal);
  if (!el) return;
  var html = '';
  for (var i = 0; i < 5; i++) {
    html += '<span class="dna-dot' + (i < filled ? ' filled' : '') + '"></span>';
  }
  el.innerHTML = html;
}

function dnaShareProfile() {
  var arch = dnaGetArchetype();
  var top3 = dnaScoreStates();
  var text = 'My Aurigen Investor DNA: ' + arch.name + '\n' +
    'Strategy: ' + arch.strategy + '\n' +
    'Top Matches: ' + top3.map(function(m) { return m.name + ' (' + m.pct + '%)'; }).join(', ') + '\n' +
    'Build yours at aurigen-directory.netlify.app';
  try {
    navigator.clipboard.writeText(text).then(function() {
      var btn = document.querySelector('.dna-cta-share');
      if (btn) { var orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function() { btn.textContent = orig; }, 2000); }
    });
  } catch(e) { /* clipboard not available */ }
}

// Initialize DNA when tab is first switched to
var dnaInitialized = false;
var daInitialized = false;
var origSwitchTabDna = switchTab;
switchTab = function(name) {
  origSwitchTabDna(name);
  if (name === 'dna' && !dnaInitialized) {
    dnaInitialized = true;
    dnaInit();
  }
  if (name === 'tools' && !daInitialized) {
    daInitialized = true;
    daInit();
    daInitLookup();
  }
  // Show/hide Sage archetype prompt
  if (name === 'advisor') {
    var sagePrompt = document.getElementById('sage-arch-prompt');
    if (sagePrompt) sagePrompt.style.display = getArchetypeKey() ? 'none' : 'block';
  }
};

