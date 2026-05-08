import * as React from "react";
import type {
  QuoteProvisionsValues,
  QuoteProvisionsRichValues,
  CartItem,
} from "@/lib/schemas/quote-provisions";
import type { QuoteMarpolValues } from "@/lib/schemas/quote-marpol";

type ProvisionsPayload = QuoteProvisionsValues | QuoteProvisionsRichValues;

type InternalQuoteProps =
  | {
      type: "provisions";
      payload: ProvisionsPayload;
      submittedAt: string;
      locale: "es" | "en";
      attachmentName?: string;
    }
  | {
      type: "marpol";
      payload: QuoteMarpolValues;
      submittedAt: string;
      locale: "es" | "en";
      attachmentName?: string;
    };

const navy = "#0A2540";
const gold = "#C9A961";
const cream = "#F8F5EE";
const charcoal = "#1A1A1A";
const border = "#e7e1d4";

const containerStyle: React.CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: charcoal,
  backgroundColor: cream,
  margin: 0,
  padding: "24px",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: `1px solid ${border}`,
  borderRadius: "8px",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: navy,
  color: cream,
  padding: "20px 24px",
  borderBottom: `3px solid ${gold}`,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 600,
  color: navy,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "10px 12px",
  backgroundColor: cream,
  borderBottom: `1px solid ${border}`,
  width: "38%",
};

const tdStyle: React.CSSProperties = {
  fontSize: "14px",
  color: charcoal,
  padding: "10px 12px",
  borderBottom: `1px solid ${border}`,
  verticalAlign: "top",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: gold,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  padding: "16px 24px 8px",
  borderTop: `1px solid ${border}`,
  margin: 0,
};

const footerStyle: React.CSSProperties = {
  backgroundColor: cream,
  color: navy,
  padding: "16px 24px",
  fontSize: "12px",
  textAlign: "center",
  borderTop: `1px solid ${border}`,
};

const itemsTableStyle: React.CSSProperties = {
  width: "calc(100% - 48px)",
  borderCollapse: "collapse",
  margin: "0 24px 12px",
};

const itemsThStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 600,
  color: navy,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "8px 10px",
  backgroundColor: cream,
  borderBottom: `1px solid ${border}`,
};

const itemsTdStyle: React.CSSProperties = {
  fontSize: "13px",
  color: charcoal,
  padding: "8px 10px",
  borderBottom: `1px solid ${border}`,
  verticalAlign: "top",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <th style={thStyle}>{label}</th>
      <td style={tdStyle}>{value || "—"}</td>
    </tr>
  );
}

function SectionTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <table style={tableStyle} cellPadding={0} cellSpacing={0}>
        <tbody>
          {rows.map((r) => (
            <Row key={r.label} label={r.label} value={r.value} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function ItemsTable({ title, items }: { title: string; items: CartItem[] }) {
  if (!items.length) return null;
  // Group by category
  const groups = items.reduce<Record<string, CartItem[]>>((acc, it) => {
    (acc[it.categoryName] ??= []).push(it);
    return acc;
  }, {});
  return (
    <>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <table style={itemsTableStyle} cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th style={itemsThStyle}>Producto / Product</th>
            <th style={{ ...itemsThStyle, width: "70px", textAlign: "right" }}>
              Cant. / Qty
            </th>
            <th style={{ ...itemsThStyle, width: "70px" }}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([catName, list]) => (
            <React.Fragment key={catName}>
              <tr>
                <td
                  colSpan={3}
                  style={{
                    ...itemsTdStyle,
                    backgroundColor: "#fafaf6",
                    fontWeight: 600,
                    color: gold,
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {catName}
                </td>
              </tr>
              {list.map((it) => (
                <tr key={it.id}>
                  <td style={itemsTdStyle}>{it.name}</td>
                  <td style={{ ...itemsTdStyle, textAlign: "right" }}>
                    <strong>{it.qty}</strong>
                  </td>
                  <td style={itemsTdStyle}>{it.unit || "—"}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

function isRichProvisions(
  payload: ProvisionsPayload
): payload is QuoteProvisionsRichValues {
  return typeof (payload as { method?: unknown }).method === "string";
}

export function InternalQuoteEmail(props: InternalQuoteProps) {
  const { type, payload, submittedAt, attachmentName } = props;
  const isProvisions = type === "provisions";
  const heading = isProvisions
    ? "Nueva cotización — Provisiones / New quote — Provisions"
    : "Nueva cotización — Desechos MARPOL / New quote — Waste management";

  const vesselRows = [
    { label: "Buque / Vessel", value: payload.vesselName },
    { label: "Bandera / Flag", value: payload.flag },
    { label: "IMO", value: payload.imo },
    { label: "Tipo / Type", value: payload.vesselType },
  ];

  const portRows = [
    { label: "Puerto / Port", value: payload.port },
    { label: "ETA", value: payload.eta },
    { label: "ETD", value: payload.etd },
  ];

  const contactRows = [
    { label: "Nombre / Name", value: payload.contactName },
    { label: "Cargo / Role", value: payload.role },
    { label: "Email", value: payload.email },
    { label: "Teléfono / Phone", value: payload.phone },
    { label: "Empresa / Company", value: payload.company },
  ];

  // -------- Provisions detail (rich vs legacy) --------
  let provisionsContent: React.ReactNode = null;
  if (isProvisions) {
    if (isRichProvisions(payload)) {
      const methodLabel =
        payload.method === "catalog"
          ? "Catálogo / Catalog"
          : payload.method === "upload"
          ? "Lista propia / Custom list"
          : "Plantilla / Template";

      const detailRows: Array<{ label: string; value: React.ReactNode }> = [
        { label: "Método / Method", value: methodLabel },
        { label: "Moneda / Currency", value: payload.currency },
      ];

      if (payload.method === "upload" || payload.method === "template") {
        detailRows.push({
          label: "Archivo / File",
          value: `${payload.fileName} (${(payload.fileSize / 1024).toFixed(0)} KB)`,
        });
      }

      if (payload.notes) {
        detailRows.push({
          label: "Notas / Notes",
          value: (
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {payload.notes}
            </pre>
          ),
        });
      }

      const items =
        payload.method === "catalog"
          ? payload.items
          : payload.extraItems ?? [];

      provisionsContent = (
        <>
          <SectionTable
            title="Detalle / Provisions detail"
            rows={detailRows}
          />
          {items.length > 0 ? (
            <ItemsTable
              title={
                payload.method === "catalog"
                  ? "Productos seleccionados / Selected products"
                  : "Productos adicionales / Additional products"
              }
              items={items}
            />
          ) : null}
        </>
      );
    } else {
      // Legacy provisions payload
      const legacy = payload as QuoteProvisionsValues;
      const detailRows = [
        {
          label: "Categorías / Categories",
          value: legacy.categories.join(", "),
        },
        { label: "Moneda / Currency", value: legacy.currency },
        {
          label: "Listado / Notes",
          value: (
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {legacy.notes}
            </pre>
          ),
        },
      ];
      provisionsContent = (
        <SectionTable title="Detalle / Provisions detail" rows={detailRows} />
      );
    }
  }

  // -------- Marpol detail --------
  const marpolContent = !isProvisions ? (
    <SectionTable
      title="Detalle / Waste detail"
      rows={[
        {
          label: "Tipos de residuo / Waste types",
          value: (payload as QuoteMarpolValues).wasteTypes.join(", "),
        },
        { label: "Volumen / Volume", value: (payload as QuoteMarpolValues).volume },
        { label: "Modalidad / Mode", value: (payload as QuoteMarpolValues).mode },
        {
          label: "Notas / Notes",
          value: (
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {(payload as QuoteMarpolValues).additionalNotes || "—"}
            </pre>
          ),
        },
      ]}
    />
  ) : null;

  return (
    <html lang="es">
      <body style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div
              style={{ fontSize: "14px", letterSpacing: "0.2em", color: gold }}
            >
              DJSS · DE JESÚS SHIP SUPPLY
            </div>
            <h1 style={{ fontSize: "20px", margin: "6px 0 0", fontWeight: 600 }}>
              {heading}
            </h1>
            <div
              style={{
                fontSize: "12px",
                marginTop: "6px",
                color: cream,
                opacity: 0.85,
              }}
            >
              {submittedAt}
            </div>
          </div>

          <SectionTable title="Datos del buque / Vessel" rows={vesselRows} />
          <SectionTable title="Escala / Port call" rows={portRows} />
          <SectionTable title="Contacto / Contact" rows={contactRows} />
          {provisionsContent}
          {marpolContent}

          {attachmentName ? (
            <div
              style={{
                margin: "12px 24px",
                padding: "10px 14px",
                backgroundColor: cream,
                border: `1px solid ${border}`,
                borderLeft: `3px solid ${gold}`,
                fontSize: "12px",
                color: navy,
              }}
            >
              📎 Archivo adjunto / Attached file: <strong>{attachmentName}</strong>
            </div>
          ) : null}

          <div style={footerStyle}>
            <strong style={{ color: navy }}>De Jesús Ship Supply</strong>
            <br />
            miguelcarmona809v@gmail.com · djesusshipsupply.com
            <br />
            <span style={{ color: "#5a6878" }}>
              Mensaje generado automáticamente — confidencial.
            </span>
          </div>
        </div>
      </body>
    </html>
  );
}

export default InternalQuoteEmail;
