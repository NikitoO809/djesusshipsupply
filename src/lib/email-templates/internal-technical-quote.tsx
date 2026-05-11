import * as React from "react";
import type { QuoteTechnicalValues } from "@/lib/schemas/quote-technical";
import type { CustomItem } from "@/lib/schemas/quote-provisions";
import { colors, containerStyle, headerStyle, footerStyle } from "./styles";

const { navy, gold, cream, charcoal, border } = colors;

const cardStyle: React.CSSProperties = {
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: `1px solid ${border}`,
  borderRadius: "8px",
  overflow: "hidden",
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

interface Props {
  payload: QuoteTechnicalValues;
  submittedAt: string;
  locale: "es" | "en";
}

export function InternalTechnicalQuoteEmail({ payload, submittedAt }: Props) {
  const groups = payload.items.reduce<
    Record<string, { titleEs: string; items: QuoteTechnicalValues["items"] }>
  >((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = { titleEs: item.categoryTitleEs, items: [] };
    }
    acc[item.categoryId].items.push(item);
    return acc;
  }, {});

  return (
    <html lang="es">
      <body style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ fontSize: "14px", letterSpacing: "0.2em", color: gold }}>
              DJSS · DE JESÚS SHIP SUPPLY
            </div>
            <h1 style={{ fontSize: "20px", margin: "6px 0 0", fontWeight: 600 }}>
              Nueva cotización — Suministros Técnicos / New Quote — Technical Supplies
            </h1>
            <div style={{ fontSize: "12px", marginTop: "6px", color: cream, opacity: 0.85 }}>
              {submittedAt}
            </div>
          </div>

          <SectionTable
            title="Datos del buque / Vessel"
            rows={[
              { label: "Buque / Vessel", value: payload.vesselName },
              { label: "Bandera / Flag", value: payload.flag },
              { label: "IMO", value: payload.imo },
              { label: "Tipo / Type", value: payload.vesselType },
            ]}
          />

          <SectionTable
            title="Escala / Port call"
            rows={[
              { label: "Puerto / Port", value: payload.port },
              { label: "ETA", value: payload.eta },
              { label: "ETD", value: payload.etd },
            ]}
          />

          <SectionTable
            title="Contacto / Contact"
            rows={[
              { label: "Nombre / Name", value: payload.contactName },
              { label: "Cargo / Role", value: payload.role },
              { label: "Email", value: payload.email },
              { label: "Teléfono / Phone", value: payload.phone },
              { label: "Empresa / Company", value: payload.company },
            ]}
          />

          <SectionTable
            title="Preferencias / Preferences"
            rows={[
              { label: "Moneda / Currency", value: payload.currency },
              { label: "Notas / Notes", value: payload.notes || "—" },
            ]}
          />

          <h3 style={sectionTitleStyle}>
            Productos solicitados / Requested products ({payload.items.length} ítems)
          </h3>
          <table style={itemsTableStyle} cellPadding={0} cellSpacing={0}>
            <thead>
              <tr>
                <th style={itemsThStyle}>Producto / Product</th>
                <th style={{ ...itemsThStyle, width: "60px", textAlign: "right" }}>Cant.</th>
                <th style={{ ...itemsThStyle, width: "55px" }}>Unidad</th>
                <th style={{ ...itemsThStyle, width: "160px" }}>Nota</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groups).map(([catId, group]) => (
                <React.Fragment key={catId}>
                  <tr>
                    <td
                      colSpan={4}
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
                      {group.titleEs}
                    </td>
                  </tr>
                  {group.items.map((item) => (
                    <tr key={item.id}>
                      <td style={itemsTdStyle}>{item.name}</td>
                      <td style={{ ...itemsTdStyle, textAlign: "right" }}>
                        <strong>{item.qty}</strong>
                      </td>
                      <td style={itemsTdStyle}>{item.unit}</td>
                      <td style={{ ...itemsTdStyle, color: "#5a6878" }}>{item.note || "—"}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {((payload as { customItems?: CustomItem[] }).customItems ?? []).filter(i => i.name.trim()).length > 0 && (() => {
            const items = ((payload as { customItems?: CustomItem[] }).customItems ?? []).filter(i => i.name.trim());
            return (
              <>
                <h3 style={{ ...sectionTitleStyle, color: navy }}>
                  Productos personalizados / Custom products ({items.length})
                </h3>
                <table style={itemsTableStyle} cellPadding={0} cellSpacing={0}>
                  <thead>
                    <tr>
                      <th style={itemsThStyle}>Descripción / Description</th>
                      <th style={{ ...itemsThStyle, width: "60px", textAlign: "right" }}>Cant.</th>
                      <th style={{ ...itemsThStyle, width: "55px" }}>Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td style={itemsTdStyle}>{it.name}</td>
                        <td style={{ ...itemsTdStyle, textAlign: "right" }}><strong>{it.qty}</strong></td>
                        <td style={itemsTdStyle}>{it.unit || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            );
          })()}

          <div style={footerStyle}>
            <strong style={{ color: navy }}>De Jesús Ship Supply</strong>
            <br />
            info@djshipsupply.com · djshipsupply.com
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

export default InternalTechnicalQuoteEmail;
