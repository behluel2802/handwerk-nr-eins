// Demo-Build (DEMO=1): Betreiberdaten, Abbruch ohne Daten, Formular/Anruf-Links/noindex im gebauten HTML.
// Build-Tests laufen nur, wenn die Bilder erzeugt sind (img/manifest.json, z. B. nach npm run build).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AUTHORITIES, demoHelpers, loadDemo, parseCredits } from '../scripts/demo.js';

const root = new URL('..', import.meta.url).pathname;
const OPERATOR = {
  DEMO_OPERATOR_NAME: 'Erika Testbetreiberin',
  DEMO_OPERATOR_STREET: 'Prüfweg 7',
  DEMO_OPERATOR_ZIP: '54321',
  DEMO_OPERATOR_CITY: 'Teststadt',
  DEMO_OPERATOR_EMAIL: 'demo@test.invalid',
  DEMO_OPERATOR_STATE: 'by',
};
const EMPTY = Object.fromEntries(Object.keys(OPERATOR).map((k) => [k, '']));
const noFile = { envFile: null };

test('ohne DEMO=1 kein Demo-Kontext, auch wenn Betreiberdaten gesetzt sind', () => {
  assert.equal(loadDemo({ ...OPERATOR }, noFile), null);
  assert.equal(loadDemo({ ...OPERATOR, DEMO: 'true' }, noFile), null);
});

test('DEMO=1 ohne Betreiberdaten bricht ab und nennt alle fehlenden Felder', () => {
  assert.throws(() => loadDemo({ DEMO: '1' }, noFile),
    /DEMO_OPERATOR_NAME, DEMO_OPERATOR_STREET, DEMO_OPERATOR_ZIP, DEMO_OPERATOR_CITY, DEMO_OPERATOR_EMAIL, DEMO_OPERATOR_STATE/);
  assert.throws(() => loadDemo({ DEMO: '1', ...OPERATOR, DEMO_OPERATOR_CITY: '  ' }, noFile), /DEMO_OPERATOR_CITY/);
});

test('DEMO=1: ungültiges Bundesland oder E-Mail bricht ab', () => {
  assert.throws(() => loadDemo({ DEMO: '1', ...OPERATOR, DEMO_OPERATOR_STATE: 'XX' }, noFile), /unbekanntes Bundesland/);
  assert.throws(() => loadDemo({ DEMO: '1', ...OPERATOR, DEMO_OPERATOR_EMAIL: 'kein-at' }, noFile), /E-Mail/);
});

test('DEMO=1 mit Daten: Betreiber, Aufsichtsbehörde, Telefon optional', () => {
  const demo = loadDemo({ DEMO: '1', ...OPERATOR }, noFile);
  assert.equal(demo.operator.name, 'Erika Testbetreiberin');
  assert.equal(demo.operator.phone, null);
  assert.deepEqual(demo.authority, AUTHORITIES.BY);
  const withPhone = loadDemo({ DEMO: '1', ...OPERATOR, DEMO_OPERATOR_PHONE: '+49 (30) 123-45' }, noFile);
  assert.equal(withPhone.operator.tel, '+493012345');
  assert.equal(Object.keys(AUTHORITIES).length, 16);
});

