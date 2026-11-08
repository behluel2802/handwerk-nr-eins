# Projekt-Briefing: Handwerk Nr. 1 – Website-Vorlage für einen Elektrobetrieb

Stand: 06.11.2026

## 1. Ausgangslage

- **Art des Projekts:** Übungsprojekt bzw. wiederverwendbare Vorlage, kein echter Kunde.
- **Beispiel-Gewerk:** Elektriker
- **Betrieb:** fiktiv, **Elektro Berger GmbH**, siehe Firmendaten unten. Alle Angaben sind ausgedacht und klar als Platzhalter erkennbar.
- **Erfahrung des Entwicklers:** erfahren, technische Erklärungen dürfen knapp sein.
- **Repository:** `git@github.com:behluel2802/handwerk-nr-eins.git` (Branch `main`)

### Firmendaten (fiktiv)

Einzige Quelle seit Schritt 15a: **`frontend/site.json`** (Name, Marke, Inhaber, Gründung, Team, Adresse, Telefon, Notdienst, E-Mail, Web, Einzugsgebiet, Antwortzeit, Bewertung, Öffnungszeiten mit Bundesland und Zusatz-Schließtagen). Seiten, Partials, JSON-LD, `js/hours.js`, `js/main.js` und das Backend lesen von dort. Werte nur dort ändern, nichts Neues erfinden.

Nicht in `site.json` (Inhalt, nicht Stammdaten):
- Mitgliedschaften: Elektro-Innung (Platzhalter), eingetragen in der Handwerksrolle – als Text in „Über uns“ und im Impressum
- Zahlwörter im Fließtext („Team aus acht Leuten“, „zwei Auszubildende“) und „Freitags um 14 Uhr Feierabend“ bei Änderungen von Hand anpassen
- WhatsApp +49 123 4567890 wird seit 07.11.2026 nicht mehr verwendet

`Musterstadt`, `12345` und die Domain `.example` sind absichtlich als Platzhalter erkennbar.

## 2. Ziele der Website

1. **Anfragen bekommen:** Anruf, Kontaktformular, Angebotsanfrage
2. **Seriös auftreten:** digitale Visitenkarte, Vertrauen aufbauen
3. **Referenzen zeigen:** Projektgalerie und Kundenstimmen

4. **Mitarbeiter finden (Nebenziel):** Kompakter Karriere-Block statt eigener Karriereseite. Hintergrund: Wegen des Fachkräftemangels sind viele Betriebe ausgelastet, und die Personalsuche ist oft der größere Engpass als die Kundengewinnung.

## 3. Zielgruppe

- Hausbesitzer (etwa 35–65 Jahre), Vermieter und Hausverwaltungen, kleine Gewerbekunden
- Suchen oft kurzfristig und vom Smartphone aus (Defekt, Sanierung, PV/Wallbox)
- Wollen vor allem eins wissen: **Ist der Betrieb zuverlässig, sicher, in der Nähe und schnell erreichbar?**

## 4. Stil und Design

Vorgabe: der Stil, der die Zielgruppe am besten anspricht. Daraus abgeleitet:

- **Hell und aufgeräumt**, gut lesbar, große Klickflächen
- **Farben:** dunkles Blau als Hauptfarbe (Vertrauen, Kompetenz) und Gelb bzw. Bernstein als Akzent (Strom, Handlungsaufforderungen)
- **Anruf-Button**, der beim Scrollen sichtbar bleibt, vor allem mobil
- **Vertrauenssignale weit oben:** Meisterbetrieb, Innung, Jahre Erfahrung, Einzugsgebiet, Notdienst
- Farben und Schriften als **CSS-Variablen (Design-Tokens)**, damit sich die Vorlage schnell auf andere Gewerke umstellen lässt

## 5. Aufbau (One-Pager)

1. **Hero:** Kernaussage, Einzugsgebiet, Buttons „Jetzt anrufen“ und „Anfrage senden“
2. **Vertrauensleiste:** Meisterbetrieb, Innungsmitglied, Bewertungen, Notdienst
3. **Leistungen:** Elektroinstallation, Altbausanierung, Smart Home, PV und Wallbox, E-Check, Notdienst
4. **Referenzen:** Projektgalerie mit Lightbox und Kundenstimmen
5. **Über uns:** Team und Geschichte
6. **Ablauf:** Anfrage → Besichtigung → Angebot → Umsetzung
7. **Karriere:** „Wir suchen Verstärkung“: offene Stellen (z. B. Elektroniker/in, Azubi), Vorteile im Betrieb, unkomplizierte Bewerbung (Telefon, E-Mail, WhatsApp, kein Anschreiben nötig)
8. **Kontakt:** Formular, Einzugsgebiet bzw. Karte, Öffnungszeiten, Telefon und E-Mail
9. **Footer:** Links auf Impressum und Datenschutz (Platzhalter)

Querschnittsthema: **Google-Bewertungen bzw. Google-Unternehmensprofil** gut sichtbar verknüpfen (Vertrauensleiste, Kundenstimmen).

## 6. Technik

- **HTML, CSS und Vanilla JavaScript**, kein Framework; Build mit Vite (seit Schritt 13a, siehe dort)
- Struktur: npm-Workspaces `frontend/` (Quellen, Vite baut nach `frontend/dist/`, nur das wird ausgeliefert) und `backend/` (Node.js), dazu `docs/`
- **Mobile-first**, responsiv, barrierearm (semantisches HTML, Kontraste, Tastaturbedienung)
- **Kontaktformular:** Validierung in JS, Versand an das eigene Node.js-Backend (`/api/kontakt`, Schritt 11b), keine externen Formular-Dienste. Ohne Backend Demo-Modus (ursprünglich „nur Frontend“, am 07.11.2026 geändert)
- **SEO:** Meta-Tags, Open Graph, Schema.org-Daten (`Electrician` bzw. `LocalBusiness`)
- **DSGVO:** keine externen CDNs oder Google Fonts, Schriften lokal oder System-Fonts, keine Tracker
- **Bilder:** freie Unsplash-Fotos, von Claude gesucht, **lokal** in `img/` abgelegt (kein Hotlinking), Bildnachweise werden in `img/CREDITS.md` dokumentiert. Nur freie Fotos verwenden, keine Unsplash+-Bilder. Hero: Elektriker mit gelbem Helm (gespiegelt). Referenzen: 6 Projektfotos. Über uns: Pendelleuchte. Alle Links in `img/CREDITS.md`.

## 7. Vorgehen und Stand

Arbeitsweise: Vor jedem Schritt stellt Claude den Plan vor (mit nummerierten Entscheidungspunkten), der Entwickler gibt Feedback, erst dann wird umgesetzt. Nach jedem Schritt Screenshot-Prüfung (Desktop/Tablet/Handy), Commit nur auf Anweisung.

