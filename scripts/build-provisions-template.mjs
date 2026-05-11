// One-shot generator for public/plantilla-provisiones.xlsx
// Run: node scripts/build-provisions-template.mjs
//
// Parses src/lib/catalog/provisions.ts to extract categories + products,
// then builds a brand-styled Excel template with one cover sheet,
// one sheet per category, and one summary sheet (12 sheets total).

import ExcelJS from "exceljs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot  = resolve(__dirname, "..");

// ─── Brand palette (mirrors src/lib/excel/quote-excel.ts) ────
const NAVY  = "FF0A2540";
const GOLD  = "FFC9A961";
const CREAM = "FFF8F5EE";
const WHITE = "FFFFFFFF";
const DARK  = "FF1A1A1A";
const LIGHT = "FFF5F2EC";
const QTY_BG = "FFFFFDF6"; // very pale gold tint to mark the editable column

// ─── Borders ─────────────────────────────────────────────────
const bMedium = (argb = NAVY) => ({ style: "medium", color: { argb } });
const bThin   = (argb = NAVY) => ({ style: "thin",   color: { argb } });
const bNone   = ()            => ({ style: "none",   color: { argb: "00000000" } });

function frame(sheet, r1, r2, c1, c2) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top:    r === r1 ? bMedium() : bThin(),
        bottom: r === r2 ? bMedium() : bThin(),
        left:   c === c1 ? bMedium() : bThin(),
        right:  c === c2 ? bMedium() : bThin(),
      };
    }
  }
}

function frameOuter(sheet, r1, r2, c1, c2) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top:    r === r1 ? bMedium() : bNone(),
        bottom: r === r2 ? bMedium() : bNone(),
        left:   c === c1 ? bMedium() : bNone(),
        right:  c === c2 ? bMedium() : bNone(),
      };
    }
  }
}

// ─── Parse the TypeScript catalog file ───────────────────────
function parseCatalog() {
  const src = readFileSync(resolve(repoRoot, "src/lib/catalog/provisions.ts"), "utf8");

  const categories = [];
  // Match each {  key: "...",  name: { es: "...", en: "..." },  products: [ ... ] }
  const catRe = /\{\s*key:\s*"([^"]+)"\s*,\s*name:\s*\{\s*es:\s*"([^"]+)"\s*,\s*en:\s*"([^"]+)"\s*\}\s*,\s*products:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
  const prodRe = /p\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*(?:,\s*"([^"]*)")?\s*\)/g;

  let m;
  while ((m = catRe.exec(src)) !== null) {
    const [, key, nameEs, nameEn, body] = m;
    const products = [];
    let pm;
    prodRe.lastIndex = 0;
    while ((pm = prodRe.exec(body)) !== null) {
      products.push({ id: pm[1], name: pm[2], unit: pm[3] || "" });
    }
    categories.push({ key, nameEs, nameEn, products });
  }
  return categories;
}

// ─── Shared header block (DJSS branding) ─────────────────────
function addBrandHeader(sheet, totalCols, subtitle) {
  let row = 1;

  // Row 1: company | subtitle
  const mid = Math.floor(totalCols / 2) + 1;
  sheet.mergeCells(row, 1, row, mid - 1);
  const companyCell = sheet.getCell(row, 1);
  companyCell.value = "DE JESÚS SHIP SUPPLY";
  companyCell.font  = { bold: true, size: 13, color: { argb: CREAM }, name: "Calibri" };
  companyCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  companyCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, mid, row, totalCols);
  const subCell = sheet.getCell(row, mid);
  subCell.value = subtitle;
  subCell.font  = { bold: true, size: 11, color: { argb: GOLD }, name: "Calibri" };
  subCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  subCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
  sheet.getRow(row).height = 26;
  row++;

  // Row 2: website | tagline
  sheet.mergeCells(row, 1, row, mid - 1);
  const webCell = sheet.getCell(row, 1);
  webCell.value = "djshipsupply.com";
  webCell.font  = { italic: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
  webCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  webCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, mid, row, totalCols);
  const tagCell = sheet.getCell(row, mid);
  tagCell.value = "Plantilla de Provisiones / Provisions Template";
  tagCell.font  = { size: 9, color: { argb: DARK }, name: "Calibri" };
  tagCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  tagCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
  sheet.getRow(row).height = 17;
  row++;

  // Row 3: email | contact
  sheet.mergeCells(row, 1, row, mid - 1);
  const emailCell = sheet.getCell(row, 1);
  emailCell.value = "info@djshipsupply.com";
  emailCell.font  = { size: 9, color: { argb: NAVY }, name: "Calibri" };
  emailCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  emailCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, mid, row, totalCols);
  const ctaCell = sheet.getCell(row, mid);
  ctaCell.value = "Llene la columna CANT. de los productos que necesite";
  ctaCell.font  = { italic: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
  ctaCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  ctaCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
  sheet.getRow(row).height = 17;

  frameOuter(sheet, 1, row, 1, totalCols);
  for (let r = 1; r <= row; r++) {
    sheet.getCell(r, mid - 1).border = { ...sheet.getCell(r, mid - 1).border, right: bMedium() };
    sheet.getCell(r, mid).border     = { ...sheet.getCell(r, mid).border,     left:  bMedium() };
  }
  return row + 1; // next row index
}

