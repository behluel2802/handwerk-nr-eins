// Erzeugt alle Bildgrößen und -formate aus img-src/ nach img/ (Konfiguration: images.config.js).
// Läuft automatisch vor `npm run dev` und `npm run build`. Unveränderte Bilder werden übersprungen.
// Alles neu erzeugen: npm run images -- --force

import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import images, { formats } from '../images.config.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDir = path.join(root, 'img-src');
const outDir = path.join(root, 'img');
const configFile = path.join(root, 'images.config.js');
const force = process.argv.includes('--force');

const mtime = (file) => stat(file).then((s) => s.mtimeMs, () => 0);

/** Ausschnitt im Original für ein Seitenverhältnis, verschoben entlang der überstehenden Achse */
function cropBox(width, height, aspect, focus = 0.5) {
  if (width / height > aspect) {
    const w = Math.round(height * aspect);
    return { left: Math.round((width - w) * focus), top: 0, width: w, height };
  }
  const h = Math.round(width / aspect);
  return { left: 0, top: Math.round((height - h) * focus), width, height: h };
}

function outputName(image, variant) {
  return `${image.name}-${variant.suffix ?? variant.width ?? variant.max}`;
}

async function render(image, variant, format, target) {
  const source = path.join(srcDir, image.src);
  let pipeline = sharp(source).rotate(); // EXIF-Ausrichtung anwenden, Metadaten fallen weg
  if (variant.aspect) {
    const meta = await sharp(source).metadata();
    const swap = (meta.orientation ?? 1) >= 5; // 90°/270° gedreht: Breite und Höhe tauschen
    const [width, height] = swap ? [meta.height, meta.width] : [meta.width, meta.height];
    pipeline = pipeline.extract(cropBox(width, height, variant.aspect, variant.focus));
  }
  if (image.flop) pipeline = pipeline.flop();
  pipeline = variant.max
    ? pipeline.resize({ width: variant.max, height: variant.max, fit: 'inside', withoutEnlargement: true })
    : pipeline.resize({ width: variant.width, withoutEnlargement: true });
  pipeline = format === 'jpg' ? pipeline.jpeg(formats.jpg) : pipeline.webp(formats.webp);
  await pipeline.toFile(target);
}

await mkdir(outDir, { recursive: true });
const configTime = await mtime(configFile);
const expected = new Set();
let created = 0;

for (const image of images) {
  const sourceTime = await mtime(path.join(srcDir, image.src));
  if (!sourceTime) throw new Error(`Original fehlt: img-src/${image.src}`);

  for (const variant of image.variants) {
    for (const format of Object.keys(formats)) {
      const file = `${outputName(image, variant)}.${format}`;
      const target = path.join(outDir, file);
      expected.add(file);
      if (!force && (await mtime(target)) > Math.max(sourceTime, configTime)) continue;
      await render(image, variant, format, target);
      created += 1;
    }
  }
}

// Verwaiste Dateien (Eintrag aus der Konfiguration entfernt) aufräumen
let removed = 0;
for (const file of await readdir(outDir)) {
  if (!expected.has(file)) {
    await rm(path.join(outDir, file));
    removed += 1;
  }
}

console.info(`[images] ${expected.size} Dateien, ${created} neu erzeugt, ${removed} entfernt`);
