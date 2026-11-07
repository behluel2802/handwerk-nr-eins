# CLAUDE.md

One-Pager-Website-Vorlage für einen **fiktiven Elektro-Meisterbetrieb** (Übungsprojekt). Das vollständige Briefing mit Zielen, Zielgruppe, Abschnitten und Entscheidungen steht in [docs/BRIEFING.md](docs/BRIEFING.md). Vor jeder Arbeit lesen und bei neuen Entscheidungen aktualisieren.

**Aktueller Stand und nächster Schritt:** Abschnitt „7. Vorgehen und Stand“ in `docs/BRIEFING.md`. Zu Beginn einer neuen Sitzung dort nachsehen und den Entwickler kurz an den offenen Punkt erinnern. Nach jedem abgeschlossenen Schritt die Statustabelle aktualisieren.

## Abschnitte (Reihenfolge)

Hero → Vertrauensleiste → Leistungen → Referenzen → Über uns → Ablauf → **Karriere** → Kontakt → Footer.
Der Karriere-Block („Wir suchen Verstärkung“) ist kompakt und hat keine eigene Seite: offene Stellen, Vorteile, Bewerbung ohne Hürden. Google-Bewertungen bzw. das Google-Profil gut sichtbar verlinken.

## Kommunikation

- Auf **Deutsch** antworten.
- Der Entwickler ist erfahren, technische Erklärungen kurz halten.
- **Nichts committen oder pushen ohne ausdrückliche Anweisung.**
- Erst umsetzen, wenn der Entwickler das Go gibt. Bei offenen Grundsatzfragen nachfragen.

## Technische Leitplanken

- Frontend: reines HTML, CSS und Vanilla JS, kein Framework, kein Build-Schritt (Entscheidung über einen Build-Schritt erst in Schritt 13). Struktur: `frontend/index.html`, `frontend/css/`, `frontend/js/`, `frontend/img/`.
- Backend: Node.js in `backend/` (möglichst wenige Abhängigkeiten, Konfiguration über `.env`, nie ins Repo). Ausgeliefert wird ausschließlich `frontend/`; `.env`, `backend/`, `docs/` und Punkt-Dateien dürfen nie per Browser erreichbar sein.
- Mobile-first, semantisches HTML, barrierearm.
- Farben, Schriften und Abstände als CSS-Variablen in `:root` (Design-Tokens), damit die Vorlage für andere Gewerke umfärbbar bleibt. Hauptfarbe dunkles Blau, Akzent Gelb/Bernstein.
- DSGVO: keine externen CDNs, keine Google Fonts per Link, keine Tracker. Alles wird lokal ausgeliefert.
- Bilder: freie Unsplash-Fotos lokal in `frontend/img/` ablegen (kein Hotlinking), komprimiert, mit `width`/`height` und `alt`. Fotograf und Link in `frontend/img/CREDITS.md` eintragen.
- Kontaktformular: JS-Validierung im Frontend, Versand an das eigene Backend (`/api/kontakt`), keine externen Formular-Dienste. Ohne Backend (z. B. GitHub-Pages-Demo) Demo-Modus.
- Firmendaten (fiktiv: Elektro Berger GmbH, Musterstadt) stehen ausschließlich in der Tabelle „Firmendaten“ in `docs/BRIEFING.md`. Werte von dort übernehmen, nichts Neues erfinden. Bei Änderungen sichtbaren Text und JSON-LD in `frontend/index.html` mitziehen.
- CSS-Aufteilung (in `frontend/`): `css/tokens.css` (nur Variablen), `css/base.css` (Reset, Typografie, Layout-Helfer, Buttons), `css/sections.css` (abschnittsspezifische Styles). Neue Werte zuerst als Token anlegen, keine hartkodierten Farben in den Abschnitten.
