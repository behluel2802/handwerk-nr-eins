// Öffnungszeiten und Feiertage – reine Funktionen ohne DOM, damit sie auch in Node testbar sind.
// Daten (Zeiten, Bundesland, Zusatz-Schließtage) kommen aus site.json → hours.

import site from '../site.json' with { type: 'json' };

// Wochentag (0 = So … 6 = Sa) → [von, bis]; fehlende Tage = geschlossen
const byWeekday = (week) =>
  Object.fromEntries(week.flatMap(({ days, from, to }) => days.map((d) => [d, [from, to]])));

export const CONFIG = {
  timeZone: site.hours.timeZone,
  state: site.hours.state, // Bundesland-Kürzel für landesspezifische Feiertage (z. B. BY, NW, HE)
  hours: byWeekday(site.hours.week),
  // Zusätzlich geschlossen (keine gesetzlichen Feiertage), Format MM-DD
  closedDays: site.hours.closedDays,
};

const pad = (n) => String(n).padStart(2, '0');
const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

// Ostersonntag nach dem gregorianischen Kalender (Algorithmus von Meeus/Jones/Butcher)
function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

const shift = (date, days) => new Date(date.getTime() + days * 86400000);
const isoOf = (date) => key(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());

// Gesetzliche Feiertage eines Jahres als Map 'YYYY-MM-DD' → Name
export function holidays(year, state = CONFIG.state) {
  const easter = easterSunday(year);
  const only = (...states) => states.includes(state);
  const list = [
    [key(year, 1, 1), 'Neujahr'],
    [isoOf(shift(easter, -2)), 'Karfreitag'],
    [isoOf(shift(easter, 1)), 'Ostermontag'],
    [key(year, 5, 1), 'Tag der Arbeit'],
    [isoOf(shift(easter, 39)), 'Christi Himmelfahrt'],
    [isoOf(shift(easter, 50)), 'Pfingstmontag'],
    [key(year, 10, 3), 'Tag der Deutschen Einheit'],
    [key(year, 12, 25), '1. Weihnachtstag'],
    [key(year, 12, 26), '2. Weihnachtstag'],
  ];

  if (only('BW', 'BY', 'ST')) list.push([key(year, 1, 6), 'Heilige Drei Könige']);
  if (only('BE', 'MV')) list.push([key(year, 3, 8), 'Internationaler Frauentag']);
  if (only('BW', 'BY', 'HE', 'NW', 'RP', 'SL')) list.push([isoOf(shift(easter, 60)), 'Fronleichnam']);
  if (only('SL')) list.push([key(year, 8, 15), 'Mariä Himmelfahrt']);
  if (only('TH')) list.push([key(year, 9, 20), 'Weltkindertag']);
  if (only('BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH')) list.push([key(year, 10, 31), 'Reformationstag']);
  if (only('BW', 'BY', 'NW', 'RP', 'SL')) list.push([key(year, 11, 1), 'Allerheiligen']);
  if (only('SN')) {
    // Buß- und Bettag: Mittwoch vor dem 23. November
    const nov23 = new Date(Date.UTC(year, 10, 23));
    const back = ((nov23.getUTCDay() - 3 + 7) % 7) || 7;
    list.push([isoOf(shift(nov23, -back)), 'Buß- und Bettag']);
  }

  return new Map(list);
}

// Datum und Uhrzeit in der Zeitzone des Betriebs (unabhängig von der Uhr des Besuchers)
function localParts(now, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now).map((p) => [p.type, p.value]),
  );
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  return {
    y, m, d,
    weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Warum ist an diesem Kalendertag geschlossen? (null = regulärer Arbeitstag)
function closedReason(y, m, d, weekday, config) {
  const name = holidays(y, config.state).get(key(y, m, d)) ?? config.closedDays[`${pad(m)}-${pad(d)}`];
  if (name) return name;
  return config.hours[weekday] ? null : '';
}

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const show = (hhmm) => hhmm.replace(/^0/, ''); // 07:00 → 7:00

/**
 * Status für die Anzeige „Jetzt erreichbar“.
 * @returns {{ open: boolean, text: string }}
 */
export function openingStatus(now = new Date(), config = CONFIG) {
  const today = localParts(now, config.timeZone);
  const reason = closedReason(today.y, today.m, today.d, today.weekday, config);
  const slot = reason === null ? config.hours[today.weekday] : null;

  if (slot) {
    const from = toMinutes(slot[0]);
    const to = toMinutes(slot[1]);
    if (today.minutes >= from && today.minutes < to) {
      return { open: true, text: `Jetzt erreichbar – bis ${show(slot[1])} Uhr` };
    }
    if (today.minutes < from) {
      return { open: false, text: `Erreichbar ab heute ${show(slot[0])} Uhr` };
    }
  }

  // Nächsten Öffnungstag suchen (max. 3 Wochen voraus)
  const base = Date.UTC(today.y, today.m - 1, today.d);
  for (let i = 1; i <= 21; i += 1) {
    const date = new Date(base + i * 86400000);
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    const weekday = date.getUTCDay();
    if (closedReason(y, m, d, weekday, config) !== null) continue;

    const day = i === 1 ? 'morgen' : WEEKDAYS[weekday];
    const next = `wieder erreichbar ab ${day} ${show(config.hours[weekday][0])} Uhr`;
    const prefix = reason ? `Heute geschlossen (${reason})` : 'Gerade geschlossen';
    return { open: false, text: `${prefix} – ${next}` };
  }

  return { open: false, text: 'Gerade geschlossen' };
}
