// Re-encode the site's JPEGs with mozjpeg (same as the Barranco site). Same names and pixel sizes,
// so no URL changes; a file is rewritten only when that saves at least 15%. The 420 photos belong
// to barranco-life/420 and are left alone. Run by hand after adding photos:
//   node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

for (const dir of ['assets', 'Actividades/assets']) {
  for (const f of readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f))) {
    const p = join(dir, f);
    const before = readFileSync(p);
    const after = await sharp(before).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer();
    if (after.length < before.length * 0.85) {
      writeFileSync(p, after);
      console.log(`${p}: ${Math.round(before.length / 1024)} -> ${Math.round(after.length / 1024)} KiB`);
    }
  }
}
