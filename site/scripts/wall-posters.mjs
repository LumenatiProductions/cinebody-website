// Hero video wall: self-host the poster frames and strip the inert <iframe>s.
//
// Before: every .scr-card shipped a Vimeo CDN <img> (25-60KB JPEG, third-party
// connection) plus a full <iframe> element (30 per page = 30 blank browsing
// contexts at parse time; on Platform/Services the iframes even carried a live
// src, so 30 Vimeo players booted on load, on phones too).
//
// After: each card is a tiny local WebP poster (cover-cropped to the 9:16 card,
// 240w + 480w) with the Vimeo URL parked on data-video. The desktop-only
// scroller script in Base.astro creates an iframe on demand for the cards in
// view and removes it when they scroll out. Mobile never streams.
//
// Usage: node scripts/wall-posters.mjs   (idempotent; re-run after editing the wall)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const FRAGS = ['homepage', 'platform', 'services'].map((f) => path.join(ROOT, 'src/fragments', `${f}.html`));
const OUT = path.join(ROOT, 'public/wall');

const CARD_RE = /<div class="scr-card(?: scr-wide)?"(?: data-video="[^"]*")?>\s*<img([^>]*)\/?>\s*(?:<iframe[^>]*>\s*<\/iframe>)?\s*<div class="scr-label">([^<]*)<\/div>\s*<\/div>/g;

const attr = (s, name) => (s.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];

async function fetchPoster(base) {
  // base = https://i.vimeocdn.com/video/<id>-<hash>-d   (without the _640 size suffix)
  for (const w of [960, 640]) {
    const r = await fetch(`${base}_${w}`);
    if (r.ok) return Buffer.from(await r.arrayBuffer());
  }
  throw new Error(`poster fetch failed: ${base}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const cache = new Map(); // videoId -> { wide }

  for (const file of FRAGS) {
    const html = await readFile(file, 'utf8');
    let count = 0;
    const jobs = [];
    const out = html.replace(CARD_RE, (m, imgAttrs, label) => {
      count++;
      const token = `__WALL_${count}__`;
      jobs.push((async () => {
        const src = attr(imgAttrs, 'src') || '';
        const eager = /loading="eager"/.test(imgAttrs);
        // video URL: from the old iframe (src or data-src) or an already-converted data-video
        const iframe = (m.match(/<iframe[^>]*>/) || [''])[0];
        const video = attr(iframe, 'data-src') || attr(iframe, 'src') || attr(m, 'data-video');
        if (!video) throw new Error(`no video url for card: ${label}`);
        const id = (video.match(/\/video\/(\d+)/) || [])[1];
        if (!id) throw new Error(`no video id in ${video}`);
        const clean = video.replace(/[?&]dnt=1/, '');

        if (!cache.has(id)) {
          const p480 = path.join(OUT, `${id}-480.webp`);
          const p240 = path.join(OUT, `${id}-240.webp`);
          let wide;
          if (existsSync(p480) && existsSync(p240) && !src.startsWith('http')) {
            wide = /scr-wide/.test(m);
          } else {
            const base = src.replace(/_\d+$/, '');
            if (!base.startsWith('https://i.vimeocdn.com/')) throw new Error(`unexpected poster src for ${id}: ${src}`);
            const buf = await fetchPoster(base);
            const meta = await sharp(buf).metadata();
            wide = meta.width > meta.height;
            await sharp(buf).resize(480, 853, { fit: 'cover', position: 'centre' }).webp({ quality: 62 }).toFile(p480);
            await sharp(buf).resize(240, 427, { fit: 'cover', position: 'centre' }).webp({ quality: 66 }).toFile(p240);
          }
          cache.set(id, { wide });
        }
        const { wide } = cache.get(id);
        const load = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
        return `<div class="scr-card${wide ? ' scr-wide' : ''}" data-video="${clean}"><img src="/wall/${id}-240.webp" srcset="/wall/${id}-240.webp 240w, /wall/${id}-480.webp 480w" sizes="(max-width: 767px) 33vw, 145px" width="240" height="427" alt="" decoding="async" ${load}/><div class="scr-label">${label}</div></div>`;
      })().then((html) => [token, html]));
      return token;
    });
    const results = await Promise.all(jobs);
    let final = out;
    for (const [token, html] of results) final = final.replace(token, html);
    await writeFile(file, final);
    console.log(`${path.basename(file)}: ${count} cards rewritten`);
  }
  console.log(`${cache.size} unique posters in public/wall`);
}

main().catch((e) => { console.error(e); process.exit(1); });
