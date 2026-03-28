// === ACCOUNT FUNCTIONS ===
// Admin detection via server-issued isAdmin flag from JWT — no client-side email list
function initAccount() {
  var badge = document.getElementById('acct-tier-badge');
  var email = document.getElementById('acct-email');
  var level = document.getElementById('acct-level');
  var states = document.getElementById('acct-states');
  var upgrade = document.getElementById('acct-upgrade');
  var lockDna = document.getElementById('lock-dna');
  var lockCompare = document.getElementById('lock-compare');
  var vsTerminal = document.getElementById('vs-terminal-paid');
  var vsLocked = document.getElementById('vs-locked-free');
  var valueSection = document.getElementById('acct-value-section');
  var adminSection = document.getElementById('acct-admin-section');
  var paidSection = document.getElementById('acct-paid-section');
  var lockedRow = document.getElementById('acct-locked-row');
  var supportLink = document.getElementById('acct-support');
  var userEmail = APP.email || '';
  var isAdmin = isAdminMode();

  email.textContent = userEmail || '\u2014';

  if (APP.tier >= 2) {
    badge.textContent = 'FULL ACCESS';
    badge.classList.add('paid');
    level.textContent = 'Full Access';
    states.textContent = 'All 51 Jurisdictions';
    if (lockedRow) lockedRow.style.display = 'none';
    if (upgrade) upgrade.style.display = 'none';
    if (valueSection) valueSection.style.display = 'none';
    if (lockDna) lockDna.style.display = 'none';
    if (lockCompare) lockCompare.style.display = 'none';
    if (vsTerminal) vsTerminal.style.display = 'flex';
    if (vsLocked) vsLocked.style.display = 'none';
    if (supportLink) supportLink.style.display = 'block';

    // Paid section: quick links
    if (paidSection) {
      paidSection.style.display = 'block';
      paidSection.innerHTML = '<div class="acct-paid-badge">FULL ACCESS</div>' +
        '<div class="acct-access-date">Access: Active</div>' +
        '<div class="acct-quick-links">' +
          '<a class="acct-quick-link" onclick="switchTab(\'scout\')"><span class="acct-quick-link-icon">\uD83D\uDD0D</span>Open Scout Checklist</a>' +
          '<a class="acct-quick-link" onclick="switchTab(\'tools\')"><span class="acct-quick-link-icon">\uD83D\uDCC8</span>Open Deal Analyzer</a>' +
          '<a class="acct-quick-link" onclick="togglePulseDrawer()"><span class="acct-quick-link-icon">\uD83D\uDD14</span>Set Pulse Alerts</a>' +
          '<a class="acct-quick-link" data-action="precall-summary"><span class="acct-quick-link-icon">\uD83D\uDCCB</span>Pre-Call Summary</a>' +
        '</div>';
    }

    // Referral section (paid users)
    var referralSection = document.getElementById('acct-referral-section');
    if (referralSection) {
      referralSection.style.display = 'block';
      loadReferralStats();
    }

    // Admin section
    if (isAdmin && adminSection) {
      adminSection.style.display = 'block';
      adminSection.innerHTML = '<div class="acct-admin-badge">ADMIN</div>' +
        '<div class="acct-admin-stats"><div class="acct-admin-stat"><div class="acct-admin-stat-num" id="admin-free-count">\u2014</div><div class="acct-admin-stat-label">FREE USERS</div></div>' +
        '<div class="acct-admin-stat"><div class="acct-admin-stat-num" id="admin-paid-count">\u2014</div><div class="acct-admin-stat-label">PAID USERS</div></div></div>';
      // Fetch admin stats
      fetchAdminStats();
    }
  } else {
    badge.textContent = 'FREE ACCESS';
    badge.classList.remove('paid');
    level.textContent = 'Free';
    states.textContent = 'All 51 States';
    var locked = document.getElementById('acct-locked');
    if (locked) locked.textContent = 'Counties, DNA, Versus, Analyzer, Sage, Scout, Warbook, Deadlines, Recon, Dossier, Auctions, Pulse';
    if (lockedRow) lockedRow.style.display = '';
    if (upgrade) upgrade.style.display = 'block';
    if (valueSection) valueSection.style.display = 'block';
    if (lockDna) lockDna.style.display = 'flex';
    if (lockCompare) lockCompare.style.display = 'flex';
    if (vsTerminal) vsTerminal.style.display = 'none';
    if (vsLocked) vsLocked.style.display = 'flex';
    if (paidSection) paidSection.style.display = 'none';
    if (adminSection) adminSection.style.display = 'none';
    if (supportLink) supportLink.style.display = 'none';
  }
}

