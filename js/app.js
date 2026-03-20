// Aurigen — App Orchestrator
// Initializes all managers. Handles tab switching and rendering.
// Called by gate.js after authentication.

var App = {
  _initialized: false,

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
    var states = window.STATES || window.STATES_EN || [];
    var level = AccessManager.getLevel();
    var lang = LanguageManager.getLang();

    var html = '<div style="padding:20px;">';
    html += '<h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;letter-spacing:0.04em;margin-bottom:16px;color:var(--text-primary)">';
    html += (lang === 'es' ? 'Explorar Estados' : 'Explore States');
    html += '</h2>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">';

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
        html += '<span>' + (s.rate || '—') + '</span>';
        html += '<span>' + (s.redemption || '—') + '</span>';
        if (s.investorScore !== undefined) html += '<span>Score: ' + s.investorScore + '</span>';
        html += '</div>';
        // v2: investorAlert indicator on card
        if (s.investorAlert) {
          html += '<div style="font-size:11px;color:var(--color-error,#e05555);margin-top:6px;line-height:1.4;">\u26A0\uFE0F Alert</div>';
        }
      }

      html += '</div>';
    }

    html += '</div></div>';
    container.innerHTML = html;
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

  openState: function (id) {
    if (!AccessManager.canAccessState(id)) {
      console.log('[APP] State locked: ' + id);
      return;
    }
    var states = window.STATES || [];
    var s = null;
    for (var i = 0; i < states.length; i++) {
      if (states[i].id === id) { s = states[i]; break; }
    }
    if (!s) return;

    var typeColor = s.type === 'lien' ? 'var(--color-lien)' :
                    s.type === 'deed' ? 'var(--color-deed)' :
                    s.type === 'hybrid' ? 'var(--color-hybrid)' : 'var(--color-rdeed)';

    var html = '<div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:flex-end;justify-content:center;" onclick="if(event.target===this)App.closeStatePanel()">';
    html += '<div style="background:var(--bg-secondary,#111116);border-radius:16px 16px 0 0;width:100%;max-width:600px;max-height:85vh;overflow-y:auto;padding:24px 20px 40px;" onclick="event.stopPropagation()">';

    // Drag handle
    html += '<div style="width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 16px;"></div>';

    // Header
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
    html += '<h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;letter-spacing:0.04em;margin:0;color:var(--text-primary)">' + s.name + '</h2>';
    html += '<button onclick="App.closeStatePanel()" style="background:none;border:none;color:var(--text-dim);font-size:24px;cursor:pointer;padding:4px;">\u2715</button>';
    html += '</div>';
    html += '<span style="font-size:11px;color:' + typeColor + ';text-transform:uppercase;font-weight:700;letter-spacing:0.05em">' + s.type + '</span>';

    // investorAlert banner
    if (s.investorAlert) {
      html += '<div style="background:rgba(224,85,85,0.12);border:1px solid var(--color-error,#e05555);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:13px;color:var(--color-error,#e05555);line-height:1.6;">' + s.investorAlert + '</div>';
    }

    // Stat cards
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px;">';
    html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;"><div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Rate</div><div style="font-size:14px;font-weight:600;color:var(--text-primary)">' + (s.rate || '—') + '</div></div>';
    html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;"><div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Redemption</div><div style="font-size:14px;font-weight:600;color:var(--text-primary)">' + (s.redemption || '—') + '</div></div>';
    html += '</div>';

    // rateNote
    if (s.rateNote) {
      html += '<div style="font-size:12px;color:var(--text-secondary);margin-top:10px;line-height:1.5;font-style:italic;">' + s.rateNote + '</div>';
    }

    // keyNotes
    if (s.keyNotes && s.keyNotes.length) {
      html += '<div style="margin-top:20px;"><div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">Investor Key Notes</div>';
      html += '<ul style="list-style:none;padding:0;margin:0;">';
      for (var k = 0; k < s.keyNotes.length; k++) {
        html += '<li style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;line-height:1.5;color:var(--text-secondary);"><span style="color:var(--accent);margin-right:8px;">&#9670;</span>' + s.keyNotes[k] + '</li>';
      }
      html += '</ul></div>';
    }

    // Legal citation (statute + officialLink + bidMethod + platform + timing)
    if (s.statute || s.officialLink) {
      html += '<div style="margin-top:20px;"><div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">Legal Citation</div>';
      html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px 14px;">';
      if (s.statute) html += '<div style="font-size:13px;color:var(--text-primary);font-weight:600;font-family:\'Space Mono\',monospace;margin-bottom:6px;">' + s.statute + '</div>';
      if (s.bidMethod) html += '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;"><strong>Bid method:</strong> ' + s.bidMethod + '</div>';
      if (s.auctionPlatformV2) html += '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;"><strong>Platform:</strong> ' + s.auctionPlatformV2 + '</div>';
      if (s.auctionTimingV2) html += '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;"><strong>Timing:</strong> ' + s.auctionTimingV2 + '</div>';
      if (s.officialLink) html += '<a href="' + s.officialLink + '" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:var(--accent);text-decoration:underline;">View Official Statute &#8599;</a>';
      html += '</div></div>';
    }

    // pendingLegislation
    if (s.pendingLegislation && s.pendingLegislation.length) {
      html += '<div style="margin-top:20px;"><div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">Legislative Watch</div>';
      for (var p = 0; p < s.pendingLegislation.length; p++) {
        var leg = s.pendingLegislation[p];
        html += '<div style="background:rgba(200,168,75,0.08);border:1px solid rgba(200,168,75,0.3);border-radius:8px;padding:12px 14px;margin-bottom:8px;">';
        html += '<div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:4px;">' + leg.bill + '</div>';
        html += '<div style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:6px;">' + leg.summary + '</div>';
        html += '<div style="display:flex;gap:12px;font-size:11px;color:var(--text-dim);">';
        html += '<span><strong>Status:</strong> ' + leg.status + '</span>';
        if (leg.effectiveDate) html += '<span><strong>Effective:</strong> ' + leg.effectiveDate + '</span>';
        html += '</div></div>';
      }
      html += '</div>';
    }

    // Note / overview (from old schema)
    if (s.note) {
      html += '<div style="margin-top:20px;"><div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">Overview</div>';
      html += '<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">' + s.note + '</div></div>';
    }

    // Disclaimer
    html += '<div style="margin-top:20px;padding:12px;background:var(--bg-card);border-radius:8px;font-size:11px;color:var(--text-dim);line-height:1.6;border:1px solid var(--border);">';
    html += 'This information is for educational purposes only and does not constitute legal, financial, or investment advice. Always verify current laws and consult professionals before investing.';
    html += '</div>';

    html += '</div></div>';

    // Render into modals container
    var modals = document.getElementById('modals');
    if (modals) modals.innerHTML = html;
  },

  closeStatePanel: function () {
    var modals = document.getElementById('modals');
    if (modals) modals.innerHTML = '';
  },

  // ── Language Toggle ─────────────────────────────

  toggleLang: function () {
    LanguageManager.toggle();
    // Reload state data for new language
    var lang = LanguageManager.getLang();
    var token = AccessManager.getToken();
    var headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    fetch('/.netlify/functions/get-states?lang=' + lang, { headers: headers })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (js) { new Function(js)(); LanguageManager.apply(); })
      .catch(function (e) { console.error('[APP] Lang data reload failed:', e); });
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
