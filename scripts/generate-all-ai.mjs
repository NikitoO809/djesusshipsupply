/**
 * Generate ALL product photos with Pollinations.ai (Flux Schnell, free).
 * Uses the "editorial cream" style Miguel approved.
 *
 * Behavior:
 *  - Reads the catalog from src/lib/catalog/provisions.ts via regex.
 *  - For each product, builds prompt:  "<name>. <STYLE>"
 *  - Generates 800x800 webp at quality 80.
 *  - SKIPS products whose file already exists at /public/products/<cat>/<slug>.webp
 *    AND was modified after this script started (so re-runs only fill gaps).
 *    Use FORCE=1 env to regenerate everything.
 *  - Serial (Pollinations rejects parallelism).
 *  - 6s sleep between requests + 60s back-off on HTTP 402/429.
 *  - Writes a log file at scripts/.generate-all.log
 *
 * Run:        node scripts/generate-all-ai.mjs
 * Force-all:  FORCE=1 node scripts/generate-all-ai.mjs
 */

import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const CATALOG_FILE = join(ROOT, "src", "lib", "catalog", "provisions.ts");
const PUBLIC_PRODUCTS = join(ROOT, "public", "products");
const LOG_FILE = join(ROOT, "scripts", ".generate-all.log");

const UA = "DJSS-catalog-bot/1.0";
const FORCE = !!process.env.FORCE;
const SCRIPT_START = new Date();

const STYLE =
  "soft warm cream beige background with subtle gradient, soft directional side lighting, gentle long delicate shadow, slight elevated three-quarter angle, minimalist editorial style, premium magazine quality, professional food styling, clean composition, commercial photography, sharp focus, high detail, no text, no labels, no watermark, square 1:1 format";

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function parseCatalog() {
  const src = await readFile(CATALOG_FILE, "utf8");
  // Matches: p("category:slug", "Name"),
  const re = /p\("([^"]+):([^"]+)",\s*"([^"]+)"/g;
  const items = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    items.push({ category: m[1], slug: m[2], name: m[3] });
  }
  return items;
}

async function log(line) {
  const ts = new Date().toISOString();
  const entry = `[${ts}] ${line}\n`;
  process.stdout.write(entry);
  await writeFile(LOG_FILE, entry, { flag: "a" });
}

async function alreadyExists(path) {
  if (FORCE) return false;
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(item) {
  const outDir = join(PUBLIC_PRODUCTS, item.category);
  const outPath = join(outDir, `${item.slug}.webp`);

  if (await alreadyExists(outPath)) {
    await log(`SKIP    ${item.category}/${item.slug}  (already exists)`);
    return { ok: true, skipped: true };
  }

  const prompt = `${item.name}. ${STYLE}`;
  const url = buildUrl(prompt);

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const start = Date.now();
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 402 || res.status === 429) {
        await log(`BACKOFF ${item.category}/${item.slug}  HTTP ${res.status}, waiting 60s (attempt ${attempts}/3)`);
        await sleep(60_000);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      const out = await sharp(bytes)
        .resize(800, 800, { fit: "cover", position: "centre" })
        .webp({ quality: 80 })
        .toBuffer();
      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, out);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      await log(`OK      ${item.category}/${item.slug}  ${(out.length / 1024).toFixed(0)} KB  ${elapsed}s`);
      return { ok: true };
    } catch (e) {
      await log(`RETRY   ${item.category}/${item.slug}  ${e.message} (attempt ${attempts}/3)`);
      await sleep(15_000);
    }
  }
  await log(`FAIL    ${item.category}/${item.slug}  exhausted retries`);
  return { ok: false };
}

async function main() {
  // Reset log
  await writeFile(LOG_FILE, "");
  const items = await parseCatalog();
  await log(`Starting generation of ${items.length} products`);
  await log(`FORCE=${FORCE ? "yes (regenerate all)" : "no (skip files modified this run)"}`);

  let ok = 0,
    fail = 0,
    skip = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await log(`[${i + 1}/${items.length}] ${item.category}/${item.slug}  ←  "${item.name}"`);
    const r = await generateOne(item);
    if (r.skipped) skip++;
    else if (r.ok) ok++;
    else fail++;
    // Throttle 6s between products to keep Pollinations happy.
    if (i < items.length - 1) await sleep(6000);
  }

  await log(`────────────────────────────────`);
  await log(`OK: ${ok} | SKIP: ${skip} | FAIL: ${fail}`);
  await log(`DONE.`);
}

main().catch(async (e) => {
  await log(`FATAL: ${e.stack || e.message}`);
  process.exit(1);
});
