// One-time prep: copy Squarespace paste-ready fragments into the Astro project,
// download all Squarespace-CDN images locally, and rewrite those URLs to /assets/.
// Vimeo / vumbnail / Calendly / cdnjs / carto URLs are intentionally left external.
//
// Usage: node scripts/prep-fragments.mjs
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { stripEmDash } from './strip-emdash.mjs';

// Raster images above this size get re-encoded to WebP (capped at 1600px wide).
const WEBP_THRESHOLD = 120 * 1024;
const RASTER_RE = /\.(png|jpe?g)$/i;

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.resolve(ROOT, '../v2/paste-ready');
const FRAG_OUT = path.join(ROOT, 'src/fragments');
const ASSET_OUT = path.join(ROOT, 'public/assets');

// page-*.html  ->  route-based fragment name
const ROUTE_MAP = {
  'page-homepage.html': 'homepage.html',
  'page-software.html': 'software.html',
  'page-services.html': 'services.html',
  'page-pricing.html': 'pricing.html',
  'page-cs-rc.html': 'royal-caribbean.html',
  'page-cs-pointme.html': 'pointme.html',
  'page-cs-nike.html': 'nike.html',
  'page-cs-gp.html': 'georgia-pacific.html',
  'page-cs-dell.html': 'dell.html',
  'page-cs-altra.html': 'altra.html',
  'page-cs-cogent.html': 'cogent.html',
  'page-cs-crocs.html': 'crocs.html',
  'page-cs-sploot.html': 'sploot.html',
  'page-knowledge-base.html': 'knowledge-base.html',
  'page-patents.html': 'patents.html',
  'page-privacy.html': 'privacy-policy.html',
  'page-terms.html': 'terms-of-service.html',
  'page-create-projects.html': 'create-projects.html',
  'page-android.html': 'android.html',
  'page-404.html': '404.html',
};

