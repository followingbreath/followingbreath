(function () {
  // ---- Theme toggle ----
  var toggle = document.getElementById('themeToggle');
  var root = document.body;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.textContent = theme === 'dark' ? 'Day' : 'Night';
  }

  var saved = 'light';
  try {
    saved = localStorage.getItem('fb-theme') || 'light';
  } catch (e) {}
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('fb-theme', next);
      } catch (e) {}
    });
  }

  // ---- Sticky header: condense once the page has scrolled ----
  var header = document.querySelector('header');
  if (header) {
    var lastState = false;
    var onScroll = function () {
      var scrolled = window.scrollY > 24;
      if (scrolled !== lastState) {
        header.classList.toggle('is-scrolled', scrolled);
        lastState = scrolled;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- FAQ accordion ----
  // Progressive enhancement only: the collapsed look in styles.css is
  // scoped to body.js-ready, which this script adds. If this script
  // never runs, every FAQ answer stays fully visible by default.
  root.classList.add('js-ready');

  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var h3 = item.querySelector('h3');
    if (!h3) return;
    h3.setAttribute('role', 'button');
    h3.setAttribute('tabindex', '0');
    h3.setAttribute('aria-expanded', 'false');

    var toggleItem = function () {
      var isOpen = item.classList.toggle('is-open');
      h3.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    h3.addEventListener('click', toggleItem);
    h3.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem();
      }
    });
  });
})();
