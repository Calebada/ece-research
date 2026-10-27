(function () {
  'use strict';

  var D = window.ECE_DATA || {};
  var research = Array.isArray(D.research) ? D.research : [];
  var awards = Array.isArray(D.achievements) ? D.achievements : [];
  var expo = (Array.isArray(D.expo) ? D.expo : []).slice().sort(function (a, b) { return Number(b.year) - Number(a.year); });
  var $ = function (id) { return document.getElementById(id); };
  var state = { field: '', sort: 'newest', layout: 'list', expoYear: expo.length ? expo[0].year : null, featured: [], galleryIndex: 0 };
  var fieldIcons = { 'IoT': '⌁', 'Power Electronics': 'ϟ', 'Communications': '⌁', 'Embedded Systems': '▣', 'Instrumentation': '⌁', 'Robotics': '✣' };
  var lastFocus = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  function text(value) { return String(value == null ? '' : value); }
  function highlight(value, query) {
    var source = text(value), needle = text(query).trim();
    if (!needle) return esc(source);
    var pattern = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), out = '', cursor = 0, match;
    while ((match = pattern.exec(source))) {
      out += esc(source.slice(cursor, match.index)) + '<mark class="mark">' + esc(match[0]) + '</mark>';
      cursor = match.index + match[0].length;
    }
    return out + esc(source.slice(cursor));
  }
  function icon(field) { return '<span class="field-icon" aria-hidden="true">' + esc(fieldIcons[field] || '•') + '</span>'; }

  // Images render as a dashed placeholder until they load; broken paths remain friendly placeholders.
  function media(src, alt, zoom) {
    var hasSrc = Boolean(src);
    return '<div class="media' + (hasSrc ? ' loading has-image' : ' missing') + (zoom ? ' zoomable' : '') + '">' +
      '<span class="placeholder"><span class="camera" aria-hidden="true">▣</span>' + esc(alt || 'Photo placeholder') + '</span>' +
      (hasSrc ? '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy">' : '') + '</div>';
  }
  function yearsOf(items) {
    var result = [];
    items.forEach(function (item) { if (result.indexOf(item.year) < 0) result.push(item.year); });
    return result.sort(function (a, b) { return Number(b) - Number(a); });
  }
  function matches(item, query) {
    return [item.title, item.students, item.adviser, item.field, item.year, item.abstract].join(' ').toLowerCase().indexOf(query) !== -1;
  }

  $('dept').textContent = D.department || 'Electronics Engineering Department';
  $('headline').innerHTML = esc(D.headline || 'Every ECE research, searchable.').replace('searchable.', '<br><em>searchable.</em>');
  $('tagline').textContent = D.tagline || 'Browse studies, awards, and annual expo showcases from our students and faculty.';
  $('foot').textContent = D.footer || D.department || 'Electronics Engineering Department';
  if (D.logo) $('logo').insertAdjacentHTML('beforeend', '<img src="' + esc(D.logo) + '" alt="' + esc(D.department || 'Department logo') + '" onerror="this.remove()">');

  function renderImageEvents() {
    document.querySelectorAll('.media img').forEach(function (image) {
      image.addEventListener('load', function () { image.parentElement.classList.remove('loading'); image.parentElement.classList.add('loaded'); });
      image.addEventListener('error', function () { image.parentElement.classList.remove('loading', 'has-image'); image.parentElement.classList.add('missing'); image.remove(); });
    });
  }
  function renderFilters() {
    var fields = [];
    research.forEach(function (item) { if (item.field && fields.indexOf(item.field) < 0) fields.push(item.field); });
    $('fields').innerHTML = [''].concat(fields).map(function (field) {
      var label = field || 'All fields';
      return '<button class="chip' + (state.field === field ? ' is-active' : '') + '" data-field="' + esc(field) + '" aria-pressed="' + (state.field === field) + '">' + icon(field) + esc(label) + '</button>';
    }).join('');
  }
  function card(item, query) {
    var index = research.indexOf(item);
    return '<article class="research-card" data-research-index="' + index + '" tabindex="0" role="button" aria-label="View details for ' + esc(item.title) + '">' +
      media(item.image, item.title, true) + '<div><h3>' + highlight(item.title, query) + '</h3>' +
      '<div><span class="tag">' + esc(item.year) + '</span><span class="tag">' + icon(item.field) + esc(item.field) + '</span></div>' +
      '<p class="meta">' + highlight(item.students, query) + ' · Adviser: ' + highlight(item.adviser, query) + '</p>' +
      (item.abstract ? '<p class="meta">' + highlight(item.abstract, query) + '</p>' : '') + '</div></article>';
  }
  function renderArchive() {
    var query = $('q').value.trim().toLowerCase(), year = $('yr').value;
    var result = research.filter(function (item) { return (!year || text(item.year) === year) && (!state.field || item.field === state.field) && (!query || matches(item, query)); });
    result.sort(function (a, b) {
      if (state.sort === 'az') return text(a.title).localeCompare(text(b.title));
      return state.sort === 'newest' ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year);
    });
    $('count').textContent = result.length + ' research project' + (result.length === 1 ? '' : 's') + ' found';
    var pinned = result.filter(function (item) { return item.featured && state.featured.indexOf(research.indexOf(item)) < 0; }).slice(0, 3);
    $('featured').innerHTML = pinned.length ? '<p class="featured-label">FEATURED RESEARCH</p>' + pinned.map(function (item) { return card(item, query); }).join('') : '';
    var pinnedIndexes = pinned.map(function (item) { return research.indexOf(item); });
    result = result.filter(function (item) { return pinnedIndexes.indexOf(research.indexOf(item)) < 0; });
    $('list').classList.toggle('grid-mode', state.layout === 'grid');
    $('list').innerHTML = result.length ? result.map(function (item) { return card(item, query); }).join('') : '<div class="empty">No research matches those filters.<br><button type="button" id="clear-filters">Clear filters</button></div>';
    $('list').querySelectorAll('.research-card').forEach(bindResearchCard);
    $('featured').querySelectorAll('.research-card').forEach(bindResearchCard);
    renderImageEvents();
  }
  function bindResearchCard(cardElement) {
    var open = function () { openDetail(Number(cardElement.dataset.researchIndex)); };
    cardElement.addEventListener('click', open);
    cardElement.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  }
  function openDetail(index) {
    var item = research[index]; if (!item) return;
    lastFocus = document.activeElement;
    $('modal-body').innerHTML = '<div class="modal-content">' + media(item.image, item.title) + '<div><p class="eyebrow orange">RESEARCH DETAIL</p><h2 id="modal-title">' + esc(item.title) + '</h2>' +
      '<span class="tag">' + esc(item.year) + '</span><span class="tag">' + icon(item.field) + esc(item.field) + '</span>' +
      '<p class="meta"><strong>Students:</strong> ' + esc(item.students) + '<br><strong>Adviser:</strong> ' + esc(item.adviser) + '</p>' +
      (item.abstract ? '<div class="detail-block"><strong>Abstract</strong><p>' + esc(item.abstract) + '</p></div>' : '') + '</div></div>';
    $('detail-modal').hidden = false; $('modal-body').querySelector('.media').classList.add('modal-media'); renderImageEvents();
    $('detail-modal').querySelector('.modal-close').focus();
  }
  function closeModal(id) { $(id).hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  function renderAwards() {
    var grouped = {};
    awards.slice().sort(function (a, b) { return Number(b.year) - Number(a.year); }).forEach(function (award) { (grouped[award.year] = grouped[award.year] || []).push(award); });
    $('awards').innerHTML = Object.keys(grouped).map(function (year) {
      return '<section class="timeline-year"><h3>' + esc(year) + '</h3>' + grouped[year].map(function (award) {
        return '<article class="award-card">' + media(award.image, award.title) + '<div><span class="medal" aria-hidden="true">✦</span><h3>' + esc(award.title) + '</h3><p class="meta">' + esc(award.event) + '</p></div></article>';
      }).join('') + '</section>';
    }).join('');
    renderImageEvents();
  }
  function renderExpo() {
    $('etabs').innerHTML = expo.map(function (item) { return '<button class="tab" type="button" role="tab" aria-selected="' + (item.year === state.expoYear) + '" data-year="' + esc(item.year) + '">' + esc(item.year) + '</button>'; }).join('');
    var current = expo.filter(function (item) { return item.year === state.expoYear; })[0] || { photos: [], summary: '' };
    $('esum').textContent = current.summary || 'A year of prototypes, demos, and ideas from the ECE community.';
    var photos = current.photos && current.photos.length ? current.photos : [{ src: '', caption: 'Expo photos will be added here.' }];
    $('egrid').innerHTML = photos.map(function (photo, index) { return '<figure data-gallery-index="' + index + '">' + media(photo.src, photo.caption || 'Expo photo', true) + '<figcaption>' + esc(photo.caption || 'Expo photo') + '</figcaption></figure>'; }).join('');
    renderImageEvents();
  }
  function openLightbox(index) {
    var current = expo.filter(function (item) { return item.year === state.expoYear; })[0], photos = current && current.photos || [];
    if (!photos.length || !photos[index] || !photos[index].src) return;
    state.galleryIndex = index; var photo = photos[index];
    $('lightbox-img').src = photo.src; $('lightbox-img').alt = photo.caption || 'Expo photo'; $('lightbox-caption').textContent = photo.caption || '';
    $('lightbox').hidden = false; $('lightbox').querySelector('.lightbox-close').focus();
  }
  function moveLightbox(step) {
    var current = expo.filter(function (item) { return item.year === state.expoYear; })[0], total = current && current.photos ? current.photos.length : 0;
    if (total) openLightbox((state.galleryIndex + step + total) % total);
  }

  var years = yearsOf(research); $('yr').innerHTML += years.map(function (year) { return '<option value="' + esc(year) + '">' + esc(year) + '</option>'; }).join('');
  renderFilters(); renderArchive(); renderAwards(); renderExpo();
  document.querySelectorAll('.navbtn').forEach(function (button) { button.addEventListener('click', function () { location.hash = button.dataset.v; }); });
  function go(view) { if (['archive', 'achievements', 'expo'].indexOf(view) < 0) view = 'archive'; ['archive', 'achievements', 'expo'].forEach(function (name) { $('v-' + name).hidden = name !== view; document.querySelector('[data-v="' + name + '"]').setAttribute('aria-current', String(name === view)); }); }
  window.addEventListener('hashchange', function () { go(location.hash.slice(1)); }); go(location.hash.slice(1));
  $('q').addEventListener('input', renderArchive); $('yr').addEventListener('change', renderArchive); $('sort').addEventListener('change', function () { state.sort = $('sort').value; renderArchive(); });
  $('search-form').addEventListener('submit', function (event) { event.preventDefault(); renderArchive(); location.hash = 'archive'; });
  $('fields').addEventListener('click', function (event) { var button = event.target.closest('.chip'); if (button) { state.field = button.dataset.field; renderFilters(); renderArchive(); } });
  $('list-view').addEventListener('click', function () { state.layout = 'list'; $('list-view').classList.add('active'); $('grid-view').classList.remove('active'); $('list-view').setAttribute('aria-pressed', 'true'); $('grid-view').setAttribute('aria-pressed', 'false'); renderArchive(); });
  $('grid-view').addEventListener('click', function () { state.layout = 'grid'; $('grid-view').classList.add('active'); $('list-view').classList.remove('active'); $('grid-view').setAttribute('aria-pressed', 'true'); $('list-view').setAttribute('aria-pressed', 'false'); renderArchive(); });
  document.addEventListener('click', function (event) {
    if (event.target.id === 'clear-filters') { $('q').value = ''; $('yr').value = ''; state.field = ''; renderFilters(); renderArchive(); }
    var figure = event.target.closest('#egrid figure'); if (figure) openLightbox(Number(figure.dataset.galleryIndex));
    if (event.target.dataset.close) closeModal(event.target.dataset.close);
    if (event.target === $('detail-modal')) closeModal('detail-modal');
    if (event.target === $('lightbox') || event.target.closest('.lightbox-close')) $('lightbox').hidden = true;
  });
  $('etabs').addEventListener('click', function (event) { var tab = event.target.closest('.tab'); if (tab) { state.expoYear = Number(tab.dataset.year); renderExpo(); } });
  $('lightbox').querySelector('.prev').addEventListener('click', function () { moveLightbox(-1); }); $('lightbox').querySelector('.next').addEventListener('click', function () { moveLightbox(1); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { $('detail-modal').hidden ? $('lightbox').hidden = true : closeModal('detail-modal'); } if (!$('lightbox').hidden && event.key === 'ArrowLeft') moveLightbox(-1); if (!$('lightbox').hidden && event.key === 'ArrowRight') moveLightbox(1); });
  var touchStart = 0; $('lightbox').addEventListener('touchstart', function (event) { touchStart = event.changedTouches[0].screenX; }, { passive: true }); $('lightbox').addEventListener('touchend', function (event) { var distance = event.changedTouches[0].screenX - touchStart; if (Math.abs(distance) > 40) moveLightbox(distance < 0 ? 1 : -1); }, { passive: true });

  var root = document.documentElement, savedTheme = ''; try { savedTheme = localStorage.getItem('ece-theme') || ''; } catch (ignore) {}
  if (savedTheme) root.dataset.theme = savedTheme;
  function updateThemeLabel() { var dark = root.dataset.theme === 'dark' || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches); $('theme-toggle').setAttribute('aria-pressed', String(dark)); $('theme-label').textContent = dark ? 'Light mode' : 'Dark mode'; }
  updateThemeLabel(); $('theme-toggle').addEventListener('click', function () { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('ece-theme', root.dataset.theme); } catch (ignore) {} updateThemeLabel(); });
  var statTargets = { research: research.length, awards: awards.length, expo: expo.length };
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, self) { if (entries[0].isIntersecting) { Object.keys(statTargets).forEach(function (key) { var node = document.querySelector('[data-stat="' + key + '"]'), target = statTargets[key], start = performance.now(); function tick(now) { node.textContent = Math.min(target, Math.floor((now - start) / 650 * target)).toString(); if (Number(node.textContent) < target) requestAnimationFrame(tick); } requestAnimationFrame(tick); }); self.disconnect(); } }); observer.observe(document.querySelector('.stats'));
  } else { Object.keys(statTargets).forEach(function (key) { document.querySelector('[data-stat="' + key + '"]').textContent = statTargets[key]; }); }
  window.addEventListener('scroll', function () { $('back-top').classList.toggle('show', window.scrollY > 500); }, { passive: true }); $('back-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();
