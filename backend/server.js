// Node-Server der Website
// Liefert ausschließlich die gebaute Seite (frontend/dist/) aus und nimmt Kontaktanfragen unter POST /api/kontakt an.
// Start: npm run build && npm start im Hauptordner (lädt .env, falls vorhanden; ohne SMTP_HOST Entwicklungsmodus)

import http from 'node:http';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir, readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRateLimiter, createSender, validateContact } from './contact.js';
import site from '../frontend/site.json' with { type: 'json' };

const DEFAULT_ROOT = fileURLToPath(new URL('../frontend/dist/', import.meta.url));
const MAX_BODY = 10 * 1024; // 10 KB reichen für jede echte Anfrage

// Nur diese Dateitypen werden ausgeliefert – alles andere ist 404
export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// Gebaute Dateien mit Hash im Namen (assets/name-AbC123.js) ändern sich nie → dauerhaft cachen
const IMMUTABLE = /^\/assets\/[^/]+-[\w-]{8}\.\w+$/;

// Vorkomprimierte Varianten (erzeugt von frontend/scripts/compress.js), bevorzugt Brotli
const ENCODINGS = { br: '.br', gzip: '.gz' };
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.svg', '.json']);

/** Wählt br/gzip, wenn der Browser es annimmt und die Datei vorkomprimiert vorliegt */
async function pickEncoding(file, acceptEncoding = '') {
  if (!COMPRESSIBLE.has(path.extname(file).toLowerCase())) return null;
  const accepted = new Set(acceptEncoding.split(',').map((e) => e.split(';')[0].trim().toLowerCase()));
  for (const [encoding, suffix] of Object.entries(ENCODINGS)) {
    if (accepted.has(encoding) && (await stat(file + suffix).then((s) => s.isFile(), () => false))) return encoding;
  }
  return null;
}

// HTML-Seiten im Wurzelordner der Website
async function htmlPages(root) {
  return (await readdir(root).catch(() => [])).filter((f) => f.endsWith('.html')).sort();
}

// Hashes aller Inline-Skripte aller Seiten für die CSP (JSON-LD wird nicht ausgeführt, braucht keinen)
async function inlineScriptHashes(root) {
  const hashes = new Set();
  for (const page of await htmlPages(root)) {
    const html = await readFile(path.join(root, page), 'utf8').catch(() => '');
    for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
      hashes.add(`'sha256-${createHash('sha256').update(code).digest('base64')}'`);
    }
  }
  return [...hashes];
}

function securityHeaders(scriptHashes) {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
      "style-src 'self'",
      "img-src 'self' data:", // data: für den leeren Platzhalter der Lightbox
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
}

const json = (res, status, body, extra = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
  res.end(JSON.stringify(body));
};

const notFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Nicht gefunden');
};

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Fehlerseite für Absenden ohne JS (mit JS zeigt das Frontend die Meldung selbst an)
const htmlError = (res, status, message) => {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Anfrage nicht gesendet</title><link rel="stylesheet" href="/css/tokens.css"><link rel="stylesheet" href="/css/base.css">
<main class="section"><div class="container stack"><h1>Anfrage nicht gesendet</h1><p>${escapeHtml(message)}</p>
<p><a href="/#kontakt">Zurück zum Formular</a> oder rufen Sie uns an: <a href="tel:${escapeHtml(site.phone.tel)}">${escapeHtml(site.phone.display)}</a></p></div></main></html>`);
};

/** Liest den Request-Body mit Größenlimit (zu große Bodies werden verworfen, nicht gepuffert) */
function readBody(req) {
  return new Promise((resolve, reject) => {
    const tooLarge = () => Object.assign(new Error('too large'), { status: 413 });
    if (Number(req.headers['content-length'] ?? 0) > MAX_BODY) {
      reject(tooLarge());
      return;
    }
    let size = 0;
    let failed = false;
    const chunks = [];
    req.on('data', (chunk) => {
      if (failed) return;
      size += chunk.length;
      if (size > MAX_BODY) {
        failed = true;
        reject(tooLarge());
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => { if (!failed) resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

/**
 * Erstellt den Request-Handler. Abhängigkeiten sind injizierbar (für Tests).
 */
export async function createApp({
  root = DEFAULT_ROOT,
  sender = createSender(),
  limiter = createRateLimiter(),
  trustProxy = process.env.TRUST_PROXY === '1',
} = {}) {
  const rootReal = await realpath(root).catch(() => {
    throw new Error(`Gebaute Website fehlt (${root}). Bitte zuerst im Hauptordner „npm run build“ ausführen.`);
  });

  // Sicherheits-Header; CSP-Hashes neu berechnen, sobald sich eine Seite ändert (z. B. nach neuem Build)
  let cached = { key: '', headers: null };
  async function currentHeaders() {
    const pages = await htmlPages(rootReal);
    const times = await Promise.all(pages.map((p) => stat(path.join(rootReal, p)).then((s) => s.mtimeMs, () => 0)));
    const key = pages.map((p, i) => `${p}:${times[i]}`).join('|');
    if (key !== cached.key) cached = { key, headers: securityHeaders(await inlineScriptHashes(rootReal)) };
    return cached.headers;
  }

  // Liefert eine Datei aus der Website-Wurzel – oder null, wenn sie nicht ausgeliefert werden darf
  async function resolveFile(urlPath) {
    let pathname;
    try {
      pathname = decodeURIComponent(urlPath);
    } catch {
      return null;
    }
    if (pathname.includes('\0') || pathname.includes('\\')) return null;
    if (pathname.endsWith('/')) pathname += 'index.html';

    // Keine Punkt-Dateien/-Ordner (.env, .git, …) und kein Verlassen der Wurzel
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some((s) => s.startsWith('.'))) return null;

    const file = path.join(rootReal, ...segments);
    if (!MIME[path.extname(file).toLowerCase()]) return null;

    try {
      const real = await realpath(file); // löst Symlinks auf – auch die müssen innerhalb bleiben
      if (!real.startsWith(rootReal + path.sep)) return null;
      const info = await stat(real);
      return info.isFile() ? { file: real, info } : null;
    } catch {
      return null;
    }
  }

  async function serveStatic(req, res, url) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }
    const found = await resolveFile(url.pathname);
    if (!found) return notFound(res);

    // Vorkomprimierte Variante (.br/.gz aus dem Build), falls der Browser sie annimmt
    const encoding = await pickEncoding(found.file, req.headers['accept-encoding']);
    const file = encoding ? `${found.file}${ENCODINGS[encoding]}` : found.file;
    const info = encoding ? await stat(file) : found.info;

    // Gehashte Assets: ein Jahr, unveränderlich. Alles andere (HTML): ETag + no-cache,
    // der Browser fragt jedes Mal nach und bekommt 304, solange sich nichts geändert hat.
    const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}${encoding ? `-${encoding}` : ''}"`;
    const fileHeaders = {
      'Content-Type': MIME[path.extname(found.file).toLowerCase()],
      'Cache-Control': IMMUTABLE.test(url.pathname) ? 'public, max-age=31536000, immutable' : 'no-cache',
      ETag: etag,
      ...(COMPRESSIBLE.has(path.extname(found.file).toLowerCase()) && { Vary: 'Accept-Encoding' }),
      ...(encoding && { 'Content-Encoding': encoding }),
    };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, fileHeaders);
      res.end();
      return;
    }
    res.writeHead(200, { ...fileHeaders, 'Content-Length': info.size });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    createReadStream(file).pipe(res);
  }

  async function handleContact(req, res) {
    if (req.method !== 'POST') return json(res, 405, { error: 'Methode nicht erlaubt.' }, { Allow: 'POST' });

    const type = (req.headers['content-type'] ?? '').split(';')[0].trim();
    const isForm = type === 'application/x-www-form-urlencoded';
    if (!isForm && type !== 'application/json') return json(res, 415, { error: 'Nicht unterstütztes Format.' });

    const fail = (status, message) => (isForm ? htmlError(res, status, message) : json(res, status, { error: message }));

    const ip = trustProxy
      ? String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket.remoteAddress
      : req.socket.remoteAddress;
    if (!limiter.hit(ip)) return fail(429, 'Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es später erneut.');

    let input;
    try {
      const body = await readBody(req);
      input = isForm ? Object.fromEntries(new URLSearchParams(body)) : JSON.parse(body);
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('kein Objekt');
    } catch (error) {
      if (error.status === 413) {
        // Antwort zuerst senden, dann Verbindung schließen – den Rest des Bodies nicht mehr lesen
        res.setHeader('Connection', 'close');
        res.on('finish', () => req.destroy());
        return fail(413, 'Die Anfrage ist zu groß.');
      }
      return fail(400, 'Die Anfrage konnte nicht gelesen werden.');
    }

    const done = () => {
      if (isForm) {
        res.writeHead(303, { Location: '/danke.html' });
        res.end();
      } else {
        json(res, 200, { ok: true });
      }
    };

    // Honeypot ausgefüllt: vermutlich Bot – Erfolg vortäuschen, nichts senden
    if (input.website) return done();

    const { valid, errors, data } = validateContact(input);
    if (!valid) {
      const message = Object.values(errors)[0];
      return isForm ? htmlError(res, 422, message) : json(res, 422, { error: message, fields: errors });
    }

    try {
      await sender.send(data);
    } catch (error) {
      // Keine Personendaten ins Log, nur die Fehlerursache
      console.error(`[kontakt] Versand fehlgeschlagen: ${error.code ?? error.message}`);
      return fail(502, 'Ihre Anfrage konnte gerade nicht versendet werden.');
    }
    console.info('[kontakt] Anfrage versendet');
    return done();
  }

  return async function handler(req, res) {
    try {
      for (const [name, value] of Object.entries(await currentHeaders())) res.setHeader(name, value);
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/kontakt') return await handleContact(req, res);
      return await serveStatic(req, res, url);
    } catch (error) {
      console.error('[server] Unerwarteter Fehler:', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Serverfehler');
      } else {
        res.destroy();
      }
    }
  };
}

// Direkt gestartet (nicht in Tests importiert): Server hochfahren
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const sender = createSender();
  let app;
  try {
    app = await createApp({ sender });
  } catch (error) {
    console.error(`[server] ${error.message}`);
    process.exit(1);
  }
  const server = http.createServer(app);
  server.listen(port, () => {
    console.info(`${site.name} läuft auf http://localhost:${port} (Mailversand: ${sender.mode === 'smtp' ? 'SMTP' : 'Entwicklungsmodus, nur Konsole'})`);
  });
}