function fetchAdminStats() {
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  fetch('/.netlify/functions/admin-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
    body: '{}'
  })
  .then(function(r) { return r.ok ? r.json() : null; })
  .then(function(data) {
    if (!data) return;
    var freeEl = document.getElementById('admin-free-count');
    var paidEl = document.getElementById('admin-paid-count');
    if (freeEl) freeEl.textContent = String(data.free_count || 0);
    if (paidEl) paidEl.textContent = String(data.paid_count || 0);
  })
  .catch(function() {});
}

// === BOOT ANIMATION ===
function runBootAnimation() {
  var ease = 'cubic-bezier(0.16,1,0.3,1)';
  var targets = [
    { el: document.getElementById('top-nav'), delay: 0 },
    { el: document.getElementById('nav-logo'), delay: 150 },
    { el: null, delay: 250, tabs: true },
    { el: document.getElementById('explore-header'), delay: 400 },
    { el: document.getElementById('d3-map'), delay: 550 },
    { el: document.getElementById('status-bar'), delay: 700 }
  ];

  // Set initial hidden state
  targets.forEach(function(t) {
    if (t.tabs) {
      document.querySelectorAll('.nav-tab').forEach(function(tab) {
        tab.style.opacity = '0';
        tab.style.transform = 'translateY(-4px)';
      });
    } else if (t.el) {
      t.el.style.opacity = '0';
      t.el.style.transform = 'translateY(-8px)';
    }
  });

  // Animate in
  targets.forEach(function(t) {
    if (t.tabs) {
      document.querySelectorAll('.nav-tab').forEach(function(tab, i) {
        setTimeout(function() {
          tab.style.transition = 'opacity 0.4s ' + ease + ', transform 0.4s ' + ease;
          tab.style.opacity = '1';
          tab.style.transform = 'translateY(0)';
        }, t.delay + i * 60);
      });
    } else if (t.el) {
      setTimeout(function() {
        t.el.style.transition = 'opacity 0.5s ' + ease + ', transform 0.5s ' + ease;
        t.el.style.opacity = '1';
        t.el.style.transform = 'none';
      }, t.delay);
    }
  });
}

