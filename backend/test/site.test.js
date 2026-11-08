import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import site from '../../frontend/site.json' with { type: 'json' };
import { checkSite, jsonLd, siteHelpers } from '../../frontend/scripts/site.js';
import { CONFIG, openingStatus } from '../../frontend/js/hours.js';

const quiet = { warn: () => {} };
const clone = () => structuredClone(site);

test('site.json ist vollständig', () => {
  assert.doesNotThrow(() => checkSite(clone(), quiet));
});

test('fehlendes Pflichtfeld bricht ab, fehlender Google-Link warnt nur', () => {
  const broken = clone();
  delete broken.phone.tel;
  broken.address.city = '';
  assert.throws(() => checkSite(broken, quiet), /address\.city, phone\.tel/);

  const warnings = [];
  const noLink = { ...clone(), rating: { ...site.rating, profileUrl: null } };
  checkSite(noLink, { warn: (m) => warnings.push(m) });
  assert.match(warnings.join(), /rating\.profileUrl/);
});

test('Helfer: Wochentage, Uhrzeit, Dezimalzahl, Aufzählung', () => {
  assert.equal(siteHelpers.dayRange([1, 2, 3, 4]), 'Mo–Do');
  assert.equal(siteHelpers.dayRange([5]), 'Fr');
  assert.equal(siteHelpers.dayRange([1, 3]), 'Mo, Mi');
  assert.equal(siteHelpers.time('07:00'), '7:00');
  assert.equal(siteHelpers.decimal(4.9), '4,9');
  assert.equal(siteHelpers.joinAnd({ a: 'Heiligabend', b: 'Silvester' }), 'Heiligabend und Silvester');
  assert.equal(siteHelpers.jsonLd({ ...clone(), name: '</script>' }).includes('</script>'), false);
});

test('Gebaute Startseite: JSON-LD stimmt mit site.json überein, keine toten Links', async () => {
  const html = await readFile(new URL('../../frontend/dist/index.html', import.meta.url), 'utf8').catch(() => null);
  if (!html) return; // ohne Build nichts zu prüfen
  const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.deepEqual(JSON.parse(block), jsonLd(site));
  assert.ok(html.includes(`href="tel:${site.phone.tel}"`));
  assert.equal(html.includes('href="#"'), false);
  assert.equal(html.includes('{{'), false);
});

test('Öffnungszeiten kommen aus site.json', () => {
  assert.deepEqual(CONFIG.hours[1], ['07:00', '17:00']);
  assert.deepEqual(CONFIG.hours[5], ['07:00', '14:00']);
  assert.equal(CONFIG.hours[6], undefined);
  assert.equal(CONFIG.state, site.hours.state);
});

test('Erreichbarkeit: offen, nach Feierabend, Feiertag, Heiligabend', () => {
  // Zeiten in UTC; Berlin = UTC+1 (Winter) bzw. UTC+2 (Sommer)
  assert.equal(openingStatus(new Date('2026-11-11T09:00:00Z')).text, 'Jetzt erreichbar – bis 17:00 Uhr'); // Mi 10:00
  assert.equal(openingStatus(new Date('2026-11-13T14:00:00Z')).text, 'Gerade geschlossen – wieder erreichbar ab Mo 7:00 Uhr'); // Fr 15:00
  assert.match(openingStatus(new Date('2026-06-04T08:00:00Z')).text, /^Heute geschlossen \(Fronleichnam\)/); // Do, Hessen
  assert.match(openingStatus(new Date('2026-12-24T09:00:00Z')).text, /^Heute geschlossen \(Heiligabend\)/);
});
