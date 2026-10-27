(function () {
  var D = window.ECE_DATA || {};
  var R = D.research || [], A = D.achievements || [];
  var E = (D.expo || []).slice().sort(function (a, b) { return b.year - a.year; });
  var $ = function (i) { return document.getElementById(i); };
  var field = '', ey = E.length ? E[0].year : null;
  var VIEWS = ['archive', 'achievements', 'expo'];
  var CAM = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  // Placeholder box; the real image covers it when the file exists.
  function pic(src, label) {
    return '<div class="ph' + (src ? ' zoom' : '') + '"><span>' + CAM + esc(label || 'Photo') + '</span>' +
      (src ? '<img src="' + esc(src) + '" alt="' + esc(label || '') + '" loading="lazy" onerror="this.remove()">' : '') + '</div>';
  }

  $('dept').textContent = D.department || 'Electronics Engineering Department';
  $('headline').textContent = D.headline || 'ECE Research';
  $('tagline').textContent = D.tagline || '';
  if (D.footer) $('foot').textContent = D.footer;
  if (D.logo) $('logo').insertAdjacentHTML('beforeend', '<img src="' + esc(D.logo) + '" alt="Logo" onerror="this.remove()">');

  var years = [];
  R.forEach(function (r) { if (years.indexOf(r.year) < 0) years.push(r.year); });
  years.sort(function (a, b) { return b - a; });
  $('yr').innerHTML += years.map(function (y) { return '<option>' + esc(y) + '</option>'; }).join('');

  var fields = [];
  R.forEach(function (r) { if (r.field && fields.indexOf(r.field) < 0) fields.push(r.field); });
  function chips() {
    $('fields').innerHTML = ['All fields'].concat(fields).map(function (f, i) {
      var v = i ? f : '';
      return '<button class="chip" data-f="' + esc(v) + '" aria-pressed="' + (field === v) + '">' + esc(f) + '</button>';
    }).join('');
  }
  $('fields').onclick = function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    field = b.dataset.f; chips(); archive();
  };

  function archive() {
    var q = $('q').value.trim().toLowerCase(), y = $('yr').value;
    var out = R.filter(function (r) {
      return (!y || String(r.year) === y) && (!field || r.field === field) &&
        (!q || [r.title, r.students, r.adviser, r.field, r.year, r.abstract].join(' ').toLowerCase().indexOf(q) > -1);
    });
    $('count').textContent = out.length + ' research found';
    $('list').innerHTML = out.length ? out.map(function (r) {
      return '<article class="item">' + pic(r.image, 'Research photo') + '<div><h3>' + esc(r.title) + '</h3>' +
        '<div class="meta"><span class="tag">' + esc(r.year) + '</span><span class="tag">' + esc(r.field) + '</span></div>' +
        '<p class="meta">' + esc(r.students) + ' &middot; Adviser: ' + esc(r.adviser) + '</p>' +
        (r.abstract ? '<p class="abs">' + esc(r.abstract) + '</p>' : '') + '</div></article>';
    }).join('') : '<div class="empty">No research matches. Try a shorter keyword or clear the filters.</div>';
  }
  $('q').oninput = function () { if (location.hash !== '#archive') location.hash = 'archive'; archive(); };
  $('yr').onchange = function () { if (location.hash !== '#archive') location.hash = 'archive'; archive(); };

  $('awards').innerHTML = A.map(function (a) {
    return '<article class="card">' + pic(a.image, 'Award photo') + '<h3>' + esc(a.title) + '</h3>' +
      '<div class="meta"><span class="tag">' + esc(a.year) + '</span>' + esc(a.event) + '</div></article>';
  }).join('');

  function expo() {
    $('etabs').innerHTML = E.map(function (e) {
      return '<button class="tab" role="tab" aria-selected="' + (e.year === ey) + '" data-y="' + e.year + '">' + e.year + '</button>';
    }).join('');
    var cur = E.filter(function (x) { return x.year === ey; })[0] || { photos: [] };
    var ps = cur.photos && cur.photos.length ? cur.photos : [{}, {}, {}, {}, {}, {}];
    $('egrid').innerHTML = ps.map(function (p) {
      return '<figure>' + pic(p.src, p.caption || 'Expo photo') + '<figcaption>' + esc(p.caption) + '</figcaption></figure>';
    }).join('');
    $('esum').textContent = cur.summary || '';
  }
  $('etabs').onclick = function (e) { var b = e.target.closest('.tab'); if (b) { ey = +b.dataset.y; expo(); } };

  function go(v) {
    if (VIEWS.indexOf(v) < 0) v = 'archive';
    VIEWS.forEach(function (n) {
      $('v-' + n).hidden = n !== v;
      $('n-' + n).setAttribute('aria-current', String(n === v));
    });
  }
  document.querySelector('.nav').onclick = function (e) {
    var b = e.target.closest('.navbtn'); if (b) location.hash = b.dataset.v;
  };
  window.onhashchange = function () { go(location.hash.slice(1)); };

  // Click a photo to enlarge it
  document.addEventListener('click', function (e) {
    var z = e.target.closest('.zoom'), im = z && z.querySelector('img');
    if (im) { $('lbimg').src = im.src; $('lb').hidden = false; }
    else if (e.target.closest('#lb')) $('lb').hidden = true;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('lb').hidden = true; });

  chips(); archive(); expo(); go(location.hash.slice(1));
})();
