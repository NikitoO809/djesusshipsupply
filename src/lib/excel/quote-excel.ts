import ExcelJS from "exceljs";
import type { QuoteTechnicalValues } from "@/lib/schemas/quote-technical";
import type { QuoteProvisionsRichValues } from "@/lib/schemas/quote-provisions";
import type { QuoteUnifiedValues } from "@/lib/schemas/quote-unified";

// ─── Brand palette ───────────────────────────────────────────
const NAVY   = "FF0A2540";
const GOLD   = "FFC9A961";
const CREAM  = "FFF8F5EE";
const WHITE  = "FFFFFFFF";
const DARK   = "FF1A1A1A";
const LIGHT  = "FFF5F2EC"; // very light cream for alt rows

// ─── Border helpers ──────────────────────────────────────────
type BorderStyle = ExcelJS.BorderStyle;

const bMedium  = (argb = NAVY): ExcelJS.Border => ({ style: "medium"  as BorderStyle, color: { argb } });
const bThin    = (argb = NAVY): ExcelJS.Border => ({ style: "thin"    as BorderStyle, color: { argb } });
const bHair    = (argb = NAVY): ExcelJS.Border => ({ style: "hair"    as BorderStyle, color: { argb } });
const bNone    = ()            : ExcelJS.Border => ({ style: "none" as BorderStyle, color: { argb: "00000000" } });

/** Apply outer medium + inner thin borders to a rectangular range (skips merged inner cells). */
function frame(
  sheet: ExcelJS.Worksheet,
  r1: number, r2: number,
  c1: number, c2: number
) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top    : r === r1 ? bMedium() : bThin(),
        bottom : r === r2 ? bMedium() : bThin(),
        left   : c === c1 ? bMedium() : bThin(),
        right  : c === c2 ? bMedium() : bThin(),
      };
    }
  }
}

/** Apply outer medium border only (no inner lines). Used for merged full-width rows. */
function frameOuter(
  sheet: ExcelJS.Worksheet,
  r1: number, r2: number,
  c1: number, c2: number
) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top    : r === r1 ? bMedium() : bNone(),
        bottom : r === r2 ? bMedium() : bNone(),
        left   : c === c1 ? bMedium() : bNone(),
        right  : c === c2 ? bMedium() : bNone(),
      };
    }
  }
}

// ─── Types ───────────────────────────────────────────────────

type InfoPayload = {
  vesselName : string;
  flag       : string;
  imo?       : string;
  vesselType : string;
  port       : string;
  eta        : string;
  etd?       : string;
  contactName: string;
  role       : string;
  email      : string;
  phone?     : string;
  company?   : string;
  currency   : string;
  notes?     : string;
};

type TechItem  = { categoryTitleEs: string; name: string; qty: number; unit: string; note?: string };
type ProvItem  = { categoryName: string;    name: string; qty: number; unit: string };

// ─── Quote number ────────────────────────────────────────────

function quoteNumber(date: Date): string {
  const d    = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `DJSS-${d}-${rand}`;
}

// ─── Sheet builder ────────────────────────────────────────────

/**
 * Builds a Print Invoice sheet.
 * @param colCount 4 for technical (product/qty/unit/note), 3 for provisions (product/qty/unit)
 */
