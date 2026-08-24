// Build-time Open Graph image generator: satori (JSX-ish -> SVG) + resvg (SVG -> PNG).
// One branded 1200x630 card per page, with the page title + a short subtitle.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Read from the project's src at build time (cwd is the Astro project root).
const font = (f: string) => readFileSync(join(process.cwd(), 'src/og-fonts', f));
const fonts = [
  { name: 'Plus Jakarta Sans', data: font('plus-jakarta-regular.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Plus Jakarta Sans', data: font('plus-jakarta-bold.ttf'), weight: 700 as const, style: 'normal' as const },
  { name: 'Plus Jakarta Sans', data: font('plus-jakarta-extrabold.ttf'), weight: 800 as const, style: 'normal' as const },
];

// tiny hyperscript so we don't need a JSX runtime in a .ts file
const h = (type: string, props: any = {}, ...children: any[]) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

export async function renderOG(title: string, subtitle?: string): Promise<Buffer> {
  const titleSize = title.length > 46 ? 56 : title.length > 30 ? 64 : 72;
  const tri = (bg: string) => h('div', { style: { display: 'flex', flex: 1, background: bg } });

  const tree = h(
    'div',
    {
      style: {
        height: '630px', width: '1200px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '76px 80px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #041a24 100%)',
        fontFamily: 'Plus Jakarta Sans', color: '#fff',
      },
    },
    h('div', { style: { display: 'flex', fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' } }, 'cinebody'),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h('div', { style: { display: 'flex', fontSize: `${titleSize}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '1010px', color: '#fff' } }, title),
      subtitle
        ? h('div', { style: { display: 'flex', fontSize: '30px', fontWeight: 400, lineHeight: 1.4, marginTop: '26px', maxWidth: '940px', color: 'rgba(255,255,255,0.62)' } }, subtitle)
        : h('div', { style: { display: 'flex' } }),
    ),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      h('div', { style: { display: 'flex', height: '6px', width: '240px', borderRadius: '3px', overflow: 'hidden' } }, tri('#00bcf1'), tri('#ffec03'), tri('#eb008b')),
      h('div', { style: { display: 'flex', fontSize: '26px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' } }, 'cinebody.com'),
    ),
  );

  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}
