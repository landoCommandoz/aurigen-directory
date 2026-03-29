// === BOOT ===
function bootApp() {
  setTimeout(function(){
    var container = document.getElementById('map-wrap') || document.querySelector('.map-container') || document.querySelector('#map-svg').parentElement;
    if(container){
      var w = container.clientWidth || container.offsetWidth || 900;
      var h = container.clientHeight || container.offsetHeight || 500;
      if(w > 0 && h > 0){ initMap(); }
      else { setTimeout(initMap, 500); }
    }
  }, 100);
  initAccount();
  initVersusTab();
  runBootAnimation();

  // Init auctions tab immediately with static data
  initAuctionsTab();
  initAuctionsInventory();

  // Fetch live data in background, then re-init auctions tab with fresh data
  fetchLiveAuctionData().then(function() {
    initAuctionsTab();
    initAuctionsInventory();
  });

  // Init journey bar + map bookmarks after map loads
  setTimeout(function() {
    updateJourneyBar();
    updateMapBookmarks();
  }, 800);
}

// === TOOL FUNCTIONS ===
function runDealAnalyzer() {
  const price = parseFloat(document.getElementById('inp-price').value);
  const tax = parseFloat(document.getElementById('inp-tax').value);
  const el = document.getElementById('result-deal');
  if (!price || !tax || price <= 0 || tax <= 0) {
    el.textContent = 'ERROR: Both fields must be positive numbers.';
    el.classList.add('show');
    return;
  }
  const yield2 = ((tax / price) * 100).toFixed(2);
  const ret2 = (yield2 * 2).toFixed(2);
  el.textContent = 'PURCHASE $' + price.toLocaleString() + ' | TAX $' + tax.toLocaleString() + '/YR | YIELD ' + yield2 + '% | 2YR RETURN ' + ret2 + '%';
  el.classList.add('show');
}

function runAuctionPulse() {
  const abbr = (document.getElementById('inp-pulse-state').value || '').trim().toUpperCase();
  const el = document.getElementById('result-pulse');
  const data = STATE_DATA[abbr];
  if (data) {
    el.textContent = 'RATE: ' + data.rate + ' | REDEMPTION: ' + data.redemption + ' | PLATFORM: ' + data.platform;
  } else {
    el.textContent = 'STATE NOT FOUND \u2014 ENTER A 2-LETTER STATE CODE (E.G. FL, TX, CO)';
  }
  el.classList.add('show');
}

function runInvestorDNA() {
  const val = document.getElementById('inp-dna').value;
  const el = document.getElementById('result-dna');
  const profiles = {
    Conservative: 'PROFILE: Lien-focused. Target 12-18% states. Priority: FL, NJ, MD. Low risk, stable returns.',
    Moderate: 'PROFILE: Mixed portfolio. Lien + hybrid states. Target 18-36%. Priority: IL, AZ, CO.',
    Aggressive: 'PROFILE: Deed-focused. Target OTC and hybrid. Priority: TX, GA, MI. Higher upside, higher risk.'
  };
  el.textContent = profiles[val] || profiles.Moderate;
  el.classList.add('show');
}

function runStateCompare() {
  const a = (document.getElementById('inp-state-a').value || '').trim().toUpperCase();
  const b = (document.getElementById('inp-state-b').value || '').trim().toUpperCase();
  const el = document.getElementById('result-compare');
  const dA = STATE_DATA[a];
  const dB = STATE_DATA[b];
  if (!dA && !dB) {
    el.textContent = 'NEITHER ' + a + ' NOR ' + b + ' IN DATABASE \u2014 ENTER A 2-LETTER STATE CODE';
  } else if (!dA) {
    el.textContent = a + ' NOT IN DATABASE \u2014 ENTER A 2-LETTER STATE CODE';
  } else if (!dB) {
    el.textContent = b + ' NOT IN DATABASE \u2014 ENTER A 2-LETTER STATE CODE';
  } else {
    el.innerHTML = sanitizeHTML(
      '<div>RATE: ' + escapeHtml(a) + ' ' + escapeHtml(dA.rate) + ' | ' + escapeHtml(b) + ' ' + escapeHtml(dB.rate) + '</div>' +
      '<div>REDEMPTION: ' + escapeHtml(a) + ' ' + escapeHtml(dA.redemption) + ' | ' + escapeHtml(b) + ' ' + escapeHtml(dB.redemption) + '</div>' +
      '<div>PLATFORM: ' + escapeHtml(a) + ' ' + escapeHtml(dA.platform) + ' | ' + escapeHtml(b) + ' ' + escapeHtml(dB.platform) + '</div>');
  }
  el.classList.add('show');
}

