// Firmendaten aus site.json: laden, prüfen und als Handlebars-Helfer aufbereiten.
// site.json ist die einzige Quelle für Name, Adresse, Telefon, Öffnungszeiten usw.
// Genutzt von vite.config.js (Templates) – js/hours.js, js/main.js und das Backend lesen site.json direkt.
import { readFileSync } from 'node:fs';

const SITE_FILE = new URL('../site.json', import.meta.url);

// Pflichtfelder: fehlt eins, bricht der Build mit klarer Meldung ab
const REQUIRED = [
  'name', 'brand.prefix', 'brand.name', 'business', 'schemaType',
  'owner.name', 'owner.title', 'founded', 'team.total', 'team.apprentices',
  'address.street', 'address.zip', 'address.city', 'address.country',
  'phone.display', 'phone.tel', 'emergency.display', 'emergency.tel',
  'email', 'url', 'areaKm', 'responseTime', 'rating.value', 'rating.count',
  'hours.timeZone', 'hours.state', 'hours.week', 'hours.closedDays',
];
// Optional, aber vor dem Go-Live nötig: null → Build-Warnung, im HTML Text ohne Link
const RECOMMENDED = ['rating.profileUrl'];

const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const empty = (v) => v === undefined || v === null || v === '';

/** Prüft Firmendaten. Wirft bei fehlenden Pflichtfeldern, warnt bei fehlenden empfohlenen. */
export function checkSite(site, { warn = console.warn } = {}) {
  const missing = REQUIRED.filter((p) => empty(get(site, p)));
  if (missing.length) throw new Error(`site.json: Pflichtfelder fehlen: ${missing.join(', ')}`);
  for (const w of site.hours.week) {
    if (!w.days?.length || !/^\d\d:\d\d$/.test(w.from) || !/^\d\d:\d\d$/.test(w.to)) {
      throw new Error(`site.json: hours.week-Eintrag ungültig: ${JSON.stringify(w)}`);
    }
  }
  for (const p of RECOMMENDED) if (empty(get(site, p))) warn(`[site] ${p} ist leer – vor dem Go-Live eintragen`);
  return site;
}

/** Liest und prüft site.json. */
export const loadSite = (options) => checkSite(JSON.parse(readFileSync(SITE_FILE, 'utf8')), options);

const DAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const SCHEMA_DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// [1,2,3,4] → "Mo–Do", [5] → "Fr", [1,3] → "Mo, Mi"
function dayRange(days) {
  const contiguous = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
  if (days.length > 2 && contiguous) return `${DAY[days[0]]}–${DAY[days.at(-1)]}`;
  return days.map((d) => DAY[d]).join(', ');
}
const time = (hhmm) => hhmm.replace(/^0/, ''); // 07:00 → 7:00

/** JSON-LD (schema.org LocalBusiness) aus den Firmendaten */
export function jsonLd(site) {
  return {
    '@context': 'https://schema.org',
    '@type': site.schemaType,
    name: site.name,
    description: `${site.business} in ${site.address.city} seit ${site.founded}`,
    foundingDate: String(site.founded),
    telephone: site.phone.tel,
    email: site.email,
    url: site.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours.week.map((w) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: w.days.length === 1 ? SCHEMA_DAY[w.days[0]] : w.days.map((d) => SCHEMA_DAY[d]),
      opens: w.from,
      closes: w.to,
    })),
    areaServed: `${site.address.city} und Umgebung (ca. ${site.areaKm} km)`,
    founder: { '@type': 'Person', name: site.owner.name, jobTitle: site.owner.title },
  };
}

export const siteHelpers = {
  dayRange,
  time,
  // 4.9 → "4,9"
  decimal: (n) => Number(n).toLocaleString('de-DE'),
  // ["Heiligabend", "Silvester"] → "Heiligabend und Silvester"
  joinAnd: (obj) => {
    const list = Object.values(obj);
    return list.length < 2 ? list.join('') : `${list.slice(0, -1).join(', ')} und ${list.at(-1)}`;
  },
  // Inhalt für <script type="application/ld+json">, im Template mit {{{jsonLd site}}} (unmaskiert).
  // "<" als \u003c, damit im JSON nie </script> entstehen kann.
  jsonLd: (site) => JSON.stringify(jsonLd(site), null, 2).replace(/</g, '\\u003c'),
};
