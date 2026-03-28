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
    var rendered = response.replace(/\[CTA\]/g, renderSageCTA());
    if (hasCTA) _sageLastCTATurn = _sageQuestionCount;
    if (_sageFirstResponse) {
      rendered += '<div style="margin-top:10px;font-size:11px;color:var(--text3);line-height:1.5;">Rates and rules vary by state and county \u2014 always verify with the official authority before transacting.</div>';
      _sageFirstResponse = false;
    }
    typing.innerHTML = '<div class="msg-label">Sage</div>' + rendered;
    msgs.scrollTop = msgs.scrollHeight;
    _sageHistory.push({ role: 'sage', text: response });
  }, delay);
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

