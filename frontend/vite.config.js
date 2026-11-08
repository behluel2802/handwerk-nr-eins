// Vite: baut die Quellen in frontend/ nach frontend/dist/.
// Entwicklung: npm run dev (http://localhost:5173, /api wird an das Backend auf :3000 weitergereicht)
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const root = import.meta.dirname;

// Alle Seiten der Website (jede wird ein eigener Einstieg im Build)
const pages = ['index', 'impressum', 'datenschutz', 'danke'];

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
      // Kontext je Seite: Anker-Präfix für Links zur Startseite und die aktuelle Seite
      context(pagePath) {
        const page = pagePath.replace(/^\//, '').replace(/\.html$/, '') || 'index';
        return { home: page === 'index' ? '' : './', current: { [page]: true } };
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
