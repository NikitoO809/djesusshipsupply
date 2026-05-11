import ExcelJS from "exceljs";
import type { QuoteTechnicalValues } from "@/lib/schemas/quote-technical";
import type { QuoteProvisionsRichValues } from "@/lib/schemas/quote-provisions";
import type { QuoteUnifiedValues } from "@/lib/schemas/quote-unified";

// ─── Brand colors ────────────────────────────────────────────
const NAVY = "FF0A2540";
const GOLD = "FFC9A961";
const CREAM = "FFF8F5EE";
const BORDER = "FFE7E1D4";
const WHITE = "FFFFFFFF";

// ─── Shared style helpers ─────────────────────────────────────

function applyHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    cell.font = { bold: true, color: { argb: CREAM }, size: 10 };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      bottom: { style: "medium", color: { argb: GOLD } },
    };
  });
  row.height = 22;
}

function applyCategoryRow(row: ExcelJS.Row, colCount: number) {
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
    cell.font = { bold: true, color: { argb: NAVY }, size: 9 };
    cell.border = {
      bottom: { style: "thin", color: { argb: BORDER } },
      top: { style: "thin", color: { argb: BORDER } },
    };
  }
  row.height = 18;
}

function applyDataRow(row: ExcelJS.Row, zebra: boolean) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: zebra ? "FFF5F2EC" : WHITE },
    };
    cell.font = { size: 10, color: { argb: "FF1A1A1A" } };
    cell.border = {
      bottom: { style: "hair", color: { argb: BORDER } },
    };
    cell.alignment = { vertical: "middle" };
  });
  row.height = 18;
}

function applyTotalsRow(row: ExcelJS.Row) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    cell.font = { bold: true, color: { argb: GOLD }, size: 10 };
    cell.border = {
      top: { style: "medium", color: { argb: GOLD } },
    };
  });
  row.height = 20;
}

// ─── Info block (vessel + contact) ───────────────────────────

type InfoPayload = {
  vesselName: string;
  flag: string;
  imo?: string;
  vesselType: string;
  port: string;
  eta: string;
  etd?: string;
  contactName: string;
  role: string;
  email: string;
  phone?: string;
  company?: string;
  currency: string;
  notes?: string;
};

function addInfoBlock(sheet: ExcelJS.Worksheet, p: InfoPayload) {
  const labelStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 9, color: { argb: NAVY } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } },
    alignment: { horizontal: "right", vertical: "middle" },
  };
  const valueStyle: Partial<ExcelJS.Style> = {
    font: { size: 10, color: { argb: "FF1A1A1A" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: WHITE } },
    alignment: { horizontal: "left", vertical: "middle" },
  };

  const pairs: [string, string][] = [
    ["Buque / Vessel", p.vesselName],
    ["Bandera / Flag", p.flag],
    ["IMO", p.imo || "—"],
    ["Tipo / Type", p.vesselType],
    ["Puerto / Port", p.port],
    ["ETA", p.eta],
    ["ETD", p.etd || "—"],
    ["Contacto / Contact", p.contactName],
    ["Cargo / Role", p.role],
    ["Email", p.email],
    ["Teléfono / Phone", p.phone || "—"],
    ["Empresa / Company", p.company || "—"],
    ["Moneda / Currency", p.currency],
    ["Notas / Notes", p.notes || "—"],
  ];

  for (const [label, value] of pairs) {
    const row = sheet.addRow([label, value]);
    Object.assign(row.getCell(1), labelStyle);
    Object.assign(row.getCell(2), valueStyle);
    row.height = 17;
  }

  sheet.addRow([]); // spacer
}

// ─── Technical items sheet ────────────────────────────────────

type TechItem = { categoryTitleEs: string; name: string; qty: number; unit: string; note?: string };

