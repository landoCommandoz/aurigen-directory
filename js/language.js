// Aurigen — LanguageManager
// Handles EN/ES toggle only.
// NEVER writes access state.
// NEVER reads aug_paid or aug_entered.
// Calls AccessManager.revalidate() at start of toggle then drops reference.

// ── V2 Data Adapter ──────────────────────────────────────────
// Merges states-data-v2.js fields into the active STATES array.
// - Enriches existing entries (matched by code→id) with v2 fields
// - Appends v2-only entries with old-schema compatibility shim
function mergeV2Data() {
  var v2 = window.STATES_V2;
  var states = window.STATES;
  if (!v2 || !v2.length || !states || !states.length) return;

  // Build lookup of existing STATES by id
  var existingById = {};
  for (var i = 0; i < states.length; i++) {
    existingById[states[i].id] = states[i];
  }

  for (var j = 0; j < v2.length; j++) {
    var v = v2[j];
    var existing = existingById[v.code];
    if (existing) {
      // Enrich existing entry with v2-only fields
      existing.statute       = v.statute       || existing.statute;
      existing.officialLink  = v.officialLink  || existing.officialLink;
      existing.keyNotes      = v.keyNotes      || existing.keyNotes;
      existing.investorAlert = v.investorAlert || existing.investorAlert;
      existing.bidMethod     = v.bidMethod     || existing.bidMethod;
      existing.auctionPlatformV2 = v.auctionPlatform || existing.auctionPlatformV2;
      existing.auctionTimingV2   = v.auctionTiming   || existing.auctionTimingV2;
      existing.rateNote      = v.rateNote      || existing.rateNote;
      if (v.pendingLegislation && v.pendingLegislation.length) {
        existing.pendingLegislation = v.pendingLegislation;
      }
    } else {
      // v2-only entry — create old-schema compatible object
      states.push({
        id:               v.code,
        name:             v.name,
        type:             v.type,
        rate:             v.rate,
        redemption:       v.redemption,
        score:            0,
        beginnerFriendly: false,
        notBeginnerReason: '',
        scoreWhy:         '',
        note:             v.rateNote || '',
        typeWhy:          '',
        rateWhy:          v.rateNote || '',
        beginnerTip:      '',
        risks:            [],
        ddExtra:          [],
        auctionSignup:    null,
        otc:              null,
        platforms:        [v.auctionPlatform || ''],
        tylerCompliance:  null,
        counties:         [],
        // v2 fields
        statute:          v.statute,
        officialLink:     v.officialLink,
        keyNotes:         v.keyNotes || [],
        investorAlert:    v.investorAlert,
        bidMethod:        v.bidMethod,
        auctionPlatformV2: v.auctionPlatform,
        auctionTimingV2:  v.auctionTiming,
        rateNote:         v.rateNote,
        pendingLegislation: v.pendingLegislation || []
      });
    }
  }
}

var LanguageManager = {
  _busy: false,

  getLang: function () {
    try {
      return localStorage.getItem('aurigen_lang') || 'en';
    } catch (e) { return 'en'; }
  },

  setLang: function (lang) {
    try {
      localStorage.setItem('aurigen_lang', lang);
    } catch (e) {}
  },

  toggle: function () {
    if (this._busy) return;
    this._busy = true;

    // Revalidate access — then drop reference. Never modify access state.
    AccessManager.revalidate();

    var next = this.getLang() === 'en' ? 'es' : 'en';
    this.setLang(next);
    this.apply();
    this._busy = false;
  },

  apply: function () {
    var lang = this.getLang();
    // Load correct state data
    var data = lang === 'es' ? (window.STATES_ES || []) : (window.STATES_EN || []);
    window.STATES = data;

    // Merge v2 enhanced data (statute, keyNotes, investorAlert, pendingLegislation)
    mergeV2Data();

    // Update document lang attribute
    document.documentElement.lang = lang;

    // Trigger app re-render if available
    if (window.App && typeof App.onLanguageChange === 'function') {
      App.onLanguageChange(lang, data);
    }
  },

  restore: function () {
    this.apply();
  }
};
