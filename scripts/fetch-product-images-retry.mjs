/**
 * Retry script for the 11 items that failed in fetch-product-images.mjs
 * (mostly Wikimedia HTTP 429 when downloading huge originals).
 *
 * Strategy:
 *  - Prefer the smaller `thumbnail.source` (always exists, ~640px wide).
 *  - If the URL is a /thumb/ variant pointing to a 3840px or 1280px, rewrite to 800px.
 *  - Sleep 1.5s between requests.
 *  - For "sweet-melon", replace the title with "Cantaloupe" (the Muskmelon
 *    page has no usable image).
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

const RETRIES = [
  ["white-radish-long", "fresh-vegetables", "Daikon"],
  ["green-chili-long", "fresh-vegetables", "Cayenne_pepper"],
  ["avocado", "fresh-fruits", "Avocado"],
  ["mandarin", "fresh-fruits", "Mandarin_orange"],
  ["mango", "fresh-fruits", "Mango"],
  ["orange", "fresh-fruits", "Orange_(fruit)"],
  ["papaya-yellow", "fresh-fruits", "Papaya"],
  ["pineapple", "fresh-fruits", "Pineapple"],
  ["sweet-melon", "fresh-fruits", "Cantaloupe"],
  ["watermelon", "fresh-fruits", "Watermelon"],
  ["papaya-green", "fresh-fruits", "Papaya"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchBytes(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processOne(slug, category, title) {
  // Use the MediaWiki Action API with pithumbsize — it generates a thumbnail at
  // the EXACT size requested and proxies it cleanly (no HTTP 400 / 429 issues).
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=900&titles=${encodeURIComponent(title)}&origin=*`;
  const data = await fetchJson(apiUrl);
  const pages = data?.query?.pages ?? {};
  const firstPage = Object.values(pages)[0];
  const imageUrl = firstPage?.thumbnail?.source;
  if (!imageUrl) throw new Error("no thumbnail returned by pageimages");

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
  console.log(`Retrying ${RETRIES.length} products with smaller thumbnails…\n`);
  const ok = [];
  const fail = [];

  for (const [slug, category, title] of RETRIES) {
    process.stdout.write(`  ${category.padEnd(18)} ${slug.padEnd(22)} ← ${title.padEnd(22)} `);
    try {
      const r = await processOne(slug, category, title);
      ok.push(r);
      console.log(`OK (${(r.bytes / 1024).toFixed(0)} KB)`);
    } catch (e) {
      fail.push({ slug, category, title, error: e.message });
      console.log(`FAIL — ${e.message}`);
    }
    await sleep(1500);
  }

  console.log(`\n────────────────────────────────`);
  console.log(`OK   : ${ok.length}/${RETRIES.length}`);
  console.log(`FAIL : ${fail.length}`);
  if (fail.length) {
    console.log(`\nStill failing:`);
    for (const f of fail) console.log(`  - ${f.category}/${f.slug} (${f.title}): ${f.error}`);
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
