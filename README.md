# Handwerk Nr. 1 – Website-Vorlage für Handwerksbetriebe

One-Pager für einen **fiktiven** Elektro-Meisterbetrieb („Elektro Berger GmbH“, Musterstadt). Frontend aus reinem HTML, CSS und Vanilla JS, ohne Framework und ohne Build-Schritt. Ein kleines Node.js-Backend liefert die Seite aus und nimmt die Kontaktanfragen an.

## Lokal ansehen

**Mit Backend (empfohlen):**

```bash
cd backend
npm install      # einmalig
npm run dev      # → http://localhost:3000, startet bei Änderungen am Backend neu
```

Ohne `backend/.env` bzw. ohne `SMTP_HOST` läuft der Mailversand im **Entwicklungsmodus**: Anfragen erscheinen nur in der Konsole. Für echten Versand `backend/.env.example` nach `backend/.env` kopieren und die SMTP-Daten eintragen.

**Nur Frontend** (z. B. für einen schnellen Blick, Formular dann im Demo-Modus):

```bash
python3 -m http.server 8000 -d frontend
```

**Tests:** `cd backend && npm test` (Prüfregeln, Kontakt-API, gesperrte Pfade wie `/.env`).

## Struktur

```
frontend/                  wird ausgeliefert (einziger öffentlicher Ordner)
  index.html               Seite (alle Abschnitte + JSON-LD)
  css/tokens.css           Design-Tokens (Farben, Schrift, Abstände)
  css/base.css             Reset, Typografie, Layout-Helfer, Buttons
  css/sections.css         Styles der einzelnen Abschnitte
  js/main.js               Interaktion (Menü, Galerie, Formular, Erreichbarkeit)
  js/hours.js              Öffnungszeiten und Feiertage (konfigurierbar)
  js/validate.js           Prüfregeln fürs Formular (auch vom Backend genutzt)
  danke.html               Bestätigung nach Absenden ohne JavaScript
  img/                     optimierte Bilder + CREDITS.md
backend/                   Node.js-Server (nie öffentlich ausgeliefert)
  server.js                Auslieferung von frontend/ + POST /api/kontakt
  contact.js               Rate-Limit, Mailtext, Versand (nodemailer)
  test/                    Tests (node:test)
  .env.example             Vorlage für die Konfiguration
docs/BRIEFING.md           Projekt-Briefing und fiktive Firmendaten
```

## Für ein anderes Gewerk anpassen

1. Farben im Block „Marke“ in `css/tokens.css` ändern.
2. Firmendaten in `docs/BRIEFING.md` und `frontend/index.html` (Text und JSON-LD, `@type` z. B. `Plumber`, `HousePainter`) ersetzen.
3. Öffnungszeiten und Bundesland (Feiertage) in `frontend/js/hours.js` anpassen.
4. Bilder in `frontend/img/` austauschen.

## Hinweise

- Alle Firmendaten sind erfunden.
- Keine externen Ressourcen (Fonts, CDNs, Tracker) – DSGVO-freundlich.
- Bilder: Unsplash-Lizenz, Nachweise in `frontend/img/CREDITS.md`.
