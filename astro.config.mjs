// Voluntariado Barranco (Astro). The pages are the Markdown files of this repo, where they always
// were (README.md is the home), so the repo still reads well on GitHub and every URL of the old
// Jekyll site stays the same: X.md -> /X.html, a folder's README.md -> /folder/.
// The URL contract lives in ER (Projects/SitesRefresh/Voluntariado_URLs.md).
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { jekyllLinks } from './src/lib/jekyll-links.mjs';
import { repoFiles } from './src/lib/repo-files.mjs';

export default defineConfig({
  site: 'https://voluntariado.barranco.life',
  // /VISION.html, as GitHub Pages served it; Pages also answers /VISION and redirects /dir to /dir/.
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  output: 'static',
  markdown: {
    processor: satteri({ mdastPlugins: [jekyllLinks] }),
  },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404.html') }), repoFiles()],
});