// === VERSUS TAB ===
function initVersusTab() {
  if (!window.STATES_V2) return;
  var states = window.STATES_V2.slice().sort(function(a, b) { return a.name.localeCompare(b.name); });
  var selA = document.getElementById('vs-select-a');
  var selB = document.getElementById('vs-select-b');
  if (!selA || !selB) return;
  var optionsHtml = states.map(function(s) {
    return '<option value="' + escapeHtml(s.code) + '">' + escapeHtml(s.name) + '</option>';
  }).join('');
  selA.innerHTML = optionsHtml;
  selB.innerHTML = optionsHtml;
  // Read localStorage pre-selection from Deal Analyzer, fallback to FL/TX
  var preA = 'FL', preB = 'TX';
  try {
    var storedA = localStorage.getItem('versus_state_a');
    var storedB = localStorage.getItem('versus_state_b');
    if (storedA) { preA = storedA; localStorage.removeItem('versus_state_a'); }
    if (storedB) { preB = storedB; localStorage.removeItem('versus_state_b'); }
  } catch(e) { /* localStorage not available */ }
  // DNA archetype pre-load (if no stored selections)
  var archKey = getArchetypeKey();
  var archCfg = archKey ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  if (!localStorage.getItem('versus_state_a') && archCfg && archCfg.daStates) {
    var profile = getProfile();
    if (profile && profile.topStates && profile.topStates.length >= 2) {
      preA = profile.topStates[0].code;
      preB = profile.topStates[1].code;
    }
  }
  selA.value = preA;
  selB.value = preB;
  // Show archetype badge
  var vsHeader = document.querySelector('.vs-terminal-header');
  if (vsHeader && archCfg) {
    var oldBadge = document.getElementById('vs-arch-badge');
    if (oldBadge) oldBadge.remove();
    var vsBadge = document.createElement('div');
    vsBadge.id = 'vs-arch-badge';
    vsBadge.style.cssText = 'font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.08em;color:#c9a84c;margin-bottom:4px';
    vsBadge.innerHTML = escapeHtml('Comparing as: ' + archCfg.label) + '<div style="font-size:9px;color:var(--text2);letter-spacing:0;margin-top:2px">Comparison reflects your strategy orientation. Not investment advice.</div>';
    vsHeader.insertBefore(vsBadge, vsHeader.firstChild);
  }
  selA.addEventListener('change', runVersusCompare);
  selB.addEventListener('change', runVersusCompare);
  runVersusCompare();
}

function getStateByCode(code) {
  if (!window.STATES_V2) return null;
  for (var i = 0; i < window.STATES_V2.length; i++) {
    if (window.STATES_V2[i].code === code) return window.STATES_V2[i];
  }
  return null;
}

function vsParseRate(str) {
  if (!str) return 0;
  var m = str.match(/(\d+(?:\.\d+)?)\s*%/);
  return m ? parseFloat(m[1]) : 0;
}

function vsParseRedemptionMonths(str) {
  if (!str) return 0;
  var lower = str.toLowerCase();
  if (lower.indexOf('none') !== -1 && lower.indexOf('year') === -1 && lower.indexOf('month') === -1 && lower.indexOf('day') === -1) return 0;
  var ym = lower.match(/(\d+(?:\.\d+)?)\s*year/);
  var mm = lower.match(/(\d+)\s*month/);
  var dm = lower.match(/(\d+)\s*day/);
  var months = 0;
  if (ym) months += parseFloat(ym[1]) * 12;
  if (mm) months += parseInt(mm[1], 10);
  if (dm) months += parseInt(dm[1], 10) / 30;
  return months;
}

function vsIsOnline(platform) {
  if (!platform) return false;
  var lower = platform.toLowerCase();
  return lower.indexOf('online') !== -1 || lower.indexOf('realauction') !== -1 || lower.indexOf('govease') !== -1 || lower.indexOf('grant street') !== -1 || lower.indexOf('zeusauction') !== -1;
}

function vsWinnerBadge(label) {
  return '<span class="vs-winner-badge">' + escapeHtml(label) + '</span>';
}