// ─── Footer line ─────────────────────────────────────────────
function addFooter(sheet, totalCols, startRow) {
  let row = startRow + 2;
  sheet.mergeCells(row, 1, row, totalCols);
  const footer = sheet.getCell(row, 1);
  footer.value = "De Jesús Ship Supply  ·  djshipsupply.com  ·  info@djshipsupply.com  ·  Plantilla generada automáticamente";
  footer.font  = { size: 8, italic: true, color: { argb: "FF888888" }, name: "Calibri" };
  footer.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(row).height = 14;
}

// ─── COVER / INSTRUCTIONS SHEET ──────────────────────────────
function buildCoverSheet(wb, totalCategories, totalProducts) {
  const sheet = wb.addWorksheet("Instrucciones", {
    pageSetup: {
      paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1,
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
    },
    views: [{ showGridLines: false }],
    properties: { defaultRowHeight: 18 },
  });

  const C = 4;
  sheet.columns = [
    { width: 6 }, { width: 38 }, { width: 18 }, { width: 22 },
  ];

  let row = addBrandHeader(sheet, C, "PLANTILLA DE PROVISIONES");

  // ── Big title block
  sheet.mergeCells(row, 1, row, C);
  const titleCell = sheet.getCell(row, 1);
  titleCell.value = "Solicitud de cotización · Provisiones para buque";
  titleCell.font  = { bold: true, size: 14, color: { argb: NAVY }, name: "Calibri" };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 28;
  row++;

  sheet.mergeCells(row, 1, row, C);
  const subCell = sheet.getCell(row, 1);
  subCell.value = "Quotation Request · Vessel Provisions";
  subCell.font  = { italic: true, size: 10, color: { argb: "FF666666" }, name: "Calibri" };
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row += 2;

  // ── Stats strip ──
  const statStart = row;
  const stats = [
    [String(totalCategories), "CATEGORÍAS"],
    [String(totalProducts),   "PRODUCTOS"],
    ["24h",                   "RESPUESTA"],
  ];
  // each stat occupies a merged 2x1 block, column ranges 1-1, 2-2, 3-4
  const ranges = [[1, 1], [2, 2], [3, 4]];
  ranges.forEach(([c1, c2], i) => {
    sheet.mergeCells(row, c1, row, c2);
    sheet.mergeCells(row + 1, c1, row + 1, c2);
    const numCell = sheet.getCell(row, c1);
    numCell.value = stats[i][0];
    numCell.font  = { bold: true, size: 22, color: { argb: NAVY }, name: "Calibri" };
    numCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
    numCell.alignment = { vertical: "middle", horizontal: "center" };

    const lblCell = sheet.getCell(row + 1, c1);
    lblCell.value = stats[i][1];
    lblCell.font  = { bold: true, size: 8, color: { argb: GOLD }, name: "Calibri" };
    lblCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
    lblCell.alignment = { vertical: "middle", horizontal: "center" };
  });
  sheet.getRow(row).height = 32;
  sheet.getRow(row + 1).height = 16;
  frame(sheet, row, row + 1, 1, C);
  row += 3;

  // ── "Cómo usar / How to use" section title ──
  sheet.mergeCells(row, 1, row, C);
  const stCell = sheet.getCell(row, 1);
  stCell.value = "CÓMO USAR ESTA PLANTILLA  /  HOW TO USE THIS TEMPLATE";
  stCell.font  = { bold: true, size: 9, color: { argb: GOLD }, name: "Calibri" };
  stCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  stCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row++;

  const steps = [
    ["1", "Abra cada hoja por categoría (pestañas inferiores).", "Open each category sheet (bottom tabs)."],
    ["2", "Escriba la cantidad en la columna CANT. de los productos que necesite.", "Enter the quantity in the QTY column for the products you need."],
    ["3", "Deje en blanco los productos que NO va a pedir. No es necesario eliminar filas.", "Leave blank the products you don't need. No need to delete rows."],
    ["4", "Guarde el archivo y súbalo en djshipsupply.com (Vía 02 · Plantilla).", "Save the file and upload it on djshipsupply.com (Track 02 · Template)."],
    ["5", "Recibirá su cotización confirmada en menos de 24 horas.", "You'll receive your quote within 24 hours."],
  ];
  const stepsStart = row;
  for (const [n, es, en] of steps) {
    const nCell = sheet.getCell(row, 1);
    nCell.value = n;
    nCell.font  = { bold: true, size: 11, color: { argb: CREAM }, name: "Calibri" };
    nCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } };
    nCell.alignment = { vertical: "middle", horizontal: "center" };

    sheet.mergeCells(row, 2, row, C);
    const txtCell = sheet.getCell(row, 2);
    txtCell.value = {
      richText: [
        { text: es, font: { size: 10, color: { argb: DARK }, name: "Calibri" } },
        { text: "  ·  ", font: { size: 10, color: { argb: GOLD }, name: "Calibri" } },
        { text: en, font: { italic: true, size: 9, color: { argb: "FF666666" }, name: "Calibri" } },
      ],
    };
    txtCell.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };
    txtCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: WHITE } };
    sheet.getRow(row).height = 26;
    row++;
  }
  frame(sheet, stepsStart, row - 1, 1, C);
  row += 2;

  // ── Categories index ──
  sheet.mergeCells(row, 1, row, C);
  const idxTitle = sheet.getCell(row, 1);
  idxTitle.value = "ÍNDICE DE CATEGORÍAS  /  CATEGORY INDEX";
  idxTitle.font  = { bold: true, size: 9, color: { argb: GOLD }, name: "Calibri" };
  idxTitle.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  idxTitle.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row++;

  return { sheet, row, totalCols: C };
}

