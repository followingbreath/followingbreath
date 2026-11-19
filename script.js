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

  // ---- "Right Now" items: each <li> can carry data-from and/or
  // data-until (YYYY-MM-DD). Anything outside that window today gets
  // hidden automatically, no manual cleanup needed. If every item in
  // a given box ends up hidden, the whole box hides itself rather
  // than showing an empty "Right Now" with nothing under it. To add
  // something new, just add a new <li> with its own dates (or none,
  // for something open ended) in the HTML.
  var currentLists = document.querySelectorAll('.current-list');
  currentLists.forEach(function (list) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var items = list.querySelectorAll('li');
    var anyVisible = false;

    items.forEach(function (li) {
      var from = li.getAttribute('data-from');
      var until = li.getAttribute('data-until');
      var show = true;
      if (from && today < new Date(from + 'T00:00:00')) show = false;
      if (until && today > new Date(until + 'T00:00:00')) show = false;
      li.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });

    var box = list.closest('.current-box');
    if (box) box.style.display = anyVisible ? '' : 'none';
  });
})();
