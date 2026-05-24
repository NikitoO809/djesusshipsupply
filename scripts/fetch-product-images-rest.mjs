/**
 * Fetch images for the remaining ~195 products in the catalog
 * (everything except fresh-vegetables + fresh-fruits, which were done by
 * fetch-product-images.mjs and fetch-product-images-retry.mjs).
 *
 * Uses the MediaWiki Action API with pithumbsize=900 (the same endpoint that
 * worked reliably in the retry script). Sleeps 1.2s between requests.
 *
 * Run: node scripts/fetch-product-images-rest.mjs
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const PUBLIC_PRODUCTS = join(ROOT, "public", "products");

const UA =
  "DJSS-catalog-bot/1.0 (https://djshipsupply.com; miguelcarmona809v@gmail.com)";

// [slug, category, wikipediaTitle]
const MAPPING = [
  // ---------- frozen-vegetables ----------
  ["broccoli", "frozen-vegetables", "Broccoli"],
  ["cauliflower", "frozen-vegetables", "Cauliflower"],
  ["corn-on-cob", "frozen-vegetables", "Sweet_corn"],
  ["green-beans", "frozen-vegetables", "Green_bean"],
  ["green-peas", "frozen-vegetables", "Pea"],
  ["carrots", "frozen-vegetables", "Carrot"],
  ["mixed", "frozen-vegetables", "Frozen_vegetables"],
  ["okra", "frozen-vegetables", "Okra"],
  ["potatoes", "frozen-vegetables", "French_fries"],
  ["spinach", "frozen-vegetables", "Spinach"],
  ["corn-kernels", "frozen-vegetables", "Maize"],

  // ---------- meat ----------
  ["beef-boneless", "meat", "Beef"],
  ["pork-liver", "meat", "Liver_(food)"],
  ["beef-minced", "meat", "Ground_beef"],
  ["beef-oxtail", "meat", "Oxtail"],
  ["beef-striploins", "meat", "Strip_steak"],
  ["beef-tongues", "meat", "Beef_tongue"],
  ["chicken-legs", "meat", "Chicken_as_food"],
  ["chicken-whole", "meat", "Roast_chicken"],
  ["chicken-breast", "meat", "Chicken_as_food"],
  ["chicken-wings", "meat", "Chicken_as_food"],
  ["lamb-chops", "meat", "Lamb_and_mutton"],
  ["lamb-legs", "meat", "Lamb_and_mutton"],
  ["pork-neck-boneless", "meat", "Pork"],
  ["pork-belly", "meat", "Pork_belly"],
  ["pork-loin-chops-boneless", "meat", "Pork_chop"],
  ["pork-neck-chop-slices", "meat", "Pork_chop"],
  ["pork-ribs", "meat", "Pork_ribs"],
  ["pork-whole", "meat", "Pork"],
  ["turkey-whole", "meat", "Turkey_as_food"],

  // ---------- frozen-fish ----------
  ["fish-fillet", "frozen-fish", "Fish_fillet"],
  ["mackerel-tilapia", "frozen-fish", "Mackerel"],
  ["octopus", "frozen-fish", "Octopus_as_food"],
  ["red-snapper", "frozen-fish", "Northern_red_snapper"],
  ["shrimps-large", "frozen-fish", "Shrimp"],
  ["squid", "frozen-fish", "Squid_as_food"],
  ["mussels", "frozen-fish", "Mussel"],

  // ---------- dairy ----------
  ["cooking-oil", "dairy", "Cooking_oil"],
  ["olive-oil-extra-virgin", "dairy", "Olive_oil"],
  ["table-butter", "dairy", "Butter"],
  ["eggs", "dairy", "Egg_as_food"],
  ["feta-cheese", "dairy", "Feta"],
  ["gouda-cheese", "dairy", "Gouda_cheese"],
  ["edam-cheese", "dairy", "Edam_cheese"],
  ["mozzarella-cheese", "dairy", "Mozzarella"],
  ["parmesan-cheese-powder", "dairy", "Parmigiano_Reggiano"],
  ["ice-cream", "dairy", "Ice_cream"],
  ["milk-chocolate", "dairy", "Chocolate_milk"],
  ["milk-condensed", "dairy", "Condensed_milk"],
  ["milk-evaporated", "dairy", "Evaporated_milk"],
  ["milk-fresh-uht", "dairy", "Milk"],
  ["yogurt-fruit", "dairy", "Yogurt"],
  ["yogurt-greek", "dairy", "Greek_yogurt"],
  ["whipping-cream", "dairy", "Whipped_cream"],

  // ---------- drinks ----------
  ["coca-cola-regular", "drinks", "Coca-Cola"],
  ["coca-cola-zero", "drinks", "Coca-Cola_Zero_Sugar"],
  ["fanta-orange", "drinks", "Fanta"],
  ["7up-sprite", "drinks", "Sprite_(drink)"],
  ["juice-apple", "drinks", "Apple_juice"],
  ["juice-motion", "drinks", "Juice"],
  ["juice-orange", "drinks", "Orange_juice"],
  ["juice-pineapple", "drinks", "Pineapple_juice"],
  ["water-500ml", "drinks", "Bottled_water"],
  ["water-1-5l", "drinks", "Bottled_water"],
  ["water-5gal", "drinks", "Bottled_water"],

  // ---------- grocery (largest) ----------
  ["chicken-sausages", "grocery", "Sausage"],
  ["corned-beef", "grocery", "Corned_beef"],
  ["frankfurter-sausages-pork", "grocery", "Frankfurter_W%C3%BCrstchen"],
  ["luncheon-meat-chicken", "grocery", "Luncheon_meat"],
  ["luncheon-meat-pork", "grocery", "Spam_(food)"],
  ["salami", "grocery", "Salami"],
  ["salami-mortadella", "grocery", "Mortadella"],
  ["smoked-bacon-slices", "grocery", "Bacon"],
  ["smoked-ham-whole", "grocery", "Ham"],
  ["mackerel-in-oil", "grocery", "Canned_fish"],
  ["mackerel-in-tomato", "grocery", "Canned_fish"],
  ["tuna-in-oil", "grocery", "Canned_tuna"],
  ["fruit-cocktail", "grocery", "Fruit_cocktail"],
  ["marmalade", "grocery", "Marmalade"],
  ["olives-green", "grocery", "Olive"],
  ["olives-black", "grocery", "Olive"],
  ["mushrooms-tin", "grocery", "Edible_mushroom"],
  ["pineapple-tin", "grocery", "Pineapple"],
  ["peach-compote", "grocery", "Compote"],
  ["biscuits-dorada", "grocery", "Biscuit"],
  ["cake-mix", "grocery", "Cake"],
  ["flour-cake", "grocery", "Flour"],
  ["flour-all-purpose", "grocery", "Flour"],
  ["macaroni-elbow", "grocery", "Macaroni"],
  ["rice-long-grain-greek", "grocery", "Rice"],
  ["rice-long-grain-filipino", "grocery", "Rice"],
  ["semolina", "grocery", "Semolina"],
  ["spaghetti-no5", "grocery", "Spaghetti"],
  ["spaghetti-no10", "grocery", "Spaghetti"],
  ["spaghetti-400g", "grocery", "Spaghetti"],
  ["penne-pasta", "grocery", "Penne"],
  ["toast-bread", "grocery", "Toast"],
  ["burger-bread", "grocery", "Bun"],
  ["phyllo-leaves", "grocery", "Phyllo"],
  ["puff-pastry", "grocery", "Puff_pastry"],
  ["danish-cookies", "grocery", "Butter_cookie"],
  ["cornflakes", "grocery", "Corn_flakes"],
  ["quaker-oats", "grocery", "Oat"],
  ["popcorn", "grocery", "Popcorn"],
  ["noodles", "grocery", "Noodle"],
  ["spring-rolls", "grocery", "Spring_roll"],
  ["baking-powder", "grocery", "Baking_powder"],
  ["baking-soda", "grocery", "Sodium_bicarbonate"],
  ["yeast-dry", "grocery", "Baker%27s_yeast"],
  ["corn-starch", "grocery", "Corn_starch"],
  ["black-pepper-powder", "grocery", "Black_pepper"],
  ["black-pepper-whole", "grocery", "Black_pepper"],
  ["cinnamon-stick", "grocery", "Cinnamon"],
  ["cloves", "grocery", "Clove"],
  ["dry-oregano", "grocery", "Oregano"],
  ["garlic-powder", "grocery", "Garlic_powder"],
  ["paprika-powder", "grocery", "Paprika"],
  ["curry-powder", "grocery", "Curry_powder"],
  ["ajinomoto", "grocery", "Monosodium_glutamate"],
  ["salt-cooking", "grocery", "Salt"],
  ["salt-table", "grocery", "Salt"],
  ["maggi-cubes-beef", "grocery", "Bouillon_cube"],
  ["maggi-cubes-chicken", "grocery", "Bouillon_cube"],
  ["sauce-bbq", "grocery", "Barbecue_sauce"],
  ["sauce-fish", "grocery", "Fish_sauce"],
  ["sauce-ketchup", "grocery", "Ketchup"],
  ["sauce-mayonnaise", "grocery", "Mayonnaise"],
  ["sauce-mustard", "grocery", "Mustard_(condiment)"],
  ["sauce-soy", "grocery", "Soy_sauce"],
  ["sauce-soy-black-gallon", "grocery", "Soy_sauce"],
  ["sauce-thousand-island", "grocery", "Thousand_Island_dressing"],
  ["sauce-tabasco", "grocery", "Tabasco_sauce"],
  ["sauce-sweet-chili", "grocery", "Sweet_chili_sauce"],
  ["sauce-oyster", "grocery", "Oyster_sauce"],
  ["vinegar-grape", "grocery", "Vinegar"],
  ["vinegar-white", "grocery", "Vinegar"],
  ["cooking-wine", "grocery", "Cooking_wine"],
  ["tomato-paste", "grocery", "Tomato_paste"],
  ["tomato-whole", "grocery", "Canned_tomato"],
  ["coffee-creamer", "grocery", "Coffee_creamer"],
  ["coffee-instant", "grocery", "Instant_coffee"],
  ["coffee-santo-domingo", "grocery", "Coffee"],
  ["coffee-greek-espresso", "grocery", "Greek_coffee"],
  ["tea-lipton-green", "grocery", "Green_tea"],
  ["tea-lipton-yellow", "grocery", "Lipton"],
  ["cocoa-powder", "grocery", "Cocoa_solids"],
  ["sugar-brown", "grocery", "Brown_sugar"],
  ["sugar-castor", "grocery", "Sugar"],
  ["sugar-white", "grocery", "Sugar"],
  ["honey", "grocery", "Honey"],
  ["syrup-chocolate", "grocery", "Chocolate_syrup"],
  ["nutella", "grocery", "Nutella"],
  ["jelly", "grocery", "Gelatin_dessert"],
  ["lentils-dry", "grocery", "Lentil"],
  ["white-beans-giant", "grocery", "Common_bean"],
  ["white-beans-small", "grocery", "Common_bean"],
  ["split-peas-yellow", "grocery", "Split_pea"],
  ["mung-beans", "grocery", "Mung_bean"],
  ["roasted-almonds", "grocery", "Almond"],
  ["roasted-peanuts", "grocery", "Peanut"],
  ["peanut-butter", "grocery", "Peanut_butter"],
  ["walnuts-shelled", "grocery", "Walnut"],
  ["sesame-seeds", "grocery", "Sesame"],
  ["raisins", "grocery", "Raisin"],
  ["milk-powder", "grocery", "Powdered_milk"],
  ["coconut-milk-tin", "grocery", "Coconut_milk"],
  ["vanilla-liquid", "grocery", "Vanilla_extract"],

  // ---------- cleaning ----------
  ["bleach-liquid", "cleaning", "Bleach"],
  ["multi-purpose-cleaner", "cleaning", "Cleaning_agent"],
  ["bathroom-cleaner", "cleaning", "Cleaning_agent"],
  ["dish-soap", "cleaning", "Dishwashing_liquid"],
  ["floor-cleaner", "cleaning", "Cleaning_agent"],
  ["glass-cleaner", "cleaning", "Window_cleaner"],
  ["toilet-cleaner", "cleaning", "Toilet_cleaner"],
  ["laundry-detergent-powder", "cleaning", "Laundry_detergent"],
  ["laundry-detergent-liquid", "cleaning", "Laundry_detergent"],
  ["fabric-softener", "cleaning", "Fabric_softener"],
  ["air-freshener", "cleaning", "Air_freshener"],
  ["insecticide", "cleaning", "Insecticide"],
  ["mop-heads", "cleaning", "Mop"],
  ["broom-dustpan", "cleaning", "Broom"],
  ["scrubbing-brush", "cleaning", "Scrub_brush"],
  ["sponges", "cleaning", "Sponge_(tool)"],
  ["microfiber-cloths", "cleaning", "Microfiber"],
  ["rubber-gloves", "cleaning", "Rubber_glove"],
  ["garbage-bags-large", "cleaning", "Bin_bag"],
  ["garbage-bags-medium", "cleaning", "Bin_bag"],
  ["toilet-paper", "cleaning", "Toilet_paper"],
  ["paper-towels", "cleaning", "Paper_towel"],
  ["hand-soap-bar", "cleaning", "Soap"],
  ["hand-soap-liquid", "cleaning", "Soap"],
  ["shampoo", "cleaning", "Shampoo"],
  ["body-wash", "cleaning", "Shower_gel"],
  ["conditioner", "cleaning", "Hair_conditioner"],
  ["toothpaste", "cleaning", "Toothpaste"],
  ["toothbrushes", "cleaning", "Toothbrush"],
  ["shaving-cream", "cleaning", "Shaving_cream"],
  ["disposable-razors", "cleaning", "Razor"],
  ["deodorant", "cleaning", "Deodorant"],

  // ---------- bonded ----------
  ["cigarettes-marlboro", "bonded", "Marlboro_(cigarette)"],
  ["cigarettes-winston", "bonded", "Winston_(cigarette)"],
  ["cigarettes-lm", "bonded", "L%26M"],
  ["cigarettes-camel", "bonded", "Camel_(cigarette)"],
  ["rolling-tobacco", "bonded", "Tobacco"],
  ["cigars", "bonded", "Cigar"],
  ["beer-presidente", "bonded", "Presidente_(beer)"],
  ["beer-heineken", "bonded", "Heineken"],
  ["beer-corona", "bonded", "Corona_(beer)"],
  ["beer-budweiser", "bonded", "Budweiser"],
  ["rum-barcelo", "bonded", "Brugal"],
  ["rum-brugal", "bonded", "Brugal"],
  ["whisky-jw-red", "bonded", "Johnnie_Walker"],
  ["whisky-jw-black", "bonded", "Johnnie_Walker"],
  ["whisky-jd", "bonded", "Jack_Daniel%27s"],
  ["vodka-absolut", "bonded", "Absolut_Vodka"],
  ["chocolates", "bonded", "Chocolate"],
  ["candy", "bonded", "Candy"],
  ["playing-cards", "bonded", "Playing_card"],
  ["lighters", "bonded", "Lighter"],
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

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
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
  console.log(`Processing ${MAPPING.length} products…\n`);
  const ok = [];
  const fail = [];
  const skipped = [];

  for (const [slug, category, title] of MAPPING) {
    const outPath = join(PUBLIC_PRODUCTS, category, `${slug}.webp`);
    if (await exists(outPath)) {
      skipped.push({ slug, category });
      console.log(`  ${category.padEnd(18)} ${slug.padEnd(28)} SKIP (already exists)`);
      continue;
    }
    process.stdout.write(`  ${category.padEnd(18)} ${slug.padEnd(28)} ← ${title.padEnd(28)} `);
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
  console.log(`OK     : ${ok.length}`);
  console.log(`SKIP   : ${skipped.length}`);
  console.log(`FAIL   : ${fail.length}`);
  if (fail.length) {
    console.log(`\nFailed items (will use fallback avatar in UI):`);
    for (const f of fail) console.log(`  - ${f.category}/${f.slug} (${f.title}): ${f.error}`);
  }
  const totalKb = ok.reduce((s, r) => s + r.bytes / 1024, 0);
  console.log(`\nDownloaded: ${(totalKb / 1024).toFixed(2)} MB`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
