import type { APIRoute } from 'astro';
import { STATIC_OG, ogFileSlug } from '../../og/entries';
import { renderOG } from '../../og/template';

export function getStaticPaths() {
  return Object.entries(STATIC_OG).map(([urlSlug, data]) => ({
    params: { slug: ogFileSlug(urlSlug) },
    props: data,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle: string };
  const png = await renderOG(title, subtitle);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
