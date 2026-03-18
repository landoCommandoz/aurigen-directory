// Aurigen — Gate
// Gate screen logic: email form, code form, stats animation, pricing.
// Posts to /.netlify/functions/aurigen
// On success: hides #gate, shows #app, calls App.init()

var NETLIFY_FN = '/.netlify/functions/aurigen';

// Client-side rate limiting for code attempts
var _codeAttempts = 0;
var _codeWindowStart = 0;
var CODE_RATE_LIMIT = 5;
var CODE_RATE_WINDOW = 60000;

function isCodeRateLimited() {
  var now = Date.now();
  if (now - _codeWindowStart > CODE_RATE_WINDOW) {
    _codeWindowStart = now;
    _codeAttempts = 0;
  }
  _codeAttempts++;
  return _codeAttempts > CODE_RATE_LIMIT;
}

// ── i18n for gate ───────────────────────────────

var GATE_TEXT = {
  en: {
    eyebrow: "The Investor's Edge",
    headline: 'The Research Edge Every Tax Investor Needs',
    subheadline: 'Auction schedules, interest rates, redemption periods, and county links \u2014 all 50 states + DC.',
    emailPlaceholder: 'Enter your email for free access',
    emailBtn: 'UNLOCK FREE ACCESS',
    consent: 'I agree to receive investor tips and updates from Aurigen. Unsubscribe anytime.',
    consentRequired: 'Please check the consent box to continue.',
    codeToggle: 'Already have an access code?',
    codePlaceholder: 'Enter access code',
    codeBtn: 'Submit Access Code',
    codeError: "That code didn't match. Please check and try again.",
    connectionError: 'Connection error \u2014 please try again.',
    rateLimited: 'Too many attempts. Please wait a minute.',
    stat1: 'Jurisdictions',
    stat2: 'Auction Calendars',
    stat3: 'Free States to Start',
    legalPre: 'By entering your email, you agree to our ',
    tos: 'Terms of Service',
    legalMid: ' and ',
    privacy: 'Privacy Policy',
    pricingBadge: 'INTRODUCTORY RATE',
    pricingNote: 'One-time payment \u00B7 Introductory rate \u00B7 Price subject to change',
    pricingBtn: 'UNLOCK FULL ACCESS',
    features: [
      'All 51 jurisdictions with full data',
      'Sage AI research assistant',
      'State-by-state comparison tool',
      'Investor DNA profile matching',
      'Auction platform guides',
      'Lifetime access to all updates'
    ]
  },
  es: {
    eyebrow: 'La Ventaja del Inversionista',
    headline: 'La Herramienta de Investigaci\u00F3n que Todo Inversionista Necesita',
    subheadline: 'Calendarios de subastas, tasas de inter\u00E9s, per\u00EDodos de redenci\u00F3n y enlaces de condados \u2014 los 50 estados + DC.',
    emailPlaceholder: 'Ingrese su email para acceso gratuito',
    emailBtn: 'DESBLOQUEAR ACCESO GRATUITO',
    consent: 'Acepto recibir consejos de inversi\u00F3n y actualizaciones de Aurigen. Cancele en cualquier momento.',
    consentRequired: 'Marque la casilla de consentimiento para continuar.',
    codeToggle: '\u00BFYa tiene un c\u00F3digo de acceso?',
    codePlaceholder: 'Ingrese c\u00F3digo de acceso',
    codeBtn: 'Enviar C\u00F3digo',
    codeError: 'Ese c\u00F3digo no coincide. Verifique e intente de nuevo.',
    connectionError: 'Error de conexi\u00F3n \u2014 intente de nuevo.',
    rateLimited: 'Demasiados intentos. Espere un minuto.',
    stat1: 'Jurisdicciones',
    stat2: 'Calendarios de Subastas',
    stat3: 'Estados Gratuitos',
    legalPre: 'Al ingresar su email, acepta nuestros ',
    tos: 'T\u00E9rminos de Servicio',
    legalMid: ' y ',
    privacy: 'Pol\u00EDtica de Privacidad',
    pricingBadge: 'TARIFA INTRODUCTORIA',
    pricingNote: 'Pago \u00FAnico \u00B7 Tarifa introductoria \u00B7 Precio sujeto a cambio',
    pricingBtn: 'DESBLOQUEAR ACCESO COMPLETO',
    features: [
      'Las 51 jurisdicciones con datos completos',
      'Asistente de investigaci\u00F3n Sage AI',
      'Herramienta de comparaci\u00F3n estado por estado',
      'Perfil de ADN del inversionista',
      'Gu\u00EDas de plataformas de subastas',
      'Acceso de por vida a todas las actualizaciones'
    ]
  }
};

