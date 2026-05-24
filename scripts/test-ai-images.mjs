/**
 * Test batch: generate 6 representative products with Pollinations.ai (Flux Schnell, free).
 * Output goes to /public/products/_test-ai/ so it doesn't overwrite the current photos.
 *
 * If Miguel likes the style, the same prompt template is used for the full 235.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const OUT_DIR = join(ROOT, "public", "products", "_test-ai");

const UA = "DJSS-catalog-bot/1.0";

// [filename-slug, prompt-subject]
const TESTS = [
  ["tomatoes-red", "fresh ripe red tomato, single piece, with green stem"],
  ["bananas", "bunch of fresh yellow bananas"],
  ["chicken-breast", "raw fresh chicken breast fillet, single piece"],
  ["mozzarella-cheese", "fresh ball of mozzarella cheese in clear water"],
  ["coca-cola-regular", "classic red Coca-Cola glass bottle"],
  ["beer-heineken", "Heineken green beer bottle with iconic green label"],
];

const STYLE = "studio product photography, plain pure white seamless background, top-down centered composition, soft natural lighting, sharp focus, high detail, premium grocery catalog style, professional, commercial photography, no text, no labels visible, no watermark, square format";

function buildUrl(prompt) {
  const params = new URLSearchParams({
    width: "800",
    height: "800",
    model: "flux",
    nologo: "true",
    enhance: "false",
    safe: "true",
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

async function generate(slug, subject) {
  const fullPrompt = `${subject}. ${STYLE}`;
  const url = buildUrl(fullPrompt);
  process.stdout.write(`  ${slug.padEnd(22)} `);
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  const out = await sharp(bytes)
    .resize(800, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 80 })
    .toBuffer();
  const outPath = join(OUT_DIR, `${slug}.webp`);
  await writeFile(outPath, out);
  console.log(`OK (${(out.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Generating ${TESTS.length} test images with Flux (Pollinations.ai)…\n`);
  for (const [slug, subject] of TESTS) {
    try {
      await generate(slug, subject);
    } catch (e) {
      console.log(`FAIL — ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  console.log(`\nDone. Open: public/products/_test-ai/`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
