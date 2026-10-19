// Copies the repo's own files that the old site served as they are (photos, the raw Markdown,
// LICENSE files, CNAME) into the build at the same paths. Jekyll published everything except
// dot/underscore files; this keeps the same set without moving any file out of its folder.
import { cpSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIP_DIRS = new Set(['node_modules', 'dist', 'src', 'public', 'scripts', 'vendor']);
const KEEP = /\.(md|jpe?g|png|gif|webp|svg|pdf)$|^(LICENSE|CNAME)$/i;
const SKIP_FILES = new Set(['package.json', 'package-lock.json', 'tsconfig.json', 'astro.config.mjs']);

function walk(root, rel, out) {
  for (const name of readdirSync(path.join(root, rel))) {
    if (name.startsWith('.') || name.startsWith('_')) continue;
    const r = rel ? `${rel}/${name}` : name;
    const st = statSync(path.join(root, r));
    if (st.isDirectory()) {
      if (!rel && SKIP_DIRS.has(name)) continue;
      walk(root, r, out);
    } else if (KEEP.test(name) && !SKIP_FILES.has(name)) out.push(r);
  }
  return out;
}

export function repoFiles() {
  return {
    name: 'repo-files',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = process.cwd();
        const outDir = fileURLToPath(dir);
        const files = walk(root, '', []);
        for (const r of files) {
          mkdirSync(path.dirname(path.join(outDir, r)), { recursive: true });
          cpSync(path.join(root, r), path.join(outDir, r));
        }
        logger.info(`copied ${files.length} repo files`);
      },
    },
  };
}
