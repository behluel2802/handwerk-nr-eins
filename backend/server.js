// Elektro Berger – Node-Server
// Liefert ausschließlich frontend/ aus und nimmt Kontaktanfragen unter POST /api/kontakt an.
// Start: npm run dev (lädt .env, falls vorhanden; ohne SMTP_HOST Entwicklungsmodus)

import http from 'node:http';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRateLimiter, createSender, validateContact } from './contact.js';

const DEFAULT_ROOT = fileURLToPath(new URL('../frontend/', import.meta.url));
const MAX_BODY = 10 * 1024; // 10 KB reichen für jede echte Anfrage

// Nur diese Dateitypen werden ausgeliefert – alles andere ist 404
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// Hashes aller Inline-Skripte in index.html für die CSP (JSON-LD wird nicht ausgeführt, braucht keinen)
async function inlineScriptHashes(root) {
  const html = await readFile(path.join(root, 'index.html'), 'utf8').catch(() => '');
  return [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`);
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
<p><a href="/#kontakt">Zurück zum Formular</a> oder rufen Sie uns an: <a href="tel:+491234567890">0123 456 789 0</a></p></div></main></html>`);
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
  const rootReal = await realpath(root);

  // Sicherheits-Header; CSP-Hashes neu berechnen, sobald sich index.html ändert
  let cached = { mtime: -1, headers: null };
  async function currentHeaders() {
    const mtime = await stat(path.join(rootReal, 'index.html')).then((s) => s.mtimeMs, () => 0);
    if (mtime !== cached.mtime) cached = { mtime, headers: securityHeaders(await inlineScriptHashes(rootReal)) };
    return cached.headers;
  }

  // Liefert eine Datei aus frontend/ – oder null, wenn sie nicht ausgeliefert werden darf
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

    // ETag + no-cache: Browser fragt jedes Mal nach und bekommt 304, solange sich nichts geändert hat
    const etag = `W/"${found.info.size.toString(16)}-${Math.floor(found.info.mtimeMs).toString(16)}"`;
    const fileHeaders = {
      'Content-Type': MIME[path.extname(found.file).toLowerCase()],
      'Cache-Control': 'no-cache',
      ETag: etag,
    };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, fileHeaders);
      res.end();
      return;
    }
    res.writeHead(200, { ...fileHeaders, 'Content-Length': found.info.size });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    createReadStream(found.file).pipe(res);
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
  const server = http.createServer(await createApp({ sender }));
  server.listen(port, () => {
    console.info(`Elektro Berger läuft auf http://localhost:${port} (Mailversand: ${sender.mode === 'smtp' ? 'SMTP' : 'Entwicklungsmodus, nur Konsole'})`);
  });
}
