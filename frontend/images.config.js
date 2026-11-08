// Bild-Pipeline: Aus den Originalen in img-src/ erzeugt `npm run images` alle Größen und Formate in img/.
// img/ ist generiert (nicht im Repo). Neues Foto: Original nach img-src/, Eintrag hier, Nachweis in img-src/CREDITS.md.
//
// Felder je Bild:
//   name – Präfix der Ausgabedateien
//   src  – Original in img-src/
//   flop – horizontal spiegeln
//   sets – benannte Bildsätze, je Satz:
//     widths – Zielbreiten in px (Ausgabe: name-set-breite.format)
//     max    – alternativ: eine Ausgabe, längste Kante in px, Seitenverhältnis bleibt
//     aspect – Ausschnitt mit diesem Seitenverhältnis (Breite/Höhe)
//     focus  – Lage des Ausschnitts entlang der überstehenden Achse: 0 = links/oben, 0.5 = Mitte, 1 = rechts/unten
//
// Im HTML erzeugen die Helfer in vite.config.js die srcset-Angaben aus diesen Daten:
//   {{> picture name="ref-bad" set="tile" …}}  oder einzeln {{srcset "about" "wide" "webp"}}

// Formate in Reihenfolge der <source>-Elemente; das letzte ist der Fallback im <img>
export const formats = {
  avif: { quality: 55, effort: 4 },
  webp: { quality: 78 },
  jpg: { quality: 80, mozjpeg: true },
};

// Favicon und App-Icon (Ausgabe nach public/, feste Dateinamen ohne Hash)
export const icon = 'icon.svg';

const reference = (focus) => ({
  tile: { widths: [400, 600, 800, 1200], aspect: 4 / 3, focus }, // Kacheln
  full: { max: 1600 }, // Lightbox: ganzes Foto
});

export default [
  {
    name: 'hero',
    src: 'hero-elektriker-helm_emmanuel-ikwuegbu.jpg',
    flop: true,
    sets: { main: { widths: [800, 1280, 1600, 1920, 2400] } },
  },
  { name: 'ref-pv-anlage', src: 'ref-pv-anlage_watt-a-lot.jpg', sets: reference(0.9) },
  { name: 'ref-kueche', src: 'ref-kueche_clay-banks.jpg', sets: reference(0.5) },
  { name: 'ref-unterverteilung', src: 'ref-unterverteilung_markus-spiske.jpg', sets: reference(0.5) },
  { name: 'ref-wallbox', src: 'ref-wallbox_andersen-ev.jpg', sets: reference(0.95) },
  { name: 'ref-bad', src: 'ref-bad_aleksandra-dementeva.jpg', sets: reference(0.385) },
  { name: 'ref-smarthome', src: 'ref-smarthome_jakub-zerdzicki.jpg', sets: reference(1) },
  {
    name: 'about',
    src: 'about-pendelleuchte_ewan-buck.jpg',
    sets: {
      portrait: { widths: [480, 720, 960], aspect: 4 / 5, focus: 0 }, // ab 768 px: Hochformat
      wide: { widths: [600, 800, 1200], aspect: 4 / 3, focus: 0.12 }, // darunter: 4:3-Ausschnitt
    },
  },
];