const SQSP_RE = /https:\/\/images\.squarespace-cdn\.com\/[^"'\s)]+/g;

function localNameFor(url) {
  // strip query, take basename, decode, sanitize; prefix short hash for uniqueness
  const noQuery = url.split('?')[0];
  let base = decodeURIComponent(noQuery.split('/').pop() || 'img');
  base = base.replace(/%2B|\+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
  if (!/\.(png|jpe?g|webp|svg|gif|avif)$/i.test(base)) base += '.png';
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${hash}-${base}`;
}

// Build FAQPage JSON-LD from a page's FAQ accordion markup (.faq-q / .faq-a-inner)
// so answer engines + Google can read the Q&A as structured data.
function faqSchema(html) {
  const items = [];
  const re = /class="faq-q">([\s\S]*?)<span class="faq-icon">[\s\S]*?<div class="faq-a-inner">([\s\S]*?)<\/div>/g;
  const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  let m;
  while ((m = re.exec(html))) {
    const q = strip(m[1]), a = strip(m[2]);
    if (q && a) items.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
  }
  if (items.length < 2) return '';
  return '\n<script type="application/ld+json">' +
    JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items }) +
    '</script>\n';
}

async function main() {
  await mkdir(FRAG_OUT, { recursive: true });
  await mkdir(ASSET_OUT, { recursive: true });

  // 1. Gather every distinct SQSP url across all source files + global footer
  const files = (await readdir(SRC)).filter((f) => f.startsWith('page-') && f.endsWith('.html'));
  const allText = (
    await Promise.all([...files, 'global-footer.html'].map((f) => readFile(path.join(SRC, f), 'utf8')))
  ).join('\n');
  const urls = [...new Set(allText.match(SQSP_RE) || [])].filter((u) => u.length > 60); // drop the truncated stub

  // 2. Download each, build url -> /assets/local map. Heavy rasters become WebP.
  const map = new Map();
  let ok = 0, fail = 0;
  for (const url of urls) {
    const local = localNameFor(url);
    const webpLocal = local.replace(RASTER_RE, '.webp');
    const dest = path.join(ASSET_OUT, local);
    const webpDest = path.join(ASSET_OUT, webpLocal);

    // Idempotent: reuse whichever variant already exists.
    if (existsSync(webpDest)) { map.set(url, `/assets/${webpLocal}`); ok++; continue; }
    if (existsSync(dest)) { map.set(url, `/assets/${local}`); ok++; continue; }

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (RASTER_RE.test(local) && buf.length > WEBP_THRESHOLD) {
        const out = await sharp(buf)
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        await writeFile(webpDest, out);
        map.set(url, `/assets/${webpLocal}`);
        console.log(`  webp ${webpLocal}  (${(buf.length / 1024).toFixed(0)}kb -> ${(out.length / 1024).toFixed(0)}kb)`);
      } else {
        await writeFile(dest, buf);
        map.set(url, `/assets/${local}`);
        console.log(`  ok   ${local}  (${(buf.length / 1024).toFixed(0)}kb)`);
      }
      ok++;
    } catch (e) {
      fail++;
      console.log(`  FAIL ${url} -> ${e.message}`);
    }
  }
  console.log(`\nAssets: ${ok} ok, ${fail} failed, ${urls.length} total\n`);

  // 2b. Homepage CTA marquee builds image URLs from a CDN prefix + suffix array
  // in JS, so the scan above misses them. Download those 6 stills and remember a
  // prefix rewrite that swaps the array values + concatenation to local paths.
  const CTA_PREFIX = 'https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/';
  const CTA_STILLS = [
    '1767306067842-W3N6CINAWS6FJ5O6Q484/CB_HowItWorxxx_LB_600.01_00_34_07.Still006.jpg',
    '1767306067373-3MRS4UVWV56617AA85XS/CB_HowItWorxxx_LB_600.01_00_34_01.Still005.jpg',
    '1767306065468-1HKIBXXJSUM9GFEZ2CTI/CB_HowItWorxxx_LB_600.01_00_33_16.Still004.jpg',
    '1767306070881-BK5GKCA5ECJQRMP9WY2H/CB_HowItWorxxx_LB_600.01_00_37_10.Still009.jpg',
    '1767306070087-YSRR51XA0NJGJ0ZBXRZ6/CB_HowItWorxxx_LB_600.01_00_34_22.Still008.jpg',
    '1767306069318-SEP54C57M1PLPEUXU5Z2/CB_HowItWorxxx_LB_600.01_00_34_14.Still007.jpg',
  ];
  const ctaReplacements = []; // [origArrayValue, localPath]
  for (const s of CTA_STILLS) {
    const name = 'cta-' + s.split('/').pop().match(/Still\d+/)[0].toLowerCase() + '.jpg';
    const dest = path.join(ASSET_OUT, name);
    if (!existsSync(dest)) {
      try {
        const res = await fetch(CTA_PREFIX + s, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok) await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      } catch { /* leave original if fetch fails */ }
    }
    ctaReplacements.push([`'${s}'`, `'/assets/${name}'`]);
  }

  // 3. Copy fragments with rewritten URLs
  for (const [srcName, outName] of Object.entries(ROUTE_MAP)) {
    const srcPath = path.join(SRC, srcName);
    if (!existsSync(srcPath)) { console.log(`  skip (missing): ${srcName}`); continue; }
    let html = await readFile(srcPath, 'utf8');
    for (const [url, local] of map) html = html.split(url).join(local);
    if (outName === 'homepage.html') {
      for (const [from, to] of ctaReplacements) html = html.split(from).join(to);
      // suffix array now holds full local paths; drop the CDN prefix concatenation
      html = html.split("img.src='" + CTA_PREFIX + "'+s").join('img.src=s');
      // Defer the 30 hero-scroller background videos: src -> data-src so they
      // load after first paint / when near view (loader lives in Base.astro),
      // letting the poster thumbnails win the initial render.
      html = html.split('<iframe src="https://player.vimeo.com/video/').join('<iframe title="Cinebody customer video" data-src="https://player.vimeo.com/video/');
      // Responsive hero thumbnails: the cards render ~300px on desktop but ~33vw
      // on mobile, so give the browser smaller Vimeo sizes to choose from. Keeps
      // the 640px source for desktop/retina (no quality change there); phones
      // pull a 320/480px file instead. Vimeo serves these via the -d_NNN suffix.
      html = html.replace(
        /<img src="(https:\/\/i\.vimeocdn\.com\/video\/[^"]+?)-d_640"/g,
        (m, b) => `<img src="${b}-d_640" srcset="${b}-d_320 320w, ${b}-d_480 480w, ${b}-d_640 640w" sizes="(max-width: 767px) 33vw, 300px" decoding="async"`
      );
      // The first thumbnail in each of the 3 columns sits at the top of the
      // scroller (the mobile fold) and is the LCP candidate. Lazy-loading
      // deprioritizes it, so make just those three eager + high priority.
      html = html.replace(
        /(<div class="hero-scroller-col">[\s\S]*?<div class="scr-card"><img [\s\S]*?)loading="lazy"/g,
        '$1loading="eager" fetchpriority="high"'
      );
      // a11y: the logo marquee images are built in JS without an alt attribute.
      // Mark them decorative (the brands are named in the visible "Trusted by" line).
      html = html.split('img.draggable=false; t.appendChild(img);').join("img.draggable=false; img.alt=''; t.appendChild(img);");
      // a11y heading order: the case-study teaser headline is <h3><em> right after
      // the hero <h1> (skips h2). Promote it to <h2>, and rename its CSS selectors
      // so the look is unchanged. (<h3><em> is unique to teasers.)
      html = html.replace(/<h3><em>([\s\S]*?)<\/h3>/g, '<h2><em>$1</h2>');
      html = html.split('.teaser--light h3').join('.teaser--light h2').split('.teaser h3').join('.teaser h2');
    }
    html = stripEmDash(html, { html: true });
    html += faqSchema(html); // appends FAQPage JSON-LD on pages that have an FAQ
    await writeFile(path.join(FRAG_OUT, outName), html);
    console.log(`  frag ${srcName} -> ${outName}`);
  }

  // 4. Emit the rewritten global footer for the layout to consume
  let footer = await readFile(path.join(SRC, 'global-footer.html'), 'utf8');
  for (const [url, local] of map) footer = footer.split(url).join(local);
  footer = stripEmDash(footer, { html: true });
  await writeFile(path.join(FRAG_OUT, '_footer.html'), footer);
  console.log('  frag global-footer.html -> _footer.html');
}

main();
