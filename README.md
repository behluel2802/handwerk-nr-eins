# Handwerk Nr. 1 – Website-Vorlage für Handwerksbetriebe

One-Pager für einen **fiktiven** Elektro-Meisterbetrieb („Elektro Berger GmbH“, Musterstadt). Gebaut mit reinem HTML, CSS und Vanilla JS, ohne Framework und ohne Build-Schritt.

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Die Seite funktioniert auch per Doppelklick auf `index.html`, ein lokaler Server kommt dem Live-Betrieb aber näher.

## Struktur

```
index.html        Seite (alle Abschnitte + JSON-LD)
css/tokens.css    Design-Tokens (Farben, Schrift, Abstände)
css/base.css      Reset, Typografie, Layout-Helfer, Buttons
css/sections.css  Styles der einzelnen Abschnitte
js/main.js        Interaktion (Menü, Galerie, Formular)
img/              optimierte Bilder + CREDITS.md
docs/BRIEFING.md  Projekt-Briefing und fiktive Firmendaten
```

## Für ein anderes Gewerk anpassen

1. Farben im Block „Marke“ in `css/tokens.css` ändern.
2. Firmendaten in `docs/BRIEFING.md` und `index.html` (Text und JSON-LD, `@type` z. B. `Plumber`, `HousePainter`) ersetzen.
3. Bilder in `img/` austauschen.

## Hinweise

- Alle Firmendaten sind erfunden.
- Keine externen Ressourcen (Fonts, CDNs, Tracker) – DSGVO-freundlich.
- Bilder: Unsplash-Lizenz, Nachweise in `img/CREDITS.md`.
