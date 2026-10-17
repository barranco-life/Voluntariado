// URL contract for the move from Jekyll: every URL of the old site (scripts/legacy-urls.txt) must
// exist in dist/, and every file in dist/ must be an old URL or a declared new one. Run after build.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const NEW = [/^\/404\.html$/, /^\/robots\.txt$/, /^\/sitemap-(index|0)\.xml$/, /^\/_astro\//];

const legacy = readFileSync('scripts/legacy-urls.txt', 'utf8')
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

const built = [];
(function walk(rel) {
  for (const name of readdirSync(path.join(DIST, rel))) {
    const r = `${rel}/${name}`;
    if (statSync(path.join(DIST, r)).isDirectory()) walk(r);
    else built.push(r);
  }
})('');

const missing = legacy.filter((u) => !existsSync(path.join(DIST, u)));
const undeclared = built.filter((u) => !legacy.includes(u) && !NEW.some((re) => re.test(u)));

console.log(`legacy URLs: ${legacy.length} · built files: ${built.length}`);
for (const u of missing) console.error(`MISSING  ${u}`);
for (const u of undeclared) console.error(`NEW, NOT DECLARED  ${u}`);
if (missing.length || undeclared.length) process.exit(1);
console.log('URL contract: OK (every old URL is in dist/, every new file is declared)');
