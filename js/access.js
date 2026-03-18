// Aurigen — AccessManager
// Single source of truth for access state.
// NEVER import this from language.js
// NEVER read state.lang here
// NEVER write state.lang here

var AccessManager = {
  LEVELS: { NONE: 0, FREE: 1, PAID: 2 },
  FREE_STATES: new Set(['FL', 'IL', 'AZ']),

  getLevel: function () {
    try {
      var p = localStorage.getItem('aug_paid');
      if (p === 'true') return 2;
      var e = localStorage.getItem('aug_entered');
      if (e === 'true') return 1;
    } catch (e) { /* localStorage unavailable */ }
    return 0;
  },

  setLevel: function (level) {
    try {
      if (level >= 2) {
        localStorage.setItem('aug_paid', 'true');
        localStorage.setItem('aug_entered', 'true');
      } else if (level >= 1) {
        localStorage.removeItem('aug_paid');
        localStorage.setItem('aug_entered', 'true');
      } else {
        localStorage.removeItem('aug_paid');
        localStorage.removeItem('aug_entered');
      }
    } catch (e) { /* localStorage unavailable */ }
    this._notify();
  },

  isPaid: function () { return this.getLevel() >= 2; },
  isEntered: function () { return this.getLevel() >= 1; },

  canAccessState: function (id) {
    return this.FREE_STATES.has(id) || this.isPaid();
  },

  grant: function (level, token) {
    this.setLevel(level);
    if (token) {
      try { localStorage.setItem('aug_token', token); } catch (e) {}
    }
  },

  revoke: function () {
    try {
      localStorage.removeItem('aug_paid');
      localStorage.removeItem('aug_entered');
      localStorage.removeItem('aug_token');
    } catch (e) {}
    this._notify();
  },

  getToken: function () {
    try { return localStorage.getItem('aug_token') || null; } catch (e) { return null; }
  },

  revalidate: function () {
    return this.getLevel();
  },

  restore: function () {
    return this.getLevel();
  },

  _listeners: [],
  onChange: function (fn) { this._listeners.push(fn); },
  _notify: function () {
    var level = this.getLevel();
    for (var i = 0; i < this._listeners.length; i++) {
      try { this._listeners[i](level); } catch (e) {}
    }
  }
};
