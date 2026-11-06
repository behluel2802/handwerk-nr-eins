// Elektro Berger – Haupt-Skript
// Progressive Enhancement: Ohne JS bleibt alles bedienbar
// (Navigation sichtbar, Anruf-Leiste dauerhaft eingeblendet).

const desktopQuery = window.matchMedia('(min-width: 60em)');

/* --- Mobiles Menü --------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? 'Menü schließen' : 'Menü';
    nav.classList.toggle('is-open', open);
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Klick auf einen Link schließt das Menü
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Escape schließt und gibt den Fokus an den Button zurück
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Klick außerhalb schließt
  document.addEventListener('click', (event) => {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  // Wechsel auf Desktop-Breite: Zustand zurücksetzen
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* --- Header-Schatten beim Scrollen ---------------------------------------- */
function initHeaderShadow() {
  const header = document.querySelector('[data-header]');
  const sentinel = document.querySelector('[data-scroll-sentinel]');
  if (!header || !sentinel) return;

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

/* --- Anruf-Leiste: erst einblenden, wenn der Hero aus dem Bild ist -------- */
function initCallBar() {
  const bar = document.querySelector('[data-call-bar]');
  const hero = document.querySelector('[data-hero]');
  if (!bar) return;

  // Ohne Hero sofort zeigen
  if (!hero) {
    bar.classList.add('is-visible');
    return;
  }

  new IntersectionObserver(([entry]) => {
    // Nur zeigen, wenn der Hero nach OBEN aus dem Bild gescrollt ist
    const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', scrolledPast);
  }).observe(hero);
}

/* --- Lightbox für die Referenzen ----------------------------------------- */
// Ohne JS (oder ohne <dialog>-Support) öffnen die Links einfach das große Bild.
function initLightbox() {
  const gallery = document.querySelector('[data-gallery]');
  const dialog = document.querySelector('[data-lightbox]');
  if (!gallery || !dialog || typeof dialog.showModal !== 'function') return;

  const links = [...gallery.querySelectorAll('a[data-full]')];
  const img = dialog.querySelector('[data-lightbox-img]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  const counter = dialog.querySelector('[data-lightbox-counter]');
  let index = 0;

  const preload = (i) => {
    new Image().src = links[(i + links.length) % links.length].dataset.full;
  };

  const show = (i) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    const thumb = link.querySelector('img');
    img.src = link.dataset.full;
    img.width = Number(link.dataset.width);
    img.height = Number(link.dataset.height);
    img.alt = thumb ? thumb.alt : '';
    // Bildunterschrift aus der Kachel übernehmen: „Titel · Ort“
    const parts = [...(link.closest('li')?.querySelectorAll('.gallery__caption > *') ?? [])];
    caption.textContent = parts.map((el) => el.textContent.trim()).join(' · ');
    counter.textContent = `${index + 1} / ${links.length}`;
    preload(index + 1);
    preload(index - 1);
  };

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());

  // Klick auf den dunklen Hintergrund schließt
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Pfeiltasten (Escape schließt der <dialog> von selbst)
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });

  // Wischen auf Touch-Geräten
  let startX = null;
  let startY = null;
  dialog.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });

  dialog.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
  });

  // Fokus zurück auf die Kachel des zuletzt gezeigten Bildes
  dialog.addEventListener('close', () => links[index].focus());
}

/* --- Footer-Jahr ------------------------------------------------------------ */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

initNav();
initHeaderShadow();
initCallBar();
initLightbox();
initYear();