test('lokale .env.demo.local füllt Lücken, Umgebungsvariablen haben Vorrang', () => {
  const dir = mkdtempSync(join(tmpdir(), 'demo-env-'));
  const file = join(dir, '.env.demo.local');
  writeFileSync(file, Object.entries(OPERATOR).map(([k, v]) => `${k}="${v}"`).join('\n'));
  try {
    assert.equal(loadDemo({ DEMO: '1' }, { envFile: file }).operator.city, 'Teststadt');
    assert.equal(loadDemo({ DEMO: '1', DEMO_OPERATOR_CITY: 'Shell' }, { envFile: file }).operator.city, 'Shell');
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('Bildnachweise: jede Zeile der Tabelle in CREDITS.md wird gelesen', () => {
  const md = readFileSync(new URL('../img-src/CREDITS.md', import.meta.url), 'utf8');
  const rows = md.split('\n').filter((l) => l.startsWith('| `'));
  const credits = parseCredits(md);
  assert.equal(credits.length, rows.length);
  for (const c of credits) {
    assert.ok(c.motif && c.author);
    assert.match(c.authorUrl, /^https:\/\/unsplash\.com\/@/);
    assert.match(c.sourceUrl, /^https:\/\/unsplash\.com\/photos\//);
  }
});

test('Anruf-Link: tel: nur ohne Demo', () => {
  const opts = (demo) => ({ data: { root: { demo } } });
  assert.equal(demoHelpers.callHref('+491234', opts(null)), 'href="tel:+491234"');
  assert.equal(demoHelpers.callHref('+491234', opts({})), 'href="#demo-hinweis" data-demo-call');
});

/* --- Gebaute Seiten ---------------------------------------------------------- */
const canBuild = existsSync(join(root, 'img/manifest.json'));
const skip = canBuild ? false : 'Bilder fehlen (erst npm run build)';

// Baut in ein temporäres Verzeichnis; DEMO und DEMO_OPERATOR_* nur aus `env`, nicht aus der aufrufenden Shell
function build(env) {
  const outDir = mkdtempSync(join(tmpdir(), 'demo-build-'));
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('DEMO')));
  const result = spawnSync('npx', ['vite', 'build', '--outDir', outDir, '--emptyOutDir', '--logLevel', 'error'], {
    cwd: root, env: { ...clean, ...env }, encoding: 'utf8',
  });
  const read = (file) => readFileSync(join(outDir, file), 'utf8');
  const pages = readdirSync(outDir).filter((f) => f.endsWith('.html'));
  const scripts = () => readdirSync(join(outDir, 'assets')).filter((f) => f.endsWith('.js')).map((f) => read(`assets/${f}`)).join('\n');
  return { result, read, pages, scripts, cleanup: () => rmSync(outDir, { recursive: true, force: true }) };
}

test('Build mit DEMO=1 ohne Betreiberdaten schlägt fehl', { skip }, () => {
  // Leere Werte überschreiben auch eine lokale .env.demo.local
  const b = build({ DEMO: '1', ...EMPTY });
  try {
    assert.notEqual(b.result.status, 0);
    assert.match(b.result.stderr, /Betreiberdaten fehlen/);
  } finally { b.cleanup(); }
});

test('Build mit DEMO=1: Hinweisleiste, noindex, Betreiber im Impressum, nichts wählt, nichts sendet', { skip }, () => {
  const b = build({ DEMO: '1', ...OPERATOR });
  try {
    assert.equal(b.result.status, 0, b.result.stderr);
    assert.equal(b.pages.length, 4);
    for (const page of b.pages) {
      const html = b.read(page);
      assert.equal(html.match(/<meta name="robots" content="noindex">/g)?.length, 1, `noindex genau einmal in ${page}`);
      assert.ok(html.includes('class="demo-banner"'), `Hinweisleiste in ${page}`);
      assert.equal(html.includes('tel:'), false, `kein tel: in ${page}`);
      assert.equal(html.includes('{{'), false);
    }
    for (const page of ['impressum.html', 'datenschutz.html']) {
      const html = b.read(page);
      for (const key of ['NAME', 'STREET', 'ZIP', 'CITY', 'EMAIL']) assert.ok(html.includes(OPERATOR[`DEMO_OPERATOR_${key}`]), `${key} in ${page}`);
      assert.equal(html.includes('legal-notice'), false, `kein Platzhalter-Kasten in ${page}`);
    }
    assert.ok(b.read('datenschutz.html').includes(AUTHORITIES.BY.name));
    assert.ok(b.read('impressum.html').includes('unsplash.com/photos/'));

    const index = b.read('index.html');
    const form = index.match(/<form[^>]*data-contact-form[^>]*>/)[0];
    assert.equal(/action=|method=/.test(form), false, 'Formular ohne action/method');
    assert.ok(index.includes('Demo-Version: Das Formular ist deaktiviert.'));
    assert.equal(index.includes('type="submit"'), false, 'ohne JS kein Absende-Button');
    assert.equal(/method:\s*[`'"]POST/.test(b.scripts()), false, 'kein POST im JS');
  } finally { b.cleanup(); }
});

test('Build ohne DEMO: keine Betreiberdaten, kein Demo-Markup, Formular sendet an das Backend', { skip }, () => {
  const b = build({ ...OPERATOR }); // Betreiberdaten gesetzt, aber DEMO fehlt
  try {
    assert.equal(b.result.status, 0, b.result.stderr);
    for (const page of b.pages) {
      const html = b.read(page);
      assert.equal(html.includes(OPERATOR.DEMO_OPERATOR_NAME), false, `kein Betreiber in ${page}`);
      assert.equal(/demo-banner|data-demo|demo-hinweis/.test(html), false, `kein Demo-Markup in ${page}`);
    }
    assert.equal(b.read('index.html').includes('<meta name="robots"'), false, 'Startseite indexierbar');
    assert.ok(b.read('index.html').includes('action="/api/kontakt" method="post"'));
    assert.ok(b.read('index.html').includes('href="tel:'));
    assert.ok(b.read('impressum.html').includes('legal-notice'));
  } finally { b.cleanup(); }
});
