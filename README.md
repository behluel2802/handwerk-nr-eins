# Handwerk Nr. 1 – Website-Vorlage für Handwerksbetriebe

One-Pager für einen **fiktiven** Elektro-Meisterbetrieb („Elektro Berger GmbH“, Musterstadt). Frontend aus HTML, CSS und Vanilla JS ohne Framework, gebaut mit **Vite** (Partials, Bild-Pipeline, Dateinamen mit Hash). Ein kleines Node.js-Backend liefert die gebaute Seite aus und nimmt die Kontaktanfragen an.

Demo (Demo-Build ohne Backend: Formular sendet nichts, Anruf-Links wählen nicht): https://behluel2802.github.io/handwerk-nr-eins/

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
| `npm run dev:demo` / `npm run build:demo` | wie oben, aber als **Demo-Build** (`DEMO=1`, siehe unten) |
| `npm start` | Backend liefert `frontend/dist/` aus → **http://localhost:3000** (wie im Betrieb, vorher `npm run build`) |
| `npm test` | Tests (Prüfregeln, Kontakt-API, gesperrte Pfade wie `/.env`, Caching, CSP, Demo-Build) |
| `npm run images` | Nur Bilder und Icons neu erzeugen (`-- --force` erzeugt alle neu) |
| `npx @lhci/cli@0.16.0 autorun` | Lighthouse für alle Seiten gegen `npm start` (Konfiguration `lighthouserc.json`) |

Ohne `backend/.env` bzw. ohne `SMTP_HOST` läuft der Mailversand im **Entwicklungsmodus**: Anfragen erscheinen nur in der Konsole. Für echten Versand `backend/.env.example` nach `backend/.env` kopieren und die SMTP-Daten eintragen.

## Demo-Build (öffentliche Vorschau mit fiktivem Betrieb)

Mit `DEMO=1` entsteht eine klar gekennzeichnete Demo: Hinweisleiste oben, `noindex` auf allen Seiten, das Formular sendet nichts, Anruf-Links wählen nicht, Impressum und Datenschutz nennen den **echten Betreiber**. Dessen Daten kommen nie ins Repo:

```bash
# frontend/.env.demo.local (steht auf .gitignore) – oder direkt als Umgebungsvariablen
DEMO_OPERATOR_NAME="Vorname Nachname"
DEMO_OPERATOR_STREET="Straße 1"        # ladungsfähige Anschrift, kein Postfach
DEMO_OPERATOR_ZIP="12345"
DEMO_OPERATOR_CITY="Ort"
DEMO_OPERATOR_EMAIL="demo@example.org"
DEMO_OPERATOR_STATE="BE"               # Bundesland-Kürzel → zuständige Datenschutz-Aufsichtsbehörde
DEMO_OPERATOR_PHONE=""                 # optional
```

Fehlt eine Pflichtangabe, bricht der Build ab. Für GitHub Pages dieselben Namen unter Settings → Secrets and variables → Actions → **Variables** anlegen.

## Struktur

```
package.json               npm-Workspaces (frontend, backend) und gemeinsame Befehle
frontend/                  Quellen der Website
  index.html, impressum.html, datenschutz.html, danke.html
  site.json                Firmendaten (einzige Quelle: Name, Adresse, Telefon, Öffnungszeiten …)
  partials/                Bausteine (Handlebars): Icon-Sprite, Footer, Kopf der Unterseiten, Demo-Hinweisleiste, Demo-Rechtstexte
  css/tokens.css           Design-Tokens (Farben, Schrift, Abstände)
  css/base.css             Reset, Typografie, Layout-Helfer, Buttons
  css/sections.css         Styles der einzelnen Abschnitte
  css/demo.css             nur im Demo-Build: Hinweisleiste, Hinweis „fiktive Nummer“
  js/main.js               Interaktion (Menü, Galerie, Formular, Erreichbarkeit)
  js/hours.js              Öffnungszeiten und Feiertage (konfigurierbar)
  js/validate.js           Prüfregeln fürs Formular (auch vom Backend genutzt)
  partials/picture.hbs     <picture> mit AVIF/WebP/JPG aus der Bild-Pipeline
  img-src/                 Original-Fotos, icon.svg (Favicon-Quelle), CREDITS.md
  images.config.js         Bildsätze: Größen, Formate, Ausschnitte
  scripts/images.js        Bild-Pipeline (sharp): img-src/ → img/ (+ manifest.json) und Icons → public/
  scripts/site.js          prüft site.json, Template-Helfer und JSON-LD
  scripts/demo.js          Demo-Build: Betreiberdaten prüfen, Aufsichtsbehörde, Bildnachweise, Helfer callHref
  scripts/compress.js      legt nach dem Build .br/.gz an (vom Backend ausgeliefert)
  img/, public/*.ico …     erzeugt, nicht im Repo
  vite.config.js           Build-Konfiguration
  test/                    Tests zum Demo-Build (node:test, baut in ein temporäres Verzeichnis)
  dist/                    gebaute Seite, nicht im Repo – nur dieser Ordner wird ausgeliefert
backend/                   Node.js-Server (nie öffentlich ausgeliefert)
  server.js                Auslieferung von frontend/dist/ + POST /api/kontakt
  contact.js               Rate-Limit, Mailtext, Versand (nodemailer)
  test/                    Tests (node:test)
  .env.example             Vorlage für die Konfiguration
.github/workflows/pages.yml    Demo-Deploy auf GitHub Pages (Demo-Build DEMO=1, veröffentlicht nur dist/)
.github/workflows/quality.yml  bei jedem Push: Build, Tests, Lighthouse, axe
lighthouserc.json              Lighthouse-Schwellen (Barrierefreiheit 100 …)
docs/BRIEFING.md           Projekt-Briefing und Entscheidungen
docs/LEITFADEN.md          Leitfaden für neue Projekte (eigenständig, zum Mitnehmen)
docs/BRIEFING-VORLAGE.md   leeres Briefing für ein neues Projekt
```

## Für ein anderes Gewerk anpassen

Schritt für Schritt in [docs/LEITFADEN.md](docs/LEITFADEN.md): Aufbau, empfohlene Reihenfolge, Entscheidungen mit Begründung, Stolpersteine, Checklisten für ein neues Gewerk und fürs Onlinegehen. Kurzfassung: Firmendaten in `frontend/site.json`, Farben in `frontend/css/tokens.css`, Texte in `frontend/index.html`, Fotos über `frontend/images.config.js`. Für ein neues Projekt `docs/BRIEFING-VORLAGE.md` nach `docs/BRIEFING.md` kopieren.

## Hinweise

- Alle Firmendaten sind erfunden. Echt sind nur die Betreiberangaben im Impressum des Demo-Builds.
- Keine externen Ressourcen (Fonts, CDNs, Tracker) – DSGVO-freundlich. Vite und sharp laufen nur beim Bauen, nichts davon landet im Browser.
- Bilder: Unsplash-Lizenz, Nachweise in `frontend/img-src/CREDITS.md`.
