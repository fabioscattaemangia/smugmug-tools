// FABIO ZITO PHOTOGRAPHY — Sistema Preferiti
// Carica questo file su GitHub e linkalo da SmugMug

(function() {
  'use strict';
  const STORAGE_KEY = 'fzp_favorites';
  const SITE = window.location.origin;
  let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); }

  const bar = document.getElementById('fzp-bar');
  const barCount = document.getElementById('fzp-bar-count');
  const shareBtn = document.getElementById('fzp-share-btn');
  const clearBtn = document.getElementById('fzp-clear-btn');
  const overlay = document.getElementById('fzp-modal-overlay');
  const linkField = document.getElementById('fzp-link-field');
  const copyBtn = document.getElementById('fzp-copy-btn');
  const modalClose = document.getElementById('fzp-modal-close');

  function updateBar() {
    const n = favorites.length;
    barCount.textContent = n === 1 ? '1 preferita' : n + ' preferite';
    if (n > 0) bar.classList.add('fzp-visible');
    else bar.classList.remove('fzp-visible');
  }

  function addHeartsToPhotos() {
    document.querySelectorAll('li.sm-tile-wrapper').forEach(function(el) {
      if (el.querySelector('.fzp-heart-btn')) return;
      const link = el.querySelector('a.sm-tile-content');
      if (!link) return;
      const photoId = encodeURIComponent(link.getAttribute('href') || '');
      if (!photoId) return;
      el.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'fzp-heart-btn' + (favorites.includes(photoId) ? ' fzp-active' : '');
      btn.dataset.id = photoId;
      btn.title = 'Aggiungi ai preferiti';
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      btn.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        const id = this.dataset.id;
        this.classList.add('fzp-pop');
        this.addEventListener('animationend', function() { this.classList.remove('fzp-pop'); }, {once: true});
        if (favorites.includes(id)) {
          favorites = favorites.filter(function(f) { return f !== id; });
          this.classList.remove('fzp-active');
        } else {
          favorites.push(id);
          this.classList.add('fzp-active');
        }
        save(); updateBar();
      });
      el.appendChild(btn);
    });
  }

  shareBtn.addEventListener('click', function() {
    if (!favorites.length) return;
    linkField.value = SITE + window.location.pathname + '?fzp_sel=' + favorites.join(',');
    overlay.classList.add('fzp-open');
  });

  copyBtn.addEventListener('click', function() {
    linkField.select();
    navigator.clipboard.writeText(linkField.value).then(function() {
      copyBtn.textContent = 'Copiato!';
      setTimeout(function() { copyBtn.textContent = 'Copia link'; }, 2000);
    });
  });

  modalClose.addEventListener('click', function() { overlay.classList.remove('fzp-open'); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('fzp-open'); });
  clearBtn.addEventListener('click', function() {
    favorites = []; save(); updateBar();
    document.querySelectorAll('.fzp-heart-btn.fzp-active').forEach(function(b) { b.classList.remove('fzp-active'); });
  });

  updateBar();
  addHeartsToPhotos();
  new MutationObserver(function() { addHeartsToPhotos(); }).observe(document.body, { childList: true, subtree: true });
})();
