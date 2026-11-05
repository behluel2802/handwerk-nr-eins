# Projekt-Briefing: Handwerk Nr. 1 – Website-Vorlage für einen Elektrobetrieb

Stand: 05.11.2026

## 1. Ausgangslage

- **Art des Projekts:** Übungsprojekt bzw. wiederverwendbare Vorlage, kein echter Kunde.
- **Beispiel-Gewerk:** Elektriker
- **Betrieb:** fiktiv, der Name wird beim Bau festgelegt (Arbeitstitel z. B. „Elektro Berger – Meisterbetrieb seit 1998“). Alle Firmendaten (Adresse, Telefon, Bewertungen …) sind ausgedacht und klar als Platzhalter erkennbar.
- **Erfahrung des Entwicklers:** erfahren, technische Erklärungen dürfen knapp sein.
- **Repository:** `git@github.com:behluel2802/handwerk-nr-eins.git` (Branch `main`)

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
- **Bilder:** freie Unsplash-Fotos, von Claude gesucht, **lokal** in `img/` abgelegt (kein Hotlinking), Bildnachweise werden in `img/CREDITS.md` dokumentiert

## 7. Vorgehen

1. Gerüst und Design-Tokens
2. Abschnitte von oben nach unten aufbauen
3. JavaScript: mobiles Menü, Galerie bzw. Lightbox, Formularvalidierung
4. Unsplash-Fotos suchen, optimieren und einbinden
5. Feinschliff: Responsiveness, Lighthouse-Check, SEO-Metadaten

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

- Name und Daten des fiktiven Betriebs festlegen
- Start der Umsetzung, sobald der Entwickler das Go gibt
- Commit und Push nur auf ausdrückliche Anweisung
