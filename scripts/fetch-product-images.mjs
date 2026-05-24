/**
 * One-shot script to populate /public/products/{fresh-vegetables,fresh-fruits}/*.webp
 * with images fetched from Wikipedia (Wikimedia Commons, CC-BY-SA / public-domain).
 *
 * Run: node scripts/fetch-product-images.mjs
 *
 * For each (slug, wikipediaTitle) in MAPPING:
 *   1. GET https://en.wikipedia.org/api/rest_v1/page/summary/<title>
 *   2. Read originalimage.source (or thumbnail.source as fallback)
 *   3. Download the image
 *   4. With sharp: cover-resize to 800x800, convert to WebP (quality 78)
 *   5. Write to public/products/<category>/<slug>.webp
 *
 * Logs OK/FAIL per item and prints a summary. Throttles 250ms between requests.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const PUBLIC_PRODUCTS = join(ROOT, "public", "products");

const UA =
  "DJSS-catalog-bot/1.0 (https://djshipsupply.com; miguelcarmona809v@gmail.com)";

// slug → [category-folder, wikipedia-title]
const MAPPING = [
  // Fresh vegetables
  ["beetroot", "fresh-vegetables", "Beetroot"],
  ["broccoli", "fresh-vegetables", "Broccoli"],
  ["cabbage-white", "fresh-vegetables", "Cabbage"],
  ["carrots", "fresh-vegetables", "Carrot"],
  ["celery", "fresh-vegetables", "Celery"],
  ["chayote", "fresh-vegetables", "Chayote"],
  ["chickpeas-dry", "fresh-vegetables", "Chickpea"],
  ["chili-pepper-hot", "fresh-vegetables", "Chili_pepper"],
  ["cauliflower", "fresh-vegetables", "Cauliflower"],
  ["corn-young", "fresh-vegetables", "Baby_corn"],
  ["cucumbers", "fresh-vegetables", "Cucumber"],
  ["dill-fresh", "fresh-vegetables", "Dill"],
  ["eggplants", "fresh-vegetables", "Eggplant"],
  ["garlic-dry", "fresh-vegetables", "Garlic"],
  ["ginger-fresh", "fresh-vegetables", "Ginger"],
  ["lemon-grass", "fresh-vegetables", "Lemongrass"],
  ["lemons-yellow", "fresh-vegetables", "Lemon"],
  ["lettuce", "fresh-vegetables", "Lettuce"],
  ["okra-fresh", "fresh-vegetables", "Okra"],
  ["onions-dry", "fresh-vegetables", "Onion"],
  ["parsley-fresh", "fresh-vegetables", "Parsley"],
  ["peppers-green-red", "fresh-vegetables", "Bell_pepper"],
  ["pak-choi", "fresh-vegetables", "Bok_choy"],
  ["potatoes-fresh", "fresh-vegetables", "Potato"],
  ["pumpkins", "fresh-vegetables", "Pumpkin"],
  ["spinach", "fresh-vegetables", "Spinach"],
  ["string-beans", "fresh-vegetables", "Green_bean"],
  ["spring-onions", "fresh-vegetables", "Scallion"],
  ["tomatoes-cherry", "fresh-vegetables", "Cherry_tomato"],
  ["tomatoes-half-ripe", "fresh-vegetables", "Tomato"],
  ["tomatoes-red", "fresh-vegetables", "Tomato"],
  ["zucchini", "fresh-vegetables", "Zucchini"],
  ["white-radish-long", "fresh-vegetables", "Daikon"],
  ["green-chili-long", "fresh-vegetables", "Cayenne_pepper"],
  ["leeks", "fresh-vegetables", "Leek"],
  // Fresh fruits
  ["apple-red", "fresh-fruits", "Apple"],
  ["avocado", "fresh-fruits", "Avocado"],
  ["bananas", "fresh-fruits", "Banana"],
  ["mandarin", "fresh-fruits", "Mandarin_orange"],
  ["mango", "fresh-fruits", "Mango"],
  ["orange", "fresh-fruits", "Orange_(fruit)"],
  ["papaya-yellow", "fresh-fruits", "Papaya"],
  ["pears", "fresh-fruits", "Pear"],
  ["pineapple", "fresh-fruits", "Pineapple"],
  ["sweet-melon", "fresh-fruits", "Muskmelon"],
  ["watermelon", "fresh-fruits", "Watermelon"],
  ["papaya-green", "fresh-fruits", "Papaya"],
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchBytes(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

async function processOne(slug, category, title) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summary = await fetchJson(summaryUrl);
  const imageUrl = summary.originalimage?.source ?? summary.thumbnail?.source;
  if (!imageUrl) throw new Error("no image in summary");

  const bytes = await fetchBytes(imageUrl);
  const outDir = join(PUBLIC_PRODUCTS, category);
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.webp`);

  const out = await sharp(bytes)
    .resize(800, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 78 })
    .toBuffer();

  await writeFile(outPath, out);
  return { slug, category, source: imageUrl, bytes: out.length };
}

async function main() {
  console.log(`Processing ${MAPPING.length} products…\n`);
  const ok = [];
  const fail = [];

  for (const [slug, category, title] of MAPPING) {
    process.stdout.write(`  ${category.padEnd(18)} ${slug.padEnd(22)} ← ${title.padEnd(22)} `);
    try {
      const r = await processOne(slug, category, title);
      ok.push(r);
      console.log(`OK (${(r.bytes / 1024).toFixed(0)} KB)`);
    } catch (e) {
      fail.push({ slug, category, title, error: e.message });
      console.log(`FAIL — ${e.message}`);
    }
    await sleep(250);
  }

  console.log(`\n────────────────────────────────`);
  console.log(`OK   : ${ok.length}`);
  console.log(`FAIL : ${fail.length}`);
  if (fail.length) {
    console.log(`\nFailed items:`);
    for (const f of fail) console.log(`  - ${f.category}/${f.slug} (${f.title}): ${f.error}`);
  }
  const totalKb = ok.reduce((s, r) => s + r.bytes / 1024, 0);
  console.log(`\nTotal size: ${(totalKb / 1024).toFixed(2)} MB`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
