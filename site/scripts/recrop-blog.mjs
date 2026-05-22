// Re-crop blog featured images for posts that set a manual `focal` override in
// frontmatter. Crops from the saved source.webp (no Squarespace fetch, no touch
// to post bodies). Posts without `focal` are left on the default smart crop.
//
// Workflow: add `focal: "0.5 0.3"` to a post's frontmatter, run this, commit.
//   x = left..right (0..1), y = top..bottom (0..1). 0.5 0.5 is dead center.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { makeHero, makeCard, parseFocal } from './blog-crop.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const POSTS = path.join(ROOT, 'src/content/blog');
const IMG = path.join(ROOT, 'public/blog');

const files = (await readdir(POSTS)).filter((f) => f.endsWith('.md'));
let recropped = 0;

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const md = await readFile(path.join(POSTS, file), 'utf8');
  const m = md.match(/^focal:\s*(.+)$/m);
  const focal = parseFocal(m ? m[1].replace(/['"]/g, '').trim() : null);
  if (!focal) continue;

  const source = path.join(IMG, slug, 'source.webp');
  if (!existsSync(source)) {
    console.log(`  skip ${slug}: no source.webp (re-run migrate-blog.mjs first)`);
    continue;
  }
  const buf = await readFile(source);
  await writeFile(path.join(IMG, slug, 'hero.webp'), await makeHero(buf, focal));
  await writeFile(path.join(IMG, slug, 'card.webp'), await makeCard(buf, focal));
  recropped++;
  console.log(`  recropped ${slug} @ ${focal.x} ${focal.y}`);
}

console.log(`\n${recropped} post(s) re-cropped from manual focal points.`);
