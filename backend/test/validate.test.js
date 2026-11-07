import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact } from '../../frontend/js/validate.js';

const ok = { name: 'Max Mustermann', kontakt: '0171 1234567', nachricht: 'Bitte Wallbox installieren.' };

test('gültige Anfrage mit Telefon', () => {
  const { valid, data } = validateContact(ok);
  assert.equal(valid, true);
  assert.equal(data.kontaktart, 'telefon');
});

test('gültige Anfrage mit E-Mail', () => {
  const { valid, data } = validateContact({ ...ok, kontakt: 'max@beispiel.de' });
  assert.equal(valid, true);
  assert.equal(data.kontaktart, 'email');
});

test('Pflichtfelder fehlen', () => {
  const { valid, errors } = validateContact({});
  assert.equal(valid, false);
  assert.deepEqual(Object.keys(errors), ['name', 'kontakt', 'nachricht']);
});

test('ungültige E-Mail und zu kurze Telefonnummer', () => {
  assert.match(validateContact({ ...ok, kontakt: 'foo@' }).errors.kontakt, /E-Mail/);
  assert.match(validateContact({ ...ok, kontakt: '123' }).errors.kontakt, /Telefonnummer/);
});

test('Nachricht zu kurz und zu lang', () => {
  assert.ok(validateContact({ ...ok, nachricht: 'kurz' }).errors.nachricht);
  assert.ok(validateContact({ ...ok, nachricht: 'x'.repeat(5001) }).errors.nachricht);
});

test('Zeilenumbrüche im Namen werden entfernt (keine Header-Injection im Betreff)', () => {
  const { data } = validateContact({ ...ok, name: 'Max\r\nBcc: spam@example.com' });
  assert.equal(data.name.includes('\n'), false);
  assert.equal(data.name.includes('\r'), false);
});

test('unbekanntes Anliegen wird verworfen, bekanntes übernommen', () => {
  assert.equal(validateContact({ ...ok, anliegen: '<script>' }).data.anliegen, '');
  assert.equal(validateContact({ ...ok, anliegen: 'PV & Wallbox' }).data.anliegen, 'PV & Wallbox');
});
