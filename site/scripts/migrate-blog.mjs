// Migrate the Squarespace blog at www.cinebody.com/cinebody-blog into Astro
// content collection files. Paginates all posts, cleans the Squarespace HTML
// down to semantic markup, self-hosts images, strips em dashes, and writes
// src/content/blog/{slug}.md (frontmatter + cleaned HTML body).
//
// Usage: node scripts/migrate-blog.mjs
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import { stripEmDash } from './strip-emdash.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src/content/blog');
const IMG_OUT = path.join(ROOT, 'public/blog');
const UA = { headers: { 'User-Agent': 'Mozilla/5.0' } };
const BASE = 'https://www.cinebody.com';

const BLOCK = new Set(['p','h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','figure','figcaption','hr','pre']);
const INLINE = new Set(['a','strong','b','em','i','u','br','code','sup','sub','mark']);
const VOID = new Set(['br','hr','img']);
const DROP = new Set(['style','script','noscript']);

function serialize(node, imgs) {
  if (node.nodeType === 3) return node.rawText; // text node
  const tag = (node.rawTagName || '').toLowerCase();
  if (!tag) return (node.childNodes || []).map((c) => serialize(c, imgs)).join('');
  if (DROP.has(tag)) return '';
  if (tag === 'img') {
    const src = node.getAttribute('data-src') || node.getAttribute('src') || '';
    if (!src || src.startsWith('data:')) return '';
    const alt = (node.getAttribute('alt') || '').replace(/"/g, '&quot;');
    imgs.add(src);
    return `<img src="${src}" alt="${alt}">`;
  }
  const inner = (node.childNodes || []).map((c) => serialize(c, imgs)).join('');
  if (tag === 'a') {
    let href = node.getAttribute('href') || '';
    // Squarespace internal links -> keep relative blog paths, else absolute
    if (href.startsWith('/')) href = BASE + href;
    return `<a href="${href}">${inner}</a>`;
  }
  if (VOID.has(tag)) return `<${tag}>`;
  if (BLOCK.has(tag) || INLINE.has(tag)) {
    if (!inner.trim() && !VOID.has(tag)) return '';
    return `<${tag}>${inner}</${tag}>`;
  }
  return inner; // unwrap div/span/section/etc.
}

function cleanBody(html, imgs) {
  const root = parse(html, { blockTextElements: { style: false, script: false } });
  root.querySelectorAll('style,script,noscript').forEach((n) => n.remove());
  let out = root.childNodes.map((c) => serialize(c, imgs)).join('');
  out = out
    .replace(/ /g, ' ')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(<\/(p|h[1-6]|ul|ol|li|blockquote|figure|figcaption|pre)>)/g, '$1\n')
    .trim();
  return out;
}

// Download an image and convert it to WebP (SVGs are kept as-is). Returns the
// chosen file extension (e.g. ".webp"/".svg") or "" on failure. `destNoExt` is
// the destination path without an extension.
async function saveImg(url, destNoExt) {
  const isSvg = /\.svg($|\?)/i.test(url);
  const dest = destNoExt + (isSvg ? '.svg' : '.webp');
  if (existsSync(dest)) return isSvg ? '.svg' : '.webp';
  try {
    const res = await fetch(url, UA);
    if (!res.ok) return '';
    const buf = Buffer.from(await res.arrayBuffer());
    if (isSvg) { await writeFile(dest, buf); return '.svg'; }
    const out = await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    await writeFile(dest, out);
    return '.webp';
  } catch { return ''; }
}

async function allItems() {
  let url = `${BASE}/cinebody-blog?format=json-pretty`, out = [];
  while (url) {
    const j = await (await fetch(url, UA)).json();
    out.push(...(j.items || []));
    url = j.pagination?.nextPage ? `${BASE}${j.pagination.nextPageUrl}&format=json-pretty` : null;
  }
  return out;
}

const plain = (h) => stripEmDash(parse(h || '').structuredText.replace(/\s+/g, ' ').trim());

async function main() {
  await mkdir(OUT, { recursive: true });
  const items = await allItems();
  console.log(`Found ${items.length} posts\n`);

  for (const it of items) {
    const slug = it.urlId;
    const dir = path.join(IMG_OUT, slug);
    await mkdir(dir, { recursive: true });

    // featured image (-> WebP)
    let hero = '';
    if (it.assetUrl) {
      const e = await saveImg(it.assetUrl, path.join(dir, 'hero'));
      if (e) hero = `/blog/${slug}/hero${e}`;
    }

    // body: clean + collect inline images, download (-> WebP) + rewrite
    const imgs = new Set();
    let body = cleanBody(it.body || '', imgs);
    let n = 0;
    for (const src of imgs) {
      const e = await saveImg(src, path.join(dir, `img-${++n}`));
      if (e) body = body.split(`src="${src}"`).join(`src="/blog/${slug}/img-${n}${e}"`);
    }
    body = stripEmDash(body, { html: true });

    const title = stripEmDash((it.title || '').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'"));
    const description = plain(it.excerpt).slice(0, 300);
    const fm = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `description: ${JSON.stringify(description)}`,
      `pubDate: ${new Date(it.publishOn).toISOString().slice(0, 10)}`,
      `author: ${JSON.stringify((it.author && it.author.displayName) || 'Cinebody')}`,
      hero ? `heroImage: ${JSON.stringify(hero)}` : null,
      '---',
      '',
    ].filter((l) => l !== null).join('\n');

    await writeFile(path.join(OUT, `${slug}.md`), fm + body + '\n');
    console.log(`  ${slug}  (${imgs.size} inline img${imgs.size === 1 ? '' : 's'}${hero ? ', hero' : ''})`);
  }
  console.log(`\nDone: ${items.length} posts written to src/content/blog/`);
}

main();
