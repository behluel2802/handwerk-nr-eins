// Bild-Pipeline: Aus den Originalen in img-src/ erzeugt `npm run images` alle Größen und Formate in img/.
// img/ ist generiert (nicht im Repo). Neues Foto: Original nach img-src/, Eintrag hier, Nachweis in img-src/CREDITS.md.
//
// Felder je Bild:
//   name     – Präfix der Ausgabedateien, z. B. ref-bad → ref-bad-480.webp
//   src      – Original in img-src/
//   flop     – horizontal spiegeln
//   variants – Liste von Ausgaben:
//     width        – Zielbreite in px (Ausgabename: name-width)
//     max          – alternativ: längste Kante in px, Seitenverhältnis bleibt (Ausgabename: name-max)
//     suffix       – optional anderer Ausgabename (name-suffix)
//     aspect       – Ausschnitt mit diesem Seitenverhältnis (Breite/Höhe)
//     focus        – Lage des Ausschnitts entlang der überstehenden Achse: 0 = links/oben, 0.5 = Mitte, 1 = rechts/unten

export const formats = {
  webp: { quality: 78 },
  jpg: { quality: 80, mozjpeg: true },
};

const tile = (focus) => [
  { width: 480, aspect: 4 / 3, focus },
  { width: 800, aspect: 4 / 3, focus },
  { max: 1600 }, // Lightbox: ganzes Foto
];

export default [
  {
    name: 'hero',
    src: 'hero-elektriker-helm_emmanuel-ikwuegbu.jpg',
    flop: true,
    variants: [{ width: 1280 }, { width: 2400 }],
  },
  { name: 'ref-pv-anlage', src: 'ref-pv-anlage_watt-a-lot.jpg', variants: tile(0.9) },
  { name: 'ref-kueche', src: 'ref-kueche_clay-banks.jpg', variants: tile(0.5) },
  { name: 'ref-unterverteilung', src: 'ref-unterverteilung_markus-spiske.jpg', variants: tile(0.5) },
  { name: 'ref-wallbox', src: 'ref-wallbox_andersen-ev.jpg', variants: tile(0.95) },
  { name: 'ref-bad', src: 'ref-bad_aleksandra-dementeva.jpg', variants: tile(0.385) },
  { name: 'ref-smarthome', src: 'ref-smarthome_jakub-zerdzicki.jpg', variants: tile(1) },
  {
    name: 'about',
    src: 'about-pendelleuchte_ewan-buck.jpg',
    variants: [
      { width: 600, aspect: 4 / 5, focus: 0 }, // Desktop: Hochformat
      { width: 1000, aspect: 4 / 5, focus: 0 },
      { width: 800, aspect: 4 / 3, focus: 0.12, suffix: 'wide-800' }, // mobil: 4:3-Ausschnitt
      { width: 1200, aspect: 4 / 3, focus: 0.12, suffix: 'wide-1200' },
    ],
  },
];
