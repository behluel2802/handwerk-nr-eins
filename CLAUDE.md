# CLAUDE.md

One-Pager-Website-Vorlage für einen **fiktiven Elektro-Meisterbetrieb** (Übungsprojekt). Das vollständige Briefing mit Zielen, Zielgruppe, Abschnitten und Entscheidungen steht in [docs/BRIEFING.md](docs/BRIEFING.md). Vor jeder Arbeit lesen und bei neuen Entscheidungen aktualisieren.

## Abschnitte (Reihenfolge)

Hero → Vertrauensleiste → Leistungen → Referenzen → Über uns → Ablauf → **Karriere** → Kontakt → Footer.
Der Karriere-Block („Wir suchen Verstärkung“) ist kompakt und hat keine eigene Seite: offene Stellen, Vorteile, Bewerbung ohne Hürden. Google-Bewertungen bzw. das Google-Profil gut sichtbar verlinken.

## Kommunikation

- Auf **Deutsch** antworten.
- Der Entwickler ist erfahren, technische Erklärungen kurz halten.
- **Nichts committen oder pushen ohne ausdrückliche Anweisung.**
- Erst umsetzen, wenn der Entwickler das Go gibt. Bei offenen Grundsatzfragen nachfragen.

## Technische Leitplanken

- Reines HTML, CSS und Vanilla JS, kein Framework, kein Build-Schritt. Struktur: `index.html`, `css/`, `js/`, `img/`.
- Mobile-first, semantisches HTML, barrierearm.
- Farben, Schriften und Abstände als CSS-Variablen in `:root` (Design-Tokens), damit die Vorlage für andere Gewerke umfärbbar bleibt. Hauptfarbe dunkles Blau, Akzent Gelb/Bernstein.
- DSGVO: keine externen CDNs, keine Google Fonts per Link, keine Tracker. Alles wird lokal ausgeliefert.
- Bilder: freie Unsplash-Fotos lokal in `img/` ablegen (kein Hotlinking), komprimiert, mit `width`/`height` und `alt`. Fotograf und Link in `img/CREDITS.md` eintragen.
- Kontaktformular nur im Frontend: JS-Validierung, Versand über einen konfigurierbaren Endpoint (z. B. Formspree) oder `mailto`.
- Firmendaten sind fiktiv und an einer zentralen Stelle gut auffindbar, damit sie sich leicht austauschen lassen.
