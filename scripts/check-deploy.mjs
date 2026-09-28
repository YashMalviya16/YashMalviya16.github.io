// Pre-deploy checks for GitHub Pages (Linux, case-sensitive file system).
//   node scripts/check-deploy.mjs          -> source checks
//   node scripts/check-deploy.mjs --dist   -> also checks the built dist/ folder
// Fails (exit 1) on: imports whose path case doesn't match the file on disk, and
// referenced public assets (/images/..., /*.pdf, ...) that don't exist with that exact case.
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve, relative } from 'node:path';

const root = process.cwd();
const problems = [];

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

// Exact-case existence check, segment by segment.
async function existsExact(absPath) {
  const rel = relative(root, absPath).split(/[\\/]/);
  let cur = root;
  for (const seg of rel) {
    let names;
    try { names = await readdir(cur); } catch { return false; }
    if (!names.includes(seg)) return false;
    cur = join(cur, seg);
  }
  return true;
}

const srcFiles = (await walk(join(root, 'src'))).filter((f) => /\.(jsx?|css)$/.test(f));
const scanFiles = [...srcFiles, join(root, 'index.html')];

for (const file of scanFiles) {
  const raw = await readFile(file, 'utf8');
  // Ignore example paths inside // line comments (but keep URLs like https://).
  const text = file.endsWith('.css') || file.endsWith('.html') ? raw : raw.split('\n').map((l) => l.replace(/(^|\s)\/\/.*$/, '$1')).join('\n');

  // 1) relative imports
  for (const m of text.matchAll(/(?:import\s[^'"]*?from\s*|import\s*\(\s*|import\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const target = resolve(dirname(file), m[1]);
    if (!(await existsExact(target))) problems.push(`${relative(root, file)}: import "${m[1]}" not found with exact case`);
  }

  // 2) absolute asset paths served from public/
  for (const m of text.matchAll(/['"(`](\/(?:images|videos)\/[^'"`)\s]+|\/[A-Za-z0-9_-]+\.(?:pdf|png|jpg|webp|svg|ico|txt|xml))['"`)]/g)) {
    const asset = m[1].split(/[?#]/)[0];
    if (!(await existsExact(join(root, 'public', asset)))) problems.push(`${relative(root, file)}: asset "${asset}" missing from public/ (exact case)`);
  }
}

if (process.argv.includes('--dist')) {
  const dist = join(root, 'dist');
  for (const f of ['index.html', 'favicon.png', 'robots.txt', 'sitemap.xml', 'Yash-Malviya-Resume.pdf']) {
    try { await stat(join(dist, f)); } catch { problems.push(`dist/${f} missing`); }
  }
  const html = await readFile(join(dist, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
    if (!(await existsExact(join(dist, m[1])))) problems.push(`dist/index.html references missing ${m[1]}`);
  }
}

console.log(`Scanned ${scanFiles.length} files.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log(' - ' + p));
  process.exit(1);
}
console.log('OK: all imports and asset paths match files exactly (case-sensitive).');
