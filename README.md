# Handwerk Nr. 1 – Website-Vorlage für Handwerksbetriebe

One-Pager für einen **fiktiven** Elektro-Meisterbetrieb („Elektro Berger GmbH“, Musterstadt). Frontend aus HTML, CSS und Vanilla JS ohne Framework, gebaut mit **Vite** (Partials, Bild-Pipeline, Dateinamen mit Hash). Ein kleines Node.js-Backend liefert die gebaute Seite aus und nimmt die Kontaktanfragen an.

Demo (ohne Backend, Formular im Demo-Modus): https://behluel2802.github.io/handwerk-nr-eins/

## Voraussetzungen

Node.js 24 (siehe `.nvmrc`, mindestens 22.9). Einmalig im Hauptordner:

```bash
npm install
```

## Befehle (im Hauptordner)

| Befehl | Was passiert |
|---|---|
| `npm run dev` | Entwicklung: Vite auf **http://localhost:5173** (lädt bei Änderungen sofort neu) + Backend auf :3000. Anfragen an `/api` reicht Vite an das Backend weiter. |
| `npm run build` | Erzeugt die Bilder und baut die Seite nach `frontend/dist/` |
| `npm start` | Backend liefert `frontend/dist/` aus → **http://localhost:3000** (wie im Betrieb, vorher `npm run build`) |
| `npm test` | Tests (Prüfregeln, Kontakt-API, gesperrte Pfade wie `/.env`, Caching, CSP) |
| `npm run images` | Nur Bilder und Icons neu erzeugen (`-- --force` erzeugt alle neu) |
| `npx @lhci/cli@0.16.0 autorun` | Lighthouse für alle Seiten gegen `npm start` (Konfiguration `lighthouserc.json`) |

Ohne `backend/.env` bzw. ohne `SMTP_HOST` läuft der Mailversand im **Entwicklungsmodus**: Anfragen erscheinen nur in der Konsole. Für echten Versand `backend/.env.example` nach `backend/.env` kopieren und die SMTP-Daten eintragen.

## Struktur

```
package.json               npm-Workspaces (frontend, backend) und gemeinsame Befehle
frontend/                  Quellen der Website
  index.html, impressum.html, datenschutz.html, danke.html
  partials/                Bausteine (Handlebars): Icon-Sprite, Footer, Kopf der Unterseiten
  css/tokens.css           Design-Tokens (Farben, Schrift, Abstände)
  css/base.css             Reset, Typografie, Layout-Helfer, Buttons
  css/sections.css         Styles der einzelnen Abschnitte
  js/main.js               Interaktion (Menü, Galerie, Formular, Erreichbarkeit)
  js/hours.js              Öffnungszeiten und Feiertage (konfigurierbar)
  js/validate.js           Prüfregeln fürs Formular (auch vom Backend genutzt)
  partials/picture.hbs     <picture> mit AVIF/WebP/JPG aus der Bild-Pipeline
  img-src/                 Original-Fotos, icon.svg (Favicon-Quelle), CREDITS.md
  images.config.js         Bildsätze: Größen, Formate, Ausschnitte
  scripts/images.js        Bild-Pipeline (sharp): img-src/ → img/ (+ manifest.json) und Icons → public/
  scripts/compress.js      legt nach dem Build .br/.gz an (vom Backend ausgeliefert)
  img/, public/*.ico …     erzeugt, nicht im Repo
  vite.config.js           Build-Konfiguration
  dist/                    gebaute Seite, nicht im Repo – nur dieser Ordner wird ausgeliefert
backend/                   Node.js-Server (nie öffentlich ausgeliefert)
  server.js                Auslieferung von frontend/dist/ + POST /api/kontakt
  contact.js               Rate-Limit, Mailtext, Versand (nodemailer)
  test/                    Tests (node:test)
  .env.example             Vorlage für die Konfiguration
.github/workflows/pages.yml    Demo-Deploy auf GitHub Pages (baut und veröffentlicht dist/, mit noindex)
.github/workflows/quality.yml  bei jedem Push: Build, Tests, Lighthouse, axe
lighthouserc.json              Lighthouse-Schwellen (Barrierefreiheit 100 …)
docs/BRIEFING.md           Projekt-Briefing, Entscheidungen und fiktive Firmendaten
```

## Für ein anderes Gewerk anpassen

1. Farben im Block „Marke“ in `frontend/css/tokens.css` ändern.
2. Firmendaten in `docs/BRIEFING.md` und in den Seiten (Text und JSON-LD in `index.html`, `@type` z. B. `Plumber`, `HousePainter`, dazu `partials/footer.hbs`) ersetzen.
3. Öffnungszeiten und Bundesland (Feiertage) in `frontend/js/hours.js` anpassen.
4. Fotos: Originale nach `frontend/img-src/`, Bildsätze in `frontend/images.config.js`, im HTML `{{> picture …}}`, Nachweise in `frontend/img-src/CREDITS.md`.
5. Favicon: Farben/Symbol in `frontend/img-src/icon.svg` ändern.

## Hinweise

- Alle Firmendaten sind erfunden.
- Keine externen Ressourcen (Fonts, CDNs, Tracker) – DSGVO-freundlich. Vite und sharp laufen nur beim Bauen, nichts davon landet im Browser.
- Bilder: Unsplash-Lizenz, Nachweise in `frontend/img-src/CREDITS.md`.
