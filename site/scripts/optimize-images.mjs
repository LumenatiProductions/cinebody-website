// Re-encode the site's hand-placed JPEG photos as WebP and point the fragments at them.
//
//   public/cuts/*.jpg     finished-cut posters (720x1280, shown 224-340px wide) -> 480w + 720w
//   public/who/*.jpg      who-films cards (1200x750, shown <=560px wide)        -> 640w + 1200w
//   public/app-ui/**.jpg  real app screenshots on Platform                        -> native width
//
// Originals stay on disk (nothing else links to them); the fragments get src/srcset
// rewritten to the .webp files. Idempotent: re-run after dropping new JPEGs in.
//
// Usage: node scripts/optimize-images.mjs
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'public');
const FRAG_DIR = path.join(ROOT, 'src/fragments');

// dir -> widths to emit (null = native width only)
const PLAN = {
  cuts: [360, 480, 720],
  who: [640, 1200],
  'app-ui': null,
  'app-ui/live': null,
};

async function encode(rel, widths) {
  const dir = rel.split('/')[0];
  const src = path.join(PUB, rel);
  const meta = await sharp(src).metadata();
  const base = rel.replace(/\.jpe?g$/i, '');
  const outs = [];
  if (!widths) {
    const out = `${base}.webp`;
    await sharp(src).webp({ quality: 80 }).toFile(path.join(PUB, out));
    outs.push({ out, w: meta.width });
  } else {
    for (const w of widths) {
      if (w > meta.width) continue;
      const out = w === Math.max(...widths.filter((x) => x <= meta.width)) ? `${base}.webp` : `${base}-${w}.webp`;
      await sharp(src).resize({ width: w }).webp({ quality: dir === 'cuts' ? 60 : 78 }).toFile(path.join(PUB, out));
      outs.push({ out, w });
    }
  }
  return { outs, width: meta.width, height: meta.height };
}

async function main() {
  const map = new Map(); // "/cuts/x.jpg" -> { outs, width, height }
  let before = 0, after = 0;
  for (const [dir, widths] of Object.entries(PLAN)) {
    for (const f of await readdir(path.join(PUB, dir))) {
      if (!/\.jpe?g$/i.test(f)) continue;
      const rel = `${dir}/${f}`;
      const r = await encode(rel, widths);
      map.set(`/${rel.replace(/\.jpe?g$/i, '')}`, r);
      before += (await stat(path.join(PUB, rel))).size;
      after += (await stat(path.join(PUB, r.outs[r.outs.length - 1].out))).size;
    }
  }
  console.log(`${map.size} images: ${(before / 1024) | 0}KB jpeg -> ${(after / 1024) | 0}KB webp (largest variant)`);

  for (const f of await readdir(FRAG_DIR)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(FRAG_DIR, f);
    let html = await readFile(p, 'utf8');
    let n = 0;
    html = html.replace(/<img\b([^>]*?)\bsrc="(\/(?:cuts|who|app-ui)\/[^"]+)\.(?:jpe?g|webp)"([^>]*)>/g, (m, pre, src, post) => {
      const r = map.get(src);
      if (!r) return m;
      n++;
      const attrs = (pre + post).replace(/\s*\bsrcset="[^"]*"/, '').replace(/\s*\bsizes="[^"]*"/, '');
      const largest = r.outs[r.outs.length - 1].out;
      let extra = '';
      if (r.outs.length > 1) {
        extra = ` srcset="${r.outs.map((o) => `/${o.out} ${o.w}w`).join(', ')}" sizes="${src.startsWith('/cuts/') ? '(max-width: 700px) 84vw, 224px' : '(max-width: 700px) 92vw, 560px'}"`;
      }
      return `<img src="/${largest}"${extra}${attrs}>`;
    });
    if (n) { await writeFile(p, html); console.log(`${f}: ${n} image refs rewritten`); }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
