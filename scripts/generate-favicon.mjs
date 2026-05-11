// One-off favicon generator: SVG → multi-size PNG → ICO
// Run with: node scripts/generate-favicon.mjs
import sharp from "sharp";
import pngToIco from "png-to-ico";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SVG_SRC = path.join(ROOT, "public", "icon.svg");
const ICO_OUT = path.join(ROOT, "src", "app", "favicon.ico");

const SIZES = [16, 32, 48, 64];

const svgBuffer = await fs.readFile(SVG_SRC);

const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(svgBuffer, { density: 384 })
      .resize(size, size, { kernel: "lanczos3" })
      .png()
      .toBuffer()
  )
);

const ico = await pngToIco(pngs);
await fs.writeFile(ICO_OUT, ico);

console.log(`✓ Wrote ${ICO_OUT} with sizes ${SIZES.join(", ")}`);