function buildInvoiceSheet(
  wb       : ExcelJS.Workbook,
  sheetName: string,
  info     : InfoPayload,
  items    : (TechItem | ProvItem)[],
  colCount : 3 | 4,
  quoteNum : string,
  date     : Date,
  attachmentName?: string
): ExcelJS.Worksheet {

  const sheet = wb.addWorksheet(sheetName, {
    pageSetup: {
      paperSize   : 9,           // A4
      orientation : "portrait",
      fitToPage   : true,
      fitToWidth  : 1,
      margins     : { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
    },
    views: [{ showGridLines: false }],
    properties: { defaultRowHeight: 18 },
  });

  // Column widths
  if (colCount === 4) {
    sheet.columns = [
      { key: "a", width: 42 },
      { key: "b", width:  8 },
      { key: "c", width: 12 },
      { key: "d", width: 26 },
    ];
  } else {
    sheet.columns = [
      { key: "a", width: 46 },
      { key: "b", width:  8 },
      { key: "c", width: 18 },
    ];
  }

  const C = colCount; // last col index (1-based)
  let row = 1;

  // ── HEADER BLOCK ────────────────────────────────────────────
  // Split: cols 1..2 = company  |  cols 3..C = quote details
  const midCol = Math.floor(C / 2) + 1; // col 3

  // Row 1: company name / quote number
  sheet.mergeCells(row, 1, row, midCol - 1);
  const companyCell = sheet.getCell(row, 1);
  companyCell.value = "DE JESÚS SHIP SUPPLY";
  companyCell.font  = { bold: true, size: 13, color: { argb: CREAM }, name: "Calibri" };
  companyCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  companyCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, midCol, row, C);
  const quoteNumCell = sheet.getCell(row, midCol);
  quoteNumCell.value = `COTIZACIÓN  Nº ${quoteNum}`;
  quoteNumCell.font  = { bold: true, size: 11, color: { argb: GOLD }, name: "Calibri" };
  quoteNumCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  quoteNumCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
  sheet.getRow(row).height = 26;
  row++;

  // Row 2: website / date
  sheet.mergeCells(row, 1, row, midCol - 1);
  const webCell = sheet.getCell(row, 1);
  webCell.value = "djshipsupply.com";
  webCell.font  = { italic: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
  webCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  webCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, midCol, row, C);
  const dateCell = sheet.getCell(row, midCol);
  dateCell.value = `Fecha / Date: ${date.toLocaleDateString("es-DO", { day: "2-digit", month: "long", year: "numeric" })}`;
  dateCell.font  = { size: 9, color: { argb: DARK }, name: "Calibri" };
  dateCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  dateCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
  sheet.getRow(row).height = 17;
  row++;

  // Row 3: email / currency
  sheet.mergeCells(row, 1, row, midCol - 1);
  const emailHeaderCell = sheet.getCell(row, 1);
  emailHeaderCell.value = "info@djshipsupply.com";
  emailHeaderCell.font  = { size: 9, color: { argb: NAVY }, name: "Calibri" };
  emailHeaderCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  emailHeaderCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, midCol, row, C);
  const currCell = sheet.getCell(row, midCol);
  currCell.value = `Moneda / Currency: ${info.currency}`;
  currCell.font  = { size: 9, color: { argb: DARK }, name: "Calibri" };
  currCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
  currCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
  sheet.getRow(row).height = 17;

  // Border the header block
  frameOuter(sheet, 1, row, 1, C);
  // Add the vertical divider manually
  for (let r = 1; r <= row; r++) {
    sheet.getCell(r, midCol - 1).border = {
      ...sheet.getCell(r, midCol - 1).border,
      right: bMedium(),
    };
    sheet.getCell(r, midCol).border = {
      ...sheet.getCell(r, midCol).border,
      left: bMedium(),
    };
  }
  row++;

  // ── VESSEL BLOCK ─────────────────────────────────────────────
  // Section title
  sheet.mergeCells(row, 1, row, C);
  const vesselTitleCell = sheet.getCell(row, 1);
  vesselTitleCell.value = "DATOS DEL BUQUE  /  VESSEL DETAILS";
  vesselTitleCell.font  = { bold: true, size: 9, color: { argb: GOLD }, name: "Calibri" };
  vesselTitleCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  vesselTitleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 18;

  // Apply left+right medium borders on title row
  sheet.getCell(row, 1).border = { top: bMedium(), bottom: bNone(), left: bMedium(), right: bNone() };
  sheet.getCell(row, C).border = { top: bMedium(), bottom: bNone(), left: bNone(), right: bMedium() };
  row++;

  const vesselStartRow = row;

  const labelStyle: Partial<ExcelJS.Style> = {
    font     : { bold: true, size: 9, color: { argb: NAVY }, name: "Calibri" },
    fill     : { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } },
    alignment: { vertical: "middle", horizontal: "right", indent: 1 },
  };
  const valueStyle: Partial<ExcelJS.Style> = {
    font     : { size: 10, color: { argb: DARK }, name: "Calibri" },
    fill     : { type: "pattern", pattern: "solid", fgColor: { argb: WHITE } },
    alignment: { vertical: "middle", horizontal: "left", indent: 1 },
  };

  // Helper: add a 2-pair info row (label, val, label, val)
  function addInfoRow(l1: string, v1: string, l2: string, v2: string) {
    const r = sheet.getRow(row);
    r.height = 17;

    if (C === 4) {
      const c1 = r.getCell(1); c1.value = l1; Object.assign(c1, labelStyle);
      const c2 = r.getCell(2); c2.value = v1; Object.assign(c2, valueStyle);
      const c3 = r.getCell(3); c3.value = l2; Object.assign(c3, labelStyle);
      const c4 = r.getCell(4); c4.value = v2; Object.assign(c4, valueStyle);
    } else {
      // 3 cols: merge col 2-3 for value on right
      const c1 = r.getCell(1); c1.value = l1; Object.assign(c1, labelStyle);
      c1.alignment = { ...c1.alignment, horizontal: "left" };
      sheet.mergeCells(row, 2, row, 3);
      const c2 = r.getCell(2); c2.value = `${l2 ? l2 + "  " : ""}${v1}  ${l2 ? v2 : ""}`;
      Object.assign(c2, valueStyle);
    }

    // Side borders
    sheet.getCell(row, 1).border = { ...sheet.getCell(row, 1).border, left: bMedium() };
    sheet.getCell(row, C).border = { ...sheet.getCell(row, C).border, right: bMedium() };
    row++;
  }

  // Helper: full-width info row
  function addFullRow(label: string, value: string) {
    sheet.mergeCells(row, 1, row, C);
    const cell = sheet.getCell(row, 1);
    cell.value = value ? `${label}  ${value}` : label;
    cell.font  = { size: 9, color: { argb: DARK }, name: "Calibri" };
    cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: WHITE } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
    sheet.getRow(row).height = 16;
    sheet.getCell(row, 1).border = { ...sheet.getCell(row, 1).border, left: bMedium() };
    sheet.getCell(row, C).border = { ...sheet.getCell(row, C).border, right: bMedium() };
    row++;
  }

  addInfoRow("Nombre / Vessel:", info.vesselName,   "Bandera / Flag:", info.flag);
  addInfoRow("Tipo / Type:",     info.vesselType,    "IMO:",            info.imo || "—");
  addInfoRow("Puerto / Port:",   info.port,          "ETA:",            `${info.eta}${info.etd ? `  ·  ETD: ${info.etd}` : ""}`);
  addFullRow("Contacto:", `${info.contactName}  ·  ${info.role}  ·  ${info.email}${info.phone ? `  ·  ${info.phone}` : ""}${info.company ? `  ·  ${info.company}` : ""}`);
  if (info.notes) {
    addFullRow("Notas / Notes:", info.notes);
  }

  const vesselEndRow = row - 1;

  // Bottom border of vessel block
  for (let c = 1; c <= C; c++) {
    const cell = sheet.getCell(vesselEndRow, c);
    cell.border = { ...cell.border, bottom: bMedium() };
  }

  // ── ITEMS TABLE ───────────────────────────────────────────────
  row++; // small gap before table

  const tableStartRow = row;

  // Table header row
  const hdr = sheet.getRow(row);
  hdr.height = 20;
  if (C === 4) {
    const cells = [
      ["PRODUCTO  /  PRODUCT", "left"],
      ["CANT.", "center"],
      ["UNIDAD", "center"],
      ["NOTA  /  NOTE", "left"],
    ] as const;
    cells.forEach(([val, align], i) => {
      const cell = hdr.getCell(i + 1);
      cell.value     = val;
      cell.font      = { bold: true, size: 9, color: { argb: CREAM }, name: "Calibri" };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      cell.alignment = { vertical: "middle", horizontal: align, indent: align === "left" ? 1 : 0 };
    });
  } else {
    [["PRODUCTO  /  PRODUCT", "left"], ["CANT.", "center"], ["UNIDAD", "center"]].forEach(([val, align], i) => {
      const cell = hdr.getCell(i + 1);
      cell.value     = val;
      cell.font      = { bold: true, size: 9, color: { argb: CREAM }, name: "Calibri" };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      cell.alignment = { vertical: "middle", horizontal: align as "left" | "center", indent: align === "left" ? 1 : 0 };
    });
  }
  row++;

  // Group items
  const groups = new Map<string, (TechItem | ProvItem)[]>();
  for (const item of items) {
    const catKey = "categoryTitleEs" in item ? item.categoryTitleEs : item.categoryName;
    if (!groups.has(catKey)) groups.set(catKey, []);
    groups.get(catKey)!.push(item);
  }

  let totalQty  = 0;
  let dataRowIdx = 0;

  for (const [cat, catItems] of groups) {
    // Category row (full width)
    sheet.mergeCells(row, 1, row, C);
    const catCell = sheet.getCell(row, 1);
    catCell.value     = cat.toUpperCase();
    catCell.font      = { bold: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
    catCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
    catCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    sheet.getRow(row).height = 17;
    // Side + inner borders for category row
    sheet.getCell(row, 1).border = { top: bThin(), bottom: bThin(), left: bMedium(), right: bNone() };
    sheet.getCell(row, C).border = { top: bThin(), bottom: bThin(), left: bNone(), right: bMedium() };
    row++;

    for (const item of catItems) {
      const isEven = dataRowIdx % 2 === 0;
      const bg     = isEven ? WHITE : LIGHT;
      const dRow   = sheet.getRow(row);
      dRow.height  = 17;

      if (C === 4) {
        const it = item as TechItem;
        [
          { v: `  ${it.name}`, a: "left"   as const },
          { v: it.qty,         a: "center" as const },
          { v: it.unit,        a: "center" as const },
          { v: it.note || "—", a: "left"   as const },
        ].forEach(({ v, a }, i) => {
          const cell = dRow.getCell(i + 1);
          cell.value     = v;
          cell.font      = { size: 9, color: { argb: DARK }, name: "Calibri" };
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
          cell.alignment = { vertical: "middle", horizontal: a, indent: a === "left" ? 1 : 0 };
        });
      } else {
        const it = item as ProvItem;
        [
          { v: `  ${it.name}`, a: "left"   as const },
          { v: it.qty,         a: "center" as const },
          { v: it.unit || "—", a: "center" as const },
        ].forEach(({ v, a }, i) => {
          const cell = dRow.getCell(i + 1);
          cell.value     = v;
          cell.font      = { size: 9, color: { argb: DARK }, name: "Calibri" };
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
          cell.alignment = { vertical: "middle", horizontal: a, indent: a === "left" ? 1 : 0 };
        });
      }

      totalQty += item.qty;
      dataRowIdx++;
      row++;
    }
  }

  // Totals row
  const totRow = sheet.getRow(row);
  totRow.height = 20;
  sheet.mergeCells(row, 1, row, C === 4 ? 1 : 1);
  totRow.getCell(1).value     = `TOTAL  ·  ${items.length} producto${items.length !== 1 ? "s" : ""}  ·  ${Object.keys(Object.fromEntries(groups)).length} categoría${groups.size !== 1 ? "s" : ""}`;
  totRow.getCell(1).font      = { bold: true, size: 9, color: { argb: CREAM }, name: "Calibri" };
  totRow.getCell(1).fill      = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  totRow.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  totRow.getCell(2).value     = totalQty;
  totRow.getCell(2).font      = { bold: true, size: 10, color: { argb: GOLD }, name: "Calibri" };
  totRow.getCell(2).fill      = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  totRow.getCell(2).alignment = { vertical: "middle", horizontal: "center" };

  for (let c = 3; c <= C; c++) {
    totRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  }

  const tableEndRow = row;
  row++;

  // Apply frame to the entire table block (header + items + totals)
  frame(sheet, tableStartRow, tableEndRow, 1, C);

  // ── FILE NOTE (if attachment) ─────────────────────────────────
  if (attachmentName) {
    row++;
    sheet.mergeCells(row, 1, row, C);
    const fileCell = sheet.getCell(row, 1);
    fileCell.value     = `📎  Archivo adjunto / Attached file: ${attachmentName}`;
    fileCell.font      = { italic: true, size: 9, color: { argb: NAVY }, name: "Calibri" };
    fileCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
    fileCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    sheet.getRow(row).height = 16;
    row++;
  }

  // ── SIGNATURE LINE ────────────────────────────────────────────
  row += 2;
  sheet.mergeCells(row, 1, row, Math.floor(C / 2));
  const sigCell = sheet.getCell(row, 1);
  sigCell.value     = "Firma / Signature: _______________________";
  sigCell.font      = { size: 9, color: { argb: NAVY }, name: "Calibri" };
  sigCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  sheet.mergeCells(row, Math.floor(C / 2) + 1, row, C);
  const stampCell = sheet.getCell(row, Math.floor(C / 2) + 1);
  stampCell.value     = "Sello / Stamp: ____________________________";
  stampCell.font      = { size: 9, color: { argb: NAVY }, name: "Calibri" };
  stampCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(row).height = 22;

  // ── FOOTER ────────────────────────────────────────────────────
  row += 2;
  sheet.mergeCells(row, 1, row, C);
  const footerCell = sheet.getCell(row, 1);
  footerCell.value     = "De Jesús Ship Supply  ·  djshipsupply.com  ·  info@djshipsupply.com  ·  Documento generado automáticamente";
  footerCell.font      = { size: 8, italic: true, color: { argb: "FF888888" }, name: "Calibri" };
  footerCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(row).height = 14;

  return sheet;
}

