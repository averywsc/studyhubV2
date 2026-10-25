/*
  Study.Hub v1 (reconstructed): settings dropdown.
  Three settings, saved in localStorage, applied as data attributes on <html>.
  The inline snippet in each page's <head> applies them before first paint.
*/
(function () {
  'use strict';

  var SETTINGS = {
    theme: { key: 'sh-theme', attr: 'theme', fallback: 'light' },
    size: { key: 'sh-text-size', attr: 'size', fallback: 'normal' },
    font: { key: 'sh-font', attr: 'font', fallback: 'default' }
  };

  var root = document.documentElement;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: setting lasts for this page only */ }
  }

  function current(name) {
    return root.dataset[SETTINGS[name].attr] || SETTINGS[name].fallback;
  }

  function apply(name, value) {
    root.dataset[SETTINGS[name].attr] = value;
  }

  function refreshButtons(panel) {
    panel.querySelectorAll('.opt').forEach(function (btn) {
      var on = current(btn.dataset.setting) === btn.dataset.value;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function init() {
    var toggle = document.getElementById('settingsBtn');
    var panel = document.getElementById('settingsPanel');
    if (!toggle || !panel) return;

    Object.keys(SETTINGS).forEach(function (name) {
      var saved = read(SETTINGS[name].key);
      if (saved) apply(name, saved);
    });
    refreshButtons(panel);

    function open() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }

    function close(returnFocus) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (panel.hidden) { open(); } else { close(false); }
    });

    panel.addEventListener('click', function (e) {
      var btn = e.target.closest('.opt');
      if (!btn) return;
      var name = btn.dataset.setting;
      apply(name, btn.dataset.value);
      write(SETTINGS[name].key, btn.dataset.value);
      refreshButtons(panel);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) close(true);
    });

    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) close(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
