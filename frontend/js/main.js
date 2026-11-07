// Elektro Berger – Haupt-Skript
// Progressive Enhancement: Ohne JS bleibt alles bedienbar
// (Navigation sichtbar, Anruf-Leiste dauerhaft eingeblendet).
// Als ES-Modul geladen (type="module", automatisch deferred) – braucht einen lokalen Server, kein file://.

import { openingStatus } from './hours.js';

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

/* --- Erreichbarkeit „Jetzt erreichbar“ ------------------------------------- */
// Zeiten und Feiertage: js/hours.js. Ohne JS bleibt nur die Tabelle sichtbar.
function initOpenStatus() {
  const el = document.querySelector('[data-open-status]');
  if (!el) return;
  const text = el.querySelector('[data-open-status-text]');

  const update = () => {
    const status = openingStatus();
    text.textContent = status.text;
    el.classList.toggle('is-open', status.open);
  };

  update();
  el.hidden = false;
  setInterval(update, 60 * 1000);
}

/* --- Kontaktformular -------------------------------------------------------- */
// Mit JS: Validierung am Feld, Versand per fetch an data-endpoint, Bestätigung statt Formular.
// Antwortet unter dem Endpoint kein Backend (statisches Hosting wie GitHub Pages), läuft der
// Demo-Modus: gleiche Bestätigung, aber mit Hinweis, dass nichts verschickt wurde.
// Ohne JS: native Pflichtfeld-Prüfung und normales POST an die action.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isPhone = (value) => /^[+\d\s()/-]+$/.test(value) && value.replace(/\D/g, '').length >= 6;

// Statuscodes, die ein statischer Server auf POST liefert → kein Backend vorhanden
const NO_BACKEND = [404, 405, 501];

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  const success = document.querySelector('[data-form-success]');
  if (!form || !success) return;

  form.noValidate = true;
  const endpoint = form.dataset.endpoint.trim();
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const el = (name) => form.elements.namedItem(name);
  const fields = { name: el('name'), kontakt: el('kontakt'), nachricht: el('nachricht') };
  let submitted = false;

  const setError = (input, message) => {
    const errorEl = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    errorEl.textContent = message;
    errorEl.hidden = !message;
  };

  const checks = {
    name: (v) => (v ? '' : 'Bitte geben Sie Ihren Namen an.'),
    kontakt: (v) => {
      if (!v) return 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.';
      if (v.includes('@')) return EMAIL_RE.test(v) ? '' : 'Bitte prüfen Sie die E-Mail-Adresse (z. B. name@beispiel.de).';
      return isPhone(v) ? '' : 'Bitte geben Sie eine Telefonnummer (mind. 6 Ziffern) oder eine E-Mail-Adresse an.';
    },
    nachricht: (v) => {
      if (!v) return 'Bitte beschreiben Sie kurz Ihr Anliegen.';
      return v.length < 10 ? 'Bitte schreiben Sie ein paar Worte mehr (mindestens 10 Zeichen).' : '';
    },
  };

  // Prüft alle Felder, gibt die fehlerhaften in Formular-Reihenfolge zurück
  const validate = () => Object.entries(fields).filter(([key, input]) => {
    const message = checks[key](input.value.trim());
    setError(input, message);
    return Boolean(message);
  }).map(([, input]) => input);

  // Nach dem ersten Absenden live nachprüfen, damit Fehler verschwinden, sobald sie behoben sind
  Object.entries(fields).forEach(([key, input]) => {
    const recheck = () => { if (submitted) setError(input, checks[key](input.value.trim())); };
    input.addEventListener('blur', recheck);
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') recheck(); });
  });

  const showError = (message) => {
    status.textContent = message;
    status.focus();
  };

  const showSuccess = (name, demo) => {
    success.querySelector('[data-form-success-title]').textContent = `Vielen Dank, ${name}!`;
    success.querySelector('[data-form-demo]').hidden = !demo;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitted = true;
    status.textContent = '';

    const invalid = validate();
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach((k) => { data[k] = String(data[k]).trim(); });
    data.kontaktart = data.kontakt.includes('@') ? 'email' : 'telefon';
    const name = data.name;

    // Honeypot ausgefüllt: vermutlich Bot – Erfolg vortäuschen, nichts senden
    if (data.website) {
      showSuccess(name, false);
      return;
    }

    if (!endpoint) {
      showSuccess(name, true);
      return;
    }

    form.classList.add('is-sending');
    submitBtn.disabled = true;
    let message = 'Das hat leider nicht geklappt.';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (NO_BACKEND.includes(response.status)) {
        showSuccess(name, true);
        return;
      }
      if (!response.ok) {
        // Backend liefert bei Fehlern { error: "…" } (z. B. Validierung, Rate-Limit)
        const result = await response.json().catch(() => ({}));
        if (result.error) message = result.error;
        throw new Error(`HTTP ${response.status}`);
      }
      showSuccess(name, false);
    } catch {
      showError(`${message} Bitte versuchen Sie es erneut oder rufen Sie uns an: 0123 456 789 0.`);
    } finally {
      form.classList.remove('is-sending');
      submitBtn.disabled = false;
    }
  });
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
initOpenStatus();
initContactForm();
initYear();