// === ADVISOR FUNCTIONS ===
var _sageHistory = [];
var _sageQuestionCount = 0;
var _sageLastCTATurn = -10; // FREQUENCY RULE: track last turn a CTA was shown
var _sageFirstResponse = true;
var SAGE_SESSION_KEY = 'aurigen_sage_history';
var SAGE_MAX_HISTORY = 10; // cap at 10 exchanges (20 messages)

// Restore session memory on load
function sageRestoreSession() {
  try {
    var stored = sessionStorage.getItem(SAGE_SESSION_KEY);
    if (stored) {
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _sageHistory = parsed;
        _sageQuestionCount = parsed.filter(function(m) { return m.role === 'user'; }).length;
        _sageFirstResponse = false;
        return true;
      }
    }
  } catch(e) {}
  return false;
}

function sageSaveSession() {
  try {
    // Keep only last SAGE_MAX_HISTORY exchanges
    var trimmed = _sageHistory;
    if (trimmed.length > SAGE_MAX_HISTORY * 2) {
      trimmed = trimmed.slice(trimmed.length - SAGE_MAX_HISTORY * 2);
    }
    sessionStorage.setItem(SAGE_SESSION_KEY, JSON.stringify(trimmed));
  } catch(e) {}
}

// Markdown-lite renderer: bold, lists, code
function sageRenderMarkdown(text) {
  // Escape HTML first
  var safe = escapeHtml(text);
  // Bold: **text** or __text__
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Inline code: `code`
  safe = safe.replace(/`([^`]+)`/g, '<code class="sage-code">$1</code>');
  // Numbered lists: lines starting with digit + period
  safe = safe.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="sage-list-item"><span class="sage-list-num">$1.</span> $2</div>');
  // Bullet lists: lines starting with - or •
  safe = safe.replace(/^[-\u2022]\s+(.+)$/gm, '<div class="sage-list-item"><span class="sage-list-bullet">\u2022</span> $1</div>');
  // Newlines to <br> (but not inside list items)
  safe = safe.replace(/\n(?!<div class="sage-list)/g, '<br>');
  return safe;
}

// Archetype-aware suggested prompts
var SAGE_PROMPTS = {
  yield: [
    'Which states have the highest lien rates?',
    'How does bid-down interest work?',
    'Best OTC opportunities for yield?'
  ],
  hunter: [
    'Which deed states have the lowest competition?',
    'How do I acquire property through tax sales?',
    'Compare Texas vs Georgia for deed investing'
  ],
  patient: [
    'Which states have the longest redemption periods?',
    'How do multi-year liens compound?',
    'Best states for passive lien investing?'
  ],
  local: [
    'How do in-person county auctions work?',
    'Which states have the best OTC programs?',
    'How to build county relationships?'
  ],
  portfolio: [
    'How to diversify across lien and deed states?',
    'Compare Florida vs Texas for portfolio balance',
    'What allocation strategy works for tax liens?'
  ],
  default: [
    'Which states are best for beginners?',
    'How does bid-down interest work?',
    'Compare Florida vs Texas',
    'What can I do with $5,000?'
  ]
};

function sageGetPrompts() {
  var archKey = typeof getArchetypeKey === 'function' ? getArchetypeKey() : null;
  return SAGE_PROMPTS[archKey] || SAGE_PROMPTS['default'];
}

function sageRenderChips() {
  var container = document.getElementById('sage-chips');
  if (!container) return;
  var prompts = sageGetPrompts();
  container.innerHTML = '';
  for (var i = 0; i < prompts.length; i++) {
    var btn = document.createElement('button');
    btn.className = 'sage-chip';
    btn.textContent = prompts[i];
    btn.onclick = (function(b) { return function() { askSageChip(b); }; })(btn);
    container.appendChild(btn);
  }
}

function sageNewConversation() {
  _sageHistory = [];
  _sageQuestionCount = 0;
  _sageLastCTATurn = -10;
  _sageFirstResponse = true;
  try { sessionStorage.removeItem(SAGE_SESSION_KEY); } catch(e) {}
  var msgs = document.getElementById('advisor-messages');
  if (msgs) {
    // Remove all messages but keep the welcome
    while (msgs.firstChild) msgs.removeChild(msgs.firstChild);
    // Rebuild welcome
    var welcome = document.createElement('div');
    welcome.className = 'sage-welcome';
    welcome.id = 'sage-welcome';
    welcome.innerHTML = '<div class="sage-welcome-title">SAGE</div>' +
      '<div class="sage-welcome-sub">Your tax lien and tax deed advisor. Ask me anything about states, rates, redemption periods, auctions, or how to get started.</div>' +
      '<div id="sage-arch-prompt" style="display:none;margin:8px 0;padding:8px 12px;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.15);border-radius:6px;font-size:11px;color:var(--text2)"><a onclick="switchTab(\'dna\')" style="color:var(--accent);cursor:pointer;text-decoration:none">Take DNA Quiz to personalize Sage \u2192</a></div>' +
      '<div class="sage-chips" id="sage-chips"></div>';
    msgs.appendChild(welcome);
    sageRenderChips();
    // Show/hide DNA prompt
    var archPrompt = document.getElementById('sage-arch-prompt');
    if (archPrompt) {
      archPrompt.style.display = (typeof getArchetypeKey === 'function' && getArchetypeKey()) ? 'none' : 'block';
    }
  }
}

// Restore prior session messages into the DOM
function sageReplayHistory() {
  var msgs = document.getElementById('advisor-messages');
  if (!msgs) return;
  var welcome = document.getElementById('sage-welcome');
  if (welcome) welcome.style.display = 'none';
  for (var i = 0; i < _sageHistory.length; i++) {
    var m = _sageHistory[i];
    var div = document.createElement('div');
    if (m.role === 'user') {
      div.className = 'msg user';
      div.innerHTML = '<div class="msg-label">You</div>' + escapeHtml(m.text);
    } else {
      div.className = 'msg sage';
      div.innerHTML = sanitizeHTML('<div class="msg-label">Sage</div>' + sageRenderMarkdown(m.text));
    }
    msgs.appendChild(div);
  }
  msgs.scrollTop = msgs.scrollHeight;
}

function askSageChip(btn) {
  var text = btn.textContent;
  var welcome = document.getElementById('sage-welcome');
  if (welcome) welcome.style.display = 'none';
  var input = document.getElementById('advisor-input');
  input.value = text;
  sendAdvisorMessage();
}

function renderSageCTA() {
  return '';
}

// Duplicate prompt detection
var _sageLastPrompt = '';

function sendAdvisorMessage() {
  var input = document.getElementById('advisor-input');
  var text = (input.value || '').trim();
  if (!text) return;
  var msgs = document.getElementById('advisor-messages');

  // Duplicate detection — exact same prompt back-to-back
  if (text.toLowerCase() === _sageLastPrompt.toLowerCase()) {
    var dupeDiv = document.createElement('div');
    dupeDiv.className = 'msg sage';
    dupeDiv.innerHTML = sanitizeHTML('<div class="msg-label">Sage</div><div style="font-size:12px;color:var(--text2)">You just asked that. Try rephrasing or ask something new.</div>');
    msgs.appendChild(dupeDiv);
    msgs.scrollTop = msgs.scrollHeight;
    input.value = '';
    return;
  }
  _sageLastPrompt = text;

  var welcome = document.getElementById('sage-welcome');
  if (welcome) welcome.style.display = 'none';

  var userDiv = document.createElement('div');
  userDiv.className = 'msg user';
  userDiv.innerHTML = '<div class="msg-label">You</div>' + escapeHtml(text);
  msgs.appendChild(userDiv);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  var typing = document.createElement('div');
  typing.className = 'msg sage';
  typing.innerHTML = '<div class="msg-label">Sage</div><span class="sage-typing"><span></span> <span></span> <span></span></span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  // Free user query limit (3 per session, enforced client-side) — checked before history push to avoid asymmetric state
  var _sageFreeCount = 0;
  try { _sageFreeCount = parseInt(sessionStorage.getItem('aurigen_sage_free_count') || '0', 10); } catch(e) {}
  if (!IS_PAID && _sageFreeCount >= 3) {
    typing.innerHTML = sanitizeHTML('<div class="msg-label">Sage</div><div style="font-size:13px;color:var(--text2);line-height:1.6">You\u2019ve used your 3 free Sage queries for this session. <strong>Upgrade to Full Access</strong> for unlimited AI-powered research.</div>');
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }

  _sageQuestionCount++;
  _sageHistory.push({ role: 'user', text: text });
  if (!IS_PAID) {
    _sageFreeCount++;
    try { sessionStorage.setItem('aurigen_sage_free_count', String(_sageFreeCount)); } catch(e) {}
  }

  // "Still thinking..." after 10s (future-proofing for API calls)
  var thinkingTimer = setTimeout(function() {
    var typingSpan = typing.querySelector('.sage-typing');
    if (typingSpan) typingSpan.insertAdjacentHTML('afterend', '<div style="font-size:11px;color:var(--text3);margin-top:4px">Still thinking...</div>');
  }, 10000);

  var capturedText = text;

  // Try API backend first, fall back to local pattern matcher
  var jwt = '';
  try { jwt = localStorage.getItem('aurigen_jwt') || ''; } catch(e) {}
  var archKey = typeof getArchetypeKey === 'function' ? getArchetypeKey() : '';
  var apiHistory = _sageHistory.slice(-10).map(function(h) {
    return { role: h.role === 'sage' ? 'assistant' : h.role, content: h.text };
  });

  fetch('/.netlify/functions/sage-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
    body: JSON.stringify({ message: capturedText, history: apiHistory, archetype: archKey })
  }).then(function(res) {
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
  }).then(function(data) {
    clearTimeout(thinkingTimer);
    var response = data.response || '';
    var rendered = sageRenderMarkdown(response);
    if (_sageFirstResponse) {
      rendered += '<div style="margin-top:10px;font-size:11px;color:var(--text3);line-height:1.5;">Rates and rules vary by state and county \u2014 always verify with the official authority before transacting.</div>';
      _sageFirstResponse = false;
    }
    // CTA every 3rd response for free users
    if (!IS_PAID && _sageQuestionCount % 3 === 0) {
      rendered += '<div style="margin-top:10px;font-size:11px"><a href="https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:none">Unlock unlimited Sage \u2192</a></div>';
    }
    typing.innerHTML = sanitizeHTML('<div class="msg-label">Sage</div>' + rendered);
    msgs.scrollTop = msgs.scrollHeight;
    _sageHistory.push({ role: 'sage', text: response });
    sageSaveSession();
  }).catch(function() {
    // Fallback to local pattern matcher
    clearTimeout(thinkingTimer);
    try {
      var response = getAdvisorResponse(capturedText);
      var hasCTA = response.indexOf('[CTA]') !== -1;
      var rendered = sageRenderMarkdown(response.replace(/\[CTA\]/g, renderSageCTA()));
      if (hasCTA) _sageLastCTATurn = _sageQuestionCount;
      if (_sageFirstResponse) {
        rendered += '<div style="margin-top:10px;font-size:11px;color:var(--text3);line-height:1.5;">Rates and rules vary by state and county \u2014 always verify with the official authority before transacting.</div>';
        _sageFirstResponse = false;
      }
      typing.innerHTML = sanitizeHTML('<div class="msg-label">Sage</div>' + rendered);
      msgs.scrollTop = msgs.scrollHeight;
      _sageHistory.push({ role: 'sage', text: response });
      sageSaveSession();
    } catch(err) {
      typing.innerHTML = sanitizeHTML('<div class="msg-label">Sage</div>' +
        '<div class="sage-error-card">' +
        '<div style="font-size:12px;color:var(--pink);margin-bottom:8px">Something went wrong. Please try again.</div>' +
        '</div>');
      var retryBtn = document.createElement('button');
      retryBtn.className = 'sage-retry-btn';
      retryBtn.textContent = 'Retry';
      retryBtn.addEventListener('click', sageRetryLast);
      typing.querySelector('.sage-error-card').appendChild(retryBtn);
      msgs.scrollTop = msgs.scrollHeight;
    }
  });
}

// Retry last failed message
function sageRetryLast() {
  // Remove the error card
  var msgs = document.getElementById('advisor-messages');
  if (msgs && msgs.lastChild) msgs.removeChild(msgs.lastChild);
  // Pop the failed user message from history and replay
  if (_sageHistory.length > 0 && _sageHistory[_sageHistory.length - 1].role === 'user') {
    var lastText = _sageHistory.pop().text;
    _sageQuestionCount--;
    _sageLastPrompt = ''; // Allow retry
    var input = document.getElementById('advisor-input');
    if (input) { input.value = lastText; sendAdvisorMessage(); }
  }
}

// Initialize Sage on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  sageRenderChips();
  if (sageRestoreSession()) {
    sageReplayHistory();
  }
  var inp = document.getElementById('advisor-input');
  if (inp) inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendAdvisorMessage();
  });
});

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// DOMPurify wrapper — sanitizes HTML before innerHTML assignment
// Falls back to escapeHtml stripping if DOMPurify not loaded
function sanitizeHTML(html) {
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['strong', 'em', 'code', 'br', 'div', 'span', 'a', 'button'], ALLOWED_ATTR: ['class', 'style', 'href', 'id', 'target', 'rel'] });
  }
  return escapeHtml(html);
}

