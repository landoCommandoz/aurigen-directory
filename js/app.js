// Aurigen — App Orchestrator
// Initializes all managers. Handles tab switching and rendering.
// Called by gate.js after authentication.

var App = {
  _initialized: false,
  _exploreView: 'map', // 'map' or 'list' — map is default

  init: function () {
    if (this._initialized) return;
    this._initialized = true;

    try {
      // 1. Restore access level (already done in gate.js but safe to repeat)
      AccessManager.restore();

      // 2. Restore language and set window.STATES
      LanguageManager.restore();

      // 3. Initialize nav with correct tabs for current level
      NavManager.init();

      // 4. Set up language toggle button
      this._setupLangToggle();

      // 5. Activate first visible tab
      var level = AccessManager.getLevel();
      var tabs = NAV_TABS[level] || [];
      if (tabs.length > 0) {
        NavManager.switchTab(tabs[0]);
      }

      console.log('[APP] Initialized, level=' + level);
    } catch (e) {
      console.error('[APP] Init failed:', e);
      this._renderError();
    }
  },

  // ── Tab Rendering ───────────────────────────────

  renderTab: function (id) {
    var content = document.getElementById('tab-content');
    if (!content) return;

    switch (id) {
      case 'explore':
        this._renderExplore(content);
        break;
      case 'tools':
        this._renderTools(content);
        break;
      case 'pulse':
        this._renderPlaceholder(content, 'Auction Pulse', 'Coming in Phase 2');
        break;
      case 'advisor':
        this._renderPlaceholder(content, 'Sage AI Advisor', 'Coming in Phase 2');
        break;
      case 'vs':
        this._renderPlaceholder(content, 'State Comparison', 'Coming in Phase 2');
        break;
      case 'deal-tape':
        this._renderPlaceholder(content, 'Deal Tape', 'Coming in Phase 2');
        break;
      case 'dna':
        this._renderPlaceholder(content, 'Investor DNA', 'Coming in Phase 2');
        break;
      case 'auctions':
        this._renderPlaceholder(content, 'Auctions', 'Coming in Phase 2');
        break;
      case 'account':
        this._renderAccount(content);
        break;
      default:
        content.innerHTML = '';
    }
  },

  // ── Explore Tab ─────────────────────────────────

  _renderExplore: function (container) {
    var lang = LanguageManager.getLang();
    var view = this._exploreView;

    var html = '<div style="padding:20px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">';
    html += '<h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;letter-spacing:0.04em;margin:0;color:var(--text-primary)">';
    html += (lang === 'es' ? 'Explorar Estados' : 'Explore States');
    html += '</h2>';
    html += '<div class="explore-view-toggle">';
    html += '<button class="explore-view-btn' + (view === 'map' ? ' active' : '') + '" onclick="App.setExploreView(\'map\')">&#9707; ' + (lang === 'es' ? 'Mapa' : 'Map') + '</button>';
    html += '<button class="explore-view-btn' + (view === 'list' ? ' active' : '') + '" onclick="App.setExploreView(\'list\')">&#8942; ' + (lang === 'es' ? 'Lista' : 'List') + '</button>';
    html += '</div></div>';

    if (view === 'map') {
      html += MapManager.getHTML();
    } else {
      html += this._getListHTML();
    }

    html += '</div>';
    container.innerHTML = html;

    // Init D3 map after DOM is ready
    if (view === 'map') {
      MapManager.init();
    }
  },

  setExploreView: function (view) {
    this._exploreView = view;
    var content = document.getElementById('tab-content');
    if (content) this._renderExplore(content);
  },

  _getListHTML: function () {
    var states = window.STATES || window.STATES_EN || [];
    var lang = LanguageManager.getLang();
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">';

    for (var i = 0; i < states.length; i++) {
      var s = states[i];
      var locked = !AccessManager.canAccessState(s.id);
      var typeColor = s.type === 'lien' ? 'var(--color-lien)' :
                      s.type === 'deed' ? 'var(--color-deed)' :
                      s.type === 'hybrid' ? 'var(--color-hybrid)' : 'var(--color-rdeed)';

      html += '<div style="background:var(--bg-card);border:1px solid ' + (locked ? 'var(--border)' : 'var(--border-hover)') + ';border-radius:var(--radius);padding:16px;cursor:pointer;transition:transform 0.2s,border-color 0.2s;opacity:' + (locked ? '0.5' : '1') + '"';
      html += ' onclick="App.openState(\'' + s.id + '\')">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
      html += '<strong style="font-size:16px;">' + s.name + '</strong>';
      html += '<span style="font-size:11px;color:' + typeColor + ';text-transform:uppercase;font-weight:700;letter-spacing:0.05em">' + s.type + '</span>';
      html += '</div>';

      if (locked) {
        html += '<div style="font-size:13px;color:var(--text-dim);">\uD83D\uDD12 ' + (lang === 'es' ? 'Desbloquear con acceso completo' : 'Unlock with full access') + '</div>';
      } else {
        html += '<div style="font-size:13px;color:var(--text-secondary);display:flex;gap:12px;">';
        html += '<span>' + (s.rate || '\u2014') + '</span>';
        html += '<span>' + (s.redemption || '\u2014') + '</span>';
        if (s.investorScore !== undefined) html += '<span>Score: ' + s.investorScore + '</span>';
        html += '</div>';
        if (s.investorAlert) {
          html += '<div style="font-size:11px;color:var(--color-error,#e05555);margin-top:6px;line-height:1.4;">\u26A0\uFE0F Alert</div>';
        }
      }

      html += '</div>';
    }

    html += '</div>';
    return html;
  },

  // ── Tools Tab ───────────────────────────────────

  _renderTools: function (container) {
    var lang = LanguageManager.getLang();
    var html = '<div style="padding:20px;">';
    html += '<h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;letter-spacing:0.04em;margin-bottom:16px;color:var(--text-primary)">';
    html += (lang === 'es' ? 'Herramientas' : 'Tools');
    html += '</h2>';
    html += '<p style="color:var(--text-secondary);margin-bottom:20px;">' +
      (lang === 'es' ? 'Calculadora de inversiones y herramientas de an\u00E1lisis.' : 'Investment calculators and analysis tools.') + '</p>';
    html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;">';
    html += '<h3 style="font-size:18px;margin-bottom:12px;">' + (lang === 'es' ? 'Analizador de Ofertas' : 'Deal Analyzer') + '</h3>';
    html += '<p style="color:var(--text-secondary);font-size:14px;">' + (lang === 'es' ? 'Disponible en Fase 2' : 'Coming in Phase 2') + '</p>';
    html += '</div></div>';
    container.innerHTML = html;
  },

  // ── Account Tab ─────────────────────────────────

  _renderAccount: function (container) {
    var level = AccessManager.getLevel();
    var lang = LanguageManager.getLang();
    var html = '<div style="padding:20px;">';
    html += '<h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;letter-spacing:0.04em;margin-bottom:16px;color:var(--text-primary)">';
    html += (lang === 'es' ? 'Cuenta' : 'Account');
    html += '</h2>';

    html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">';
    html += '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">' + (lang === 'es' ? 'Nivel de Acceso' : 'Access Level') + '</div>';
    html += '<div style="font-size:24px;font-weight:700;color:' + (level >= 2 ? 'var(--color-success)' : 'var(--accent)') + '">';
    html += level >= 2 ? (lang === 'es' ? 'Acceso Completo' : 'Full Access') : (lang === 'es' ? 'Acceso Gratuito' : 'Free Access');
    html += '</div></div>';

    if (level < 2) {
      html += '<a href="https://buy.stripe.com/28E6oHfcUbHufL58hQ2VG00" style="display:block;text-align:center;background:var(--accent);color:var(--bg-primary);padding:16px;border-radius:var(--radius);font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;">';
      html += lang === 'es' ? 'DESBLOQUEAR ACCESO COMPLETO' : 'UNLOCK FULL ACCESS';
      html += '</a>';
    }

    // Language toggle
    html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">';
    html += '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">' + (lang === 'es' ? 'Idioma' : 'Language') + '</div>';
    html += '<button onclick="App.toggleLang()" style="background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);padding:10px 20px;border-radius:var(--radius-sm);cursor:pointer;font-size:14px;">';
    html += lang === 'en' ? '\uD83C\uDDEA\uD83C\uDDF8 Cambiar a Espa\u00F1ol' : '\uD83C\uDDFA\uD83C\uDDF8 Switch to English';
    html += '</button></div>';

    html += '</div>';
    container.innerHTML = html;
  },

  // ── Placeholder Tab ─────────────────────────────

  _renderPlaceholder: function (container, title, subtitle) {
    container.innerHTML =
      '<div style="padding:40px 20px;text-align:center;">' +
      '<h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:32px;letter-spacing:0.04em;color:var(--text-primary);margin-bottom:8px;">' + title + '</h2>' +
      '<p style="color:var(--text-secondary);font-size:14px;">' + subtitle + '</p>' +
      '</div>';
  },

  // ── State Panel ─────────────────────────────────

  openState: function (id) { StatePanel.open(id); },
  closeStatePanel: function () { StatePanel.close(); },

  // ── Language Toggle ─────────────────────────────

  toggleLang: function () {
    // Both STATES_EN and STATES_ES are already loaded via static script tags.
    // toggle() calls apply() which picks the correct one from memory.
    LanguageManager.toggle();
  },

  _setupLangToggle: function () {
    // Language toggle will be rendered in nav or account tab
  },

  // ── Language Change Handler ─────────────────────

  onLanguageChange: function (lang, data) {
    NavManager.updateLabels(lang);
    var activeTab = NavManager.getActiveTab();
    if (activeTab) this.renderTab(activeTab);
  },

  // ── Error Fallback ──────────────────────────────

  _renderError: function () {
    var content = document.getElementById('tab-content');
    if (content) {
      content.innerHTML =
        '<div style="padding:40px 20px;text-align:center;">' +
        '<h2 style="color:var(--color-error);font-size:20px;margin-bottom:8px;">Something went wrong</h2>' +
        '<p style="color:var(--text-secondary);font-size:14px;">Please refresh the page. If this continues, contact support@theaurigen.com</p>' +
        '</div>';
    }
  }
};
