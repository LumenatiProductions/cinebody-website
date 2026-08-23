// Publish an approved Cinebody blog draft into the live Astro site.
//
// Usage:  node scripts/publish-draft.mjs <draft-dir> [--force]
//
// <draft-dir> contains:
//   draft.json            the post payload (see CONTRACT below)
//   hero.<ext>            source hero image (>=1600px wide, ~16:9). png/jpg/jpeg/webp
//   <still files>         any files referenced by draft.json stills[].file
//
// draft.json (the contract):
// {
//   "title":        "5 Steps to a Great iPhone Interview",   // required
//   "slug":         "5-steps-great-iphone-interview",        // required, kebab-case
//   "author":       "Scott McDonald",                        // Scott McDonald | Travis Page | Cinebody
//   "description":  "One or two sentences. Used as meta + card excerpt.", // required
//   "pubDate":      "2026-01-20",                            // YYYY-MM-DD
//   "focal":        "0.5 0.35",                              // optional "x y" 0..1 crop focus
//   "body_markdown":"Markdown body 800-1400 words with {{img-1}} tokens where stills go.",
//   "stills": [                                              // 0-3
//     { "file": "still-a.jpg", "alt": "Lighting a subject", "caption": "Optional caption" }
//   ]
// }
//
// Writes  src/content/blog/<slug>.md  and  public/blog/<slug>/{source,hero,card,img-N}.webp
// Idempotent per slug (re-run with --force to overwrite an existing post).

import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { makeHero, makeCard, makeSource, parseFocal } from './blog-crop.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = path.join(ROOT, 'src/content/blog');
const IMG = path.join(ROOT, 'public/blog');

const exists = (p) => access(p).then(() => true).catch(() => false);
const die = (m) => { console.error('✗ ' + m); process.exit(1); };

const [, , draftDir, ...flags] = process.argv;
if (!draftDir) die('usage: node scripts/publish-draft.mjs <draft-dir> [--force]');
const force = flags.includes('--force');

const dir = path.resolve(draftDir);
const draft = JSON.parse(await readFile(path.join(dir, 'draft.json'), 'utf8').catch(() => die('no draft.json in ' + dir)));

// ── validate ──
for (const k of ['title', 'slug', 'description', 'pubDate', 'body_markdown']) {
  if (!draft[k] || !String(draft[k]).trim()) die(`draft.json missing "${k}"`);
}
const slug = String(draft.slug).trim();
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) die(`slug "${slug}" must be kebab-case`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(draft.pubDate))) die(`pubDate "${draft.pubDate}" must be YYYY-MM-DD`);
const author = draft.author || 'Cinebody';
const stills = Array.isArray(draft.stills) ? draft.stills : [];
if (stills.length > 3) die('max 3 stills');

const postFile = path.join(POSTS, `${slug}.md`);
if (await exists(postFile) && !force) die(`post ${slug}.md already exists (re-run with --force to overwrite)`);

const outDir = path.join(IMG, slug);
await mkdir(outDir, { recursive: true });

// ── hero: source.webp + hero.webp (1280x720) + card.webp (800x500) ──
const files = await readdir(dir);
const heroSrc = files.find((f) => /^hero\.(png|jpe?g|webp)$/i.test(f));
if (!heroSrc) die('no hero.(png|jpg|jpeg|webp) in ' + dir);
const heroBuf = await readFile(path.join(dir, heroSrc));
const focal = parseFocal(draft.focal);
await writeFile(path.join(outDir, 'source.webp'), await makeSource(heroBuf));
await writeFile(path.join(outDir, 'hero.webp'), await makeHero(heroBuf, focal));
await writeFile(path.join(outDir, 'card.webp'), await makeCard(heroBuf, focal));
console.log(`  hero  → /blog/${slug}/hero.webp (1280x720), card.webp (800x500), source.webp`);

// ── stills: img-N.webp (<=1200 wide) + figure html ──
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const figures = {};
for (let i = 0; i < stills.length; i++) {
  const s = stills[i];
  if (!s.file) die(`stills[${i}] missing "file"`);
  const buf = await readFile(path.join(dir, s.file)).catch(() => die(`still file not found: ${s.file}`));
  const name = `img-${i + 1}.webp`;
  await writeFile(path.join(outDir, name), await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer());
  const cap = s.caption ? `\n  <figcaption><p>${esc(s.caption)}</p></figcaption>` : '';
  figures[`img-${i + 1}`] = `\n<figure>\n  <img src="/blog/${slug}/${name}" alt="${esc(s.alt)}">${cap}\n</figure>\n`;
  console.log(`  still → /blog/${slug}/${name}`);
}

// ── body: swap {{img-N}} tokens for figures; append any unplaced, drop empty tokens ──
let body = String(draft.body_markdown);
for (const key of Object.keys(figures)) {
  const token = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
  if (token.test(body)) body = body.replace(token, figures[key]);
  else { console.warn(`  ! no {{${key}}} token in body — appending ${key} at end`); body += `\n${figures[key]}`; }
}
body = body.replace(/\{\{\s*img-\d+\s*\}\}/g, (m) => { console.warn(`  ! leftover token ${m} with no still — removed`); return ''; });

// ── frontmatter + write ──
const fm = [
  '---',
  `title: ${JSON.stringify(draft.title)}`,
  `description: ${JSON.stringify(draft.description)}`,
  `pubDate: ${draft.pubDate}`,
  `author: ${JSON.stringify(author)}`,
  `heroImage: "/blog/${slug}/hero.webp"`,
  `cardImage: "/blog/${slug}/card.webp"`,
  ...(draft.focal ? [`focal: ${JSON.stringify(String(draft.focal))}`] : []),
  '---',
  '',
].join('\n');

await writeFile(postFile, fm + body.trim() + '\n');
console.log(`✓ published: src/content/blog/${slug}.md  →  /cinebody-blog/${slug}`);
console.log('  next: commit + push (Vercel auto-deploys on push to the live branch).');
