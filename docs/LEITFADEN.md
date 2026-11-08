# Leitfaden: Website für einen Handwerksbetrieb

Wie man aus dieser Vorlage die Website für einen Handwerksbetrieb baut, egal welches Gewerk: Aufbau, Reihenfolge, Entscheidungen mit Begründung, Stolpersteine und Checklisten. Der Leitfaden ist in sich vollständig und kann in jedes neue Projekt mitkopiert werden. Beispiele beziehen sich auf den fiktiven „Elektro Berger GmbH“, aus dem die Vorlage entstanden ist.

**Inhalt**
1. [Wann die Vorlage passt](#1-wann-die-vorlage-passt)
2. [Aufbau im Überblick](#2-aufbau-im-überblick)
3. [Schnellstart](#3-schnellstart)
4. [Empfohlene Reihenfolge](#4-empfohlene-reihenfolge)
5. [Entscheidungen mit Begründung](#5-entscheidungen-mit-begründung)
6. [Stolpersteine](#6-stolpersteine)
7. [Checkliste: neues Gewerk](#7-checkliste-neues-gewerk)
8. [Checkliste: Go-Live](#8-checkliste-go-live) (inkl. öffentliche Demo und Rechtliches)
9. [Arbeitsweise mit Claude](#9-arbeitsweise-mit-claude)

---

## 1. Wann die Vorlage passt

**Passt** für kleine und mittlere Betriebe (ca. 1–30 Leute), deren Website vor allem **Anfragen bringen** und **Vertrauen schaffen** soll: Elektriker, Sanitär/Heizung, Maler, Dachdecker, Schreiner, Fliesenleger, Gartenbau, Kfz-Werkstatt. Typisch: Kunden suchen kurzfristig per Smartphone und wollen wissen, ob der Betrieb **zuverlässig, in der Nähe und schnell erreichbar** ist.

**Passt nicht** (oder nur mit Umbau), wenn
- der Kunde die Inhalte **selbst pflegen** will (Blog, News, wechselnde Angebote) → CMS oder statischer Generator mit Redaktionsoberfläche,
- es einen **Shop** oder Terminbuchung mit Bezahlung braucht,
- es **viele Unterseiten** gibt (z. B. eigene Seite je Leistung für SEO) → die Partials tragen das, aber Navigation und Aufbau sind auf einen One-Pager zugeschnitten,
- mehrere Sprachen nötig sind.

## 2. Aufbau im Überblick

**Seite (One-Pager), Reihenfolge der Abschnitte:**

| # | Abschnitt | Zweck |
|---|---|---|
| 1 | Hero | Kernaussage, Ort + Einzugsgebiet, „Jetzt anrufen“ und „Anfrage senden“, 3 Versprechen |
| 2 | Vertrauensleiste | Meisterbetrieb, seit Jahr X, Bewertungen (Google), Notdienst |
| 3 | Leistungen | 6 Karten mit Icon, Titel, einem Satz; Notdienst hervorgehoben |
| 4 | Referenzen | Galerie mit Lightbox, 3 Kundenstimmen, Link zum Google-Profil |
| 5 | Über uns | Foto, Geschichte, Inhaber-Zitat, 4 Kennzahlen, Handwerksrolle/Innung |
| 6 | Ablauf | 4 Schritte (Anfrage → Besichtigung → Angebot → Umsetzung), CTA-Box |
| 7 | Karriere | 1–2 Stellen (aufklappbar), Vorteile, Bewerbung ohne Anschreiben |
| 8 | Kontakt | Links Anruf (Live-Status „Jetzt erreichbar“, Zeiten, Notdienst), rechts kurzes Formular |
| 9 | Footer | Firma, Kontakt, Seitenlinks, Impressum/Datenschutz |

Dazu: Impressum, Datenschutz, Danke-Seite (Formular ohne JS), feste Anruf-Leiste unten auf dem Handy.

**Technik:**

```
package.json            npm-Workspaces (frontend, backend), gemeinsame Befehle
frontend/               Quellen
  index.html …          Seiten (Handlebars-Templates)
  site.json             Firmendaten – einzige Quelle
  partials/             Icon-Sprite, Footer, Kopf der Unterseiten, <picture>, Favicons
  css/tokens.css        Design-Tokens (nur Variablen)
  css/base.css          Reset, Typografie, Layout-Helfer, Buttons
  css/sections.css      Abschnitte
  js/main.js            Menü, Lightbox, Formular, Erreichbarkeit
  js/hours.js           Öffnungszeiten + Feiertage (reine Funktionen, testbar)
  js/validate.js        Prüfregeln Formular (auch im Backend genutzt)
  img-src/              Original-Fotos, icon.svg, CREDITS.md
  images.config.js      Bildsätze: Breiten, Seitenverhältnis, Ausschnitt
  scripts/              images.js (sharp), site.js (Daten prüfen, Helfer, JSON-LD), compress.js
  vite.config.js        Build
  dist/                 gebaut – nur dieser Ordner ist öffentlich
backend/                Node-Server: liefert dist/ aus, POST /api/kontakt
.github/workflows/      pages.yml (Demo), quality.yml (Lighthouse + axe bei jedem Push)
```

**Befehle:** `npm run dev` (Vite :5173 + Backend :3000), `npm run build`, `npm start` (Backend liefert `dist/` aus), `npm test`, `npm run images`.

## 3. Schnellstart

1. Repo kopieren **ohne alte Git-Historie** (z. B. auf GitHub „Use this template“ oder Ordner kopieren, `.git` löschen, `git init`).
2. Node-Version aus `.nvmrc` verwenden, dann im Hauptordner `npm install`.
3. `npm run dev` → http://localhost:5173. Der erste Lauf erzeugt alle Bildgrößen (dauert bis ca. 1 Minute), danach nur noch geänderte Bilder.
4. Briefing anlegen (`docs/BRIEFING-VORLAGE.md` → `docs/BRIEFING.md`) und ausfüllen, bevor irgendetwas am Code geändert wird.
5. [Checkliste neues Gewerk](#7-checkliste-neues-gewerk) abarbeiten.
6. Vor dem Onlinegehen: [Checkliste Go-Live](#8-checkliste-go-live).

Ohne `backend/.env` (bzw. ohne `SMTP_HOST`) läuft der Mailversand im Entwicklungsmodus: Anfragen erscheinen nur in der Konsole.

## 4. Empfohlene Reihenfolge

Für ein neues Projekt **von Grund auf**. Die Vorlage ist so entstanden, aber mit Umwegen; hier die Reihenfolge, die man rückblickend wählen sollte.

| # | Schritt | Warum an dieser Stelle |
|---|---|---|
| 1 | **Briefing**: Ziele, Zielgruppe, Abschnitte, Firmendaten, offene Fragen | Alle späteren Entscheidungen beziehen sich darauf. Firmendaten nie erfinden. |
| 2 | **Gerüst komplett**: Workspaces, `frontend/`/`backend/`, Vite, Partials, `site.json`, `.gitignore`, `.nvmrc` | Später umzubauen kostet mehr (Pfade, Duplikate in mehreren Seiten, Deploy). |
| 3 | **Design-Tokens + Basis-CSS** (Farben, Abstände, Schrift, Buttons, Container) | Abschnitte verwenden nur noch Tokens. |
| 4 | **Bild-Pipeline** (`images.config.js`, `{{> picture}}`) vor dem ersten Foto | Sonst entstehen von Hand geschriebene `srcset`s, die man wieder entfernt. |
| 5 | **Header, Hero, mobile Anruf-Leiste** | Wichtigster Bereich, legt den Ton fest. |
| 6 | **Abschnitte** in fester Reihenfolge (Vertrauensleiste → … → Kontakt-Frontend → Footer) | Jeder Abschnitt einzeln: Plan → Umsetzung → Sichtprüfung 320/390/768/1280 px. |
| 7 | **Backend** (`/api/kontakt`, Auslieferung, Tests) | Erst wenn das Formular steht. |
| 8 | **Rechtsseiten** als Gliederung mit sichtbaren Platzhaltern | Vor jeder öffentlichen Demo. |
| 9 | **Demo-Deploy** (GitHub Pages, Demo-Build mit `DEMO=1`) + **Qualitäts-Workflow** | Ab jetzt prüft jeder Push Barrierefreiheit. Vorher die Checkliste „Öffentliche Demo mit fiktivem Betrieb“ (Abschnitt 8). |
| 10 | **Feinschliff**: Lighthouse, axe, Tastatur, 400 % Zoom, Hochkontrast, Favicon, SEO | Am Ende, wenn sich am Layout nichts mehr bewegt. |
| 11 | **Go-Live** (nur bei echtem Betrieb) | Alles Domain-Abhängige erst hier. |

## 5. Entscheidungen mit Begründung

### Struktur und Technik

| Entscheidung | Begründung | Verworfen |
|---|---|---|
| **One-Pager** mit Ankern | Zielgruppe will schnell anrufen, nicht navigieren; ein Scrollweg, mobil ideal | Mehrseitig (lohnt erst bei vielen Leistungen/SEO je Leistung) |
| **HTML/CSS/Vanilla JS**, kein Framework | Wenig Interaktion, maximale Ladegeschwindigkeit, lange wartbar ohne Updates | React/Vue/Astro (Overhead ohne Nutzen für diese Größe) |
| **Vite** als Build | Partials gegen Duplikate (Kopf, Footer), Dateinamen mit Hash (dauerhaft cachebar), CSS zusammengefasst, Lighthouse misst das echte Ergebnis | Kein Build (Footer in jeder Seite kopiert), eigener Build mit Skripten |
| **Handlebars-Partials** (`vite-plugin-handlebars`) | etabliert, Parameter möglich (`{{> picture name=… }}`) | eigenes Vite-Plugin |
| **`site.json`** als einzige Quelle der Firmendaten, Kontext `site` | NAP (Name, Adresse, Telefon) muss überall gleich sein – Text, Footer, JSON-LD, Google-Profil. Ein Gewerkwechsel ändert eine Datei. JSON ist ohne Zusatzpaket in Vite, Node und Tests lesbar. Build bricht bei fehlenden Pflichtfeldern ab. | Werte im HTML (stand an ~85 Stellen), JS-Konfigurationsdatei, YAML (Parser nötig) |
| **Nur Stammdaten** in `site.json`, Fließtext bleibt im HTML | Platzhalter mitten im Text sind schwer zu lesen und zu redigieren | Alles in Daten (Leistungen, Stimmen) – lohnt erst mit CMS |
| **Fehlende Werte `null`** → Text ohne Link + Build-Warnung | `href="#"` ist ein toter Link (Barrierefreiheit, SEO) | `#` mit TODO-Kommentar |
| **Eigenes Node-Backend** für das Formular | Daten bleiben beim Betrieb (DSGVO), keine Abhängigkeit von Drittanbietern, voll kontrollierbar | Formspree & Co. (Daten bei Dritten), `mailto:` (unzuverlässig, viele haben kein Mailprogramm eingerichtet) |
| Backend mit `node:http`, **eine Abhängigkeit** (nodemailer) | kleine Angriffsfläche, wenig Updates | Express/Fastify |
| **Gemeinsame Prüfregeln** (`validate.js`) für Browser und Backend | Regeln nur an einer Stelle | doppelte Implementierung |
| **Bild-Pipeline mit `sharp`** und Konfigurationsdatei | AVIF/WebP/JPG in mehreren Breiten, Ausschnitt per `focus`, nur Originale im Repo | `vite-imagetools` (verarbeitet nur JS-Imports, nicht Bild-URLs im HTML), Bilder von Hand |
| **Ausgelieferter Ordner nur `dist/`** | `.env`, Backend, Doku, Quellen nie per Browser erreichbar | Projektordner ausliefern |

### Inhalt und UX

| Entscheidung | Begründung | Verworfen |
|---|---|---|
| **Zwei Kontaktwege**: Anruf (Hauptweg) + kurzes Formular (3 Pflichtfelder) | Weniger Wege = mehr Anfragen; ein Feld „Telefon oder E-Mail“ statt zwei | WhatsApp (dritter gleichrangiger Weg, Datenschutz), viele Formularfelder, Datei-Upload |
| **Live-Status „Jetzt erreichbar – bis 17:00 Uhr“** mit Feiertagen des Bundeslands | Beantwortet „lohnt sich ein Anruf jetzt?“ | nur Tabelle |
| **Keine eingebettete Karte**, kein Route-Link | Kunde fährt nicht zum Betrieb, der Betrieb kommt; Karten laden Drittanbieter | Google Maps/OSM-Einbettung (höchstens Zwei-Klick-Lösung) |
| **Kundenstimmen als 3 feste Karten** | lesbar ohne Interaktion, barrierearm | Slider/Karussell |
| **Lightbox mit `<dialog>`** ohne Bibliothek | Fokusverwaltung und Esc nativ, Wischen + Pfeiltasten wenige Zeilen JS | Lightbox-Bibliothek |
| **Karriere als Abschnitt**, Stellen als `<details>` | Personalsuche ist oft der größere Engpass, braucht aber keine eigene Seite | Karriereseite, Stellen-Slider |
| **Bewerbung ohne Anschreiben** (Anruf, Lebenslauf per Mail) | senkt die Hürde für Handwerker deutlich | Bewerbungsformular mit Upload |
| **Kein Team-Raster mit erfundenen Personen** | wirkt schnell unecht; besser ein Arbeitsfoto + Inhaber | Stockfotos als „Team“ |
| **Innung/Handwerksrolle als Text**, keine Logos | Markenrechte, Logos nur mit Erlaubnis | Logos |
| **Keine `aggregateRating`** im JSON-LD | Eigene Bewertungen im LocalBusiness-Markup wertet Google nicht aus („self-serving reviews“) | Sterne im Markup |
| **Ansprache „Sie“** | Zielgruppe 35–65, seriös | „Du“ |

### Qualität und Datenschutz

| Entscheidung | Begründung | Verworfen |
|---|---|---|
| **Systemschriften** | keine Font-Dateien, kein Laden von Google Fonts (DSGVO), sofort lesbar | Webfonts (wenn nötig: lokal als woff2) |
| **Keine Cookies, kein Tracking** | kein Cookie-Banner nötig | Analytics |
| **CSP mit Hash** für das eine Inline-Skript, Hash automatisch aus dem Build | strenge CSP ohne `unsafe-inline` | `unsafe-inline` |
| **Vorkomprimiert** (`.br`/`.gz` beim Build) | Backend liefert ohne Rechenaufwand komprimiert aus | Komprimierung zur Laufzeit |
| **AVIF zusätzlich** zu WebP/JPG | deutlich kleinere Bilder | nur WebP |
| **Kein Web-App-Manifest, kein kritisches CSS inline** | kein Nutzen für eine Visitenkarten-Seite; CSS ist klein genug | – |
| **Qualitäts-Workflow** bei jedem Push: Build, Tests, Lighthouse (Barrierefreiheit 100), axe (WCAG 2.2 AA) | Rückschritte fallen sofort auf | nur manuell prüfen |
| **Öffentliche Demo als eigener Build** (`DEMO=1`): Hinweisleiste, `noindex`, Formular sendet nichts, Anruf-Links wählen nicht, echter Betreiber im Impressum aus Umgebungsvariablen | Ein fiktives Impressum erfüllt § 5 DDG nicht; ohne Schalter landen Formulardaten beim Demo-Host und `tel:`-Links wählen womöglich echte Anschlüsse. Ohne `DEMO` bleibt der Build für echte Betriebe unverändert | `noindex` per `sed` in die veröffentlichte Kopie; Banner per JS; Betreiberdaten in `site.json` (dauerhaft in der Git-Historie) |

## 6. Stolpersteine

Jeweils **Symptom → Ursache → Lösung**.

**Layout und Darstellung**
- **Button-Gruppe bricht 2 + 1 um** → `flex-wrap` entscheidet je nach Textlänge → feste Zustände per **Container Query** (gestapelt → alle nebeneinander gleich breit → Text links, Buttons rechts).
- **Trennpunkt „·“ am Zeilenende/-anfang** → Punkte als Text zwischen Elementen → Punkte per CSS, beim Umbruch abschneiden; oder ganz auf Abstände setzen.
- **Kacheln auf dem Handy zu schmal** → 2 Spalten auch unter 480 px → unter 480 px **immer einspaltig**.
- **Chips/Kacheln unterschiedlich hoch** → Grid ohne gleiche Zeilenhöhe → `grid-auto-rows: 1fr`, Spaltenzahl per Container Query nach Kartenbreite.
- **Seite läuft bei 320 px (= 400 % Zoom) seitlich über** → lange Komposita in Überschriften („Datenschutzerklärung“, „Berufshaftpflichtversicherung“) → Überschriften mit `hyphens: auto` und `hyphenate-limit-chars: 15 6 6` (trennt nur sehr lange Wörter), `lang="de"` gesetzt.
- **`#top`-Link scrollt nicht ganz nach oben** → Ziel-Element unter einem Sticky-Header → **kein** Element mit `id="top"`; ohne Ziel springt der Browser laut Spezifikation an den Seitenanfang.

**Barrierefreiheit**
- **Tab springt im mobilen Menü an den Links vorbei** → Menü-Button steht im HTML hinter der Navigation → Button direkt **vor** die Navigation, optisch per CSS `order` nach rechts.
- **axe: „Landmarks müssen eindeutig sein“** → Footer-Spalten als `<section>` mit Überschrift = Landmark, Name doppelt mit dem Abschnitt „Kontakt“ → Footer-Spalten als `<div>`, nur die Footer-Navigation bleibt Landmark.
- **Text über Foto zu kontrastarm** → Kontrast hängt von der Bildstelle ab → Verlauf-Overlay über dem Foto, pixelgenau an der schlechtesten Stelle messen (≥ 4,5 : 1), auch auf dem Handy-Ausschnitt.
- **Fehler nur in Rot** → Farbe allein reicht nicht (WCAG 1.4.1) → zusätzlich Zeichen ⚠ und Text, `aria-invalid`, `aria-describedby`, Fokus aufs erste fehlerhafte Feld.

**Build und Auslieferung**
- **Hero ohne Foto, nur auf dem eigenen Server** → Backend kennt `.avif` nicht (404) → jeder Dateityp braucht einen `MIME`-Eintrag; ein Test prüft, dass jede Endung aus `dist/` ausgeliefert wird.
- **Demo auf GitHub Pages ohne CSS/JS** → absolute Pfade, Pages läuft im Unterordner `/<repo>/` → Vite `base: './'`.
- **Lightbox zeigt Bild nicht nach dem Build** → Vite verarbeitet nur bekannte Attribute → `html.additionalAssetSources` für `<a href>` und `data-full`.
- **Kleine Bilder fehlen als Datei** → Vite bettet kleine Assets als `data:`-URI ein → `assetsInlineLimit: 0`.
- **`og:image` zeigt ins Leere** → Bilder bekommen im Build einen Hash, `og:image` braucht eine feste, absolute URL → eigenes Vorschaubild in `frontend/public/` (fester Name), URL erst mit echter Domain.
- **CSP blockiert das Inline-Skript** → Hash passt nicht mehr nach Änderung → Hash nicht von Hand pflegen, Backend berechnet ihn aus den gebauten Seiten.
- **Änderung nicht sichtbar auf :3000** → :3000 liefert das gebaute `dist/` → in der Entwicklung :5173 (Vite) nutzen, für :3000 vorher `npm run build`.
- **Bild-Pipeline erzeugt alles neu** → Prüfung nach Dateidatum → Fingerabdruck aus Original + Einstellungen; im CI Bilder zwischenspeichern (`actions/cache`).

**Formular und Backend**
- **Formular auf statischem Hosting tot** → kein Backend unter `/api/kontakt` → bei 404/405/501 Demo-Modus: gleiche Bestätigung mit Hinweis „Demo-Version“. Nur als Sicherheitsnetz: Die Daten sind dann schon beim Host angekommen. Für eine öffentliche Demo den Demo-Build nehmen (kein `fetch`).
- **Demo-Formular ohne JS schickt trotzdem ab** → ohne `action` geht ein Absenden per GET an die eigene URL (Daten in den Server-Logs), ein versteckter Submit-Button löst bei Enter womöglich aus → im Demo-Build Button `type="button" hidden`, JS macht ihn zu `submit`.
- **Block-Helfer verändert den Build** → Handlebars entfernt bei mehrzeiligen `{{#helfer}}…{{/helfer}}` Zeilenumbrüche („standalone“) → für Attribute einen einfachen Helfer nehmen (`<a class="btn" {{{callHref site.phone.tel}}}>`), Markup bleibt unverändert.
- **Header-Injection im Betreff** → Zeilenumbrüche im Namen → beim Prüfen entfernen (Test vorhanden).
- **IP-Adresse fürs Rate-Limit hinter Reverse Proxy immer gleich** → Proxy-IP statt Kunden-IP → `TRUST_PROXY=1` setzen (nur hinter einem Proxy!).
- **HSTS lokal gesetzt** → Browser erzwingt danach HTTPS auf localhost → HSTS erst auf dem echten Server mit HTTPS.

**Inhalt**
- **Erfundene Angaben wandern in die Seite** → Werte „sinnvoll ergänzt“ → nur Werte aus `site.json`/Briefing; fehlende Pflichtangaben im Impressum als sichtbare Platzhalter `[…]`.
- **Zahlen im Fließtext veralten** → „Team aus acht Leuten“, „Freitags um 14 Uhr Feierabend“ stehen bewusst als Text, nicht in `site.json` → bei Änderungen der Daten mit durchsuchen (siehe Checkliste).

## 7. Checkliste: neues Gewerk

**Daten und Marke**
- [ ] `frontend/site.json`: alle Felder ersetzen. `schemaType` passend wählen (`Electrician`, `Plumber`, `HVACBusiness`, `HousePainter`, `RoofingContractor`, `GeneralContractor`, `Locksmith`, `AutoRepair`, sonst `HomeAndConstructionBusiness`). Unbekannte Links als `null`.
- [ ] `hours`: Zeiten, Bundesland (`state`, z. B. `BY`, `NW`, `HE`), Zusatz-Schließtage. Feiertage werden berechnet.
- [ ] `css/tokens.css`, Block „Marke“: Haupt- und Akzentfarbe, dazu „Text auf …“-Farben. Kontraste prüfen (≥ 4,5 : 1 für Text, ≥ 3 : 1 für Rahmen/Icons).
- [ ] `meta name="theme-color"` in allen Seiten an die Hauptfarbe anpassen.
- [ ] `img-src/icon.svg`: Symbol und Farben (daraus entstehen Favicon und App-Icon).
- [ ] Icon im Logo (`#i-bolt`) im Sprite `partials/sprite.hbs` ersetzen.
- [ ] Paketnamen in `frontend/package.json` und `backend/package.json`, Absender/Empfänger in `backend/.env.example`, Titel im README.

**Inhalte (`frontend/index.html`)**
- [ ] Hero: Untertitel, 3 Versprechen – nur was der Betrieb wirklich zusagt.
- [ ] Vertrauensleiste: 4 Punkte, passend zum Gewerk (z. B. Meisterbetrieb, Fachbetrieb nach …, Notdienst nur wenn vorhanden).
- [ ] Leistungen: 6 Karten, Icons im Sprite ergänzen (Linien-Icons, `stroke="currentColor"`). Gleiche Leistungen als Chips im Formular und in `js/validate.js` (erlaubte Anliegen).
- [ ] Referenzen: Fotos, Alt-Texte, Bildunterschriften „Leistung · Objekt, Ortsteil“, Kundenstimmen (echt, mit Einverständnis).
- [ ] Über uns: Geschichte, Zitat, Kennzahlen, Mitgliedschaften (Innung, Verbände) als Text.
- [ ] Zahlwörter und abgeleitete Angaben im Fließtext suchen: Teamgröße, Azubis, „über X Jahre“, Feierabend-Uhrzeit.
- [ ] Ablauf: 4 Schritte, Texte nur mit Versprechen, die schon im Hero stehen.
- [ ] Karriere: Stellen, Vorteile (nichts erfinden), Betreff der Bewerbungs-Mails.
- [ ] Meta-Beschreibung (≈ 120–155 Zeichen) und Titel (≤ 60 Zeichen) prüfen.

**Bilder**
- [ ] Originale nach `img-src/` (frei lizenziert oder vom Betrieb, kein Hotlinking).
- [ ] Einträge in `images.config.js` (Bildsätze, `focus` für den Ausschnitt, ggf. `flop`).
- [ ] Im HTML nur `{{> picture …}}` bzw. Helfer, nie Pfade/Größen von Hand.
- [ ] Nachweise in `img-src/CREDITS.md`.

**Rechtliches**
- [ ] Impressum: Platzhalter `[…]` füllen (Vertretung, Register, USt-IdNr., Kammer, Handwerksrolle, Berufsbezeichnung, Berufshaftpflicht, VSBG).
- [ ] Datenschutz: Hosting, E-Mail-Anbieter, Speicherdauern, Aufsichtsbehörde – rechtlich prüfen lassen.
- [ ] Hinweis „Fiktiver Betrieb – Übungsprojekt“ im Footer entfernen.

**Prüfen**
- [ ] `npm test`, `npm run build` (keine Warnungen aus `site.json`, oder bewusst offen).
- [ ] Sichtprüfung bei 320, 390, 768, 1280 px; Menü, Lightbox, Formular per Tastatur.
- [ ] Lighthouse (Barrierefreiheit 100) und axe ohne Befund – läuft auch im Workflow.

## 8. Checkliste: Go-Live

**Hosting und Server**
- [ ] Anbieter mit Rechenzentrum in Deutschland/EU, Vertrag zur Auftragsverarbeitung.
- [ ] Node in der Version aus `.nvmrc`, `npm ci && npm run build`, `npm start` als Dienst (systemd, supervisord o. Ä.).
- [ ] `backend/.env` auf dem Server anlegen (SMTP-Zugang, `MAIL_TO`, ggf. `TRUST_PROXY=1`), nie ins Repo.
- [ ] Testanfrage über das Formular, Mail kommt an, Antworten an den Kunden funktionieren (`Reply-To`).
- [ ] HTTPS ist Pflicht (Formulare übertragen personenbezogene Daten, DSGVO Art. 32; Browser warnen sonst „Nicht sicher“): Let's-Encrypt-Zertifikat mit automatischer Verlängerung, TLS 1.2/1.3, HTTP per 301 auf HTTPS. Node lauscht nur auf `localhost` hinter einem Reverse Proxy (Caddy/nginx bzw. beim Hoster), der TLS übernimmt, dazu `TRUST_PROXY=1`. HSTS erst, wenn HTTPS stabil läuft.
- [ ] Prüfen, dass `/.env`, `/backend/`, `/docs/`, `/site.json`, `/.git/` mit 404 antworten.

**Domainabhängiges**
- [ ] `url` in `site.json`, `og:url`, `canonical`.
- [ ] `og:image` als absolute URL auf eine feste Datei in `frontend/public/` (z. B. 1200 × 630).
- [ ] JSON-LD: `image`/`logo` als absolute URL, ggf. `sameAs` (Google-Profil, Social Media).
- [ ] `robots.txt` und `sitemap.xml` (nur Startseite; Rechtsseiten bleiben `noindex`).
- [ ] Optional JSON-LD `JobPosting` je Stelle – nur mit echten Daten (Ort, Datum, Anstellungsart).

**Extern**
- [ ] Google-Unternehmensprofil anlegen/prüfen: NAP **exakt** wie in `site.json`; Link in `rating.profileUrl`.
- [ ] Bewertungszahl und Durchschnitt in `site.json` aktuell halten.
- [ ] Impressum und Datenschutz final, Platzhalter-Kasten entfernen.
- [ ] Lighthouse und axe gegen den echten Server.

**Öffentliche Demo mit fiktivem Betrieb** (z. B. GitHub Pages)
- [ ] Nur als Demo-Build veröffentlichen (`DEMO=1`), nie den normalen Build mit fiktiven Daten.
- [ ] Echter Betreiber im Impressum (§ 5 DDG): Name, ladungsfähige Anschrift (kein Postfach, c/o-Anschriften-Service zulässig), E-Mail (eigene Alias-Adresse), Telefon optional. Werte als Umgebungsvariablen bzw. CI-Variablen, **nie ins Repo** (bleiben dauerhaft in der Git-Historie).
- [ ] Datenschutzerklärung für den Demo-Host (Server-Logs, Rechtsgrundlage, ggf. Drittlandübermittlung), keine Cookies/Tracking/externen Inhalte, Beschwerderecht bei der Aufsichtsbehörde des Bundeslands. Mit einem anerkannten Generator abgleichen.
- [ ] Formulare senden nichts (kein `fetch`, ohne JS kein Absenden), Anruf-Links wählen nicht (fiktive Nummern können echten Anschlüssen gehören). `mailto:` an `.example` ist unbedenklich.
- [ ] Sichtbarer Hinweis auf jeder Seite (statisch, nicht wegklickbar – sonst bräuchte es Speicher und damit § 25 TDDDG) und `noindex` überall.
- [ ] Im Netzwerk-Tab prüfen: beim Absenden kein Request. In `dist/` und `git log -p` keine Betreiberdaten außer im Demo-Build.

**Rechtliches für echte Betriebe** (keine Rechtsberatung – im Zweifel prüfen lassen)
- [ ] Impressum nach § 5 DDG und DL-InfoV: zuständige Handwerkskammer, Eintrag in der Handwerksrolle, gesetzliche Berufsbezeichnung und Staat der Verleihung, berufsrechtliche Regelungen, Berufshaftpflicht (falls vorhanden: Versicherer, Geltungsbereich).
- [ ] Hinweis zur Verbraucherstreitbeilegung (§ 36 VSBG), wenn mehr als 10 Beschäftigte oder AGB verwendet werden.
- [ ] Datenschutzerklärung vollständig (Hosting, E-Mail-Anbieter, Formular, Bewerbungen, Speicherdauern, Aufsichtsbehörde).
- [ ] Verträge zur Auftragsverarbeitung (Art. 28 DSGVO) mit Hoster und Mail-Anbieter.
- [ ] Verzeichnis der Verarbeitungstätigkeiten (Art. 30 DSGVO).
- [ ] Löschkonzept: Anfragen nach Erledigung, Bewerbungen ca. 6 Monate nach Absage.
- [ ] UWG: nur echte Bewertungen, dazu Angabe, ob und wie sie geprüft werden (§ 5b Abs. 3 UWG). Keine Stockfotos als eigene Referenzen oder als eigenes Team ausgeben.
- [ ] „Meisterbetrieb“, „Innungsbetrieb“, „24/7“, „Festpreis“ nur, wenn es stimmt. Innungs- und Kammerlogos nur mit Erlaubnis.
- [ ] Stellenanzeigen nach AGG (neutral formuliert, „(m/w/d)“, keine Altersgrenzen).
- [ ] Kein Cookie-Banner nötig, solange nichts Nicht-Notwendiges gespeichert oder von Dritten geladen wird (§ 25 TDDDG). Kommt z. B. eine Karte oder Analyse dazu, neu bewerten.
- [ ] Barrierefreiheitsstärkungsgesetz (BFSG): greift für reine Info- und Kontaktseiten in der Regel nicht (erst bei Verträgen im elektronischen Geschäftsverkehr, z. B. Online-Buchung oder Shop). Barrierefreiheit trotzdem halten.

## 9. Arbeitsweise mit Claude

Bewährt hat sich:

- **Briefing als Gedächtnis**: `docs/BRIEFING.md` (Vorlage: `docs/BRIEFING-VORLAGE.md`) enthält Ziele, Zielgruppe, Abschnitte, eine Statustabelle der Schritte und je Schritt Plan + Entscheidungen. `CLAUDE.md` verweist darauf; zu Beginn jeder Sitzung liest Claude den Stand und nennt den offenen Punkt.
- **Plan → Feedback → Umsetzung**: Vor jedem Schritt stellt Claude den Plan mit **nummerierten Entscheidungspunkten** vor (inkl. Empfehlung). Erst nach dem Go wird umgesetzt. Rückfragen wie „was ist hier Best Practice?“ lohnen sich bei Grundsatzfragen.
- **Nach jedem Schritt**: Sichtprüfung per Screenshot (Handy/Tablet/Desktop), Tests, Statustabelle aktualisieren. **Commit und Push nur auf ausdrückliche Anweisung.**
- **Regeln in `CLAUDE.md`** knapp halten: Sprache, Abschnitte, technische Leitplanken (Tokens, Partials, `site.json`, Bilder nur über die Pipeline, Barrierefreiheit 100, DSGVO). Alles Projektspezifische steht im Briefing.
- **Firmendaten nie erfinden lassen**: Was fehlt, wird als Platzhalter sichtbar gemacht oder im Briefing als offene Frage notiert.
