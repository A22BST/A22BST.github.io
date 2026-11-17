// Theme toggle (remembers the choice) and copy-email buttons.
(function () {
  var root = document.documentElement;
  var danish = root.lang === 'da';
  var btn = document.querySelector('[data-theme-toggle]');

  function current() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function label() {
    if (btn) btn.textContent = current() === 'dark' ? (danish ? 'Lys' : 'Light') : (danish ? 'Mørk' : 'Dark');
  }
  if (btn) {
    label();
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () {
        var old = b.textContent;
        b.textContent = danish ? 'Kopieret' : 'Copied';
        setTimeout(function () { b.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectFallback(b); });
      } else {
        selectFallback(b);
      }
    });
  });
  function selectFallback(b) {
    var target = document.getElementById(b.getAttribute('aria-controls'));
    if (!target) return;
    var range = document.createRange();
    range.selectNodeContents(target);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('video[autoplay]'), function (video) {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }
})();