function addTechnicalItemsSheet(
  wb: ExcelJS.Workbook,
  items: TechItem[],
  info: InfoPayload,
  sheetName = "Suministros Técnicos"
) {
  const sheet = wb.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1 },
    views: [{ showGridLines: false }],
  });

  sheet.columns = [
    { key: "cat", width: 24 },
    { key: "name", width: 36 },
    { key: "qty", width: 8 },
    { key: "unit", width: 10 },
    { key: "note", width: 28 },
  ];

  // Title
  sheet.mergeCells("A1:E1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "De Jesús Ship Supply — Suministros Técnicos / Technical Supplies";
  titleCell.font = { bold: true, size: 12, color: { argb: CREAM } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(1).height = 28;

  sheet.addRow([]);

  addInfoBlock(sheet, info);

  // Items header
  const hdr = sheet.addRow(["Categoría", "Producto / Product", "Cant.", "Unidad", "Nota / Note"]);
  applyHeaderRow(hdr);

  // Group by category
  const groups = items.reduce<Record<string, TechItem[]>>((acc, item) => {
    (acc[item.categoryTitleEs] ??= []).push(item);
    return acc;
  }, {});

  let zebra = false;
  let totalQty = 0;

  for (const [cat, catItems] of Object.entries(groups)) {
    const catRow = sheet.addRow([cat, "", "", "", ""]);
    sheet.mergeCells(`A${catRow.number}:E${catRow.number}`);
    applyCategoryRow(catRow, 5);

    for (const item of catItems) {
      const dataRow = sheet.addRow(["", item.name, item.qty, item.unit, item.note || ""]);
      applyDataRow(dataRow, zebra);
      dataRow.getCell(3).alignment = { horizontal: "center" };
      totalQty += item.qty;
      zebra = !zebra;
    }
  }

  const totalsRow = sheet.addRow(["", `Total: ${items.length} productos`, totalQty, "", ""]);
  applyTotalsRow(totalsRow);
  totalsRow.getCell(3).alignment = { horizontal: "center" };

  return sheet;
}

// ─── Provisions items sheet ───────────────────────────────────

type ProvItem = { categoryName: string; name: string; qty: number; unit: string };

function addProvisionsItemsSheet(
  wb: ExcelJS.Workbook,
  items: ProvItem[],
  info: InfoPayload,
  sheetName = "Provisiones"
) {
  const sheet = wb.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1 },
    views: [{ showGridLines: false }],
  });

  sheet.columns = [
    { key: "cat", width: 28 },
    { key: "name", width: 40 },
    { key: "qty", width: 8 },
    { key: "unit", width: 14 },
  ];

  // Title
  sheet.mergeCells("A1:D1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "De Jesús Ship Supply — Provisiones / Provisions";
  titleCell.font = { bold: true, size: 12, color: { argb: CREAM } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(1).height = 28;

  sheet.addRow([]);

  addInfoBlock(sheet, info);

  // Items header
  const hdr = sheet.addRow(["Categoría", "Producto / Product", "Cant.", "Unidad"]);
  applyHeaderRow(hdr);

  const groups = items.reduce<Record<string, ProvItem[]>>((acc, item) => {
    (acc[item.categoryName] ??= []).push(item);
    return acc;
  }, {});

  let zebra = false;
  let totalQty = 0;

  for (const [cat, catItems] of Object.entries(groups)) {
    const catRow = sheet.addRow([cat, "", "", ""]);
    sheet.mergeCells(`A${catRow.number}:D${catRow.number}`);
    applyCategoryRow(catRow, 4);

    for (const item of catItems) {
      const dataRow = sheet.addRow(["", item.name, item.qty, item.unit || "—"]);
      applyDataRow(dataRow, zebra);
      dataRow.getCell(3).alignment = { horizontal: "center" };
      totalQty += item.qty;
      zebra = !zebra;
    }
  }

  const totalsRow = sheet.addRow(["", `Total: ${items.length} productos`, totalQty, ""]);
  applyTotalsRow(totalsRow);
  totalsRow.getCell(3).alignment = { horizontal: "center" };

  return sheet;
}

// ─── Public API ───────────────────────────────────────────────

export async function buildTechnicalExcel(
  payload: QuoteTechnicalValues
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();

  const info: InfoPayload = {
    vesselName: payload.vesselName,
    flag: payload.flag,
    imo: payload.imo,
    vesselType: payload.vesselType,
    port: payload.port,
    eta: payload.eta,
    etd: payload.etd,
    contactName: payload.contactName,
    role: payload.role,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    currency: payload.currency,
    notes: payload.notes,
  };

  addTechnicalItemsSheet(wb, payload.items, info);

  return Buffer.from(await wb.xlsx.writeBuffer());
}

export async function buildProvisionsExcel(
  payload: QuoteProvisionsRichValues
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();

  const info: InfoPayload = {
    vesselName: payload.vesselName,
    flag: payload.flag,
    imo: payload.imo,
    vesselType: payload.vesselType,
    port: payload.port,
    eta: payload.eta,
    etd: payload.etd,
    contactName: payload.contactName,
    role: payload.role,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    currency: payload.currency,
    notes: payload.notes,
  };

  if (payload.method === "catalog") {
    addProvisionsItemsSheet(wb, payload.items, info);
  } else {
    const extra = payload.extraItems ?? [];
    if (extra.length > 0) {
      addProvisionsItemsSheet(wb, extra, info, "Ítems adicionales");
    } else {
      // File-only: still add info sheet
      const sheet = wb.addWorksheet("Info", { views: [{ showGridLines: false }] });
      sheet.columns = [{ width: 28 }, { width: 40 }];
      const titleRow = sheet.addRow(["De Jesús Ship Supply — Provisiones"]);
      titleRow.getCell(1).font = { bold: true, size: 12, color: { argb: CREAM } };
      titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      sheet.addRow([]);
      addInfoBlock(sheet, info);
    }
  }

  return Buffer.from(await wb.xlsx.writeBuffer());
}

export async function buildUnifiedExcel(
  payload: QuoteUnifiedValues
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "De Jesús Ship Supply";
  wb.created = new Date();

  const info: InfoPayload = {
    vesselName: payload.vesselName,
    flag: payload.flag,
    imo: payload.imo,
    vesselType: payload.vesselType,
    port: payload.port,
    eta: payload.eta,
    etd: payload.etd,
    contactName: payload.contactName,
    role: payload.role,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    currency: payload.currency,
    notes: payload.notes,
  };

  if (payload.technicalItems.length > 0) {
    addTechnicalItemsSheet(wb, payload.technicalItems, info);
  }

  if (payload.provisionsItems.length > 0) {
    addProvisionsItemsSheet(wb, payload.provisionsItems, info);
  }

  return Buffer.from(await wb.xlsx.writeBuffer());
}
