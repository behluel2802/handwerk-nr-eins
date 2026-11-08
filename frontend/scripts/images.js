// Bild-Pipeline (Konfiguration: images.config.js). Läuft automatisch vor `npm run dev` und `npm run build`.
//   img-src/<foto>.jpg → img/<name>-<set>-<breite>.<format>   + img/manifest.json (Maße für die HTML-Helfer)
//   img-src/icon.svg   → public/favicon.ico, public/icon.svg, public/apple-touch-icon.png
// Übersprungen wird, was sich nicht geändert hat: Fingerabdruck aus Original + Einstellungen (nicht das Datum,
// damit der Cache im GitHub-Workflow greift). Alles neu erzeugen: npm run images -- --force

import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import images, { formats, icon } from '../images.config.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDir = path.join(root, 'img-src');
const outDir = path.join(root, 'img');
const publicDir = path.join(root, 'public');
const manifestFile = path.join(outDir, 'manifest.json');
const force = process.argv.includes('--force');
const VERSION = 1; // erhöhen, wenn sich die Verarbeitung in diesem Skript ändert

const exists = (file) => stat(file).then(() => true, () => false);
const fingerprint = (...parts) => {
  const hash = createHash('sha256');
  for (const part of parts) hash.update(typeof part === 'string' ? part : Buffer.isBuffer(part) ? part : JSON.stringify(part));
  return hash.digest('hex').slice(0, 16);
};

/** Führt Aufgaben mit begrenzter Parallelität aus */
async function pool(tasks, limit = availableParallelism()) {
  const queue = [...tasks];
  await Promise.all(Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await queue.shift()();
  }));
}

/** Ausschnitt im Original für ein Seitenverhältnis, verschoben entlang der überstehenden Achse */
function cropBox(width, height, aspect, focus = 0.5) {
  if (width / height > aspect) {
    const w = Math.round(height * aspect);
    return { left: Math.round((width - w) * focus), top: 0, width: w, height };
  }
  const h = Math.round(width / aspect);
  return { left: 0, top: Math.round((height - h) * focus), width, height: h };
}

/** Plant alle Ausgaben eines Bildes: Dateiname, Zielmaße, Ausschnitt */
async function plan(image) {
  const meta = await sharp(path.join(srcDir, image.src)).metadata();
  const swap = (meta.orientation ?? 1) >= 5; // EXIF 90°/270°: Breite und Höhe tauschen
  const [srcW, srcH] = swap ? [meta.height, meta.width] : [meta.width, meta.height];

  const sets = {};
  for (const [setName, set] of Object.entries(image.sets)) {
    const crop = set.aspect ? cropBox(srcW, srcH, set.aspect, set.focus) : null;
    const [baseW, baseH] = crop ? [crop.width, crop.height] : [srcW, srcH];
    const widths = set.max ? [Math.min(baseW, Math.round(baseW * Math.min(1, set.max / Math.max(baseW, baseH))))] : set.widths;
    sets[setName] = widths.map((w) => {
      const width = Math.min(w, baseW); // nie vergrößern
      return { file: `${image.name}-${setName}-${width}`, width, height: Math.round((baseH * width) / baseW), crop };
    });
  }
  return sets;
}

async function render(image, out, format, target) {
  let pipeline = sharp(path.join(srcDir, image.src)).rotate(); // EXIF-Ausrichtung anwenden, Metadaten fallen weg
  if (out.crop) pipeline = pipeline.extract(out.crop);
  if (image.flop) pipeline = pipeline.flop();
  pipeline = pipeline.resize({ width: out.width, height: out.height });
  pipeline = { avif: (p) => p.avif(formats.avif), webp: (p) => p.webp(formats.webp), jpg: (p) => p.jpeg(formats.jpg) }[format](pipeline);
  await pipeline.toFile(target);
}

/** ICO-Datei mit einem eingebetteten PNG (von allen Browsern unterstützt) */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); // Typ: Icon
  header.writeUInt16LE(1, 4); // Anzahl Bilder
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // Farbebenen
  header.writeUInt16LE(32, 12); // Bit pro Pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // Offset der Bilddaten
  return Buffer.concat([header, png]);
}

async function renderIcons(previousKey) {
  const source = path.join(srcDir, icon);
  await mkdir(publicDir, { recursive: true });
  const svg = await readFile(source);
  const key = fingerprint(VERSION, svg);
  const raster = (size) => sharp(svg, { density: (72 * size) / 32 }).resize(size, size);
  const background = (await readFile(source, 'utf8')).match(/<rect[^>]*fill="([^"]+)"/)?.[1] ?? '#ffffff';

  const outputs = {
    'icon.svg': () => copyFile(source, path.join(publicDir, 'icon.svg')),
    'favicon.ico': async () => writeFile(path.join(publicDir, 'favicon.ico'), pngToIco(await raster(32).png().toBuffer(), 32)),
    // iOS rundet die Ecken selbst ab und zeigt Transparenz schwarz: vollflächig mit Hintergrundfarbe
    'apple-touch-icon.png': () => raster(180).flatten({ background }).png().toFile(path.join(publicDir, 'apple-touch-icon.png')),
  };
  let created = 0;
  for (const [file, make] of Object.entries(outputs)) {
    if (force || key !== previousKey || !(await exists(path.join(publicDir, file)))) {
      await make();
      created += 1;
    }
  }
  return { key, created };
}

await mkdir(outDir, { recursive: true });
const previous = JSON.parse(await readFile(manifestFile, 'utf8').catch(() => '{}'));
const manifest = {};
const keys = {};
const expected = new Set(['manifest.json']);
const tasks = [];

for (const image of images) {
  const source = path.join(srcDir, image.src);
  const original = await readFile(source).catch(() => {
    throw new Error(`Original fehlt: img-src/${image.src}`);
  });
  keys[image.name] = fingerprint(VERSION, original, image, formats);
  const unchanged = !force && previous.keys?.[image.name] === keys[image.name];
  const sets = await plan(image);
  manifest[image.name] = {};

  for (const [setName, outputs] of Object.entries(sets)) {
    manifest[image.name][setName] = outputs.map(({ file, width, height }) => ({ file, width, height }));
    for (const out of outputs) {
      for (const format of Object.keys(formats)) {
        const target = path.join(outDir, `${out.file}.${format}`);
        expected.add(path.basename(target));
        if (unchanged && (await exists(target))) continue;
        tasks.push(() => render(image, out, format, target));
      }
    }
  }
}

await pool(tasks);

// Verwaiste Dateien (Eintrag aus der Konfiguration entfernt) aufräumen
let removed = 0;
for (const file of await readdir(outDir)) {
  if (!expected.has(file)) {
    await rm(path.join(outDir, file));
    removed += 1;
  }
}

const icons = await renderIcons(previous.keys?.[`icon:${icon}`]);
keys[`icon:${icon}`] = icons.key;
await writeFile(manifestFile, `${JSON.stringify({ formats: Object.keys(formats), keys, images: manifest }, null, 2)}\n`);
console.info(`[images] ${expected.size - 1} Bilder (${tasks.length} neu, ${removed} entfernt), Icons: ${icons.created} neu`);
