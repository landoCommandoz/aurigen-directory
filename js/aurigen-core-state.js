// === STATE ===
const APP = {
  tier: 0,          // 0=gate, 1=free, 2=paid
  email: null,
  activeTab: 'map',
  freeStates: ['FL','IL','AZ'],
  selectedState: null
};

// === ACCESS TIER ===
// Admin detection via server-issued JWT isAdmin flag — no client-side email whitelist
function isAdminMode() {
  try {
    if (localStorage.getItem('aurigen_admin') !== 'on') return false;
    return localStorage.getItem('aurigen_is_admin') === 'true';
  } catch(e) { return false; }
}
function getAccessTier() {
  if (isAdminMode()) return 'paid';
  try { return localStorage.getItem('aurigen_access') || 'none'; } catch(e) { return 'none'; }
}
var IS_PAID = getAccessTier() === 'paid';
var IS_FREE = getAccessTier() === 'free' || IS_PAID;

// Read tier from localStorage (set by gate.html)
(function initFromGate() {
  try {
    var access = localStorage.getItem('aurigen_access');
    if (access === 'paid') APP.tier = 2;
    else APP.tier = 1;
    var email = localStorage.getItem('aurigen_email');
    if (email) APP.email = email;
  } catch(e) {}
})();

var STRIPE_URL = 'https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02';

function applyAccessLocks() {
  // Tab-level locks (paid only) — includes Auctions now
  var tabLocks = ['lock-dna-tab', 'lock-advisor-tab', 'lock-tools-tab', 'lock-scout-tab', 'lock-warbook-tab', 'lock-deadlines-tab', 'lock-recon-tab', 'lock-dossier-tab', 'lock-auctions-tab'];
  tabLocks.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = IS_PAID ? 'none' : 'flex';
  });

  // Versus uses its own paid/free toggle (terminal vs locked preview)
  var vsTerminal = document.getElementById('vs-terminal-paid');
  var vsLocked = document.getElementById('vs-locked-free');
  if (vsTerminal) vsTerminal.style.display = IS_PAID ? 'flex' : 'none';
  if (vsLocked) vsLocked.style.display = IS_PAID ? 'none' : 'flex';

  // Hard lock: add tab-locked class to prevent interaction behind overlay
  var lockPanelMap = {
    'lock-dna-tab': 'panel-dna',
    'lock-advisor-tab': 'panel-advisor',
    'lock-tools-tab': 'panel-tools',
    'lock-scout-tab': 'panel-scout',
    'lock-warbook-tab': 'panel-warbook',
    'lock-deadlines-tab': 'panel-deadlines',
    'lock-recon-tab': 'panel-recon',
    'lock-dossier-tab': 'panel-dossier',
    'lock-auctions-tab': 'panel-auctions'
  };
  // Versus uses tab-locked for FOUC prevention (hides terminal until JS runs)
  var versusPanel = document.getElementById('panel-versus');
  if (versusPanel) {
    if (IS_PAID) { versusPanel.classList.remove('tab-locked'); }
    else { versusPanel.classList.add('tab-locked'); }
  }
  Object.keys(lockPanelMap).forEach(function(lockId) {
    var panel = document.getElementById(lockPanelMap[lockId]);
    if (panel) {
      if (IS_PAID) { panel.classList.remove('tab-locked'); }
      else { panel.classList.add('tab-locked'); }
    }
  });

  // Existing tool card locks
  var cardLocks = ['lock-dna', 'lock-compare'];
  cardLocks.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = IS_PAID ? 'none' : 'flex';
  });

  // Pulse drawer lock
  var pulseLock = document.getElementById('lock-pulse');
  if (pulseLock) pulseLock.style.display = IS_PAID ? 'none' : 'flex';

  // Upgrade CTA in account
  var upgrade = document.getElementById('acct-upgrade');
  if (upgrade) upgrade.style.display = IS_PAID ? 'none' : 'block';
}

// Lock county data in state detail modal (called after counties render)
function applyCountyLock() {
  if (IS_PAID) return;
  var countiesEl = document.getElementById('panel-counties');
  if (!countiesEl) return;
  // Check if lock already applied
  if (countiesEl.querySelector('.paywall-lock')) return;
  var list = countiesEl.querySelector('.counties-list');
  if (list) list.classList.add('counties-blur');
  var lock = document.createElement('div');
  lock.className = 'paywall-lock';
  lock.style.cssText = 'position:relative;inset:auto;margin-top:12px;border-radius:10px;background:rgba(6,6,10,0.85);padding:20px';
  lock.innerHTML = '<span class="paywall-lock-icon">\uD83D\uDD12</span>' +
    '<span class="paywall-lock-title">County Data</span>' +
    '<span class="paywall-lock-sub">Unlock all county details, platform links, and OTC availability.</span>' +
    '<a class="paywall-lock-btn" href="' + STRIPE_URL + '" target="_blank" rel="noopener noreferrer">Unlock Full Access \u2014 $197<span class="paywall-lock-btn-sub">Comparable tools charge $200+/month. You pay once.</span></a>';
  countiesEl.appendChild(lock);
}