function finishCoverSheet(coverSheet, startRow, totalCols, categories) {
  let row = startRow;
  let zebra = false;

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const bg = zebra ? LIGHT : WHITE;

    const nCell = coverSheet.getCell(row, 1);
    nCell.value = String(i + 1).padStart(2, "0");
    nCell.font  = { bold: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
    nCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    nCell.alignment = { vertical: "middle", horizontal: "center" };

    const nameCell = coverSheet.getCell(row, 2);
    nameCell.value = cat.nameEs;
    nameCell.font  = { bold: true, size: 10, color: { argb: NAVY }, name: "Calibri" };
    nameCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    nameCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

    const enCell = coverSheet.getCell(row, 3);
    enCell.value = cat.nameEn;
    enCell.font  = { italic: true, size: 9, color: { argb: "FF666666" }, name: "Calibri" };
    enCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    enCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

    const countCell = coverSheet.getCell(row, 4);
    const c = cat.products.length;
    countCell.value = c === 0 ? "—" : `${c} producto${c !== 1 ? "s" : ""}`;
    countCell.font  = { size: 9, color: { argb: DARK }, name: "Calibri" };
    countCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    countCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };

    coverSheet.getRow(row).height = 19;
    zebra = !zebra;
    row++;
  }
  frame(coverSheet, startRow, row - 1, 1, totalCols);

  addFooter(coverSheet, totalCols, row);
}