function gt(key) {
  var lang = window._initialLang || 'en';
  return (GATE_TEXT[lang] || GATE_TEXT.en)[key] || (GATE_TEXT.en[key] || '');
}

// ── Render Gate ─────────────────────────────────

function renderGate() {
  var el = document.getElementById('gate');
  if (!el) return;

  var t = gt;
  var features = (GATE_TEXT[window._initialLang || 'en'] || GATE_TEXT.en).features || [];
  var featureHTML = '';
  for (var i = 0; i < features.length; i++) {
    featureHTML += '<li>' + features[i] + '</li>';
  }

  el.innerHTML =
    '<section class="gate-hero">' +
      '<div class="gate-glow"></div>' +
      '<div class="gate-eyebrow">' + t('eyebrow') + '</div>' +
      '<h1 class="gate-logo">AURI<span>GEN</span></h1>' +
      '<p class="gate-tagline">County Resource Directory</p>' +
      '<h2 class="gate-headline">' + t('headline') + '</h2>' +
      '<p class="gate-subheadline">' + t('subheadline') + '</p>' +

      '<form class="gate-email-form" id="gate-email-form" onsubmit="handleEmailSubmit(event)">' +
        '<input type="email" class="gate-email-input" id="gate-email-input" placeholder="' + t('emailPlaceholder') + '" required autocomplete="email">' +
        '<label class="gate-consent"><input type="checkbox" id="gate-consent-check"> ' + t('consent') + '</label>' +
        '<div class="gate-code-error" id="gate-consent-error">' + t('consentRequired') + '</div>' +
        '<button type="submit" class="gate-btn-primary" id="gate-email-btn">' + t('emailBtn') + '</button>' +
      '</form>' +

      '<button class="gate-code-toggle" onclick="toggleCodeForm()">' + t('codeToggle') + '</button>' +

      '<div class="gate-code-form" id="gate-code-form">' +
        '<input type="text" class="gate-code-input" id="gate-code-input" placeholder="' + t('codePlaceholder') + '" autocomplete="off">' +
        '<div class="gate-code-error" id="gate-code-error"></div>' +
        '<button class="gate-btn-primary" onclick="handleCodeSubmit()">' + t('codeBtn') + '</button>' +
      '</div>' +

      '<div class="gate-stats">' +
        '<div class="gate-stat"><div class="gate-stat-number" id="stat-1">0</div><div class="gate-stat-label">' + t('stat1') + '</div></div>' +
        '<div class="gate-stat"><div class="gate-stat-number" id="stat-2">0</div><div class="gate-stat-label">' + t('stat2') + '</div></div>' +
        '<div class="gate-stat"><div class="gate-stat-number" id="stat-3">0</div><div class="gate-stat-label">' + t('stat3') + '</div></div>' +
      '</div>' +

      '<div class="gate-legal">' + t('legalPre') +
        '<a href="#" onclick="openLegalModal(\'tos\');return false">' + t('tos') + '</a>' +
        t('legalMid') +
        '<a href="#" onclick="openLegalModal(\'privacy\');return false">' + t('privacy') + '</a>' +
      '</div>' +
    '</section>' +

    '<section class="gate-pricing">' +
      '<div class="gate-pricing-badge">' + t('pricingBadge') + '</div>' +
      '<div class="gate-pricing-amount">$97</div>' +
      '<div class="gate-pricing-note">' + t('pricingNote') + '</div>' +
      '<ul class="gate-pricing-features">' + featureHTML + '</ul>' +
      '<a href="https://buy.stripe.com/28E6oHfcUbHufL58hQ2VG00" class="gate-btn-primary" style="display:inline-block;text-align:center;max-width:420px;width:100%">' + t('pricingBtn') + '</a>' +
    '</section>';

  // Animate stats
  animateStats();

  // Enter key on code input
  var codeInput = document.getElementById('gate-code-input');
  if (codeInput) {
    codeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleCodeSubmit();
    });
  }
}

