// Vite: baut die Quellen in frontend/ nach frontend/dist/.
// Entwicklung: npm run dev (http://localhost:5173, /api wird an das Backend auf :3000 weitergereicht)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { loadSite, siteHelpers } from './scripts/site.js';

const root = import.meta.dirname;

// Alle Seiten der Website (jede wird ein eigener Einstieg im Build)
const pages = ['index', 'impressum', 'datenschutz', 'danke'];

// Bild-Helfer für die Templates. Datenquelle: img/manifest.json (erzeugt von scripts/images.js)
const manifest = () => JSON.parse(readFileSync(resolve(root, 'img/manifest.json'), 'utf8'));
function variants(name, set) {
  const found = manifest().images[name]?.[set];
  if (!found) throw new Error(`Bild "${name}" / Satz "${set}" fehlt in images.config.js`);
  return found;
}
const imageHelpers = {
  // "img/ref-bad-tile-400.avif 400w, img/ref-bad-tile-600.avif 600w, …"
  srcset: (name, set, format) => variants(name, set).map((v) => `img/${v.file}.${format} ${v.width}w`).join(', '),
  // kleinste Variante (bzw. einzige, z. B. Lightbox-Bild)
  src: (name, set, format) => `img/${variants(name, set)[0].file}.${format}`,
  // Maße der kleinsten Variante für width/height (Seitenverhältnis, verhindert Layout-Sprünge)
  dim: (name, set, key) => variants(name, set)[0][key],
  sourceFormats: () => manifest().formats.slice(0, -1),
  fallbackFormat: () => manifest().formats.at(-1),
};

// Firmendaten (site.json) bei jedem Rendern neu lesen: Änderungen zeigt der Dev-Server nach dem Neuladen der Seite.
// Warnungen (z. B. fehlender Google-Link) nur einmal ausgeben.
const warned = new Set();
const warnOnce = (message) => {
  if (!warned.has(message)) console.warn(message);
  warned.add(message);
};

export default defineConfig({
  // Relative Pfade: dist/ funktioniert unter jeder Adresse, auch im Unterordner von GitHub Pages
  base: './',

  html: {
    // Lightbox-Links auf die großen Referenzfotos ebenfalls als Assets behandeln (Hash im Dateinamen)
    additionalAssetSources: {
      a: { srcAttributes: ['href', 'data-full'], filter: ({ attributes }) => 'data-full' in attributes },
    },
  },

  plugins: [
    handlebars({
      partialDirectory: resolve(root, 'partials'),
      helpers: { ...imageHelpers, ...siteHelpers },
      // Kontext je Seite: Firmendaten, Anker-Präfix für Links zur Startseite und die aktuelle Seite
      context(pagePath) {
        const page = pagePath.replace(/^\//, '').replace(/\.html$/, '') || 'index';
        return { site: loadSite({ warn: warnOnce }), home: page === 'index' ? '' : './', current: { [page]: true } };
      },
    }),
  ],

  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Keine Bilder als data:-URI ins HTML: einheitlich als Datei, dauerhaft cachebar
    assetsInlineLimit: 0,
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page, resolve(root, `${page}.html`)])),
    },
  },
});