function runVersusCompare() {
  var codeA = document.getElementById('vs-select-a').value;
  var codeB = document.getElementById('vs-select-b').value;
  var a = getStateByCode(codeA);
  var b = getStateByCode(codeB);
  if (!a || !b) return;

  // Update command line
  var cmdA = document.getElementById('vs-cmd-a');
  var cmdB = document.getElementById('vs-cmd-b');
  if (cmdA) cmdA.textContent = codeA;
  if (cmdB) cmdB.textContent = codeB;

  // Update column headers
  var hdrA = document.getElementById('vs-hdr-a');
  var hdrB = document.getElementById('vs-hdr-b');
  if (hdrA) hdrA.textContent = a.name.toUpperCase();
  if (hdrB) hdrB.textContent = b.name.toUpperCase();

  // Metrics
  var rateA = vsParseRate(a.rate);
  var rateB = vsParseRate(b.rate);
  var redA = vsParseRedemptionMonths(a.redemption);
  var redB = vsParseRedemptionMonths(b.redemption);
  var onA = vsIsOnline(a.auctionPlatform);
  var onB = vsIsOnline(b.auctionPlatform);

  var rows = [
    { label: 'TYPE', valA: (a.type || '—').toUpperCase(), valB: (b.type || '—').toUpperCase(), badgeA: '', badgeB: '' },
    { label: 'YIELD RATE', valA: (a.rate || '—').toUpperCase(), valB: (b.rate || '—').toUpperCase(), badgeA: rateA > rateB ? 'EDGE' : '', badgeB: rateB > rateA ? 'EDGE' : '' },
    { label: 'REDEMPTION', valA: (a.redemption || '—').toUpperCase(), valB: (b.redemption || '—').toUpperCase(), badgeA: (redA > 0 && redB > 0 && redA < redB) ? 'EDGE' : '', badgeB: (redA > 0 && redB > 0 && redB < redA) ? 'EDGE' : '' },
    { label: 'BID METHOD', valA: (a.bidMethod || '—').toUpperCase(), valB: (b.bidMethod || '—').toUpperCase(), badgeA: '', badgeB: '' },
    { label: 'PLATFORM', valA: (a.auctionPlatform || '—').toUpperCase(), valB: (b.auctionPlatform || '—').toUpperCase(), badgeA: (onA && !onB) ? 'EDGE' : '', badgeB: (onB && !onA) ? 'EDGE' : '' },
    { label: 'BEGINNER', valA: a.beginnerFriendly ? 'YES' : 'NO', valB: b.beginnerFriendly ? 'YES' : 'NO', badgeA: (a.beginnerFriendly && !b.beginnerFriendly) ? 'EDGE' : '', badgeB: (b.beginnerFriendly && !a.beginnerFriendly) ? 'EDGE' : '' }
  ];

  document.getElementById('vs-rows').innerHTML = rows.map(function(r) {
    return '<div class="vs-row">'
      + '<div class="vs-row-label">' + escapeHtml(r.label) + '</div>'
      + '<div class="vs-row-val">' + escapeHtml(r.valA) + (r.badgeA ? vsWinnerBadge(r.badgeA) : '') + '</div>'
      + '<div class="vs-row-val">' + escapeHtml(r.valB) + (r.badgeB ? vsWinnerBadge(r.badgeB) : '') + '</div>'
      + '</div>';
  }).join('');

  // Analysis output
  var insights = vsGenerateInsights(a, b, rateA, rateB, redA, redB, onA, onB);
  var analysisEl = document.getElementById('vs-analysis');
  if (insights.length > 0) {
    analysisEl.innerHTML = '<div class="vs-analysis-header">&gt; ANALYSIS OUTPUT</div>'
      + insights.map(function(i) { return '<div class="vs-analysis-item">' + escapeHtml(i) + '</div>'; }).join('');
  } else {
    analysisEl.innerHTML = '';
  }
}

