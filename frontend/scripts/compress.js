// Komprimiert Textdateien in dist/ vorab mit Brotli und gzip (läuft nach `npm run build`).
// Das Backend liefert die .br/.gz-Variante aus, wenn der Browser sie annimmt – ohne Rechenaufwand pro Anfrage.
// Bilder sind schon komprimiert und werden übersprungen.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { brotliCompress, constants, gzip } from 'node:zlib';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const TEXT = new Set(['.html', '.css', '.js', '.svg', '.json']);
const MIN_SIZE = 1024; // kleinere Dateien lohnen nicht

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

let count = 0;
let before = 0;
let after = 0;
for (const entry of await readdir(dist, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !TEXT.has(path.extname(entry.name))) continue;
  const file = path.join(entry.parentPath, entry.name);
  const data = await readFile(file);
  if (data.length < MIN_SIZE) continue;
  const br = await brotli(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: data.length } });
  await writeFile(`${file}.br`, br);
  await writeFile(`${file}.gz`, await gz(data, { level: 9 }));
  count += 1;
  before += data.length;
  after += br.length;
}
console.info(`[compress] ${count} Dateien, ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (Brotli)`);