| # | Schritt | Status |
|---|---|---|
| 1 | Fiktiven Betrieb festlegen | ✅ erledigt |
| 2 | Gerüst (`index.html`, Ordner, README, .gitignore) | ✅ erledigt |
| 3 | Design-Tokens und Basis-CSS | ✅ erledigt |
| 4 | Header, Hero, mobile Anruf-Leiste | ✅ erledigt |
| 5 | Hero-Foto (Unsplash) | ✅ erledigt, gepusht |
| 6 | Vertrauensleiste + Leistungen | ✅ erledigt, gepusht |
| 7 | Referenzen (Galerie + Lightbox, Kundenstimmen) | ✅ erledigt, gepusht |
| 8 | Über uns (Innung hier erwähnen) | ✅ erledigt, gepusht |
| 9 | Ablauf | ✅ erledigt, gepusht |
| 10 | Karriere | ✅ erledigt, committet |
| 11a | Kontakt: Umstrukturierung `frontend/`/`backend/`, UX-Umbau, Erreichbarkeit mit Feiertagen, Demo-Modus | ✅ erledigt, committet |
| 11b | Node-Backend `/api/kontakt` (gesichertes Ausliefern nur aus `frontend/`, SMTP, Rate-Limit, Dev-Modus ohne SMTP) | ✅ erledigt, committet |
| 12 | Footer (inkl. Hinweis „Fiktiver Betrieb – Übungsprojekt“), Impressum/Datenschutz-Platzhalter | ✅ erledigt, committet |
| 12b | Demo über GitHub Pages: Actions-Workflow nur für `frontend/`, `noindex`, Pages in den Repo-Einstellungen aktivieren | ✅ erledigt, gepusht, Demo online geprüft |
| 13a | Build-Schritt mit Vite: Bausteine (Partials) für Kopf/Footer, Ausgabe nach `dist/`, Backend und Pages-Workflow anpassen, CSP-Hash aus dem Build | ✅ erledigt, gepusht |
| 13b | Feinschliff (unabhängig vom Hosting): Barrierefreiheit, Lighthouse/Performance, Favicon und App-Icons, On-Page-SEO (Überschriften, Meta-Beschreibung, Alt-Texte, JSON-LD prüfen) | ✅ erledigt, gepusht |
| 14 | Deployment (nur falls die Seite echt öffentlich gehen soll): Anbieter mit Rechenzentrum in DE (Favorit Uberspace, Alternative eigener VPS), Domain, SMTP, Ablauf – dazu alles Domain-Abhängige: `og:url`, `canonical`, absolute `og:image`, `sitemap.xml`/`robots.txt`, JSON-LD `JobPosting` (echte Daten), Link zum Google-Profil, Impressum/Datenschutz ausfüllen, HSTS, Lighthouse auf dem echten Server | zurückgestellt, Übungsprojekt wird vorerst nicht gehostet |
| 15a | Firmendaten an einer Stelle: `frontend/site.json` als Handlebars-Kontext `site`, JSON-LD daraus erzeugt, Pflichtfeld-Prüfung im Build | ✅ erledigt, gepusht |
| 15 | Leitfaden „Vorlage für neue Projekte“ (`docs/LEITFADEN.md`, eigenständig) und leere Briefing-Vorlage | ✅ erledigt, gepusht |
| 16 | Öffentliche Demo rechtssicher: Build-Schalter `DEMO`, echter Betreiber im Impressum (aus Umgebungsvariablen), Formular sendet nichts, Anruf-Links wählen nicht, Hinweisleiste, `noindex`, Demo-Fassungen von Impressum/Datenschutz | ✅ umgesetzt, nicht committet. Offen: GitHub-Variablen anlegen, Pages danach wieder aktivieren (siehe Abschnitt 9) |

### Schritt 6 (umgesetzt am 06.11.2026)

**Vertrauensleiste:** heller Streifen unter dem Hero, 4 Punkte (Desktop 4 Spalten, Handy 2×2):
Meisterbetrieb (eingetragen in der Handwerksrolle) · seit 1998 (über 25 Jahre Erfahrung) · 4,9/5 (127 Google-Bewertungen, Link zum Google-Profil, vorerst `#`) · 24/7 Notdienst (Nummer anklickbar).

**Leistungen:** Einleitung „Alles aus einer Hand – für Privathaushalte, Vermieter und Gewerbe.“ und 6 Karten (3/2/1 Spalten), jeweils Linien-Icon, Titel, Kurztext, kein „Mehr erfahren“-Link:
- Elektroinstallation – Neubau, Umbau, Erweiterung – vom Zählerschrank bis zur Steckdose.
- Altbausanierung – Alte Leitungen raus, sichere Technik rein – sauber und mit wenig Schmutz.
- Smart Home – Licht, Heizung und Rollläden bequem per App oder Sprache steuern.
- PV & Wallbox – Solarstrom vom eigenen Dach und Laden des E-Autos in der Garage.
- E-Check – Prüfung nach DGUV V3 für Vermieter und Gewerbe, mit Prüfprotokoll.
- Notdienst – Stromausfall oder Kurzschluss? Wir sind rund um die Uhr erreichbar.

**Entscheidungen (freigegeben):**
1. „seit 1998“ statt „Innungsmitglied“ in der Vertrauensleiste (Innung wandert zu „Über uns“)
2. Notdienst-Karte farblich hervorgehoben (navy, gelbes Icon) mit Notdienst-Nummer als Button
3. Vorgemerkte Fotos noch nicht in den Leistungen verwenden, sondern für Über uns / Referenzen aufheben

Offen: Link zum Google-Profil ist noch `#` (TODO in `index.html`). Vertrauensleiste unter 640 px: Icon über dem Text, zentriert (2×2); ab 640 px Icon links.

Technik: neue Icons im bestehenden SVG-Sprite, neues Token `--color-accent-tint`, Styles in `sections.css`, neue Werte als Token, kein JS nötig.

### Schritt 7 (Plan freigegeben, umgesetzt am 06.11.2026)

**Galerie:** 6 Projekte als Kacheln (ab 960 px 3, ab 480 px 2, darunter 1 Spalte), einheitlich 4:3 zugeschnitten, Bildunterschrift „Leistung · Objekt, Ort“. Klick öffnet die Lightbox mit dem Bild im Originalformat.
Fotos (alle freie Unsplash-Lizenz):
- Unterverteilung – Markus Spiske, `kK7uPfb2YWU`
- PV-Anlage – Watt A Lot, `gqpuuF3a2tY`
- Wallbox in der Garage – Andersen EV, `CRa_dWoilkg`
- Smart-Home-Taster – `3ci2aJgGi1c`
- Küchenbeleuchtung – Clay Banks, `i6SOaGYmNOA`
- Bad mit LED-Spiegel – `nZmJVbFWsvU`

**Lightbox:** natives `<dialog>`, Vor/Zurück, Pfeiltasten, Esc, Wischen, Fokus zurück auf die Kachel. Ohne JS öffnen die Links das große Bild direkt.

**Kundenstimmen:** Überschrift mit „4,9 ★ aus 127 Google-Bewertungen“, 3 statische Karten (Sterne, Zitat, „Familie K., Musterstadt · Wallbox“), Button „Alle Bewertungen auf Google“ (Link vorerst `#`).

