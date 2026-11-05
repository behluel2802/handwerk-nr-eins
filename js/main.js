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

/* --- Footer-Jahr ------------------------------------------------------------ */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

initNav();
initHeaderShadow();
initCallBar();
initYear();