function vsGenerateInsights(a, b, rateA, rateB, redA, redB, onA, onB) {
  var out = [];

  // Rate insight
  if (rateA > 0 && rateB > 0 && rateA !== rateB) {
    var higher = rateA > rateB ? a : b;
    var lower = rateA > rateB ? b : a;
    var diff = Math.abs(rateA - rateB);
    var sentence = higher.name + ' offers a ' + diff.toFixed(1) + '% higher statutory rate than ' + lower.name + '.';
    var hRate = rateA > rateB ? rateA : rateB;
    var hState = rateA > rateB ? a : b;
    if (hState.bidMethod && hState.bidMethod.toLowerCase().indexOf('bid') !== -1 && hState.bidMethod.toLowerCase().indexOf('down') !== -1) {
      sentence += ' However, ' + hState.name + ' uses bid-down — actual yields may be lower in competitive counties.';
    }
    out.push(sentence);
  }

  // Platform insight
  if (onA !== onB) {
    var onState = onA ? a : b;
    var offState = onA ? b : a;
    out.push(onState.name + ' auctions are available online via ' + onState.auctionPlatform + '. ' + offState.name + ' requires in-person attendance.');
  }

  // Redemption insight
  if (redA > 0 && redB > 0 && Math.abs(redA - redB) >= 3) {
    var longerState = redA > redB ? a : b;
    var shorterState = redA > redB ? b : a;
    var longerMonths = Math.max(redA, redB);
    var shorterMonths = Math.min(redA, redB);
    var diffYears = ((longerMonths - shorterMonths) / 12).toFixed(1);
    out.push(longerState.name + ' locks capital approximately ' + diffYears + ' year(s) longer than ' + shorterState.name + '. Factor redemption periods into capital rotation planning.');
  }

  // Bid-down competition flag
  if (out.length < 3) {
    var bidDownStates = [];
    if (a.bidMethod && a.bidMethod.toLowerCase().indexOf('bid-down') !== -1) bidDownStates.push(a);
    if (b.bidMethod && b.bidMethod.toLowerCase().indexOf('bid-down') !== -1) bidDownStates.push(b);
    if (bidDownStates.length === 1) {
      out.push(bidDownStates[0].name + ' uses a bid-down system where institutional competition can compress effective yields below the statutory maximum.');
    }
  }

  // Type difference
  if (out.length < 3 && a.type !== b.type) {
    var typeExplain = {
      lien: 'a debt instrument — interest accrues per statute while the owner retains the property',
      deed: 'a property acquisition — you receive the deed directly at sale',
      hybrid: 'a hybrid system offering both lien and deed pathways',
      redeemable: 'a redeemable deed — you acquire the deed but the owner may redeem within a statutory window',
      forfeiture: 'a forfeiture system where the state reclaims and resells delinquent properties'
    };
    out.push(a.name + ' is ' + (typeExplain[a.type] || a.type) + '. ' + b.name + ' is ' + (typeExplain[b.type] || b.type) + '. This affects hold times, risk profile, and capital requirements.');
  }

  return out.slice(0, 3);
}

// ═══════════════════════════════════════════════════════════
// DNA INVESTOR PROFILER
// ═══════════════════════════════════════════════════════════

var DNA_QUESTIONS = [
  {
    id: 'goal', step: 'One', label: 'Goal',
    text: "What\u2019s your #1 goal?",
    options: [
      {key:'A', text:'Returns', sub:'I want interest income'},
      {key:'B', text:'The property', sub:'I want to acquire real estate'},
      {key:'C', text:'Both', sub:'Open to either outcome'}
    ]
  },
  {
    id: 'capital', step: 'Two', label: 'Capital',
    text: 'How much are you starting with?',
    options: [
      {key:'A', text:'Under $5,000', sub:''},
      {key:'B', text:'$5,000 \u2013 $25,000', sub:''},
      {key:'C', text:'$25,000 \u2013 $100,000', sub:''},
      {key:'D', text:'$100,000+', sub:''}
    ]
  },
  {
    id: 'involvement', step: 'Three', label: 'Involvement',
    text: 'How hands-on do you want to be?',
    options: [
      {key:'A', text:'Fully online', sub:'Bid from anywhere'},
      {key:'B', text:'Some travel is fine', sub:''},
      {key:'C', text:'In-person preferred', sub:'I like being there'}
    ]
  },
  {
    id: 'timeline', step: 'Four', label: 'Timeline',
    text: 'When do you want your first return?',
    options: [
      {key:'A', text:'Under 6 months', sub:''},
      {key:'B', text:'6 months to 2 years', sub:''},
      {key:'C', text:'2\u20134 years', sub:'I\u2019m patient'},
      {key:'D', text:'I want the property itself', sub:''}
    ]
  },
  {
    id: 'risk', step: 'Five', label: 'Risk',
    text: "What\u2019s your risk tolerance?",
    options: [
      {key:'A', text:'Conservative', sub:'Protect capital first'},
      {key:'B', text:'Moderate', sub:'Balanced approach'},
      {key:'C', text:'Aggressive', sub:'Maximize rate'}
    ]
  },
  {
    id: 'experience', step: 'Six', label: 'Experience',
    text: 'Where are you in your journey?',
    options: [
      {key:'A', text:'Complete beginner', sub:''},
      {key:'B', text:'Some experience', sub:'Done research'},
      {key:'C', text:'Experienced', sub:'Already investing'}
    ]
  }
];