**Entscheidungen (freigegeben):**
1. Fotoauswahl wie oben (Pendelleuchte bleibt für „Über uns“ reserviert)
2. Lightbox mit `<dialog>` und Wischgeste, ohne Bibliothek
3. Bildunterschriften mit fiktivem Objekt und Ortsteil (z. B. „Wallbox · Einfamilienhaus, Musterstadt-Nord“)
4. Kundenstimmen als 3 feste Karten statt Slider
5. Fiktive Inhalte nur per HTML-Kommentar kennzeichnen, nicht sichtbar

### Schritt 8 (Plan freigegeben, umgesetzt am 06.11.2026)

**Layout:** ab 768 px zweispaltig (links Foto im Hochformat 4:5, rechts Text), darunter Foto oben (4:3) und Text darunter. Hintergrund weiß.
**Foto:** Pendelleuchten-Montage von Ewan Buck (`4HjF7TNV1us`).
**Text:** Gründung 1998 durch Elektrotechnikermeister Thomas Berger, heute 8 Leute inkl. 2 Azubis, Kunden im Umkreis von ca. 25 km. Handwerksrolle und Elektro-Innung (Platzhalter) mit Nutzen für den Kunden.
**Inhaber-Zitat (fiktiv):** „Bei uns bekommen Sie einen festen Ansprechpartner, ein ehrliches Angebot und eine Baustelle, die wir sauber hinterlassen.“ – Thomas Berger, Elektrotechnikermeister und Inhaber
**Kennzahlen (4 Kacheln, unter 480 px 1 Spalte, ab 480 px 2×2, ab 640 px 4 nebeneinander):** 1998 gegründet · 8 Mitarbeitende · 2 Azubis (Ausbildungsbetrieb) · ca. 25 km Einzugsgebiet

**Entscheidungen (freigegeben):**
1. Pendelleuchten-Foto, kein Team-Raster mit erfundenen Personen (Firmendaten nennen nur den Inhaber)
2. Fiktives Inhaber-Zitat mit Name und Titel
3. Kennzahlen als 4 Kacheln unter dem Text (Desktop 4 nebeneinander, Handy 2×2)
4. Innung und Handwerksrolle als Text mit Häkchen, keine Logos (Markenrechte, Platzhalter)
5. Überschrift bleibt schlicht „Über uns“ wie in den anderen Abschnitten

### Schritt 9 (Plan freigegeben, umgesetzt am 06.11.2026)

**Schritte (Texte greifen nur bestehende Versprechen aus dem Hero auf):**
1. Anfrage – Rufen Sie an, schreiben Sie per WhatsApp oder nutzen Sie das Formular. Kurz schildern, worum es geht.
2. Besichtigung – Wir schauen uns alles vor Ort an, Termin meist innerhalb von 48 Stunden.
3. Angebot – Sie bekommen ein verständliches Festpreis-Angebot, ohne versteckte Kosten.
4. Umsetzung – Wir arbeiten sauber und termintreu und übergeben alles mit Dokumentation.

