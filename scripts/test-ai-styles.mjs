/**
 * Generate 4 different premium styles on the SAME subject (red apple)
 * so Miguel can pick the visual direction before we burn 235 generations.
 *
 * Output: /public/products/_test-styles/<style>.webp
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const OUT_DIR = join(ROOT, "public", "products", "_test-styles");

const UA = "DJSS-catalog-bot/1.0";

// Same subject for all 4 → only the style changes.
const SUBJECT = "a single fresh red apple with a green leaf and stem";

const STYLES = [
  {
    key: "1-editorial-cream",
    label: "Editorial cream (Apple/Muji)",
    prompt:
      "soft warm cream beige background with subtle gradient, soft directional side lighting, gentle long delicate shadow, slight elevated three-quarter angle, minimalist editorial style, premium magazine quality, professional food styling, clean composition, commercial photography",
  },
  {
    key: "2-rustic-wood",
    label: "Rustic farmer-market (wood)",
    prompt:
      "rustic dark wooden table background, warm natural window light from the left, three-quarter angle, organic authentic farmer market feel, soft natural shadows, artisan food photography, premium quality",
  },
  {
    key: "3-dramatic-charcoal",
    label: "Dramatic charcoal (luxury)",
    prompt:
      "dramatic single spotlight studio lighting, dark charcoal gradient background, deep cinematic shadows, three-quarter elevated angle, luxury restaurant aesthetic, premium commercial photography, moody high-end product shot",
  },
  {
    key: "4-light-airy",
    label: "Light & airy modern",
    prompt:
      "light and airy modern style, off-white soft cream background, soft diffused natural daylight, gentle subtle shadow, 45-degree elevated angle, fresh clean optimistic premium grocery catalog aesthetic, IKEA-style product shot",
  },
];

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

async function generate(style) {
  const fullPrompt = `${SUBJECT}. ${style.prompt}. Sharp focus, high detail, no text, no watermark, square 1:1 format.`;
  const url = buildUrl(fullPrompt);
  const start = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  const out = await sharp(bytes)
    .resize(800, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 80 })
    .toBuffer();
  const outPath = join(OUT_DIR, `${style.key}.webp`);
  await writeFile(outPath, out);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  return { key: style.key, label: style.label, kb: (out.length / 1024).toFixed(0), elapsed };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Generating ${STYLES.length} styles in parallel (same subject: red apple)…\n`);
  const results = await Promise.allSettled(STYLES.map(generate));
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      console.log(`  ✓ ${r.value.key.padEnd(22)} ${r.value.label.padEnd(30)} (${r.value.kb} KB, ${r.value.elapsed}s)`);
    } else {
      console.log(`  ✗ ${STYLES[i].key.padEnd(22)} ${STYLES[i].label.padEnd(30)} FAIL — ${r.reason.message}`);
    }
  }
  console.log(`\nDone. Open: public/products/_test-styles/`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
