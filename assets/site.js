/* Общие удобства: меню, кнопка «Наверх», увеличение фото и сканов. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* Меню на телефоне и планшете */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('sitenav');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Закрыть меню' : 'Меню';
    };
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.topbar')) setOpen(false);
    });
  }

  /* Кнопка «Наверх» */
  var top = document.createElement('button');
  top.type = 'button';
  top.className = 'to-top';
  top.innerHTML = '<span aria-hidden="true">↑</span> Наверх';
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.body.appendChild(top);
  var onScroll = function () { top.classList.toggle('show', window.scrollY > 700); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Миниатюры альбома — доступны с клавиатуры */
  document.querySelectorAll('.photo-thumb, .thumb-wrap').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  /* Увеличение фото и сканов. На странице фотоальбома работает свой просмотр. */
  if (document.getElementById('lightbox') && document.getElementById('lbImg')) return;

  var zoom = document.createElement('div');
  zoom.className = 'zoom';
  zoom.setAttribute('role', 'dialog');
  zoom.setAttribute('aria-modal', 'true');
  zoom.setAttribute('aria-label', 'Просмотр изображения');
  zoom.innerHTML =
    '<div class="zoom-bar">' +
    '<a class="lb-btn" id="zoomFull" target="_blank" rel="noopener">Открыть в полном размере</a>' +
    '<button type="button" class="lb-btn lb-close" id="zoomClose">Закрыть ✕</button>' +
    '</div>' +
    '<div class="zoom-stage"><img id="zoomImg" alt=""></div>' +
    '<div class="zoom-cap" id="zoomCap"></div>';
  document.body.appendChild(zoom);
  var zImg = zoom.querySelector('#zoomImg');
  var zCap = zoom.querySelector('#zoomCap');
  var zFull = zoom.querySelector('#zoomFull');
  var lastFocus = null;

  function openZoom(src, cap) {
    lastFocus = document.activeElement;
    zImg.src = src;
    zImg.alt = cap || '';
    zCap.textContent = cap || '';
    zFull.href = src;
    zoom.classList.add('open');
    document.body.style.overflow = 'hidden';
    zoom.querySelector('#zoomClose').focus();
  }
  function closeZoom() {
    zoom.classList.remove('open');
    document.body.style.overflow = '';
    zImg.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  zoom.querySelector('#zoomClose').addEventListener('click', closeZoom);
  zoom.addEventListener('click', function (e) {
    if (e.target === zoom || e.target.classList.contains('zoom-stage')) closeZoom();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeZoom(); });

  /* Старые вызовы со страниц остаются рабочими */
  window.openLightbox = function (img) { openZoom(img.currentSrc || img.src, img.alt); };
  window.closeLightbox = closeZoom;
  window.openLb = function (src, cap) { openZoom(src, cap); };
  window.closeLb = closeZoom;

  document.querySelectorAll('img.scan-preview, .page-home .gallery img').forEach(function (img) {
    img.setAttribute('data-zoomable', '');
    img.addEventListener('click', function () {
      var fig = img.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      openZoom(img.currentSrc || img.src, cap ? cap.textContent.trim() : img.alt);
    });
  });
})();
