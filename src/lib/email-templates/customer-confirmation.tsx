import * as React from "react";

type Props = {
  locale: "es" | "en";
  contactName: string;
  type: "provisions" | "marpol";
};

import { colors, containerStyle, headerStyle, footerStyle } from "./styles";

const { navy, gold, cream, charcoal, border } = colors;

const COPY = {
  es: {
    subject: "Solicitud recibida — De Jesús Ship Supply",
    hello: (n: string) => `Estimado/a ${n},`,
    intro:
      "Hemos recibido su solicitud de cotización. Un coordinador la revisará y le responderá en menos de 2 horas hábiles con disponibilidad y precio.",
    urgent:
      "Para asuntos urgentes, contáctenos por WhatsApp al número indicado en nuestro sitio.",
    type: {
      provisions: "Tipo de solicitud: Provisiones",
      marpol: "Tipo de solicitud: Gestión de desechos MARPOL",
    },
    closing: "Gracias por su confianza.",
    team: "El equipo de De Jesús Ship Supply",
    legal:
      "Este correo es una confirmación automática de la solicitud enviada desde djesusshipsupply.com. Si no realizó esta solicitud, ignore este mensaje.",
  },
  en: {
    subject: "Request received — De Jesús Ship Supply",
    hello: (n: string) => `Dear ${n},`,
    intro:
      "We have received your quote request. A coordinator will review it and respond within 2 business hours with availability and pricing.",
    urgent:
      "For urgent matters, please reach us on WhatsApp at the number listed on our site.",
    type: {
      provisions: "Request type: Provisions",
      marpol: "Request type: MARPOL waste management",
    },
    closing: "Thank you for your trust.",
    team: "The De Jesús Ship Supply team",
    legal:
      "This is an automated confirmation of a request submitted via djesusshipsupply.com. If you did not submit this request, please ignore this message.",
  },
} as const;

const cardStyle: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: `1px solid ${border}`,
  borderRadius: "8px",
  overflow: "hidden",
};

const bodyStyle: React.CSSProperties = {
  padding: "24px",
  fontSize: "15px",
  lineHeight: 1.55,
  color: charcoal,
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: "12px",
  padding: "6px 12px",
  border: `1px solid ${gold}`,
  borderRadius: "999px",
  color: navy,
  fontSize: "12px",
  letterSpacing: "0.04em",
};

export function CustomerConfirmationEmail({ locale, contactName, type }: Props) {
  const t = COPY[locale];
  return (
    <html lang={locale}>
      <body style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ fontSize: "14px", letterSpacing: "0.2em", color: gold }}>
              DJSS · DE JESÚS SHIP SUPPLY
            </div>
            <h1 style={{ fontSize: "20px", margin: "6px 0 0", fontWeight: 600 }}>
              {locale === "es" ? "Solicitud recibida" : "Request received"}
            </h1>
          </div>

          <div style={bodyStyle}>
            <p style={{ marginTop: 0 }}>{t.hello(contactName)}</p>
            <p>{t.intro}</p>
            <span style={tagStyle}>{t.type[type]}</span>
            <p style={{ marginTop: "20px" }}>{t.urgent}</p>
            <p style={{ marginBottom: 0 }}>
              {t.closing}
              <br />
              <strong style={{ color: navy }}>{t.team}</strong>
            </p>
          </div>

          <div style={footerStyle}>
            <strong style={{ color: navy }}>De Jesús Ship Supply</strong>
            <br />
            miguelcarmona809v@gmail.com · djesusshipsupply.com
            <br />
            <span style={{ color: "#5a6878" }}>{t.legal}</span>
          </div>
        </div>
      </body>
    </html>
  );
}

export const customerConfirmationSubject = (locale: "es" | "en") =>
  COPY[locale].subject;

export default CustomerConfirmationEmail;