// ── Stats Animation ─────────────────────────────

function animateStats() {
  // Hardcoded values — never derive from STATES array length
  animateCounter('stat-1', 51, 1200);
  animateCounter('stat-2', 51, 1200);
  animateCounter('stat-3', AccessManager.FREE_STATES.size, 800);
}

function animateCounter(id, target, duration) {
  var el = document.getElementById(id);
  if (!el) return;
  var start = performance.now();
  function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Toggle Code Form ────────────────────────────

function toggleCodeForm() {
  var form = document.getElementById('gate-code-form');
  if (form) form.classList.toggle('visible');
}

// ── Email Submit ────────────────────────────────

function handleEmailSubmit(e) {
  if (e) e.preventDefault();

  var consent = document.getElementById('gate-consent-check');
  var consentError = document.getElementById('gate-consent-error');
  if (consent && !consent.checked) {
    if (consentError) consentError.classList.add('show');
    return;
  }
  if (consentError) consentError.classList.remove('show');

  var input = document.getElementById('gate-email-input');
  var btn = document.getElementById('gate-email-btn');
  var email = input ? input.value.trim() : '';
  if (!email) return;

  if (btn) btn.disabled = true;

  fetch(NETLIFY_FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'capture-email', email: email, lang: window._initialLang || 'en' })
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.success) {
        AccessManager.grant(1);
        enterApp();
      } else {
        if (btn) btn.disabled = false;
      }
    })
    .catch(function () {
      if (btn) btn.disabled = false;
    });
}

// ── Code Submit ─────────────────────────────────

function handleCodeSubmit() {
  var input = document.getElementById('gate-code-input');
  var errorEl = document.getElementById('gate-code-error');
  var code = input ? input.value.trim() : '';
  if (!code) return;

  if (isCodeRateLimited()) {
    if (errorEl) { errorEl.textContent = gt('rateLimited'); errorEl.classList.add('show'); }
    return;
  }

  if (input) input.disabled = true;
  if (errorEl) errorEl.classList.remove('show');

  fetch(NETLIFY_FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'validate-code', code: code })
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.valid) {
        AccessManager.grant(2, data.token);
        // Reload state data with token to get full 51-state dataset
        reloadStateData().then(function () { enterApp(); });
      } else {
        if (input) input.disabled = false;
        if (input) input.classList.add('error');
        if (errorEl) { errorEl.textContent = data.message || gt('codeError'); errorEl.classList.add('show'); }
        setTimeout(function () { if (input) input.classList.remove('error'); }, 400);
      }
    })
    .catch(function () {
      if (input) input.disabled = false;
      if (errorEl) { errorEl.textContent = gt('connectionError'); errorEl.classList.add('show'); }
    });
}

// ── Reload State Data ───────────────────────────

function reloadStateData() {
  var lang = (window.LanguageManager ? LanguageManager.getLang() : window._initialLang) || 'en';
  var token = AccessManager.getToken();
  var headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;

  return fetch('/.netlify/functions/get-states?lang=' + lang, { headers: headers })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (js) { new Function(js)(); })
    .catch(function (e) { console.error('[GATE] State data reload failed:', e); });
}

// ── Enter App ───────────────────────────────────

function enterApp() {
  var gate = document.getElementById('gate');
  var app = document.getElementById('app');
  if (gate) gate.classList.add('hidden');
  if (app) app.removeAttribute('hidden');
  if (window.App && typeof App.init === 'function') App.init();
}

// ── Legal Modal Stub ────────────────────────────

function openLegalModal(type) {
  // Will be implemented in Phase 3
  console.log('[GATE] Legal modal: ' + type);
}

// ── Init ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  var level = AccessManager.restore();

  if (level >= 1) {
    // Already authenticated — skip gate
    enterApp();
  } else {
    renderGate();
  }
});
