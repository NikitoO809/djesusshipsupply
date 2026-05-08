import * as React from "react";
import type { QuoteProvisionsValues } from "@/lib/schemas/quote-provisions";
import type { QuoteMarpolValues } from "@/lib/schemas/quote-marpol";

type InternalQuoteProps =
  | { type: "provisions"; payload: QuoteProvisionsValues; submittedAt: string; locale: "es" | "en" }
  | { type: "marpol"; payload: QuoteMarpolValues; submittedAt: string; locale: "es" | "en" };

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

export function InternalQuoteEmail(props: InternalQuoteProps) {
  const { type, payload, submittedAt } = props;
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

  const detailRows = isProvisions
    ? [
        {
          label: "Categorías / Categories",
          value: (payload as QuoteProvisionsValues).categories.join(", "),
        },
        {
          label: "Moneda / Currency",
          value: (payload as QuoteProvisionsValues).currency,
        },
        {
          label: "Listado / Notes",
          value: (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {(payload as QuoteProvisionsValues).notes}
            </pre>
          ),
        },
      ]
    : [
        {
          label: "Tipos de residuo / Waste types",
          value: (payload as QuoteMarpolValues).wasteTypes.join(", "),
        },
        {
          label: "Volumen / Volume",
          value: (payload as QuoteMarpolValues).volume,
        },
        {
          label: "Modalidad / Mode",
          value: (payload as QuoteMarpolValues).mode,
        },
        {
          label: "Notas / Notes",
          value: (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {(payload as QuoteMarpolValues).additionalNotes || "—"}
            </pre>
          ),
        },
      ];

  return (
    <html lang="es">
      <body style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ fontSize: "14px", letterSpacing: "0.2em", color: gold }}>
              DJSS · DE JESÚS SHIP SUPPLY
            </div>
            <h1 style={{ fontSize: "20px", margin: "6px 0 0", fontWeight: 600 }}>
              {heading}
            </h1>
            <div style={{ fontSize: "12px", marginTop: "6px", color: cream, opacity: 0.85 }}>
              {submittedAt}
            </div>
          </div>

          <SectionTable title="Datos del buque / Vessel" rows={vesselRows} />
          <SectionTable title="Escala / Port call" rows={portRows} />
          <SectionTable title="Contacto / Contact" rows={contactRows} />
          <SectionTable
            title={
              isProvisions
                ? "Detalle / Provisions detail"
                : "Detalle / Waste detail"
            }
            rows={detailRows}
          />

          <div style={footerStyle}>
            <strong style={{ color: navy }}>De Jesús Ship Supply</strong>
            <br />
            ops@djesusshipsupply.com · djesusshipsupply.com
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
