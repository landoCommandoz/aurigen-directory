/**
 * Builds the app icons from the designer's artwork (src/design/icon.svg) with sharp.
 *
 *   npm run icons
 *
 * Writes into public/icons/ (app-engineer's directory; the outputs are small and committed):
 *   icon-192.png          192 px, manifest icon (purpose any and maskable)
 *   icon-512.png          512 px, manifest icon (purpose any and maskable)
 *   apple-touch-icon.png  180 px, the iPhone Home Screen icon (D3)
 *   favicon.svg           the artwork itself, for desktop browser tabs
 *
 * The artwork bleeds to every edge and keeps its mark inside the maskable safe circle
 * (src/design/icon.svg says how), so one image serves both manifest purposes.
 * iOS paints any transparent pixel black, so every PNG is flattened onto the base color.
 * That color is read from src/design/tokens.css (--base), never typed here.
 */
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = join(root, 'src', 'design', 'icon.svg');
const tokens = join(root, 'src', 'design', 'tokens.css');
const outDir = join(root, 'public', 'icons');

interface Target {
  file: string;
  size: number;
}

const TARGETS: readonly Target[] = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

/** Reads one hex color token from tokens.css, such as --base. */
export function readHexToken(css: string, name: string): string {
  const pattern = new RegExp(`${name.replace(/[-]/g, '\\-')}\\s*:\\s*(#[0-9a-fA-F]{6})\\b`);
  const match = pattern.exec(css);
  if (!match?.[1]) throw new Error(`${name} is not a 6-digit hex color in src/design/tokens.css`);
  return match[1].toLowerCase();
}

async function main(): Promise<void> {
  const svg = readFileSync(source);
  const base = readHexToken(readFileSync(tokens, 'utf8'), '--base');
  mkdirSync(outDir, { recursive: true });

  for (const target of TARGETS) {
    const out = join(outDir, target.file);
    // Render at the SVG's own 512 px viewBox scaled to the target density, so edges stay crisp.
    const density = Math.max(72, Math.ceil((72 * target.size) / 512) * 2);
    await sharp(svg, { density })
      .resize(target.size, target.size, { fit: 'cover' })
      .flatten({ background: base })
      .png({ compressionLevel: 9, palette: false })
      .toFile(out);
    const meta = await sharp(out).metadata();
    if (meta.width !== target.size || meta.height !== target.size || meta.hasAlpha === true) {
      throw new Error(`${target.file}: expected ${target.size}x${target.size} with no alpha, got ${meta.width}x${meta.height} alpha=${String(meta.hasAlpha)}`);
    }
    console.log(`wrote ${relative(root, out)} (${target.size} px, ${statSync(out).size} bytes)`);
  }

  const favicon = join(outDir, 'favicon.svg');
  copyFileSync(source, favicon);
  console.log(`wrote ${relative(root, favicon)} (copy of src/design/icon.svg)`);
}

main().catch((error: unknown) => {
  console.error('icons: failed', error);
  process.exitCode = 1;
});