// ─── CATEGORY SHEET ──────────────────────────────────────────
function buildCategorySheet(wb, cat, index) {
  // Sheet name max 31 chars, no special chars / : ? * [ ]
  const safeName = `${String(index).padStart(2, "0")} ${cat.nameEs}`
    .replace(/[\\/?*[\]:]/g, "-")
    .slice(0, 31);

  const sheet = wb.addWorksheet(safeName, {
    pageSetup: {
      paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1,
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
    },
    views: [{ showGridLines: false }],
    properties: { defaultRowHeight: 18 },
  });

  const C = 5;
  sheet.columns = [
    { width:  5 },   // #
    { width: 38 },   // Producto / Product
    { width: 10 },   // CANT.
    { width: 12 },   // UNIDAD
    { width: 26 },   // NOTA
  ];

  let row = addBrandHeader(sheet, C, `CATEGORÍA  ·  ${String(index).padStart(2, "0")} / 10`);

  // ── Category title block ──
  sheet.mergeCells(row, 1, row, C);
  const titleCell = sheet.getCell(row, 1);
  titleCell.value = cat.nameEs;
  titleCell.font  = { bold: true, size: 14, color: { argb: NAVY }, name: "Calibri" };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 28;
  row++;

  sheet.mergeCells(row, 1, row, C);
  const enCell = sheet.getCell(row, 1);
  enCell.value = cat.nameEn;
  enCell.font  = { italic: true, size: 10, color: { argb: "FF666666" }, name: "Calibri" };
  enCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row += 2;

  // ── Table header ──
  const tableStart = row;
  const hdr = sheet.getRow(row);
  hdr.height = 20;
  const headers = [
    ["#", "center"],
    ["PRODUCTO  /  PRODUCT", "left"],
    ["CANT.", "center"],
    ["UNIDAD", "center"],
    ["NOTA  /  NOTE", "left"],
  ];
  headers.forEach(([val, align], i) => {
    const cell = hdr.getCell(i + 1);
    cell.value = val;
    cell.font  = { bold: true, size: 9, color: { argb: CREAM }, name: "Calibri" };
    cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    cell.alignment = { vertical: "middle", horizontal: align, indent: align === "left" ? 1 : 0 };
  });
  row++;

  if (cat.products.length === 0) {
    // Empty placeholder row
    sheet.mergeCells(row, 1, row, C);
    const empty = sheet.getCell(row, 1);
    empty.value = "Productos disponibles bajo solicitud. Indique sus necesidades en la hoja Resumen.";
    empty.font  = { italic: true, size: 10, color: { argb: "FF666666" }, name: "Calibri" };
    empty.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: WHITE } };
    empty.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    sheet.getRow(row).height = 36;
    row++;
  } else {
    let zebra = false;
    cat.products.forEach((p, i) => {
      const bg = zebra ? LIGHT : WHITE;
      const r  = sheet.getRow(row);
      r.height = 18;

      // #
      const idxCell = r.getCell(1);
      idxCell.value = i + 1;
      idxCell.font  = { size: 9, color: { argb: "FF888888" }, name: "Calibri" };
      idxCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      idxCell.alignment = { vertical: "middle", horizontal: "center" };

      // Producto
      const nameCell = r.getCell(2);
      nameCell.value = p.name;
      nameCell.font  = { size: 10, color: { argb: DARK }, name: "Calibri" };
      nameCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      nameCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

      // CANT. (editable, pale gold tint)
      const qtyCell = r.getCell(3);
      qtyCell.value = null;
      qtyCell.font  = { bold: true, size: 10, color: { argb: NAVY }, name: "Calibri" };
      qtyCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: QTY_BG } };
      qtyCell.alignment = { vertical: "middle", horizontal: "center" };
      qtyCell.numFmt = "0";
      qtyCell.dataValidation = {
        type: "decimal",
        operator: "greaterThanOrEqual",
        formulae: [0],
        showErrorMessage: true,
        errorStyle: "warning",
        errorTitle: "Cantidad no válida",
        error: "Introduzca un número mayor o igual a 0.",
      };

      // UNIDAD
      const unitCell = r.getCell(4);
      unitCell.value = p.unit || "";
      unitCell.font  = { size: 9, color: { argb: "FF666666" }, name: "Calibri" };
      unitCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      unitCell.alignment = { vertical: "middle", horizontal: "center" };

      // NOTA (editable, white)
      const noteCell = r.getCell(5);
      noteCell.value = null;
      noteCell.font  = { italic: true, size: 9, color: { argb: DARK }, name: "Calibri" };
      noteCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      noteCell.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };

      zebra = !zebra;
      row++;
    });
  }

  const tableEnd = row - 1;
  frame(sheet, tableStart, tableEnd, 1, C);

  // Hint line
  row++;
  sheet.mergeCells(row, 1, row, C);
  const hint = sheet.getCell(row, 1);
  hint.value = "💡  Llene solo la columna CANT. de los productos que necesite. Deje en blanco los demás.";
  hint.font  = { italic: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
  hint.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  hint.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  frameOuter(sheet, row, row, 1, C);

  addFooter(sheet, C, row);

  // Freeze top rows so header + table header stay on screen
  sheet.views = [{ showGridLines: false, state: "frozen", ySplit: tableStart }];
}

