import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../server.js';
import { createRateLimiter } from '../contact.js';

// Eigene Test-Wurzel mit „gefährlichen“ Dateien, die NIE ausgeliefert werden dürfen
let dir;
let root;

before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'eb-test-'));
  root = path.join(dir, 'frontend');
  await mkdir(path.join(root, 'css'), { recursive: true });
  await mkdir(path.join(root, 'assets'));
  await writeFile(path.join(root, 'assets', 'index-AbCd12_-.js'), 'console.log(1)');
  await writeFile(path.join(root, 'unterseite.html'), '<!doctype html><script>window.x = 1;</script>');
  await writeFile(path.join(root, 'css', 'a.css.br'), 'BROTLI');
  await writeFile(path.join(root, 'css', 'a.css.gz'), 'GZIP');
  await mkdir(path.join(root, '.git'));
  await writeFile(path.join(root, 'index.html'), "<!doctype html><script>document.documentElement.classList.add('js');</script>");
  await writeFile(path.join(root, 'css', 'a.css'), 'body{}');
  await writeFile(path.join(root, 'notes.md'), 'intern');
  await writeFile(path.join(root, '.env'), 'SMTP_PASS=geheim');
  await writeFile(path.join(root, '.git', 'config'), '[core]');
  await writeFile(path.join(dir, 'secret.html'), 'außerhalb');
  await symlink(path.join(dir, 'secret.html'), path.join(root, 'link.html'));
});

after(() => rm(dir, { recursive: true, force: true }));

/** Startet einen Server auf einem freien Port, führt fn aus, beendet ihn wieder */
async function withServer(options, fn) {
  const sent = [];
  const sender = options.sender ?? { send: async (data) => { sent.push(data); } };
  const server = http.createServer(await createApp({ root, sender, limiter: createRateLimiter({ limit: 100 }), ...options }));
  await new Promise((resolve) => server.listen(0, resolve));
  try {
    await fn({ port: server.address().port, sent });
  } finally {
    server.close();
  }
}

