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

/* --- Kontaktformular -------------------------------------------------------- */
// Ohne JS: native Pflichtfeld-Prüfung und Versand per mailto (action des Formulars).
// Mit JS: eigene Validierung mit Meldungen am Feld, Versand an data-endpoint (z. B. Formspree)
// oder – wenn leer – mailto mit vorausgefülltem Text.
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  form.noValidate = true;
  const endpoint = form.dataset.endpoint.trim();
  const mailto = form.dataset.mailto;
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const el = (name) => form.elements.namedItem(name);
  const fields = {
    name: el('name'),
    telefon: el('telefon'),
    email: el('email'),
    nachricht: el('nachricht'),
  };
  let submitted = false;

  const setError = (input, errorEl, message) => {
    if (input) input.setAttribute('aria-invalid', String(Boolean(message)));
    errorEl.textContent = message;
    errorEl.hidden = !message;
  };
  const errorOf = (input) => document.getElementById(`${input.id}-error`);
  const reachError = document.getElementById('cf-reach-error');

  const phoneOk = (value) => /^[+\d\s()/-]+$/.test(value) && value.replace(/\D/g, '').length >= 6;

  // Gibt die Felder mit Fehler in Formular-Reihenfolge zurück
  const validate = () => {
    const invalid = [];
    const name = fields.name.value.trim();
    const phone = fields.telefon.value.trim();
    const email = fields.email.value.trim();
    const message = fields.nachricht.value.trim();

    setError(fields.name, errorOf(fields.name), name ? '' : 'Bitte geben Sie Ihren Namen an.');
    if (!name) invalid.push(fields.name);

    // Telefon oder E-Mail: mindestens eins, ausgefüllte Felder müssen gültig sein
    const phoneMsg = phone && !phoneOk(phone) ? 'Bitte prüfen Sie die Telefonnummer.' : '';
    const emailMsg = email && fields.email.validity.typeMismatch ? 'Bitte prüfen Sie die E-Mail-Adresse (z. B. name@beispiel.de).' : '';
    const noneMsg = !phone && !email ? 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.' : '';
    setError(fields.telefon, errorOf(fields.telefon), phoneMsg);
    setError(fields.email, errorOf(fields.email), emailMsg);
    setError(null, reachError, noneMsg);
    if (noneMsg) {
      fields.telefon.setAttribute('aria-invalid', 'true');
      fields.email.setAttribute('aria-invalid', 'true');
      invalid.push(fields.telefon);
    }
    if (phoneMsg) invalid.push(fields.telefon);
    if (emailMsg) invalid.push(fields.email);

    let messageMsg = '';
    if (!message) messageMsg = 'Bitte beschreiben Sie kurz Ihr Anliegen.';
    else if (message.length < 10) messageMsg = 'Bitte schreiben Sie ein paar Worte mehr (mindestens 10 Zeichen).';
    setError(fields.nachricht, errorOf(fields.nachricht), messageMsg);
    if (messageMsg) invalid.push(fields.nachricht);

    return invalid;
  };

  // Nach dem ersten Absenden live nachprüfen, damit Fehler verschwinden, sobald sie behoben sind
  Object.values(fields).forEach((input) => {
    input.addEventListener('blur', () => { if (submitted) validate(); });
    input.addEventListener('input', () => {
      if (submitted && input.getAttribute('aria-invalid') === 'true') validate();
    });
  });

  const showStatus = (type, message) => {
    status.className = `form-status form-status--${type}`;
    status.textContent = message;
    status.focus();
  };

  const collect = () => {
    const data = Object.fromEntries(new FormData(form));
    delete data.website; // Honeypot
    data.rueckruf = data.rueckruf ? 'ja' : 'nein';
    return data;
  };

  const labels = {
    name: 'Name', telefon: 'Telefon', email: 'E-Mail', anliegen: 'Anliegen',
    ort: 'PLZ / Ort', rueckruf: 'Rückruf gewünscht', nachricht: 'Nachricht',
  };

  const openMailto = (data) => {
    const subject = `Anfrage über die Website${data.anliegen ? `: ${data.anliegen}` : ''}`;
    const body = Object.entries(labels)
      .filter(([key]) => data[key])
      .map(([key, label]) => (key === 'nachricht' ? `\n${data[key]}` : `${label}: ${data[key]}`))
      .join('\n');
    window.location.href = `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showStatus('success', 'Ihr E-Mail-Programm wurde mit Ihrer Anfrage geöffnet. Bitte senden Sie die E-Mail dort ab. Falls sich nichts geöffnet hat, rufen Sie uns gern an: 0123 456 789 0.');
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

    // Honeypot ausgefüllt: vermutlich Bot – Erfolg vortäuschen, nichts senden
    if (el('website').value) {
      form.reset();
      showStatus('success', 'Vielen Dank! Ihre Anfrage ist bei uns angekommen.');
      return;
    }

    const data = collect();
    if (!endpoint) {
      openMailto(data);
      return;
    }

    form.classList.add('is-sending');
    submitBtn.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      submitted = false;
      showStatus('success', 'Vielen Dank! Ihre Anfrage ist bei uns angekommen. Wir melden uns innerhalb eines Werktags.');
    } catch {
      showStatus('error', 'Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an: 0123 456 789 0.');
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
initContactForm();
initYear();