**Layout:** Hintergrund hellgrau (wie bisher geplant). Ab 960 px 4 Schritte nebeneinander, verbunden durch eine Linie, Nummern in gelben Kreisen. Darunter eine vertikale Zeitleiste (Linie links, Nummern auf der Linie), einspaltig.
**Abschluss:** Box „Bereit für Schritt 1?“ mit Buttons „Jetzt anrufen“, „Anfrage senden“ (#kontakt) und „WhatsApp“.

**Entscheidungen (freigegeben):**
1. Horizontale Zeitleiste ab 960 px, darunter vertikal (kein 2×2)
2. Nur Nummern in Kreisen, keine zusätzlichen Icons
3. Texte nur mit bestehenden Versprechen (48 h, Festpreis), keine neuen Zusagen
4. Abschluss-Box mit drei Kontaktwegen inkl. WhatsApp (`https://wa.me/491234567890`, neutrales Chat-Icon). Buttons nie 2+1: per Container Query gestapelt (volle Breite) → 3 gleich breit in einer Reihe → Text links, Buttons rechts
5. Kein Foto in diesem Abschnitt

### Schritt 10 (Plan freigegeben, umgesetzt am 07.11.2026)

**Hintergrund:** Navy (`section--dark`), Einleitung: „Wir sind ein Team aus acht Leuten – und suchen Verstärkung, die Lust auf saubere Arbeit und abwechslungsreiche Aufgaben hat.“
**Layout:** ab 960 px zweispaltig (links Stellen, rechts Vorteile), darunter einspaltig. Darunter Bewerbungs-Box über die volle Breite.

**Stellen (2 Karten, Details per `<details>` aufklappbar, ohne JS):**
- Elektroniker/in für Energie- und Gebäudetechnik (m/w/d): Vollzeit, unbefristet, ab sofort. Aufgaben: Installation Neubau/Umbau/Altbau, PV/Wallbox/Smart Home, DGUV-V3-Prüfungen, Notdienst-Bereitschaft im Wechsel. Anforderungen: abgeschlossene Ausbildung, Führerschein B, Zuverlässigkeit.
- Ausbildung Elektroniker/in EGT (m/w/d): Start jeweils 1. August, 3,5 Jahre, Übernahme bei guten Leistungen möglich. Voraussetzungen: Haupt- oder Realschulabschluss, Interesse an Technik/Mathe/Physik.
- Je Stelle ein Link „Per E-Mail bewerben“ (`mailto:` mit vorbelegtem Betreff).

**Vorteile:** aus Firmendaten abgeleitet: Freitags 14 Uhr Feierabend · kurze Wege (ca. 25 km, keine Montage) · kleines Team, direkter Draht zum Chef · Meisterbetrieb seit 1998.
Freigegebene Platzhalter (nicht aus den Firmendaten): Weiterbildung bis zur Meisterprüfung · modernes Werkzeug und Messtechnik · eigenes Firmenfahrzeug.

**Bewerbungs-Box:** „Bewerben in 2 Minuten“, „Kein Anschreiben nötig …, Ansprechpartner ist Thomas Berger“, Buttons Anrufen · WhatsApp · E-Mail.

**Entscheidungen (freigegeben):**
1. Nur zwei Stellen (Geselle/Gesellin + Azubi)
2. Erfundene Vorteile als Platzhalter erlaubt (siehe oben), kein Gehalt/Tarif
3. Kein Foto, Abschnitt bleibt kompakt
4. Stellen-Details aufklappbar (`<details>`)
5. JSON-LD `JobPosting` erst in Schritt 13 klären
6. Ansprache „Sie“ wie im Rest der Seite

Technik: Abschluss-Box aus dem Ablauf zur allgemeinen `.cta-box` umbenannt (Variante `.cta-box--dark`), neue Tokens `--color-border-on-primary` und `--color-surface-on-primary`, `.section--dark .lead` in `base.css`.

### Schritt 11 (Plan freigegeben, umgesetzt am 07.11.2026)

**Layout:** Hintergrund weiß. Ab 960 px zweispaltig (links Kontaktdaten, rechts Formular), darunter einspaltig mit Kontaktdaten zuerst.
**Kontaktdaten:** großer Anruf-Button, Notdienst, WhatsApp, E-Mail, Adresse mit Link „Route planen“ (OpenStreetMap, neues Fenster), Einzugsgebiet, Öffnungszeiten als Tabelle.
**Formular:** Name*, Telefon oder E-Mail* (mindestens eins), Anliegen (6 Leistungen + Sonstiges), PLZ/Ort (optional), Nachricht* (mind. 10 Zeichen), Checkbox „Bitte rufen Sie mich zurück“, Honeypot gegen Spam. Hinweis „Wir melden uns innerhalb eines Werktags“ plus Datenschutz-Hinweis.
**Validierung:** JS mit `novalidate`, Fehler am Feld (`aria-invalid`, `aria-describedby`, ⚠-Zeichen zusätzlich zur Farbe), Fokus auf das erste fehlerhafte Feld, nach dem ersten Absenden Live-Prüfung. Statusmeldung in einer `role="status"`-Region, die den Fokus bekommt. Ohne JS: native Validierung + `mailto`-Action.
**Versand:** `data-endpoint` am `<form>` (z. B. Formspree-URL) → `fetch` mit JSON. Leer (Standard) → `mailto:` mit vorausgefülltem Betreff und Text.

**Entscheidungen (freigegeben):**
1. Keine eingebettete Karte, nur Link „Route planen“. Eine Zwei-Klick-Karte (Laden erst nach Einwilligung) gilt als DSGVO-tauglich, ist aber als Zusatz zurückgestellt.
2. Keine Datenschutz-Checkbox, nur Hinweistext (Art. 6 Abs. 1 lit. b DSGVO)
3. Felder wie oben, kein Datei-Upload
4. Keine Vorauswahl des Anliegens über Links (wenig Nutzen ohne Tracking)
5. Neue Zusage „Rückmeldung innerhalb eines Werktags“ (in die Firmendaten aufgenommen)

Technik: neue Icons `i-pin` und `i-radius`, neue Tokens `--color-input-bg`, `--color-input-border` (≥ 3:1), `--color-success-tint`, `--color-error-tint`.
Abgelöst durch Schritt 11a (siehe unten).

### Schritt 11a (UX-Umbau, umgesetzt am 07.11.2026)

Anlass: Die erste Fassung bot zu viele gleichrangige Wege und Umwege (`mailto`-Versand, Route-Link, 7 Formularfelder).

**Umstrukturierung:** `frontend/` (einziger öffentlicher Ordner) und `backend/` (Node.js, ab 11b). Verschoben mit `git mv`.
**Weg 1 – Anruf (links, mobil zuerst):** großer Anruf-Button, Live-Status „Jetzt erreichbar – bis 17:00 Uhr“ bzw. „Heute geschlossen (Fronleichnam) – wieder erreichbar ab morgen 7:00 Uhr“, Öffnungszeiten-Tabelle, E-Mail als kleine Alternative, Notdienst als abgesetzte navy Box, Satz „Wir kommen zu Ihnen – im Umkreis von ca. 25 km“ mit Adresse.
**Weg 2 – Formular (rechts):** Chips „Worum geht es?“ (optional, Radio-Buttons, 2 Spalten mobil / 3 sonst), Name*, Telefon oder E-Mail* (ein Feld, JS erkennt die Art), Nachricht*. Honeypot. Nach dem Absenden ersetzt eine Bestätigung „Vielen Dank, {Name}!“ das Formular.
**Versand:** `fetch` an `/api/kontakt`. Antwortet dort kein Backend (404/405/501, z. B. GitHub Pages oder `http.server`), läuft der Demo-Modus: gleiche Bestätigung mit Hinweis „Demo-Version: In dieser Vorschau wird keine Anfrage verschickt.“ Ohne JS: normales POST an `/api/kontakt`.
**Erreichbarkeit:** `frontend/js/hours.js` (ES-Modul, reine Funktionen, in Node getestet): Zeitzone `Europe/Berlin`, Feiertage aller Bundesländer berechnet (Osterformel), konfiguriert auf Hessen, dazu Heiligabend und Silvester geschlossen.

**Entscheidungen (freigegeben):**
1. Eigenes Backend statt `mailto`/Formspree, Sprache Node.js (Schritt 11b)
2. WhatsApp auf der ganzen Seite gestrichen (Kontakt, Ablauf-Box, Ablauf-Schritt 1, Karriere-Box). Die CTA-Boxen haben jetzt 2 Buttons: gestapelt → 2 gleich breit (ab 26rem Boxbreite) → Text links, Buttons rechts (ab 48rem)
3. Live-Status mit Feiertagen (Hessen), Heiligabend/Silvester geschlossen
4. Bestätigung mit Namen
5. Keine eingebettete Karte, kein Route-Link (Kunde fährt nicht zur Werkstatt)
6. Getrennte Ordner `frontend/` und `backend/`; `.env`, `backend/`, `docs/` nie per Browser erreichbar

### Schritt 11b (Plan freigegeben, umgesetzt am 07.11.2026)

**Aufbau:** `backend/server.js` (`node:http`, ohne Framework), `backend/contact.js`, `backend/test/` (`node:test`). Einzige Abhängigkeit: `nodemailer`. `.env` liest Node selbst (`--env-file-if-exists`). Start: `cd backend && npm run dev` → http://localhost:3000.
**Auslieferung:** nur aus `frontend/`; Pfade werden aufgelöst und auf die Wurzel geprüft (auch Symlinks), Punkt-Dateien gesperrt, nur erlaubte Dateitypen (html, css, js, Bilder, woff2), keine Ordnerlisten. `Cache-Control: no-cache` + ETag (kein Strg+Shift+R mehr nötig). Sicherheits-Header inkl. CSP; der Hash für das Inline-Skript im `<head>` wird automatisch aus `index.html` berechnet.
**`POST /api/kontakt`:** JSON (mit JS) und Formulardaten (ohne JS → 303 auf `danke.html`, Fehler als schlichte HTML-Seite). Max. 10 KB, Prüfung über `frontend/js/validate.js` (gleiche Regeln wie im Browser), Honeypot, Rate-Limit 5 Anfragen / 10 Min. / IP. Mail als Klartext an `MAIL_TO`, bei E-Mail-Kontakt `Reply-To` = Kunde. Keine Personendaten in den Logs.
**Entwicklungsmodus:** ohne `SMTP_HOST` erscheint die Anfrage nur in der Konsole, nichts wird gespeichert.

**Entscheidungen (freigegeben):**
1. Gemeinsame Prüfregeln `frontend/js/validate.js` für Frontend und Backend
2. Entwicklungsmodus nur Konsole (später ggf. Mailpit für echte Mails lokal)
3. Ohne JS: Weiterleitung auf `frontend/danke.html`
4. Keine Bestätigungsmail an den Kunden (Missbrauchsrisiko, DSGVO)
5. CSP mit Hash für das Inline-Skript

Getestet: 30 automatische Tests (u. a. `/.env`, `/.git/config`, `/../secret`, URL-kodierte Varianten, Symlink nach außen → 404), Browser-Durchlauf mit echtem Server (keine CSP-Verstöße, Versand im Entwicklungsmodus), Absenden ohne JS per `curl`. `npm audit`: 0 Schwachstellen.
Hinweis für Schritt 14: HSTS-Header erst mit echtem HTTPS setzen; hinter einem Reverse Proxy `TRUST_PROXY=1`.

**Nachbesserung Kontakt-Design (07.11.2026):** Anliegen-Chips per Container Query nach Breite der Formular-Karte: 1 Spalte (schmal) → 2 (ab 22rem) → 3 (ab 32rem), alle Reihen gleich hoch. Adresszeile: Trennpunkte verschwinden beim Umbruch (kein „·“ am Zeilenende/-anfang). Weitere Umbruch-Befunde (Notdienst-Button bei 320 px, Status-Zeile, „ca. 25 km“, Mittelbreiten-Layout) bewusst so belassen.

### Schritt 12 (Plan freigegeben, umgesetzt am 08.11.2026)

**Footer (navy dunkel):** ab 768 px drei Spalten, darunter einspaltig.
1. Firma: Logo, Claim, Adresse (`<address>`), „Meisterbetrieb · seit 1998“
2. Kontakt: Telefon, 24/7-Notdienst (gelb hervorgehoben), E-Mail, Öffnungszeiten
3. Seite: Anker wie im Header + „Bewertungen auf Google“ (Link vorerst `#`)
Untere Zeile mit Trennlinie: © Jahr · Impressum · Datenschutz · „Fiktiver Betrieb – Übungsprojekt“ (kursiv, ab 768 px rechtsbündig). Ohne Trennpunkte, nur Abstände.

**Rechtsseiten:** `frontend/impressum.html` und `frontend/datenschutz.html`, `noindex`, schlanker Kopf (Logo + „Zur Startseite“), gleicher Footer (Anker als `./#…`), kein JS. Gelber Hinweiskasten „Platzhalter: kein gültiger Rechtstext“. Fehlende Angaben als sichtbare Platzhalter `[…]` (Klasse `.placeholder`).
- Impressum: § 5 DDG, Vertretung, Kontakt, Register, USt-IdNr., Handwerksangaben (Kammer, Handwerksrolle, Berufsbezeichnung, HwO, Innung), Berufshaftpflicht, VSBG
- Datenschutz (nur Gliederung): Verantwortlicher, Hosting/Logs, Kontaktformular (keine Speicherung, Mail-Versand, IP max. 10 Min. im Speicher fürs Rate-Limit), keine Cookies/Tracker/externen Dienste, Bewerbungen, Rechte, Stand

**Entscheidungen (freigegeben):**
1. Footer dreispaltig (nach Sichtprüfung bestätigt)
2. Fehlende Pflichtangaben (Geschäftsführer, HRB, USt-IdNr., Kammer …) als sichtbare Platzhalter, nicht in die Firmendaten aufgenommen
3. Datenschutz nur als Gliederung, keine ausformulierten Mustertexte
4. Hinweis „Fiktiver Betrieb – Übungsprojekt“ nur im Footer
5. Eigene HTML-Seiten statt `<dialog>`

Technik: neues Token `--font-mono`, Klassen `.brand--on-dark`, `.page-header`, `.legal`, `.legal-notice`, `.placeholder`, `body.page-legal` (keine Anruf-Leiste, kein Abstand unten). Datenschutz-Link im Kontaktformular zeigt jetzt auf `datenschutz.html`.

### Schritt 12b (Plan freigegeben, Workflow angelegt am 08.11.2026)

**Online:** https://behluel2802.github.io/handwerk-nr-eins/ (erster Deploy nach ca. 30 s, geprüft: alle Seiten 200, `noindex` drin, `backend/`, `docs/`, `.github/` → 404, `POST /api/kontakt` → 405 = Demo-Modus).

**Workflow** `.github/workflows/pages.yml`: kopiert nur `frontend/` nach `_site`, fügt dort in jede HTML-Datei ohne Robots-Angabe `<meta name="robots" content="noindex">` ein (bricht ab, falls das fehlschlägt), lädt `_site` hoch und veröffentlicht. Kein Build, kein `npm install`. Adresse: `https://behluel2802.github.io/handwerk-nr-eins/`.
Ohne Backend greift der Demo-Modus des Formulars; ohne JS führt das Absenden auf eine GitHub-Fehlerseite (für die Demo akzeptiert).

**Entscheidungen (freigegeben):**
1. `noindex` nur in der veröffentlichten Kopie, die Dateien im Repo bleiben unverändert
2. Automatisches Deploy bei Push auf `main` mit Änderungen in `frontend/` oder am Workflow, zusätzlich manuell startbar
3. ~~Kein zusätzlicher Demo-Banner (Footer-Hinweis und Demo-Hinweis im Formular reichen)~~ – revidiert in Schritt 16: Hinweisleiste im Demo-Build
4. Pages aktiviert der Entwickler selbst (Settings → Pages → Source „GitHub Actions“), kein `gh` in der Sitzung

### Schritt 13a (Plan freigegeben, umgesetzt am 08.11.2026)

**Aufbau:** npm-Workspaces im Hauptordner (`frontend`, `backend`), eine `package-lock.json`, Node-Version in `.nvmrc` (24). Befehle: `npm run dev` (Vite :5173 + Backend :3000 über `concurrently`, Vite reicht `/api` weiter), `npm run build`, `npm start` (Backend liefert `frontend/dist/` aus), `npm test`, `npm run images`.
**Vite** (`frontend/vite.config.js`): `base: './'` (relative Pfade, läuft auch im Pages-Unterordner), vier Seiten als Einstiege, CSS/JS verkleinert und mit Hash im Namen, CSS der drei Dateien zu einer zusammengefasst, keine `data:`-URIs (`assetsInlineLimit: 0`). Die Lightbox-Links (`<a href>` und `data-full`) werden über `html.additionalAssetSources` ebenfalls verarbeitet, die Lightbox selbst blieb unverändert.
**Partials** (`vite-plugin-handlebars`, `frontend/partials/`): `sprite.hbs` (Icon-Sprite), `footer.hbs` (Kontext `home` = Anker-Präfix, `current.<seite>` für `aria-current`), `page-header.hbs` (Unterseiten).
**Bild-Pipeline:** Originale in `frontend/img-src/` (jetzt im Repo, 6,3 MB), Konfiguration `frontend/images.config.js` (Breiten, Seitenverhältnis, Fokus des Ausschnitts, Spiegelung), Skript `frontend/scripts/images.js` mit `sharp`, läuft automatisch vor dev/build, überspringt unveränderte Bilder, räumt verwaiste auf. Ausgabe `frontend/img/` (nicht mehr im Repo). Die Ausschnitte wurden aus den bisherigen Bildern zurückgerechnet: gleiche Maße und Motive, insgesamt ca. 3 % kleiner.
**Backend:** liefert `frontend/dist/` aus (ohne Build klare Fehlermeldung), CSP-Hashes aus allen gebauten Seiten, `/assets/*` mit Hash im Namen `Cache-Control: public, max-age=31536000, immutable`, HTML weiter `no-cache` + ETag. 3 neue Tests (33 gesamt).
**Pages-Workflow:** `setup-node` (Version aus `.nvmrc`, npm-Cache), `npm ci`, `npm run build`, veröffentlicht `frontend/dist/` (mit `noindex` in der Kopie).

**Entscheidungen (freigegeben):**
1. Vite als Build-Werkzeug (Begründung siehe Abschnitt 8)
2. Partials mit `vite-plugin-handlebars` statt eigenem Plugin (etabliert, Parameter möglich)
3. Bildgrößen werden beim Build erzeugt, nur Originale im Repo. Geplant war `vite-imagetools`; im Test verarbeitet es nur JS-Imports, nicht Bild-URLs im HTML. Deshalb eigenes Skript mit `sharp` (dieselbe Bibliothek, die imagetools intern nutzt) plus Konfigurationsdatei.
4. npm-Workspaces mit einem gemeinsamen Startbefehl

Hinweis für Schritt 14: `og:image` braucht dann eine feste Datei-URL (z. B. eigenes Vorschaubild in `frontend/public/`), da die Bilder im Build einen Hash bekommen.

### Schritt 13b (Plan freigegeben, umgesetzt am 08.11.2026)

**Ausgangslage (Lighthouse Handy, lokal):** Performance 98, Barrierefreiheit 100, Best Practices 96, SEO 100. Befunde: Favicon fehlt (404), keine Komprimierung im Backend, Bilder teils zu groß, LCP 2,3 s.
**Ergebnis:** Startseite 99 / 100 / 100 / 100, LCP 1,3 s, 198 KB Übertragung. Unterseiten 100 / 100 / 100, SEO 50 gewollt (`noindex`).

**Umgesetzt:**
- **Favicon/App-Icon** aus einer Quelle `frontend/img-src/icon.svg`: `favicon.ico` (32 px), `icon.svg`, `apple-touch-icon.png` (180 px), erzeugt von der Bild-Pipeline nach `frontend/public/` (feste Namen, nicht im Repo), eingebunden über `partials/head-icons.hbs` auf allen Seiten.
- **Bilder:** zusätzlich AVIF, Zwischengrößen (Hero 800–2400, Kacheln 400–1200, Über uns 480–960 bzw. 600–1200). `images.config.js` arbeitet mit benannten Bildsätzen (`tile`, `full`, …); `img/manifest.json` liefert Dateinamen und Maße. Im HTML erzeugen Helfer (`srcset`, `src`, `dim`) bzw. `partials/picture.hbs` die Angaben – Größen stehen nur noch an einer Stelle. Erzeugung parallel, Überspringen per Fingerabdruck (Original + Einstellungen) statt Datum; erster Lauf ca. 50 s, danach 0,3 s. Im Workflow werden die Bilder zwischengespeichert (`actions/cache`).
- **Komprimierung:** `frontend/scripts/compress.js` legt nach dem Build `.br`/`.gz` an (118 KB → 26 KB). Das Backend liefert sie je nach `Accept-Encoding` aus (`Vary: Accept-Encoding`), direkt abrufbar sind sie nicht. Auf Pages werden sie entfernt (GitHub komprimiert selbst).
- **Fehler gefunden und behoben:** Das Backend kannte `.avif` nicht (404 → Hero ohne Foto). Neuer Test prüft, dass jeder Dateityp aus `dist/` ausgeliefert wird.
- **Barrierefreiheit:**
  - axe 4.14 (WCAG 2.2 AA + Best Practice), alle Seiten, 375 und 1280 px: ein Befund – zwei Bereiche namens „Kontakt“ (Footer-Spalten waren `<section>` mit Namen = Landmark). Footer-Spalten jetzt `<div>`, nur die Footer-Navigation bleibt Landmark.
  - Tastatur: Im mobilen Menü sprang Tab nach dem Öffnen an den Links vorbei (Button stand im HTML hinter der Navigation). Button jetzt direkt vor der Navigation, sichtbar weiterhin rechts (CSS `order`). Sonst ohne Befund: Fokusring überall, Skip-Link, Lightbox (Fokus bleibt im Dialog, Esc, Pfeile, Fokus zurück auf die Kachel), Details, Formular-Fehlerführung, Esc im Menü.
  - Kontrast Text über dem Hero-Foto pixelgenau gemessen (320–1920 px): schlechteste Stelle 5,5 : 1 (AA verlangt 4,5 : 1).
  - Umfließen bei 320 px (= 400 % Zoom): Impressum/Datenschutz liefen seitlich über (lange Komposita in Überschriften). Überschriften trennen jetzt sehr lange Wörter (`hyphens: auto`, `hyphenate-limit-chars: 15 6 6`); geprüft, dass sich sonst kein Umbruch ändert. Anruf-Leiste bricht bei vergrößerten Textabständen (WCAG 1.4.12) um statt überzulaufen.
  - Hochkontrast (`forced-colors`): Buttons, Karten und Felder behalten Rahmen, ohne Befund.
  - „Bewegung reduzieren“ war bereits vollständig umgesetzt (alle Übergänge und Animationen).
- **SEO:** Gliederung h1 → h2 → h3 → h4 lückenlos, Titel 59 Zeichen, Beschreibung 129 Zeichen, Alt-Texte vollständig (Hero dekorativ). JSON-LD: `aggregateRating` entfernt (eigene Bewertungen im LocalBusiness-Markup wertet Google nicht aus), `founder` (Thomas Berger, aus den Firmendaten) ergänzt.
- **Qualitätsprüfung bei jedem Push/PR** (`.github/workflows/quality.yml`): Build, Tests, Backend starten, Lighthouse CI (`lighthouserc.json`: Barrierefreiheit 100, Best Practices ≥ 95, SEO Startseite ≥ 95, Performance nur Warnung) und axe (WCAG 2.2 AA). Berichte als Download am Workflow-Lauf, kein Upload zu externen Diensten. Blockiert den Pages-Deploy nicht.

**Entscheidungen (freigegeben):**
1. AVIF zusätzlich zu WebP/JPG
2. Kein Web-App-Manifest
3. Kein kritisches CSS im HTML
4. Automatische Qualitätsprüfung auf GitHub

Für Schritt 14 vorgemerkt: `image`/`logo` im JSON-LD und `og:image` als absolute URL (feste Datei in `frontend/public/`).

### Schritt 15 (Plan freigegeben, umgesetzt am 08.11.2026)

**Leitfaden** `docs/LEITFADEN.md`, gedacht zum Mitnehmen in andere Projekte: Wann die Vorlage passt · Schnellstart · empfohlene Reihenfolge (idealisiert: Ordnerstruktur, Vite und Bild-Pipeline von Anfang an) · Entscheidungen mit Begründung inkl. verworfener Alternativen · Stolpersteine (Symptom → Ursache → Lösung) · Checkliste neues Gewerk · Checkliste Go-Live.
**Briefing-Vorlage** `docs/BRIEFING-VORLAGE.md`: Gliederung, Firmendaten- und Statustabelle ohne Inhalte, dazu im Leitfaden ein Abschnitt „Arbeitsweise mit Claude“.
Umgesetzt: Leitfaden mit 9 Abschnitten (zusätzlich „Aufbau im Überblick“), Entscheidungen in drei Tabellen (Struktur/Technik, Inhalt/UX, Qualität/Datenschutz), 24 Stolpersteine in vier Gruppen, Checklisten mit `schemaType`-Beispielen. README-Abschnitt „Für ein anderes Gewerk anpassen“ ist jetzt ein Verweis, `CLAUDE.md` nennt den Leitfaden (neue allgemeine Erkenntnisse dort ergänzen).

**Entscheidungen (freigegeben):**
1. Eigene Datei statt README-Ausbau
2. Idealisierte Reihenfolge, nicht die tatsächliche
3. Leitfaden in sich vollständig, **ohne Verweise auf dieses Briefing** (soll in andere Projekte wandern). README und `CLAUDE.md` verweisen auf den Leitfaden, nicht umgekehrt; README-Abschnitt „Für ein anderes Gewerk anpassen“ wird zum Verweis.
4. Leere Briefing-Vorlage + Abschnitt „Arbeitsweise mit Claude“
5. Vorher Schritt 15a (Firmendaten zentral)

### Schritt 15a (Plan freigegeben, umgesetzt am 08.11.2026)

**`frontend/site.json`** ist die einzige Quelle für die Stammdaten (Felder siehe Abschnitt 1). Liegt bei den Quellen, wird nicht ausgeliefert (`/site.json` → 404).
- **Templates:** Kontext `site` in allen Seiten und Partials (`{{site.phone.display}}` …). Helfer in `frontend/scripts/site.js`: `dayRange` ([1,2,3,4] → „Mo–Do“), `time`, `decimal` (4.9 → „4,9“), `joinAnd`, `jsonLd` (JSON-LD komplett aus den Daten, `<` maskiert).
- **Prüfung:** `checkSite` bricht den Build bei fehlenden Pflichtfeldern ab, fehlender Google-Link (`rating.profileUrl: null`) gibt nur eine Warnung.
- **Fehlende Links:** `null` statt `href="#"`. Vertrauensleiste zeigt „127 Google-Bewertungen“ als Text, Button „Alle Bewertungen auf Google“ und Footer-Link entfallen, bis die URL eingetragen ist.
- **JS/Backend:** `hours.js` (Zeiten, Bundesland, Schließtage), `main.js` (Telefonnummer in der Fehlermeldung) und `backend/server.js` (Fehlerseite, Startmeldung) importieren `site.json` (`with { type: 'json' }`).
- **Ergebnis:** gebautes HTML bis auf JSON-LD-Formatierung, Kommentare und die Google-Links identisch (Diff geprüft). 41 Tests (neu: Pflichtfelder, Helfer, JSON-LD = `site.json`, keine `href="#"`, Öffnungszeiten inkl. Fronleichnam/Heiligabend). Lighthouse Startseite 99–100 / 100 / 100 / 100, axe 0 Befunde auf allen Seiten.

**Entscheidungen (freigegeben, nach Best Practices):**
1. JSON statt JS-Konfiguration (reine Daten, ohne Zusatzpaket in Vite, Node und Tests lesbar; Konvention wie Eleventy `_data/site.json`), Pflichtfeld-Prüfung im Build
2. Nur Stammdaten (vor allem NAP: Name, Adresse, Telefon) in `site.json`, Fließtext bleibt Inhalt; Zahlwörter bleiben im Text
3. Unbekannte Werte als `null` mit Build-Warnung, im HTML Text ohne Link statt `href="#"`
4. Kontextname `site` (Konvention Jekyll/Hugo/Eleventy)

### Schritt 16 (Plan freigegeben, umgesetzt am 08.11.2026)

**Anlass:** Die öffentliche Demo hatte nur ein fiktives Impressum (erfüllt § 5 DDG nicht, verantwortlich ist der tatsächliche Betreiber). Der Demo-Modus schickte die Formulardaten trotzdem per `fetch` an `/api/kontakt` (auf Pages an GitHub, Bestätigung erst nach 405), und die `tel:`-Links wählten fiktive Nummern, die echten Anschlüssen gehören könnten. Pages wurde bis zur Umsetzung deaktiviert.

**Schalter:** Umgebungsvariable `DEMO=1`. Ohne baut alles wie die Vorlage für echte Betriebe. Vergleich mit dem Stand vorher: HTML und JS identisch (nur Asset-Hashes), CSS enthält 5 zusätzliche Tokens.
- `frontend/scripts/demo.js` (`loadDemo`): liest `DEMO_OPERATOR_NAME`, `_STREET`, `_ZIP`, `_CITY`, `_EMAIL`, `_STATE` (Pflicht) und `_PHONE` (optional) aus der Umgebung, lokal ergänzend aus `frontend/.env.demo.local` (gitignored, Shell hat Vorrang). Fehlt ein Pflichtfeld, ist das Bundesland unbekannt oder die E-Mail ungültig, bricht der Build ab. Bundesland → Datenschutz-Aufsichtsbehörde (16 Länder, nicht-öffentlicher Bereich). Bildnachweise aus der Tabelle in `img-src/CREDITS.md`.
- `vite.config.js`: Kontext `demo` (oder `null`) neben `site`, `define: { __DEMO__ }` für `js/main.js`.
- `npm run dev:demo` / `npm run build:demo` (setzen `DEMO=1`, Linux/macOS).

**Formular:** mit `__DEMO__` kein `fetch`, sofort die Bestätigung mit Demo-Hinweis (der Minifier entfernt den Versandcode im Demo-Bundle). Im HTML ohne `action`/`method`, Absende-Button `type="button" hidden` plus Hinweis „Demo-Version: Das Formular ist deaktiviert.“; JS schaltet den Button frei. Grund: Ohne `action` würde ein Absenden per GET an die eigene URL gehen, ein verstecktes Submit-Element könnte per Enter auslösen. Der Fallback bei 404/405/501 bleibt als Sicherheitsnetz.
**Anruf-Links:** Helfer `{{{callHref site.phone.tel}}}` an allen 15 Stellen (Header, Hero, Vertrauensleiste, Notdienst-Karte, CTA-Boxen, Kontakt, Bestätigung, Anruf-Leiste, Footer, `danke.html`, Rechtsseiten). Normal `href="tel:…"`, in der Demo `href="#demo-hinweis" data-demo-call`: gleiches Element, gleiches Aussehen, ohne JS Sprung zur Hinweisleiste, mit JS (`js/demo.js`) kurz „Demo: fiktive Nummer – es wird nicht gewählt.“ in einer `role="status"`-Region.
**Hinweisleiste:** `partials/demo-banner.hbs` auf allen Seiten direkt nach dem Skip-Link, `<aside aria-label="Demo-Hinweis">`, statisch, nicht wegklickbar. Text: „Demo-Projekt: Elektro Berger ist ein fiktiver Betrieb. Anfragen werden nicht versendet. Betreiber und Impressum“. Styles in `css/demo.css` (nur im Demo-Build eingebunden), Farben über Tokens `--color-demo-*`.
**noindex:** im Demo-Build auf allen Seiten (Startseite per `{{#if demo}}`, die anderen hatten es schon). Der Pages-Workflow fügt nichts mehr ein, sondern prüft nur noch `noindex`, Hinweisleiste und dass keine fiktive `tel:`-Nummer enthalten ist.
**Rechtsseiten:** `{{#if demo}}` → `partials/impressum-demo.hbs` (Betreiber, Kontakt, Satz zum fiktiven Betrieb, Bildnachweise, keine Register-/USt-/Kammerangaben, kein Platzhalter-Kasten) bzw. `partials/datenschutz-demo.hbs` (Verantwortlicher, Hosting GitHub Pages mit Logs/Art. 6 Abs. 1 lit. f/DPF, keine Cookies/Tracking/externen Inhalte, Formular überträgt nichts, E-Mail an den Betreiber, Rechte Art. 15–21, Beschwerderecht bei der Behörde des Bundeslands, Stand 8. November 2026). Am 08.11.2026 mit dem kostenlosen Datenschutz-Generator von Dr. Schwenke abgeglichen und in eigenen Worten ergänzt (daher kein Generator-Hinweis nötig): BDSG-Hinweis, CDN von GitHub, Logdaten vollständiger, Link zur DPF-Liste, Pflicht zur Bereitstellung und keine automatisierte Entscheidung (Art. 13 Abs. 2), Widerspruchsrecht hervorgehoben (Art. 21 Abs. 4), Beschwerde auch am Ort des Verstoßes, Abschnitt zu Änderungen. Nicht übernommen, weil für die Demo falsch: Beschäftigten-/Hinweisgeberdaten, Einwilligung/rechtliche Verpflichtung als Rechtsgrundlage, eigene Standardvertragsklauseln, 30 Tage Logfile-Speicherung, Kontaktformular. Sonst die bisherige Platzhalter-Gliederung.
**Workflows:** Pages baut mit `DEMO: 1` und `DEMO_OPERATOR_*: ${{ vars.… }}`; fehlen die Variablen, bricht der Build ab. Der Qualitäts-Workflow baut zusätzlich einen Demo-Build mit fiktiven Prüfdaten und lässt axe darüber laufen.
**Tests:** `frontend/test/demo.test.js` (10 Tests, insgesamt 41): `loadDemo` (fehlende Felder, Bundesland, E-Mail, lokale Datei vs. Shell), Bildnachweise, Helfer, und drei echte Builds in ein temporäres Verzeichnis (Demo ohne Daten bricht ab; Demo mit Daten: Leiste, `noindex`, Betreiber, kein `tel:`, kein `action`, kein POST im JS; ohne `DEMO`: keine Betreiberdaten, kein Demo-Markup).
**Geprüft:** Lighthouse Barrierefreiheit 100 auf allen 4 Seiten im Demo-Build (SEO dort bewusst niedriger wegen `noindex`), axe 0 Befunde; im Browser beim Absenden kein Request, ohne JS kein Absende-Button und kein Request bei Enter, Hinweis beim Klick auf „Jetzt anrufen“.

**Entscheidungen (freigegeben):**
1. Demo-Flag im JS per Vite `define` (`__DEMO__`), nicht per `data-demo`-Attribut
2. Anruf-Elemente in der Demo: geplant als `<button>`, umgesetzt als Link auf `#demo-hinweis`, weil viele Styles am Selektor `a` hängen und der Link ohne JS sinnvoll zur Erklärung springt (kein `href="#"`, fokussierbar)
3. Komfort-Skripte `dev:demo`/`build:demo`
4. Qualitäts-Workflow prüft zusätzlich den Demo-Build mit axe (Lighthouse nur auf dem normalen Build, weil `noindex` den SEO-Wert senkt)
5. JSON-LD bleibt im Demo-Build unverändert (fiktive Daten, `noindex`)
6. Revidiert Schritt 12b, Entscheidung 3: sichtbare Hinweisleiste statt nur Footer-Hinweis

## 8. Getroffene Entscheidungen

| Thema | Entscheidung |
|---|---|
| Zweck | Übung / Vorlage |
| Ziele | Anfragen, Seriosität, Referenzen, dazu Mitarbeitersuche als Nebenziel |
| Karriere | kompakter Abschnitt im One-Pager, keine eigene Seite |
| Gewerk | Elektriker |
| Betrieb | fiktiv |
| Struktur | One-Pager |
| Stil | auf die Zielgruppe ausgerichtet (Blau + Gelb/Bernstein, hell, vertrauenswürdig) |
| Technik | einfaches HTML/CSS/JS |
| Formular | eigenes Node.js-Backend (`/api/kontakt`), ohne Backend Demo-Modus |
| Ordner | `frontend/` (Quellen; öffentlich nur `frontend/dist/`) und `backend/` getrennt, npm-Workspaces |
| Build-Schritt | Vite (Schritt 13a). Begründung: Projekt dient als Vorlage und Lernbasis für größere Projekte; Kopf/Footer sind bereits mehrfach dupliziert; Lighthouse soll das gebaute Ergebnis messen. Entscheidung vom 08.11.2026 |
| Aufteilung 13/14 | Feinschliff ohne Domain-Bezug jetzt (Schritt 13), alles Domain-Abhängige erst beim echten Onlinestellen (Schritt 14), Entscheidung vom 08.11.2026 |
| Firmendaten | eine Quelle `frontend/site.json`, Templates/JS/Backend lesen daraus (Schritt 15a, 08.11.2026) |
| Hosting | vorerst keins; Demo über GitHub Pages (Schritt 12b), echtes Hosting in Schritt 14 |
| Öffentliche Demo | nur als Demo-Build (`DEMO=1`): echter Betreiber im Impressum aus Umgebungsvariablen (nie im Repo), Formular sendet nichts, Anruf-Links wählen nicht, Hinweisleiste, `noindex` (Schritt 16, 08.11.2026) |
| Bilder | Unsplash, automatisch von Claude gesucht, lokal gespeichert |

## 9. Offene Punkte

- Schritt 14 (Deployment) zurückgestellt, Checkliste in `docs/LEITFADEN.md` Abschnitt 8
- Schritt 16, vor dem erneuten Veröffentlichen: (1) Pages ist deaktiviert (Settings → Pages); (2) unter Settings → Secrets and variables → Actions → Variables `DEMO_OPERATOR_NAME`, `_STREET`, `_ZIP`, `_CITY`, `_EMAIL`, `_STATE` (z. B. `BE`), optional `_PHONE` anlegen; ladungsfähige Anschrift, kein Postfach (c/o-Anschriften-Service zulässig), am besten eine eigene Alias-Adresse; (3) committen und pushen, Workflow-Lauf prüfen; (4) Pages wieder aktivieren (Source „GitHub Actions“).
- `img-src/CREDITS.md`: Die Spalte „Datei(en)“ nennt noch alte Dateinamen (vor der Bild-Pipeline), inhaltlich (Motiv, Fotograf, Link) stimmt sie
- Commit und Push nur auf ausdrückliche Anweisung
