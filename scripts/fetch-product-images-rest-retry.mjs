/**
 * Retry the 34 items that failed in fetch-product-images-rest.mjs
 * (Wikipedia articles whose infobox has no "page image").
 *
 * Uses alternative titles that DO have lead images.
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
  ["pork-liver", "meat", "Liver"],
  ["eggs", "dairy", "Chicken_egg"],
  ["parmesan-cheese-powder", "dairy", "Parmesan"],
  ["yogurt-greek", "dairy", "Strained_yogurt"],
  ["frankfurter-sausages-pork", "grocery", "Vienna_sausage"],
  ["luncheon-meat-chicken", "grocery", "Spam_(food)"],
  ["tuna-in-oil", "grocery", "Tuna"],
  ["fruit-cocktail", "grocery", "Fruit_salad"],
  ["toast-bread", "grocery", "Bread"],
  ["phyllo-leaves", "grocery", "Filo"],
  ["yeast-dry", "grocery", "Yeast"],
  ["cooking-wine", "grocery", "Wine"],
  ["coffee-creamer", "grocery", "Non-dairy_creamer"],
  ["coffee-greek-espresso", "grocery", "Espresso"],
  ["tea-lipton-yellow", "grocery", "Black_tea"],
  ["cocoa-powder", "grocery", "Cocoa_bean"],
  ["nutella", "grocery", "Hazelnut_spread"],
  ["jelly", "grocery", "Fruit_preserves"],
  ["white-beans-giant", "grocery", "Cannellini_bean"],
  ["white-beans-small", "grocery", "Navy_bean"],
  ["fabric-softener", "cleaning", "Laundry"],
  ["scrubbing-brush", "cleaning", "Brush"],
  ["deodorant", "cleaning", "Antiperspirant"],
  ["cigarettes-marlboro", "bonded", "Marlboro"],
  ["cigarettes-lm", "bonded", "L%26M_(cigarette)"],
  ["cigarettes-camel", "bonded", "Camel_(brand)"],
  ["beer-heineken", "bonded", "Heineken_Pilsener"],
  ["beer-corona", "bonded", "Corona_Extra"],
  ["beer-budweiser", "bonded", "Budweiser_(Anheuser-Busch)"],
  ["rum-barcelo", "bonded", "Rum"],
  ["rum-brugal", "bonded", "Rum"],
  ["whisky-jw-red", "bonded", "Scotch_whisky"],
  ["whisky-jw-black", "bonded", "Scotch_whisky"],
  ["whisky-jd", "bonded", "Tennessee_whiskey"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchBytes(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for image`);
  return Buffer.from(await res.arrayBuffer());
}

async function processOne(slug, category, title) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=900&titles=${encodeURIComponent(title)}&origin=*`;
  const data = await fetchJson(apiUrl);
  const pages = data?.query?.pages ?? {};
  const firstPage = Object.values(pages)[0];
  const imageUrl = firstPage?.thumbnail?.source;
  if (!imageUrl) throw new Error("no thumbnail returned");

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
  console.log(`Retrying ${RETRIES.length} products with alternative Wikipedia titles…\n`);
  const ok = [];
  const fail = [];

  for (const [slug, category, title] of RETRIES) {
    process.stdout.write(`  ${category.padEnd(10)} ${slug.padEnd(28)} ← ${title.padEnd(32)} `);
    try {
      const r = await processOne(slug, category, title);
      ok.push(r);
      console.log(`OK (${(r.bytes / 1024).toFixed(0)} KB)`);
    } catch (e) {
      fail.push({ slug, category, title, error: e.message });
      console.log(`FAIL — ${e.message}`);
    }
    await sleep(1200);
  }

  console.log(`\n────────────────────────────────`);
  console.log(`OK   : ${ok.length}/${RETRIES.length}`);
  console.log(`FAIL : ${fail.length}`);
  if (fail.length) {
    console.log(`\nStill failing (will use fallback avatar):`);
    for (const f of fail) console.log(`  - ${f.category}/${f.slug} (${f.title}): ${f.error}`);
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
