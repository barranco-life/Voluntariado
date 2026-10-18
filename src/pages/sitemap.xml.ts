// One sitemap built from the same page list as the routes, so every URL is exactly the page's URL
// (/VISION.html, /Actividades/Yoga.html). The 420 copy is canonical at 420.barranco.life: left out.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { pathFor } from '../lib/page-meta';

export const GET: APIRoute = async ({ site }) => {
  const pages = await getCollection('pages', (p) => !p.id.startsWith('Actividades/420/'));
  const urls = pages
    .map((p) => new URL(encodeURI(pathFor(p.id)), site).href)
    .sort()
    .map((u) => `  <url><loc>${u}</loc></url>`);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
