// Compresses your photos for the site. Run: npm run photos
//
// photos/orgs/<name>.*        -> public/images/orgs/<name>.webp        (cropped to 4:3, for Experience)
//   e.g. eotss.jpg, wpi.jpg, availity.jpg, tcs.jpg; then set photo: '/images/orgs/<name>.webp' in src/data.js
// photos/highlights/<name>.*  -> public/images/highlights/<name>.webp  (full frame, for Honors & community)
//   then set photo: '/images/highlights/<name>.webp' on the matching entry in `achievements`
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { extname, basename } from 'node:path';

sharp.cache(false); // don't hold source files open (Windows file locks)

const JOBS = [
  { src: 'photos/orgs', out: 'public/images/orgs', resize: { width: 1200, height: 900, fit: 'cover' } },
  { src: 'photos/highlights', out: 'public/images/highlights', resize: { width: 1400, height: 1400, fit: 'inside' } },
];

for (const job of JOBS) {
  const files = (await readdir(job.src).catch(() => [])).filter((f) => /\.(jpe?g|png|webp|heic|avif|tiff?)$/i.test(f));
  if (!files.length) continue;
  await mkdir(job.out, { recursive: true });
  for (const f of files) {
    const out = `${job.out}/${basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`;
    await sharp(`${job.src}/${f}`).rotate().resize({ ...job.resize, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    const kb = ((await stat(out)).size / 1024).toFixed(0);
    console.log(`${f} -> ${out} (${kb} KB)`);
  }
}