// ─── SUMMARY SHEET (notes) ───────────────────────────────────
function buildSummarySheet(wb) {
  const sheet = wb.addWorksheet("Resumen", {
    pageSetup: {
      paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1,
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
    },
    views: [{ showGridLines: false }],
    properties: { defaultRowHeight: 18 },
  });

  const C = 2;
  sheet.columns = [{ width: 32 }, { width: 60 }];

  let row = addBrandHeader(sheet, C, "RESUMEN  /  SUMMARY");

  // Title
  sheet.mergeCells(row, 1, row, C);
  const t = sheet.getCell(row, 1);
  t.value = "Datos opcionales del buque y comentarios";
  t.font  = { bold: true, size: 14, color: { argb: NAVY }, name: "Calibri" };
  t.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 28;
  row++;

  sheet.mergeCells(row, 1, row, C);
  const s = sheet.getCell(row, 1);
  s.value = "Optional vessel data & comments — final data will be requested on upload";
  s.font  = { italic: true, size: 10, color: { argb: "FF666666" }, name: "Calibri" };
  s.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row += 2;

  // Vessel fields
  sheet.mergeCells(row, 1, row, C);
  const vt = sheet.getCell(row, 1);
  vt.value = "DATOS DEL BUQUE  /  VESSEL DETAILS  (opcional)";
  vt.font  = { bold: true, size: 9, color: { argb: GOLD }, name: "Calibri" };
  vt.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  vt.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row++;

  const vesselStart = row;
  const fields = [
    ["Nombre / Vessel Name", ""],
    ["Bandera / Flag", ""],
    ["IMO", ""],
    ["Tipo de buque / Vessel Type", ""],
    ["Puerto / Port", ""],
    ["ETA", ""],
    ["ETD", ""],
    ["Contacto / Contact Name", ""],
    ["Rol / Role", ""],
    ["Email", ""],
    ["Teléfono / Phone", ""],
    ["Compañía / Company", ""],
    ["Moneda / Currency  (USD / EUR / DOP)", ""],
  ];

  let zebra = false;
  for (const [label, val] of fields) {
    const r = sheet.getRow(row);
    r.height = 20;
    const lblCell = r.getCell(1);
    lblCell.value = label;
    lblCell.font  = { bold: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
    lblCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
    lblCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };

    const valCell = r.getCell(2);
    valCell.value = val;
    valCell.font  = { size: 10, color: { argb: DARK }, name: "Calibri" };
    valCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: zebra ? LIGHT : WHITE } };
    valCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    zebra = !zebra;
    row++;
  }
  frame(sheet, vesselStart, row - 1, 1, C);
  row += 2;

  // Notes
  sheet.mergeCells(row, 1, row, C);
  const nt = sheet.getCell(row, 1);
  nt.value = "NOTAS GENERALES  /  GENERAL NOTES";
  nt.font  = { bold: true, size: 9, color: { argb: GOLD }, name: "Calibri" };
  nt.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  nt.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;
  row++;

  const notesStart = row;
  sheet.mergeCells(row, 1, row + 7, C);
  const notesCell = sheet.getCell(row, 1);
  notesCell.value = "";
  notesCell.font  = { size: 10, color: { argb: DARK }, name: "Calibri" };
  notesCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: WHITE } };
  notesCell.alignment = { vertical: "top", horizontal: "left", indent: 1, wrapText: true };
  for (let r = row; r <= row + 7; r++) sheet.getRow(r).height = 22;
  row += 8;
  frame(sheet, notesStart, row - 1, 1, C);

  addFooter(sheet, C, row);
}

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  const categories = parseCatalog();
  const totalProducts = categories.reduce((n, c) => n + c.products.length, 0);

  console.log(`Parsed ${categories.length} categories / ${totalProducts} products`);

  const wb = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();
  wb.company = "De Jesús Ship Supply";
  wb.title   = "Plantilla de Provisiones";

  // 1. Cover
  const cover = buildCoverSheet(wb, categories.length, totalProducts);

  // 2..11. Category sheets
  categories.forEach((cat, i) => buildCategorySheet(wb, cat, i + 1));

  // 12. Summary
  buildSummarySheet(wb);

  // Finish cover index (after sheets exist so the count is meaningful)
  finishCoverSheet(cover.sheet, cover.row, cover.totalCols, categories);

  const outPath = resolve(repoRoot, "public/plantilla-provisiones.xlsx");
  mkdirSync(dirname(outPath), { recursive: true });
  const buffer = await wb.xlsx.writeBuffer();
  writeFileSync(outPath, Buffer.from(buffer));

  console.log(`✓ Wrote ${outPath}`);
  console.log(`  Sheets: ${wb.worksheets.length}`);
  wb.worksheets.forEach((s, i) => console.log(`    ${i + 1}. ${s.name}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
