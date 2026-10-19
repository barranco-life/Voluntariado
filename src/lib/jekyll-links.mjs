// Rewrites relative links the way GitHub Pages (jekyll-relative-links) did, so the Markdown keeps
// working on GitHub and on the site: a link to an existing X.md becomes /X.html (a README.md
// becomes its folder, /dir/), and a relative image becomes a root path served from the repo copy.
// Other links (../, anchors, external) are left as written. A Sätteri mdast plugin.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const SKIP = /^([a-z][a-z0-9+.-]*:|\/|#)/i;

export const jekyllLinks = ({ fileURL }) => {
  if (!fileURL) return null;
  const dir = path.dirname(fileURLToPath(fileURL));
  const toRoot = (target) => '/' + path.relative(ROOT, path.resolve(dir, decodeURI(target))).split(path.sep).join('/');
  return {
    name: 'jekyll-links',
    link(node, ctx) {
      if (!node.url || SKIP.test(node.url)) return;
      const [target, hash] = node.url.split('#');
      if (!/\.md$/i.test(target) || !existsSync(path.resolve(dir, decodeURI(target)))) return;
      const rel = toRoot(target);
      const url = /(^|\/)README\.md$/i.test(rel) ? rel.replace(/README\.md$/i, '') : rel.replace(/\.md$/i, '.html');
      ctx.setProperty(node, 'url', encodeURI(url) + (hash !== undefined ? '#' + hash : ''));
    },
    image(node, ctx) {
      if (!node.url || SKIP.test(node.url)) return;
      ctx.setProperty(node, 'url', encodeURI(toRoot(node.url)));
    },
  };
};
