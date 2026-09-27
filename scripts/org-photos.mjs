// Compresses your organisation photos for the Experience section.
// 1. Put photos in photos/orgs/ named after the organisation: eotss.jpg, wpi.jpg, availity.jpg, tcs.jpg, rgpv.jpg
// 2. Run: npm run photos
// 3. Set photo: '/images/orgs/<name>.webp' for that entry in src/data.js
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { extname, basename } from 'node:path';

const SRC = 'photos/orgs';
const OUT = 'public/images/orgs';
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC).catch(() => [])).filter((f) => /\.(jpe?g|png|webp|heic|avif|tiff?)$/i.test(f));
if (!files.length) console.log(`No photos found in ${SRC}/`);

for (const f of files) {
  const out = `${OUT}/${basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`;
  await sharp(`${SRC}/${f}`).rotate().resize({ width: 1200, height: 900, fit: 'cover', withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  const kb = ((await stat(out)).size / 1024).toFixed(0);
  console.log(`${f} -> ${out} (${kb} KB)`);
}
