/**
* i18n - PT/EN translations shared by every page.
*
* - Portuguese is the default and comes straight from the HTML: any element with
*   data-i18n="key" (or data-i18n-aria="key" for aria-label) keeps its PT text in the markup.
* - English strings live in `shared.en` below (common to all pages) and in
*   window.PAGE_I18N = { en: { ... } }, defined by each page before this file.
* - The chosen language is saved in localStorage, so it carries over between pages.
* - Fires `i18n:change` on document ({ detail: { lang } }) after each switch.
*/

(function() {
  "use strict";

  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = 'pt';

  const shared = {
    en: {
      home: "Home",
      about: "About",
      skills: "Skills",
      portfolio: "Portfolio",
      contact: "Contact",
      "lang-switch": "PT",
      "lang-switch-label": "Switch language to Portuguese",
      "open-menu": "Open menu",
      "back-to-top": "Back to top",
      "all-rights": "All Rights Reserved",
      "designed-by": "Designed by",
      "project-info": "Project information",
      category: "Category",
      "project-date": "Project date",
      tecs: "Technologies",
      "view-github": "View on GitHub",
      "about-project": "About the project"
    }
  };

  const page = window.PAGE_I18N || {};
  const strings = {
    pt: {},
    en: Object.assign({}, shared.en, page.en)
  };

  // Capture the Portuguese strings from the markup before anything is translated
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!(key in strings.pt)) {
      strings.pt[key] = el.innerHTML.trim();
    }
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (!(key in strings.pt)) {
      strings.pt[key] = el.getAttribute('aria-label');
    }
  });

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && strings[stored]) {
        return stored;
      }
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  let currentLang = getStoredLang();

  function applyLanguage(lang) {
    const dict = strings[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = dict[el.getAttribute('data-i18n')];
      if (value !== undefined) {
        el.innerHTML = value;
      }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const value = dict[el.getAttribute('data-i18n-aria')];
      if (value !== undefined) {
        el.setAttribute('aria-label', value);
      }
    });

    document.dispatchEvent(new CustomEvent('i18n:change', {
      detail: { lang }
    }));
  }

  document.querySelectorAll('.lang-switch').forEach(button => {
    button.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      storeLang(currentLang);
      applyLanguage(currentLang);
    });
  });

  window.i18n = {
    get lang() {
      return currentLang;
    }
  };

  applyLanguage(currentLang);

})();