var dnaCurrentQ = 0;
var dnaAnswers = {};

function dnaInit() {
  dnaCurrentQ = 0;
  dnaAnswers = {};
  dnaRenderQuestion(0);
  dnaUpdateCard();
  dnaUpdateProgress();
  document.getElementById('dna-card').classList.remove('complete');
  document.getElementById('dna-card-cta').style.display = 'none';
  document.getElementById('dna-card-completion').style.display = 'none';
  document.getElementById('dna-card').style.animation = '';
  void document.getElementById('dna-card').offsetHeight;
  document.getElementById('dna-card').style.animation = 'dnaPulseInit 2s ease-in-out infinite';
}

function dnaRenderQuestion(idx) {
  var q = DNA_QUESTIONS[idx];
  var area = document.getElementById('dna-question-area');
  var selected = dnaAnswers[q.id] || null;
  var html = '<div class="dna-q-enter">' +
    '<div class="dna-step-label">Question ' + escapeHtml(q.step) + ' \u2014 ' + escapeHtml(q.label) + '</div>' +
    '<div class="dna-question-text">' + escapeHtml(q.text) + '</div>' +
    '<div class="dna-options">';
  q.options.forEach(function(opt, i) {
    var isSel = selected === opt.key;
    html += '<div class="dna-option' + (isSel ? ' selected' : '') + '" onclick="dnaSelectOption(\'' + q.id + '\',\'' + opt.key + '\')" style="animation:dnaOptionIn 200ms ease-out ' + (i * 60) + 'ms both">' +
      '<div class="dna-option-letter">' + escapeHtml(opt.key) + '</div>' +
      '<div><div class="dna-option-text">' + escapeHtml(opt.text) + '</div>' +
      (opt.sub ? '<div class="dna-option-sub">' + escapeHtml(opt.sub) + '</div>' : '') +
      '</div></div>';
  });
  html += '</div></div>';
  area.innerHTML = html;

  // Nav state
  document.getElementById('dna-back').disabled = idx === 0;
  var nextBtn = document.getElementById('dna-next');
  nextBtn.disabled = !selected;
  nextBtn.textContent = idx === DNA_QUESTIONS.length - 1 ? 'Finish' : 'Continue';
}

function dnaSelectOption(qId, key) {
  dnaAnswers[qId] = key;
  // Re-render to show selection
  dnaRenderQuestion(dnaCurrentQ);
  document.getElementById('dna-next').disabled = false;
  // Live update card after every answer
  dnaUpdateCard();
}

function dnaNext() {
  if (dnaCurrentQ < DNA_QUESTIONS.length - 1) {
    dnaCurrentQ++;
    dnaRenderQuestion(dnaCurrentQ);
    dnaUpdateProgress();
  } else {
    // Quiz complete — persist to localStorage
    dnaComplete();
    var archResult = dnaGetArchetype();
    var topMatches = dnaScoreStates();
    saveProfile({
      archetype: Object.keys(DNA_ARCHETYPES).find(function(k) { return DNA_ARCHETYPES[k].name === archResult.name; }) || '',
      topStates: topMatches.map(function(m) { return { code: m.code, name: m.name, pct: m.pct }; }),
      answers: Object.assign({}, dnaAnswers)
    });
  }
}

