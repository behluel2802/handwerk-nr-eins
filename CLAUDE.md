# CLAUDE.md

One-Pager-Website-Vorlage für einen **fiktiven Elektro-Meisterbetrieb** (Übungsprojekt). Das vollständige Briefing mit Zielen, Zielgruppe, Abschnitten und Entscheidungen steht in [docs/BRIEFING.md](docs/BRIEFING.md). Vor jeder Arbeit lesen und bei neuen Entscheidungen aktualisieren. [docs/LEITFADEN.md](docs/LEITFADEN.md) ist die eigenständige Anleitung für neue Projekte: neue allgemeine Erkenntnisse (Entscheidungen, Stolpersteine) dort ergänzen, ohne auf das Briefing zu verweisen.

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

- Frontend: HTML, CSS und Vanilla JS, kein Framework. Build mit **Vite** (seit Schritt 13a): Quellen in `frontend/`, Ausgabe `frontend/dist/`. Wiederkehrende Teile (Icon-Sprite, Footer, Kopf der Unterseiten) als Handlebars-Partials in `frontend/partials/`, nie in die Seiten kopieren. Neue Seiten in `pages` in `frontend/vite.config.js` eintragen.
- npm-Workspaces im Hauptordner (`frontend`, `backend`): `npm run dev` (Vite :5173 + Backend :3000), `npm run build`, `npm start`, `npm test`. Abhängigkeiten im Frontend nur als devDependencies (laufen nur beim Bauen).
- Backend: Node.js in `backend/` (möglichst wenige Abhängigkeiten, Konfiguration über `.env`, nie ins Repo). Ausgeliefert wird ausschließlich `frontend/dist/`; `.env`, `backend/`, `docs/`, Quellen und Punkt-Dateien dürfen nie per Browser erreichbar sein.
- Mobile-first, semantisches HTML, barrierearm.
- Farben, Schriften und Abstände als CSS-Variablen in `:root` (Design-Tokens), damit die Vorlage für andere Gewerke umfärbbar bleibt. Hauptfarbe dunkles Blau, Akzent Gelb/Bernstein.
- DSGVO: keine externen CDNs, keine Google Fonts per Link, keine Tracker. Alles wird lokal ausgeliefert.
- Bilder: freie Unsplash-Fotos, Original nach `frontend/img-src/` (kein Hotlinking), Größen/Formate/Ausschnitte in `frontend/images.config.js` eintragen; `npm run images` (läuft automatisch vor dev/build) erzeugt sie nach `frontend/img/` (generiert, nicht im Repo). Im HTML mit `width`/`height` und `alt`. Fotograf und Link in `frontend/img-src/CREDITS.md`. Im HTML nie Bildpfade oder Größen von Hand schreiben: `{{> picture name="…" set="…" sizes="…" alt="…"}}` bzw. die Helfer `srcset`/`src`/`dim` (Daten aus `img/manifest.json`). Favicon/App-Icon entstehen aus `frontend/img-src/icon.svg`.
- Qualität: Barrierefreiheit (Lighthouse/axe) muss 100 bleiben, der Workflow „Qualität“ prüft bei jedem Push. Neue Dateitypen im Build brauchen einen Eintrag in `MIME` in `backend/server.js` (Test prüft das).
- Kontaktformular: JS-Validierung im Frontend, Versand an das eigene Backend (`/api/kontakt`), keine externen Formular-Dienste. Ohne Backend (z. B. GitHub-Pages-Demo) Demo-Modus.
- Firmendaten (fiktiv: Elektro Berger GmbH, Musterstadt) stehen ausschließlich in `frontend/site.json` (Kontext `site` in Seiten/Partials, z. B. `{{site.phone.display}}`; JSON-LD wird daraus erzeugt). Nie Name, Adresse, Telefon, Öffnungszeiten o. Ä. direkt ins HTML/JS schreiben, nichts Neues erfinden. Fehlende Werte als `null` (Text ohne Link), nie `href="#"`.
- CSS-Aufteilung (in `frontend/`, Vite fasst beim Build zu einer Datei zusammen): `css/tokens.css` (nur Variablen), `css/base.css` (Reset, Typografie, Layout-Helfer, Buttons), `css/sections.css` (abschnittsspezifische Styles). Neue Werte zuerst als Token anlegen, keine hartkodierten Farben in den Abschnitten.
