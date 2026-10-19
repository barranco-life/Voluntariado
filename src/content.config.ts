import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Every page is a Markdown file of the repo (and of the 420 submodule), at its own path.
// The id is the file path as written, so routes keep their case and accents.
const pages = defineCollection({
  loader: glob({
    base: '.',
    pattern: ['*.md', 'Actividades/**/*.md', 'Voluntarios/**/*.md', '!CONTRIBUTING.md', '!**/node_modules/**'],
    generateId: ({ entry }) => entry,
  }),
});

export const collections = { pages };