function dnaPrev() {
  if (dnaCurrentQ > 0) {
    dnaCurrentQ--;
    dnaRenderQuestion(dnaCurrentQ);
    dnaUpdateProgress();
  }
}

function dnaUpdateProgress() {
  var pct = ((dnaCurrentQ) / DNA_QUESTIONS.length) * 100;
  document.getElementById('dna-progress-bar').style.width = pct + '%';
  document.getElementById('dna-progress-label').textContent = 'Question ' + (dnaCurrentQ + 1) + ' of 6';
  // Mobile progress
  var mobFill = document.getElementById('dna-mobile-bar-fill');
  if (mobFill) mobFill.style.width = pct + '%';
}

function dnaComplete() {
  document.getElementById('dna-progress-bar').style.width = '100%';
  document.getElementById('dna-progress-label').textContent = 'Complete';
  var mobFill = document.getElementById('dna-mobile-bar-fill');
  if (mobFill) mobFill.style.width = '100%';

  var card = document.getElementById('dna-card');
  card.style.animation = 'none';
  card.classList.add('complete');
  document.getElementById('dna-card-label').textContent = 'INVESTOR DNA \u00b7 COMPLETE';
  document.getElementById('dna-card-cta').style.display = 'block';
  document.getElementById('dna-card-completion').style.display = 'block';
  dnaUpdateCard();

  // Replace quiz area with result summary
  var area = document.getElementById('dna-question-area');
  var arch = dnaGetArchetype();
  area.innerHTML = '<div class="dna-q-enter">' +
    '<div class="dna-step-label">Profile Complete</div>' +
    '<div class="dna-question-text">' + escapeHtml(arch.name) + '</div>' +
    '<div class="dna-option-text" style="color:var(--text2);line-height:1.6;max-width:460px">' + escapeHtml(arch.desc) + '</div>' +
    '</div>';
  document.getElementById('dna-nav').style.display = 'none';
}

function dnaRetake() {
  document.getElementById('dna-nav').style.display = 'flex';
  dnaInit();
}

// === REFERRAL ENGINE ===
function generateReferralLink() {
  var btn = document.getElementById('acct-referral-gen-btn');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  fetch('/.netlify/functions/referral', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
    body: JSON.stringify({ action: 'generate' })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.referral_url) {
      var urlEl = document.getElementById('acct-referral-url');
      var wrap = document.getElementById('acct-referral-link-wrap');
      if (urlEl) urlEl.value = data.referral_url;
      if (wrap) wrap.style.display = 'block';
      if (btn) btn.style.display = 'none';
    } else {
      if (btn) { btn.disabled = false; btn.textContent = 'GET YOUR REFERRAL LINK'; }
    }
  })
  .catch(function() {
    if (btn) { btn.disabled = false; btn.textContent = 'GET YOUR REFERRAL LINK'; }
  });
}

function copyReferralLink() {
  var urlEl = document.getElementById('acct-referral-url');
  if (urlEl) {
    urlEl.select();
    try { navigator.clipboard.writeText(urlEl.value); } catch(e) { document.execCommand('copy'); }
  }
}

function loadReferralStats() {
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  if (!jwt) return;
  fetch('/.netlify/functions/referral', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
    body: JSON.stringify({ action: 'stats' })
  })
  .then(function(r) { return r.ok ? r.json() : null; })
  .then(function(data) {
    if (!data) return;
    var statsEl = document.getElementById('acct-referral-stats');
    var countEl = document.getElementById('acct-ref-count');
    var convEl = document.getElementById('acct-ref-converted');
    if (statsEl && (data.referred > 0 || data.converted > 0)) {
      statsEl.style.display = 'block';
      if (countEl) countEl.textContent = String(data.referred);
      if (convEl) convEl.textContent = String(data.converted);
    }
  })
  .catch(function() {});
}

