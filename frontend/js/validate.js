// Prüfregeln für das Kontaktformular – gemeinsam genutzt von Frontend (js/main.js)
// und Backend (backend/contact.js), damit beide Seiten exakt dieselben Regeln anwenden.
// Reine Funktionen ohne DOM.

export const LIMITS = { name: 100, kontakt: 200, nachricht: 5000 };

export const ANLIEGEN = ['Elektroinstallation', 'Altbausanierung', 'Smart Home', 'PV & Wallbox', 'E-Check', 'Sonstiges'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isPhone = (value) => /^[+\d\s()/-]+$/.test(value) && value.replace(/\D/g, '').length >= 6;

/** 'email' oder 'telefon' – entschieden am @-Zeichen */
export const contactKind = (value) => (value.includes('@') ? 'email' : 'telefon');

// Je Feld: Wert (getrimmt) → Fehlermeldung, leerer String = in Ordnung
export const checks = {
  name: (v) => {
    if (!v) return 'Bitte geben Sie Ihren Namen an.';
    return v.length > LIMITS.name ? `Bitte höchstens ${LIMITS.name} Zeichen.` : '';
  },
  kontakt: (v) => {
    if (!v) return 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.';
    if (v.length > LIMITS.kontakt) return `Bitte höchstens ${LIMITS.kontakt} Zeichen.`;
    if (contactKind(v) === 'email') {
      return EMAIL_RE.test(v) ? '' : 'Bitte prüfen Sie die E-Mail-Adresse (z. B. name@beispiel.de).';
    }
    return isPhone(v) ? '' : 'Bitte geben Sie eine Telefonnummer (mind. 6 Ziffern) oder eine E-Mail-Adresse an.';
  },
  nachricht: (v) => {
    if (!v) return 'Bitte beschreiben Sie kurz Ihr Anliegen.';
    if (v.length < 10) return 'Bitte schreiben Sie ein paar Worte mehr (mindestens 10 Zeichen).';
    return v.length > LIMITS.nachricht ? `Bitte höchstens ${LIMITS.nachricht} Zeichen.` : '';
  },
};

// Steuerzeichen entfernen (Zeilenumbrüche nur in der Nachricht erlaubt)
const clean = (value, multiline = false) => {
  const text = String(value ?? '').trim();
  return multiline
    ? text.replace(/\r\n?/g, '\n').replace(/[^\P{Cc}\n\t]/gu, '')
    : text.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ');
};

/**
 * Prüft und bereinigt eine komplette Anfrage (z. B. im Backend).
 * @returns {{ valid: boolean, errors: Record<string,string>, data: object }}
 */
export function validateContact(input = {}) {
  const data = {
    name: clean(input.name),
    kontakt: clean(input.kontakt),
    nachricht: clean(input.nachricht, true),
    anliegen: ANLIEGEN.includes(clean(input.anliegen)) ? clean(input.anliegen) : '',
  };
  data.kontaktart = contactKind(data.kontakt);

  const errors = {};
  for (const [field, check] of Object.entries(checks)) {
    const message = check(data[field]);
    if (message) errors[field] = message;
  }
  return { valid: Object.keys(errors).length === 0, errors, data };
}
