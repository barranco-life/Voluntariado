// Route, title, description and image for a Markdown page, read from the file itself (the old
// site had no front matter: the title came from the first heading).
export const SITE_NAME = 'Voluntariado Barranco';
export const REPO = 'https://github.com/barranco-life/Voluntariado';
const SUBMODULE = 'Actividades/420/';
const REPO_420 = 'https://github.com/barranco-life/420';

export const isReadme = (id: string) => /(^|\/)README\.md$/i.test(id);

/** Public path: '/', '/Actividades/420/', '/VISION.html'. */
export function pathFor(id: string): string {
  if (isReadme(id)) return '/' + id.replace(/README\.md$/i, '');
  return '/' + id.replace(/\.md$/i, '.html');
}

/** Where the source of a page can be read and improved. */
export function sourceUrl(id: string): string {
  if (id.startsWith(SUBMODULE)) return `${REPO_420}/blob/main/${id.slice(SUBMODULE.length)}`;
  return `${REPO}/blob/main/${id}`;
}

/** The 420 repo's own README is in English; everything else is Spanish. */
export function langFor(id: string): string {
  return id === `${SUBMODULE}README.md` ? 'en' : 'es';
}

const strip = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export function titleFor(body: string): string {
  const h1 = body.match(/^#\s+(.+)$/m);
  return h1 ? strip(h1[1]) : SITE_NAME;
}

/** First real paragraph after the heading, cut at a word near 160 characters. */
export function descriptionFor(body: string): string {
  const blocks = body.replace(/<!--[\s\S]*?-->/g, '').split(/\n\s*\n/);
  for (const raw of blocks) {
    const b = raw.trim();
    if (!b || /^(#|!|>|\||-|\*|_|\[[^\]]*\]\([^)]*\)\s*>|---)/.test(b)) continue;
    const text = strip(b);
    if (text.length < 40) continue;
    if (text.length <= 160) return text;
    return text.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  }
  return 'Comunidad abierta de actividades colaborativas y autogestionadas en el Proyecto Cultural Barranco (Mallasa, La Paz).';
}

/** First image of the page, as a root path (relative images become root paths like the links). */
export function imageFor(id: string, body: string): string {
  const m = body.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
  if (!m || /^[a-z]+:/i.test(m[1])) return '/assets/README.jpg';
  if (m[1].startsWith('/')) return m[1];
  const base = id.split('/').slice(0, -1);
  for (const part of m[1].split('/')) {
    if (part === '.' || part === '') continue;
    if (part === '..') base.pop();
    else base.push(part);
  }
  return '/' + base.join('/');
}
