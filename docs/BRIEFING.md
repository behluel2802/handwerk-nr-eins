# Projekt-Briefing: Handwerk Nr. 1 – Website-Vorlage für einen Elektrobetrieb

Stand: 06.11.2026

## 1. Ausgangslage

- **Art des Projekts:** Übungsprojekt bzw. wiederverwendbare Vorlage, kein echter Kunde.
- **Beispiel-Gewerk:** Elektriker
- **Betrieb:** fiktiv, **Elektro Berger GmbH**, siehe Firmendaten unten. Alle Angaben sind ausgedacht und klar als Platzhalter erkennbar.
- **Erfahrung des Entwicklers:** erfahren, technische Erklärungen dürfen knapp sein.
- **Repository:** `git@github.com:behluel2802/handwerk-nr-eins.git` (Branch `main`)

### Firmendaten (fiktiv)

Diese Daten sind die einzige Quelle für alle Angaben zum Betrieb. Bei Änderungen hier und in `frontend/index.html` (sichtbarer Text und JSON-LD im `<head>`) anpassen.

| Feld | Wert |
|---|---|
| Name | Elektro Berger GmbH |
| Claim | Ihr Elektro-Meisterbetrieb in Musterstadt |
| Inhaber | Thomas Berger, Elektrotechnikermeister |
| Gegründet | 1998 |
| Mitarbeiter | 8 (davon 2 Azubis) |
| Adresse | Werkstraße 12, 12345 Musterstadt |
| Telefon | 0123 456 789 0 (Link: `tel:+491234567890`) |
| Notdienst | 0123 456 789 9, rund um die Uhr |
| WhatsApp | +49 123 4567890 (wird seit 07.11.2026 nicht mehr auf der Website verwendet) |
| E-Mail | info@elektro-berger.example |
| Web | www.elektro-berger.example |
| Öffnungszeiten | Mo–Do 7:00–17:00, Fr 7:00–14:00 |
| Einzugsgebiet | ca. 25 km um Musterstadt |
| Antwortzeit | Rückmeldung auf Anfragen innerhalb eines Werktags |
| Mitgliedschaften | Elektro-Innung (Platzhalter), eingetragen in der Handwerksrolle |
| Bewertung | 4,9 von 5 Sternen (127 Google-Bewertungen, fiktiv) |

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

- **Reines HTML, CSS und Vanilla JavaScript**, kein Framework, kein Build-Schritt
- Struktur: `frontend/` (öffentlich: `index.html`, `css/`, `js/`, `img/`), `backend/` (Node.js), `docs/`
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
| 11b | Node-Backend `/api/kontakt` (gesichertes Ausliefern nur aus `frontend/`, SMTP, Rate-Limit, Dev-Modus ohne SMTP) | **nächster Schritt:** Plan vorstellen |
| 12 | Footer (inkl. Hinweis „Fiktiver Betrieb – Übungsprojekt“), Impressum/Datenschutz-Platzhalter | offen |
| 12b | Demo über GitHub Pages: Actions-Workflow nur für `frontend/`, `noindex`, Pages in den Repo-Einstellungen aktivieren | offen |
| 13 | Feinschliff: Lighthouse, SEO, Barrierefreiheit (inkl. Entscheidungen JSON-LD `JobPosting` und Build-Schritt, z. B. Vite) | offen |
| 14 | Deployment (nur falls die Seite echt öffentlich gehen soll): Anbieter mit Rechenzentrum in DE (Favorit Uberspace, Alternative eigener VPS), Domain, SMTP, Ablauf | zurückgestellt, Übungsprojekt wird vorerst nicht gehostet |

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
| Ordner | `frontend/` (einzig öffentlich) und `backend/` getrennt |
| Build-Schritt | vorerst keiner, Entscheidung in Schritt 13 |
| Hosting | vorerst keins; Demo über GitHub Pages (Schritt 12b), echtes Hosting in Schritt 14 |
| Bilder | Unsplash, automatisch von Claude gesucht, lokal gespeichert |

## 9. Offene Punkte

- Start der Umsetzung, sobald der Entwickler das Go gibt
- Commit und Push nur auf ausdrückliche Anweisung
