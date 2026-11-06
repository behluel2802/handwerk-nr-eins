# Projekt-Briefing: Handwerk Nr. 1 – Website-Vorlage für einen Elektrobetrieb

Stand: 06.11.2026

## 1. Ausgangslage

- **Art des Projekts:** Übungsprojekt bzw. wiederverwendbare Vorlage, kein echter Kunde.
- **Beispiel-Gewerk:** Elektriker
- **Betrieb:** fiktiv, **Elektro Berger GmbH**, siehe Firmendaten unten. Alle Angaben sind ausgedacht und klar als Platzhalter erkennbar.
- **Erfahrung des Entwicklers:** erfahren, technische Erklärungen dürfen knapp sein.
- **Repository:** `git@github.com:behluel2802/handwerk-nr-eins.git` (Branch `main`)

### Firmendaten (fiktiv)

Diese Daten sind die einzige Quelle für alle Angaben zum Betrieb. Bei Änderungen hier und in `index.html` (sichtbarer Text und JSON-LD im `<head>`) anpassen.

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
| WhatsApp | +49 123 4567890 |
| E-Mail | info@elektro-berger.example |
| Web | www.elektro-berger.example |
| Öffnungszeiten | Mo–Do 7:00–17:00, Fr 7:00–14:00 |
| Einzugsgebiet | ca. 25 km um Musterstadt |
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
- Geplante Struktur: `index.html`, `css/`, `js/`, `img/`
- **Mobile-first**, responsiv, barrierearm (semantisches HTML, Kontraste, Tastaturbedienung)
- **Kontaktformular nur im Frontend:** Validierung in JS, Versand über einen austauschbaren Endpoint (z. B. Formspree) oder `mailto`, kein eigenes Backend
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
| 10 | Karriere | **nächster Schritt:** Plan vorstellen |
| 11 | Kontakt (Formular, Validierung, Endpoint) | offen |
| 12 | Footer, Impressum/Datenschutz-Platzhalter | offen |
| 13 | Feinschliff: Lighthouse, SEO, Barrierefreiheit | offen |

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
| Formular | nur Frontend |
| Bilder | Unsplash, automatisch von Claude gesucht, lokal gespeichert |

## 9. Offene Punkte

- Start der Umsetzung, sobald der Entwickler das Go gibt
- Commit und Push nur auf ausdrückliche Anweisung