// ─── Public API ───────────────────────────────────────────────

export async function buildTechnicalExcel(payload: QuoteTechnicalValues): Promise<Buffer> {
  const wb   = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();

  const date     = new Date();
  const quoteNum = quoteNumber(date);

  const info: InfoPayload = {
    vesselName : payload.vesselName,
    flag       : payload.flag,
    imo        : payload.imo,
    vesselType : payload.vesselType,
    port       : payload.port,
    eta        : payload.eta,
    etd        : payload.etd,
    contactName: payload.contactName,
    role       : payload.role,
    email      : payload.email,
    phone      : payload.phone,
    company    : payload.company,
    currency   : payload.currency,
    notes      : payload.notes,
  };

  buildInvoiceSheet(wb, "Suministros Técnicos", info, payload.items, 4, quoteNum, date);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

export async function buildProvisionsExcel(payload: QuoteProvisionsRichValues): Promise<Buffer> {
  const wb   = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();

  const date     = new Date();
  const quoteNum = quoteNumber(date);

  const info: InfoPayload = {
    vesselName : payload.vesselName,
    flag       : payload.flag,
    imo        : payload.imo,
    vesselType : payload.vesselType,
    port       : payload.port,
    eta        : payload.eta,
    etd        : payload.etd,
    contactName: payload.contactName,
    role       : payload.role,
    email      : payload.email,
    phone      : payload.phone,
    company    : payload.company,
    currency   : payload.currency,
    notes      : payload.notes,
  };

  const attachmentName = payload.method !== "catalog"
    ? ("fileName" in payload ? (payload as { fileName?: string }).fileName : undefined)
    : undefined;

  const items = payload.method === "catalog"
    ? payload.items
    : (payload.extraItems ?? []);

  if (items.length > 0) {
    buildInvoiceSheet(wb, "Provisiones", info, items, 3, quoteNum, date, attachmentName);
  } else {
    // File-only: info sheet
    const sheet = wb.addWorksheet("Provisiones", { views: [{ showGridLines: false }] });
    sheet.columns = [{ width: 28 }, { width: 40 }];
    buildInvoiceSheet(wb, "Provisiones", info, [], 3, quoteNum, date, attachmentName);
  }

  return Buffer.from(await wb.xlsx.writeBuffer());
}

export async function buildUnifiedExcel(payload: QuoteUnifiedValues): Promise<Buffer> {
  const wb   = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();

  const date     = new Date();
  const quoteNum = quoteNumber(date);

  const info: InfoPayload = {
    vesselName : payload.vesselName,
    flag       : payload.flag,
    imo        : payload.imo,
    vesselType : payload.vesselType,
    port       : payload.port,
    eta        : payload.eta,
    etd        : payload.etd,
    contactName: payload.contactName,
    role       : payload.role,
    email      : payload.email,
    phone      : payload.phone,
    company    : payload.company,
    currency   : payload.currency,
    notes      : payload.notes,
  };

  if (payload.technicalItems.length > 0) {
    buildInvoiceSheet(wb, "Suministros Técnicos", info, payload.technicalItems, 4, quoteNum, date);
  }

  if (payload.provisionsItems.length > 0) {
    buildInvoiceSheet(wb, "Provisiones", info, payload.provisionsItems, 3, quoteNum, date);
  }

  return Buffer.from(await wb.xlsx.writeBuffer());
}
