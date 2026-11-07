# Handwerk Nr. 1 – Website-Vorlage für Handwerksbetriebe

One-Pager für einen **fiktiven** Elektro-Meisterbetrieb („Elektro Berger GmbH“, Musterstadt). Frontend aus reinem HTML, CSS und Vanilla JS, ohne Framework und ohne Build-Schritt. Ein kleines Node.js-Backend (in Arbeit) nimmt die Kontaktanfragen an.

## Lokal ansehen

```bash
python3 -m http.server 8000 -d frontend
# → http://localhost:8000
```

Ohne Backend läuft das Kontaktformular im **Demo-Modus**: Es wird geprüft, aber nichts verschickt.

## Struktur

```
frontend/                  wird ausgeliefert (einziger öffentlicher Ordner)
  index.html               Seite (alle Abschnitte + JSON-LD)
  css/tokens.css           Design-Tokens (Farben, Schrift, Abstände)
  css/base.css             Reset, Typografie, Layout-Helfer, Buttons
  css/sections.css         Styles der einzelnen Abschnitte
  js/main.js               Interaktion (Menü, Galerie, Formular, Erreichbarkeit)
  js/hours.js              Öffnungszeiten und Feiertage (konfigurierbar)
  img/                     optimierte Bilder + CREDITS.md
backend/                   Node.js-Server (nie öffentlich ausgeliefert)
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
