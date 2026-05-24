/**
 * Generate 102 product photos for /procurement with Pollinations.ai (Flux Schnell, free).
 * Same "editorial cream" style approved by Miguel.
 *
 * For each item we provide a curated English subject (instead of using the
 * Spanish name directly with brand mentions). Flux works much better with
 * clean English nouns and skips brand names anyway.
 *
 * Output: /public/procurement/<category-id>/<item-id>.webp
 * Log:    scripts/.generate-procurement.log
 *
 * Run:        node scripts/generate-procurement-ai.mjs
 * Force-all:  FORCE=1 node scripts/generate-procurement-ai.mjs
 */

import { mkdir, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const OUT_BASE = join(ROOT, "public", "procurement");
const LOG_FILE = join(ROOT, "scripts", ".generate-procurement.log");

const UA = "DJSS-catalog-bot/1.0";
const FORCE = !!process.env.FORCE;

const STYLE =
  "soft warm cream beige background with subtle gradient, soft directional side lighting, gentle long delicate shadow, slight elevated three-quarter angle, minimalist editorial style, premium magazine quality, professional product photography, clean composition, commercial photography, sharp focus, high detail, no text, no labels, no watermark, square 1:1 format";

// id → English subject (no brand names — Flux handles generics better).
const SUBJECTS = {
  // Eléctricos
  "electricos-01": "spool of marine electrical cable, copper wire bundle",
  "electricos-02": "industrial electrical circuit breaker single switch",
  "electricos-03": "roll of black industrial electrical insulating tape",
  "electricos-04": "set of electrical wire terminals and crimp connectors on a tray",
  "electricos-05": "industrial cartridge fuse",
  "electricos-06": "industrial wall power outlet and switch panel",
  "electricos-07": "electrical distribution panel cabinet with breakers",
  "electricos-08": "industrial electrical contactor relay device",
  "electricos-09": "industrial motor starter electrical device",
  "electricos-10": "digital multimeter with leads, electrical testing tool",
  "electricos-11": "emergency LED work flashlight industrial",
  "electricos-12": "metal electrical conduit pipe with fittings",
  "electricos-13": "industrial control transformer electrical box",
  "electricos-14": "industrial digital timer relay electrical device",
  // Ferretería
  "ferreteria-01": "assortment of stainless steel bolts, nuts and washers on a tray",
  "ferreteria-02": "coil of nautical marine rope on white",
  "ferreteria-03": "stainless steel shackle, hook and pulley hardware",
  "ferreteria-04": "industrial padlock heavy duty stainless steel",
  "ferreteria-05": "stainless steel hose clamps assortment",
  "ferreteria-06": "galvanized steel chain coil heavy duty",
  "ferreteria-07": "roll of white teflon thread sealing tape",
  "ferreteria-08": "tube of marine silicone sealant adhesive",
  "ferreteria-09": "set of metal drill bits and cutting discs",
  "ferreteria-10": "adjustable pipe wrench tool industrial",
  "ferreteria-11": "industrial utility knife with replaceable blades",
  "ferreteria-12": "stainless steel pop rivets in a box",
  "ferreteria-13": "industrial grease gun lubricator tool",
  // Seguridad
  "seguridad-01": "industrial white safety hard hat helmet",
  "seguridad-02": "pair of industrial work gloves nitrile",
  "seguridad-03": "clear industrial safety glasses goggles",
  "seguridad-04": "pair of steel toe industrial work boots black leather",
  "seguridad-05": "full body safety harness with lanyard",
  "seguridad-06": "industrial ear muffs hearing protection",
  "seguridad-07": "white industrial respirator dust mask N95",
  "seguridad-08": "white tyvek-style industrial coverall suit",
  "seguridad-09": "orange traffic safety cone with reflective strips",
  "seguridad-10": "red portable fire extinguisher CO2",
  "seguridad-11": "high visibility reflective safety vest neon yellow",
  "seguridad-12": "white industrial first aid kit case",
  "seguridad-13": "portable gas detector industrial device yellow",
  // Pintura
  "pintura-01": "metal can of industrial anti-corrosion primer paint",
  "pintura-02": "metal can of marine enamel paint with paint brush",
  "pintura-03": "can of non-slip deck paint industrial gray",
  "pintura-04": "set of industrial paint brushes and roller with tray",
  "pintura-05": "metal can of industrial paint thinner solvent",
  "pintura-06": "roll of beige industrial masking tape",
  "pintura-07": "stack of sandpaper sheets in various grits",
  "pintura-08": "roll of industrial abrasive sanding belt",
  "pintura-09": "can of industrial paint and rust remover",
  "pintura-10": "tube of marine sealant filler caulk",
  "pintura-11": "industrial spray can of anti-corrosion penetrating oil",
  "pintura-12": "metal can of industrial rust converter liquid",
  // Refrigeración
  "refrigeracion-01": "blue refrigerant gas tank cylinder industrial",
  "refrigeracion-02": "industrial air conditioning filter pleated white",
  "refrigeracion-03": "digital thermostat control panel white",
  "refrigeracion-04": "industrial copper refrigeration hose with fittings",
  "refrigeracion-05": "industrial refrigeration compressor unit cylinder",
  "refrigeracion-06": "brass refrigeration service valve fitting",
  "refrigeracion-07": "refrigeration pressure gauge manifold with hoses",
  "refrigeracion-08": "black foam pipe insulation tubing roll",
  "refrigeracion-09": "industrial axial fan ventilator metal",
  "refrigeracion-10": "industrial temperature controller digital device",
  // Plomería
  "plomeria-01": "brass ball valve plumbing fitting",
  "plomeria-02": "industrial brass water stopcock valve",
  "plomeria-03": "stack of white PVC plumbing pipes",
  "plomeria-04": "galvanized steel pipe elbow and tee fittings",
  "plomeria-05": "roll of white plumber teflon thread tape",
  "plomeria-06": "industrial submersible water pump black",
  "plomeria-07": "industrial reinforced hose coil black rubber",
  "plomeria-08": "stainless steel german hose clamps assortment",
  "plomeria-09": "brass plumbing union and nipple fittings assortment",
  "plomeria-10": "white industrial water sediment filter cartridge",
  // Iluminación
  "iluminacion-01": "industrial LED light bulb E27 white",
  "iluminacion-02": "high power LED industrial floodlight black",
  "iluminacion-03": "white LED T8 tube light fluorescent style",
  "iluminacion-04": "waterproof IP65 industrial bulkhead light fixture",
  "iluminacion-05": "rechargeable industrial work flashlight black",
  "iluminacion-06": "pack of alkaline industrial batteries AA",
  "iluminacion-07": "industrial heavy duty extension cord orange coiled",
  "iluminacion-08": "industrial power surge protector strip with switch",
  // Limpieza
  "limpieza-01": "industrial degreaser cleaning bottle blue",
  "limpieza-02": "industrial multi-purpose cleaner soap bottle white",
  "limpieza-03": "industrial deck broom and scrub brush wooden handle",
  "limpieza-04": "industrial mop with bucket yellow plastic",
  "limpieza-05": "pair of yellow industrial latex cleaning gloves",
  "limpieza-06": "roll of heavy duty industrial black trash bags",
  "limpieza-07": "stainless steel cleaner spray bottle",
  "limpieza-08": "industrial oil spill absorbent pads white",
  "limpieza-09": "stack of white industrial cleaning rags cloth",
  "limpieza-10": "industrial chlorine bleach disinfectant white bottle",
  // Herramientas
  "herramientas-01": "set of combination wrenches in a tool roll",
  "herramientas-02": "pneumatic impact wrench tool industrial",
  "herramientas-03": "cordless power drill industrial black and yellow",
  "herramientas-04": "industrial angle grinder power tool",
  "herramientas-05": "industrial bar clamp and vice tool",
  "herramientas-06": "arc welding machine with electrodes industrial",
  "herramientas-07": "industrial heat gun power tool yellow",
  "herramientas-08": "industrial jigsaw and circular saw power tool",
  "herramientas-09": "set of screwdrivers in a tool case",
  "herramientas-10": "set of bearing puller tools metal",
  "herramientas-11": "red hydraulic floor jack industrial",
  "herramientas-12": "digital caliper measuring tool metal",
};

function buildUrl(prompt) {
  const params = new URLSearchParams({
    width: "600",
    height: "600",
    model: "flux",
    nologo: "true",
    enhance: "false",
    safe: "true",
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function generateOne(itemId, subject) {
  const dashIdx = itemId.indexOf("-");
  const categoryId = itemId.slice(0, dashIdx);
  const outDir = join(OUT_BASE, categoryId);
  const outPath = join(outDir, `${itemId}.webp`);

  if (await alreadyExists(outPath)) {
    await log(`SKIP    ${categoryId}/${itemId}  (already exists)`);
    return { ok: true, skipped: true };
  }

  const prompt = `${subject}. ${STYLE}`;
  const url = buildUrl(prompt);

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const start = Date.now();
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 402 || res.status === 429) {
        await log(`BACKOFF ${categoryId}/${itemId}  HTTP ${res.status}, waiting 60s (${attempts}/3)`);
        await sleep(60_000);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      const out = await sharp(bytes)
        .resize(600, 600, { fit: "cover", position: "centre" })
        .webp({ quality: 80 })
        .toBuffer();
      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, out);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      await log(`OK      ${categoryId}/${itemId}  ${(out.length / 1024).toFixed(0)} KB  ${elapsed}s`);
      return { ok: true };
    } catch (e) {
      await log(`RETRY   ${categoryId}/${itemId}  ${e.message} (${attempts}/3)`);
      await sleep(15_000);
    }
  }
  await log(`FAIL    ${categoryId}/${itemId}  exhausted retries`);
  return { ok: false };
}

async function main() {
  await writeFile(LOG_FILE, "");
  const entries = Object.entries(SUBJECTS);
  await log(`Starting procurement generation: ${entries.length} items`);
  await log(`FORCE=${FORCE ? "yes" : "no"}`);

  let ok = 0, fail = 0, skip = 0;
  for (let i = 0; i < entries.length; i++) {
    const [itemId, subject] = entries[i];
    await log(`[${i + 1}/${entries.length}] ${itemId}  ←  "${subject.slice(0, 60)}"`);
    const r = await generateOne(itemId, subject);
    if (r.skipped) skip++;
    else if (r.ok) ok++;
    else fail++;
    if (i < entries.length - 1) await sleep(6000);
  }

  await log(`────────────────────────────────`);
  await log(`OK: ${ok} | SKIP: ${skip} | FAIL: ${fail}`);
  await log(`DONE.`);
}

main().catch(async (e) => {
  await log(`FATAL: ${e.stack || e.message}`);
  process.exit(1);
});