// Rohe Anfrage: fetch würde ../ vorher selbst auflösen, so kommt der Pfad unverändert an
function raw(port, { method = 'GET', path: p = '/', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path: p, headers }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const post = (port, payload, type = 'application/json') => raw(port, {
  method: 'POST',
  path: '/api/kontakt',
  headers: { 'Content-Type': type },
  body: type === 'application/json' ? JSON.stringify(payload) : new URLSearchParams(payload).toString(),
});

const valid = { name: 'Max Mustermann', kontakt: 'max@beispiel.de', nachricht: 'Bitte Wallbox installieren.' };

test('Startseite und CSS werden ausgeliefert, mit Sicherheits-Headern', () => withServer({}, async ({ port }) => {
  const res = await raw(port, { path: '/' });
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/html/);
  assert.match(res.headers['content-security-policy'], /script-src 'self' 'sha256-/);
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.equal(res.headers['cache-control'], 'no-cache');
  assert.equal((await raw(port, { path: '/css/a.css' })).status, 200);
}));

test('Gehashte Assets werden dauerhaft gecacht, andere Dateien nicht', () => withServer({}, async ({ port }) => {
  const asset = await raw(port, { path: '/assets/index-AbCd12_-.js' });
  assert.equal(asset.status, 200);
  assert.equal(asset.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.equal((await raw(port, { path: '/css/a.css' })).headers['cache-control'], 'no-cache');
}));

test('Alle Dateitypen aus dem Build werden ausgeliefert', async () => {
  // Jede Endung in frontend/dist/ braucht einen Eintrag in MIME, sonst 404 (z. B. .avif)
  const { readdir } = await import('node:fs/promises');
  const dist = new URL('../../frontend/dist/', import.meta.url);
  const files = await readdir(dist, { recursive: true }).catch(() => []);
  const exts = new Set(files.map((f) => path.extname(f)).filter((e) => e && !['.br', '.gz'].includes(e)));
  const { MIME } = await import('../server.js');
  for (const ext of exts) assert.ok(MIME[ext], `Dateityp ${ext} fehlt in MIME`);
});

test('CSP enthält die Inline-Skripte aller Seiten', () => withServer({}, async ({ port }) => {
  const csp = (await raw(port, { path: '/' })).headers['content-security-policy'];
  assert.equal(csp.match(/'sha256-/g).length, 2);
}));

test('Fehlender Build-Ordner → verständliche Fehlermeldung', async () => {
  await assert.rejects(createApp({ root: path.join(dir, 'gibt-es-nicht') }), /npm run build/);
});

test('Vorkomprimiert: Brotli bevorzugt, sonst gzip, sonst unkomprimiert', () => withServer({}, async ({ port }) => {
  const br = await raw(port, { path: '/css/a.css', headers: { 'Accept-Encoding': 'gzip, deflate, br' } });
  assert.equal(br.headers['content-encoding'], 'br');
  assert.equal(br.headers.vary, 'Accept-Encoding');
  assert.equal(br.body, 'BROTLI');
  const gz = await raw(port, { path: '/css/a.css', headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(gz.headers['content-encoding'], 'gzip');
  const plain = await raw(port, { path: '/css/a.css' });
  assert.equal(plain.headers['content-encoding'], undefined);
  assert.equal(plain.body, 'body{}');
  assert.notEqual(br.headers.etag, plain.headers.etag);
  // .br/.gz selbst sind nicht direkt abrufbar
  assert.equal((await raw(port, { path: '/css/a.css.br' })).status, 404);
}));

test('ETag: unveränderte Datei → 304', () => withServer({}, async ({ port }) => {
  const first = await raw(port, { path: '/css/a.css' });
  const second = await raw(port, { path: '/css/a.css', headers: { 'If-None-Match': first.headers.etag } });
  assert.equal(second.status, 304);
}));

for (const p of [
  '/.env',
  '/.git/config',
  '/%2e%2e/secret.html',
  '/../secret.html',
  '/css/../../secret.html',
  '/%2e%2e%2fsecret.html',
  '/..%5csecret.html',
  '/link.html',
  '/notes.md',
  '/css/',
  '/docs/BRIEFING.md',
  '/backend/server.js',
  '/../backend/.env',
]) {
  test(`gesperrt: ${p}`, () => withServer({}, async ({ port }) => {
    const res = await raw(port, { path: p });
    assert.equal(res.status, 404, `${p} → ${res.status}`);
    assert.doesNotMatch(res.body, /geheim|außerhalb|intern|\[core\]/);
  }));
}

test('Kontakt: gültige JSON-Anfrage wird versendet', () => withServer({}, async ({ port, sent }) => {
  const res = await post(port, valid);
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].kontaktart, 'email');
}));

test('Kontakt: ohne JS (Formulardaten) → Weiterleitung auf danke.html', () => withServer({}, async ({ port, sent }) => {
  const res = await post(port, valid, 'application/x-www-form-urlencoded');
  assert.equal(res.status, 303);
  assert.equal(res.headers.location, '/danke.html');
  assert.equal(sent.length, 1);
}));

test('Kontakt: ungültige Anfrage → 422 mit Meldung, kein Versand', () => withServer({}, async ({ port, sent }) => {
  const res = await post(port, { ...valid, kontakt: 'foo@' });
  assert.equal(res.status, 422);
  assert.match(JSON.parse(res.body).error, /E-Mail/);
  assert.equal(sent.length, 0);
}));

test('Kontakt: Honeypot → scheinbarer Erfolg, kein Versand', () => withServer({}, async ({ port, sent }) => {
  const res = await post(port, { ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.equal(sent.length, 0);
}));

test('Kontakt: Rate-Limit greift nach 5 Anfragen', () => withServer({ limiter: createRateLimiter({ limit: 5 }) }, async ({ port }) => {
  for (let i = 0; i < 5; i += 1) assert.equal((await post(port, valid)).status, 200);
  assert.equal((await post(port, valid)).status, 429);
}));

test('Kontakt: zu großer Body → 413', () => withServer({}, async ({ port }) => {
  const res = await post(port, { ...valid, nachricht: 'x'.repeat(20000) });
  assert.equal(res.status, 413);
}));

test('Kontakt: falsches Format und falsche Methode', () => withServer({}, async ({ port }) => {
  assert.equal((await post(port, valid, 'text/plain')).status, 415);
  assert.equal((await raw(port, { path: '/api/kontakt' })).status, 405);
  assert.equal((await raw(port, { method: 'POST', path: '/api/kontakt', headers: { 'Content-Type': 'application/json' }, body: '{kaputt' })).status, 400);
}));

test('Kontakt: Versandfehler → 502 mit Meldung', () => withServer({ sender: { send: async () => { throw new Error('SMTP down'); } } }, async ({ port }) => {
  const original = console.error;
  console.error = () => {};
  try {
    const res = await post(port, valid);
    assert.equal(res.status, 502);
    assert.match(JSON.parse(res.body).error, /nicht versendet/);
  } finally {
    console.error = original;
  }
}));
