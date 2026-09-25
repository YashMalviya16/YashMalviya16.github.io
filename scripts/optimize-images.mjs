// Converts the source images in legacy/images into small WebP files in public/images.
// Run with: npm run images
import sharp from 'sharp';
import { mkdir, copyFile, stat } from 'node:fs/promises';

const SRC = 'legacy/images';
const OUT = 'public/images';

const jobs = [
  // Hero portrait: crop the head-and-shoulders area out of the full-length photo.
  { src: 'final pic.jpg', out: 'portrait.webp', extract: { left: 240, top: 60, width: 1320, height: 1650 }, width: 800 },
  { src: 'new york.jpg', out: 'nyt-titles.webp', width: 960 },
  { src: 'brain.jpg', out: 'medical-imaging.webp', width: 960 },
  { src: 'Risk.jpg', out: 'maang-risk.webp', width: 960 },
  { src: 'AI Medical EHR.jpg', out: 'synthetic-ehr.webp', width: 960 },
  { src: 'pf2.png', out: 'retail-dashboard.webp', width: 960 },
  { src: 'Inventory .png', out: 'inventory.webp', width: 960 },
  { src: 'Funnel Analysis .png', out: 'funnel.webp', width: 960 },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  let img = sharp(`${SRC}/${job.src}`).rotate();
  if (job.extract) img = img.extract(job.extract);
  await img.resize({ width: job.width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${OUT}/${job.out}`);
  const before = (await stat(`${SRC}/${job.src}`)).size;
  const after = (await stat(`${OUT}/${job.out}`)).size;
  console.log(`${job.out.padEnd(24)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${(after / 1024).toFixed(0).padStart(4)} KB`);
}

// Social preview card (1200x630) for LinkedIn / Twitter link previews.
await sharp(`${SRC}/final pic.jpg`)
  .rotate()
  .extract({ left: 0, top: 0, width: 1812, height: 951 })
  .resize(1200, 630)
  .jpeg({ quality: 80 })
  .toFile(`${OUT}/og-card.jpg`);

await copyFile(`${SRC}/Yash malviya Resume.pdf`, 'public/Yash-Malviya-Resume.pdf');
console.log('done');
