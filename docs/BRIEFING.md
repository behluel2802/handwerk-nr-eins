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
- **Bilder:** freie Unsplash-Fotos, von Claude gesucht, **lokal** in `img/` abgelegt (kein Hotlinking), Bildnachweise werden in `img/CREDITS.md` dokumentiert. Nur freie Fotos verwenden, keine Unsplash+-Bilder. Hero: Elektriker mit gelbem Helm (gespiegelt). Für spätere Abschnitte vorgemerkt: Pendelleuchte (Über uns / Leistungen) und deutscher Sicherungskasten (Leistungen), Links in `img/CREDITS.md`.

## 7. Vorgehen und Stand

Arbeitsweise: Vor jedem Schritt stellt Claude den Plan vor (mit nummerierten Entscheidungspunkten), der Entwickler gibt Feedback, erst dann wird umgesetzt. Nach jedem Schritt Screenshot-Prüfung (Desktop/Tablet/Handy), Commit nur auf Anweisung.

| # | Schritt | Status |
|---|---|---|
| 1 | Fiktiven Betrieb festlegen | ✅ erledigt |
| 2 | Gerüst (`index.html`, Ordner, README, .gitignore) | ✅ erledigt |
| 3 | Design-Tokens und Basis-CSS | ✅ erledigt |
| 4 | Header, Hero, mobile Anruf-Leiste | ✅ erledigt |
| 5 | Hero-Foto (Unsplash) | ✅ erledigt, gepusht |
| 6 | Vertrauensleiste + Leistungen | ✅ erledigt, committet |
| 7 | Referenzen (Galerie + Lightbox, Kundenstimmen) | **nächster Schritt:** Plan vorstellen |
| 8 | Über uns (Innung hier erwähnen) | offen |
| 9 | Ablauf | offen |
| 10 | Karriere | offen |
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
