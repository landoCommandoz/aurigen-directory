// Aurigen — NavManager
// Controls tab visibility. Derives ALL visibility from AccessManager.getLevel().
// NEVER reads state.isPaid directly.
// NEVER reads localStorage directly.

var NAV_TABS = {
  0: [],
  1: ['explore', 'tools'],
  2: ['explore', 'pulse', 'tools', 'advisor', 'vs', 'deal-tape', 'dna', 'auctions', 'account']
};

var NAV_LABELS = {
  en: {
    explore: 'Explore', pulse: 'Pulse', tools: 'Tools', advisor: 'Sage',
    vs: 'Compare', 'deal-tape': 'Deal Tape', dna: 'DNA', auctions: 'Auctions', account: 'Account'
  },
  es: {
    explore: 'Explorar', pulse: 'Pulso', tools: 'Herramientas', advisor: 'Sage',
    vs: 'Comparar', 'deal-tape': 'Ofertas', dna: 'ADN', auctions: 'Subastas', account: 'Cuenta'
  }
};

var NAV_ICONS = {
  explore: '\uD83D\uDDFA\uFE0F',
  pulse: '\uD83D\uDCC5',
  tools: '\uD83D\uDEE0\uFE0F',
  advisor: '\uD83E\uDDD9',
  vs: '\u2696\uFE0F',
  'deal-tape': '\uD83C\uDFAC',
  dna: '\uD83E\uDDEC',
  auctions: '\uD83D\uDD28',
  account: '\u2699\uFE0F'
};

var NavManager = {
  _activeTab: null,

  init: function () {
    var level = AccessManager.getLevel();
    this._renderNav();
    this.showTabs(level);
    AccessManager.onChange(function (l) { NavManager.showTabs(l); });
  },

  _renderNav: function () {
    var nav = document.getElementById('bottom-nav');
    if (!nav) return;

    var lang = LanguageManager.getLang();
    var labels = NAV_LABELS[lang] || NAV_LABELS.en;
    var allTabs = NAV_TABS[2]; // render all, visibility controlled by showTabs
    var html = '';

    for (var i = 0; i < allTabs.length; i++) {
      var id = allTabs[i];
      html += '<button class="nav-tab" data-tab="' + id + '" onclick="NavManager.switchTab(\'' + id + '\')">';
      html += '<span class="nav-icon">' + (NAV_ICONS[id] || '') + '</span>';
      html += '<span class="nav-label">' + (labels[id] || id) + '</span>';
      html += '</button>';
    }

    nav.innerHTML = html;
  },

  showTabs: function (level) {
    var visible = NAV_TABS[level] || [];
    var tabs = document.querySelectorAll('[data-tab]');
    for (var i = 0; i < tabs.length; i++) {
      var id = tabs[i].dataset.tab;
      tabs[i].style.display = visible.indexOf(id) !== -1 ? 'flex' : 'none';
    }
    // If active tab is no longer visible, switch to first visible
    if (this._activeTab && visible.indexOf(this._activeTab) === -1 && visible.length > 0) {
      this.switchTab(visible[0]);
    }
  },

  switchTab: function (id) {
    if (!this.canViewTab(id)) return;
    this._activeTab = id;

    // Update nav button states
    var tabs = document.querySelectorAll('[data-tab]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.tab === id);
    }

    // Trigger app to render tab content
    if (window.App && typeof App.renderTab === 'function') {
      App.renderTab(id);
    }
  },

  canViewTab: function (id) {
    var level = AccessManager.getLevel();
    return (NAV_TABS[level] || []).indexOf(id) !== -1;
  },

  getActiveTab: function () {
    return this._activeTab;
  },

  updateLabels: function (lang) {
    var labels = NAV_LABELS[lang] || NAV_LABELS.en;
    var tabs = document.querySelectorAll('[data-tab]');
    for (var i = 0; i < tabs.length; i++) {
      var id = tabs[i].dataset.tab;
      var labelEl = tabs[i].querySelector('.nav-label');
      if (labelEl) labelEl.textContent = labels[id] || id;
    }
  }
};
