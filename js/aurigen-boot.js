// === BOOT ===
function bootApp() {
  initMap();
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
    el.innerHTML =
      '<div>RATE: ' + escapeHtml(a) + ' ' + escapeHtml(dA.rate) + ' | ' + escapeHtml(b) + ' ' + escapeHtml(dB.rate) + '</div>' +
      '<div>REDEMPTION: ' + escapeHtml(a) + ' ' + escapeHtml(dA.redemption) + ' | ' + escapeHtml(b) + ' ' + escapeHtml(dB.redemption) + '</div>' +
      '<div>PLATFORM: ' + escapeHtml(a) + ' ' + escapeHtml(dA.platform) + ' | ' + escapeHtml(b) + ' ' + escapeHtml(dB.platform) + '</div>';
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
      div.innerHTML = '<div class="msg-label">Sage</div>' + sageRenderMarkdown(m.text);
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

function sendAdvisorMessage() {
  var input = document.getElementById('advisor-input');
  var text = (input.value || '').trim();
  if (!text) return;
  var msgs = document.getElementById('advisor-messages');

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

  _sageQuestionCount++;
  _sageHistory.push({ role: 'user', text: text });

  var delay = 600 + Math.floor(Math.random() * 600);
  setTimeout(function() {
    var response = getAdvisorResponse(text);
    var hasCTA = response.indexOf('[CTA]') !== -1;
    var rendered = sageRenderMarkdown(response.replace(/\[CTA\]/g, renderSageCTA()));
    if (hasCTA) _sageLastCTATurn = _sageQuestionCount;
    if (_sageFirstResponse) {
      rendered += '<div style="margin-top:10px;font-size:11px;color:var(--text3);line-height:1.5;">Rates and rules vary by state and county \u2014 always verify with the official authority before transacting.</div>';
      _sageFirstResponse = false;
    }
    typing.innerHTML = '<div class="msg-label">Sage</div>' + rendered;
    msgs.scrollTop = msgs.scrollHeight;
    _sageHistory.push({ role: 'sage', text: response });
    sageSaveSession();
  }, delay);
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

