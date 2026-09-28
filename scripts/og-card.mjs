// Builds the 1200x630 link-preview image (LinkedIn, WhatsApp, Slack, X) in the orange site style.
// Run: node scripts/og-card.mjs  -> public/images/og-card.jpg
import sharp from 'sharp';

const W = 1200, H = 630, ORANGE = '#E4572E';

const grid = [];
for (let x = W / 6; x < W; x += W / 6) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`);
for (let y = H / 4; y < H; y += H / 4) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" />`);

// Faint neural-network nodes in the background.
let seed = 7;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pts = Array.from({ length: 34 }, () => [Math.round(rand() * W), Math.round(rand() * H)]);
const links = [];
pts.forEach(([x1, y1], i) => pts.slice(i + 1).forEach(([x2, y2]) => {
  if (Math.hypot(x1 - x2, y1 - y2) < 190) links.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`);
}));

const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${ORANGE}"/>
  <g stroke="#fff" stroke-opacity="0.10" stroke-width="1.5">${grid.join('')}</g>
  <g stroke="#fff" stroke-opacity="0.22" stroke-width="1.2">${links.join('')}</g>
  <g fill="#fff" fill-opacity="0.5">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g>
  <text x="-20" y="210" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="260" letter-spacing="-12" fill="#fff" fill-opacity="0.09">YASH</text>
</svg>`;

const fg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="64" y="118" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="24" letter-spacing="4" fill="#fff">DATA &amp; AI PRODUCT ANALYST</text>
  <text x="64" y="160" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="26" fill="#fff" fill-opacity="0.9">Commonwealth of Massachusetts (EOTSS)</text>
  <text x="58" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="118" letter-spacing="-5" fill="#fff">YASH</text>
  <text x="58" y="575" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="118" letter-spacing="-5" fill="#fff">MALVIYA</text>
  <rect x="64" y="200" width="420" height="52" rx="26" fill="#000" fill-opacity="0.22"/>
  <text x="88" y="234" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="#fff">Production AI · LLMs · Agents · MLOps</text>
</svg>`;

const portrait = await sharp('public/images/portrait-cutout.webp').resize({ height: 600 }).png().toBuffer();
const { width: pw } = await sharp(portrait).metadata();

await sharp(Buffer.from(bg))
  .composite([
    { input: portrait, left: W - pw - 40, top: H - 600 },
    { input: Buffer.from(fg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 86 })
  .toFile('public/images/og-card.jpg');

console.log('wrote public/images/og-card.jpg');
