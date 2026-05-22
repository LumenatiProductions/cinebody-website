// Downloads self-hosted webfonts (the same woff2 files Google serves, latin
// subset) and generates the 1200x630 social share card. Run once: node scripts/build-assets.mjs
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const FONTS = path.join(ROOT, 'public/fonts');
const PUBLIC = path.join(ROOT, 'public');

// Google serves Inter as a variable font (one file = all weights), so we only
// need the first latin block per family. weight -> output filename.
const WANT = {
  Inter: { 400: 'inter-var.woff2' },
  'JetBrains Mono': { 500: 'jetbrains-mono-500.woff2' },
};
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap';
const CHROME_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function fonts() {
  await mkdir(FONTS, { recursive: true });
  const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': CHROME_UA } })).text();
  // Each @font-face is preceded by a /* subset */ comment. Keep only latin.
  const blocks = css.split('/*').map((b) => '/*' + b);
  let got = 0;
  for (const b of blocks) {
    if (!b.startsWith('/* latin */')) continue;
    const fam = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
    const wght = (b.match(/font-weight:\s*(\d+)/) || [])[1];
    const url = (b.match(/url\((https:\/\/[^)]+\.woff2)\)/) || [])[1];
    const out = WANT[fam] && WANT[fam][wght];
    if (!out || !url) continue;
    const dest = path.join(FONTS, out);
    if (existsSync(dest)) { got++; continue; }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(dest, buf);
    got++;
    console.log(`  font ${out} (${(buf.length / 1024).toFixed(0)}kb)`);
  }
  console.log(`Fonts: ${got} written.`);
}

async function og() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="28%" cy="34%" r="75%">
      <stop offset="0%" stop-color="#00bcf1" stop-opacity="0.20"/>
      <stop offset="45%" stop-color="#eb008b" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="92" y="372" font-family="Helvetica, Arial, sans-serif" font-size="58" font-weight="700" fill="#ffffff">Your community is</text>
  <text x="92" y="442" font-family="Helvetica, Arial, sans-serif" font-size="58" font-weight="700" fill="#00bcf1">your content team.</text>
  <text x="92" y="506" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="400" fill="#9aa0a6">The video capture platform for authentic UGC at scale.</text>
  <rect x="0" y="624" width="400" height="6" fill="#00bcf1"/>
  <rect x="400" y="624" width="400" height="6" fill="#ffec03"/>
  <rect x="800" y="624" width="400" height="6" fill="#eb008b"/>
</svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const logo = await sharp(path.join(PUBLIC, 'assets/5b29f7e3-cb_white.png'))
    .resize({ width: 300 })
    .png()
    .toBuffer();
  await sharp(base)
    .composite([{ input: logo, left: 92, top: 150 }])
    .png()
    .toFile(path.join(PUBLIC, 'og.png'));
  console.log('OG: og.png written.');
}

await fonts();
await og();