// Limit auctions to 3 cards for free users
function applyAuctionLock() {
  if (IS_PAID) return;
  var container = document.getElementById('auctions-cards');
  if (!container || container.querySelector('.paywall-lock')) return;
  var cards = container.querySelectorAll('.auction-card');
  for (var i = 3; i < cards.length; i++) {
    cards[i].style.display = 'none';
  }
  var lock = document.createElement('div');
  lock.className = 'paywall-lock';
  lock.style.cssText = 'position:relative;inset:auto;margin-top:12px;border-radius:10px;background:rgba(6,6,10,0.85);padding:24px';
  lock.innerHTML = '<span class="paywall-lock-icon">\uD83D\uDD12</span>' +
    '<span class="paywall-lock-title">Full Auction Calendar</span>' +
    '<span class="paywall-lock-sub">Unlock all auction dates, registration deadlines, and platform links.</span>' +
    '<a class="paywall-lock-btn" href="' + STRIPE_URL + '" target="_blank" rel="noopener noreferrer">Unlock Full Access \u2014 $197<span class="paywall-lock-btn-sub">Comparable tools charge $200+/month. You pay once.</span></a>';
  container.appendChild(lock);
}

// Limit Pulse to 1 alert for free users
function applyPulseLock() {
  if (IS_PAID) return;
  var feed = document.getElementById('pulse-feed');
  if (!feed || feed.querySelector('.paywall-lock')) return;
  var alerts = feed.querySelectorAll('.pulse-alert');
  for (var i = 1; i < alerts.length; i++) {
    alerts[i].style.display = 'none';
  }
  var lock = document.createElement('div');
  lock.className = 'paywall-lock';
  lock.style.cssText = 'position:relative;inset:auto;margin-top:8px;border-radius:10px;background:rgba(6,6,10,0.85);padding:20px';
  lock.innerHTML = '<span class="paywall-lock-icon">\uD83D\uDD12</span>' +
    '<span class="paywall-lock-title">All Alerts</span>' +
    '<span class="paywall-lock-sub">Unlock full alert feed with law changes and auction updates.</span>' +
    '<a class="paywall-lock-btn" href="' + STRIPE_URL + '" target="_blank" rel="noopener noreferrer">Unlock Full Access \u2014 $197<span class="paywall-lock-btn-sub">Comparable tools charge $200+/month. You pay once.</span></a>';
  feed.appendChild(lock);
}

// Boot app after all functions are defined
document.addEventListener('DOMContentLoaded', function() {
  updateTierBadge();
  applyAccessLocks();
  bootApp();
  // Apply saved language
  applyLanguage(LANG);
  updateNavFilterBtn();
  window.addEventListener('resize', updateNavFilterBtn);
});

function updateTierBadge() {
  const badge = document.getElementById('nav-tier-badge');
  if (APP.tier >= 2) {
    badge.textContent = t('nav_tier_paid');
    badge.classList.add('paid');
  } else {
    badge.textContent = t('nav_tier_free');
    badge.classList.remove('paid');
  }
}

// === TAB SWITCHING ===
var TOOLS_TABS = ['dna', 'advisor', 'tools', 'versus', 'scout', 'warbook', 'deadlines', 'recon', 'dossier'];

function switchTab(name) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // For tools subtabs, highlight the tools menu trigger
  var navEl = document.getElementById('tab-' + name);
  if (navEl) {
    navEl.classList.add('active');
  } else if (TOOLS_TABS.indexOf(name) >= 0) {
    var trigger = document.getElementById('tab-tools-menu');
    if (trigger) trigger.classList.add('active');
  }
  document.getElementById('panel-' + name).classList.add('active');
  APP.activeTab = name;
  closeToolsMenu();
  if(typeof updateNavFilterBtn==='function') updateNavFilterBtn();
  // Lazy init for Warbook and Deadlines
  if (name === 'warbook' && typeof initWarbook === 'function') initWarbook();
  if (name === 'deadlines' && typeof initDeadlines === 'function') initDeadlines();
  if (name === 'recon' && typeof initRecon === 'function') initRecon();
  if (name === 'dossier' && typeof initDossier === 'function') initDossier();
}

function toggleToolsMenu(e) {
  if (e) e.stopPropagation();
  var dd = document.getElementById('tools-dropdown');
  var trigger = document.getElementById('tab-tools-menu');
  if (dd.classList.contains('open')) {
    closeToolsMenu();
  } else {
    dd.classList.add('open');
    trigger.classList.add('open');
  }
}

function closeToolsMenu() {
  var dd = document.getElementById('tools-dropdown');
  var trigger = document.getElementById('tab-tools-menu');
  if (dd) dd.classList.remove('open');
  if (trigger) trigger.classList.remove('open');
}

function switchToolsTab(name) {
  switchTab(name);
}

// Close tools dropdown when clicking elsewhere
document.addEventListener('click', function(e) {
  var dd = document.getElementById('tools-dropdown');
  var trigger = document.getElementById('tab-tools-menu');
  if (dd && dd.classList.contains('open') && !dd.contains(e.target) && !trigger.contains(e.target)) {
    closeToolsMenu();
  }
});

