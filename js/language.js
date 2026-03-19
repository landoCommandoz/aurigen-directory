// Aurigen — LanguageManager
// Handles EN/ES toggle only.
// NEVER writes access state.
// NEVER reads aug_paid or aug_entered.
// Calls AccessManager.revalidate() at start of toggle then drops reference.

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
