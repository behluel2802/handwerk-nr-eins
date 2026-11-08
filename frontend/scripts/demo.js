// Demo-Build (öffentliche Vorschau mit fiktivem Betrieb, z. B. GitHub Pages).
// Schalter: Umgebungsvariable DEMO=1. Ohne DEMO baut alles wie die Vorlage für echte Betriebe.
// Betreiberdaten (echter Verantwortlicher für Impressum/Datenschutz) kommen NIE ins Repo:
// nur aus Umgebungsvariablen (CI: GitHub-Variablen) oder lokal aus frontend/.env.demo.local (gitignored).
import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const ENV_FILE = new URL('../.env.demo.local', import.meta.url);
const CREDITS_FILE = new URL('../img-src/CREDITS.md', import.meta.url);

// Variable → Feld; Pflicht, außer phone
const FIELDS = {
  name: 'DEMO_OPERATOR_NAME',
  street: 'DEMO_OPERATOR_STREET',
  zip: 'DEMO_OPERATOR_ZIP',
  city: 'DEMO_OPERATOR_CITY',
  email: 'DEMO_OPERATOR_EMAIL',
  state: 'DEMO_OPERATOR_STATE',
  phone: 'DEMO_OPERATOR_PHONE',
};
const OPTIONAL = ['phone'];

// Zuständige Datenschutz-Aufsichtsbehörde für nicht-öffentliche Stellen je Bundesland (Art. 77 DSGVO).
// Quelle: Anschriften der Landesbeauftragten beim BfDI (bfdi.bund.de), geprüft 11/2026.
export const AUTHORITIES = {
  BW: { name: 'Landesbeauftragte/r für den Datenschutz und die Informationsfreiheit Baden-Württemberg', url: 'https://www.baden-wuerttemberg.datenschutz.de' },
  BY: { name: 'Bayerisches Landesamt für Datenschutzaufsicht', url: 'https://www.lda.bayern.de' },
  BE: { name: 'Berliner Beauftragte/r für Datenschutz und Informationsfreiheit', url: 'https://www.datenschutz-berlin.de' },
  BB: { name: 'Landesbeauftragte/r für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg', url: 'https://www.lda.brandenburg.de' },
  HB: { name: 'Landesbeauftragte/r für Datenschutz und Informationsfreiheit der Freien Hansestadt Bremen', url: 'https://www.datenschutz.bremen.de' },
  HH: { name: 'Hamburgische/r Beauftragte/r für Datenschutz und Informationsfreiheit', url: 'https://www.datenschutz-hamburg.de' },
  HE: { name: 'Hessische/r Beauftragte/r für Datenschutz und Informationsfreiheit', url: 'https://datenschutz.hessen.de' },
  MV: { name: 'Landesbeauftragte/r für Datenschutz und Informationsfreiheit Mecklenburg-Vorpommern', url: 'https://www.datenschutz-mv.de' },
  NI: { name: 'Landesbeauftragte/r für den Datenschutz Niedersachsen', url: 'https://www.lfd.niedersachsen.de' },
  NW: { name: 'Landesbeauftragte/r für Datenschutz und Informationsfreiheit Nordrhein-Westfalen', url: 'https://www.ldi.nrw.de' },
  RP: { name: 'Landesbeauftragte/r für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz', url: 'https://www.datenschutz.rlp.de' },
  SL: { name: 'Unabhängiges Datenschutzzentrum Saarland', url: 'https://www.datenschutz.saarland.de' },
  SN: { name: 'Sächsische Datenschutz- und Transparenzbeauftragte', url: 'https://www.datenschutz.sachsen.de' },
  ST: { name: 'Landesbeauftragte/r für den Datenschutz Sachsen-Anhalt', url: 'https://datenschutz.sachsen-anhalt.de' },
  SH: { name: 'Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein', url: 'https://www.datenschutzzentrum.de' },
  TH: { name: 'Thüringer Landesbeauftragte/r für den Datenschutz und die Informationsfreiheit', url: 'https://www.tlfdi.de' },
};

/** Bildnachweise aus der Tabelle in img-src/CREDITS.md: [{ motif, author, authorUrl, sourceUrl }] */
export function parseCredits(markdown) {
  const link = (cell) => cell.match(/^\[(.+?)\]\((.+?)\)$/);
  return markdown.split('\n')
    .filter((line) => line.startsWith('|') && !/^\|\s*(-|Datei)/.test(line))
    .map((line) => {
      const [, , motif, author, source] = line.split('|').map((c) => c.trim());
      const a = link(author);
      const s = link(source);
      if (!a || !s) throw new Error(`CREDITS.md: Zeile nicht lesbar: ${line}`);
      return { motif, author: a[1], authorUrl: a[2], sourceUrl: s[2] };
    });
}

/**
 * Demo-Kontext für die Templates oder null (kein Demo-Build).
 * Bricht ab, wenn DEMO=1 gesetzt ist, aber Betreiberdaten fehlen: nie eine Demo ohne gültiges Impressum.
 */
export function loadDemo(env = process.env, { envFile = ENV_FILE } = {}) {
  if (env.DEMO !== '1') return null;
  // Lokale Datei füllt nur Lücken, gesetzte Umgebungsvariablen haben Vorrang
  if (envFile && existsSync(envFile)) {
    env = { ...parseEnv(readFileSync(envFile, 'utf8')), ...env };
  }
  const value = (key) => (env[key] ?? '').trim() || null;
  const operator = Object.fromEntries(Object.entries(FIELDS).map(([field, key]) => [field, value(key)]));
  const missing = Object.entries(FIELDS).filter(([f]) => !OPTIONAL.includes(f) && !operator[f]).map(([, k]) => k);
  if (missing.length) throw new Error(`DEMO=1: Betreiberdaten fehlen: ${missing.join(', ')} (Umgebungsvariablen oder frontend/.env.demo.local)`);
  operator.state = operator.state.toUpperCase();
  const authority = AUTHORITIES[operator.state];
  if (!authority) throw new Error(`DEMO_OPERATOR_STATE: unbekanntes Bundesland "${operator.state}" (erlaubt: ${Object.keys(AUTHORITIES).join(', ')})`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(operator.email)) throw new Error('DEMO_OPERATOR_EMAIL: keine gültige E-Mail-Adresse');
  // Telefon: Anzeige wie eingegeben, für tel: nur + und Ziffern
  if (operator.phone) operator.tel = operator.phone.replace(/[^\d+]/g, '');
  return { operator, authority, credits: parseCredits(readFileSync(CREDITS_FILE, 'utf8')) };
}


const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export const demoHelpers = {
  // Ziel eines Anruf-Links, unmaskiert einsetzen: <a class="btn" {{{callHref site.phone.tel}}}>…</a>
  // Normal: href="tel:…". Demo: kein tel: (wählt nie), sondern Sprung zur Hinweisleiste;
  // mit JS zeigt js/demo.js stattdessen kurz „Demo: fiktive Nummer“. Gleiches Element → gleiches Aussehen.
  callHref(tel, options) {
    return options.data.root.demo ? 'href="#demo-hinweis" data-demo-call' : `href="tel:${escape(tel)}"`;
  },
};
