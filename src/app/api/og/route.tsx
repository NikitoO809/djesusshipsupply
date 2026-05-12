import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const COPY = {
  es: {
    label: "SHIP CHANDLER · REPÚBLICA DOMINICANA",
    title: "De Jesús Ship Supply",
    tagline: "Provisiones marítimas y gestión de desechos MARPOL en los 8 puertos principales de RD.",
    services: ["Provisiones", "MARPOL", "Suministros técnicos"],
    cta: "djshipsupply.com",
    ports: "8 puertos · 24/7",
  },
  en: {
    label: "SHIP CHANDLER · DOMINICAN REPUBLIC",
    title: "De Jesús Ship Supply",
    tagline: "Ship provisions and MARPOL waste management across the 8 main ports of the Dominican Republic.",
    services: ["Provisions", "MARPOL", "Technical supplies"],
    cta: "djshipsupply.com",
    ports: "8 ports · 24/7",
  },
} as const;

type Locale = keyof typeof COPY;

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawLocale = searchParams.get("locale") ?? "es";
  const locale: Locale = rawLocale === "en" ? "en" : "es";
  const copy = COPY[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0A2540 0%, #1B3A5C 60%, #0A2540 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Top gold bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #C9A961, #D4B976, #C9A961)",
          }}
        />

        {/* Subtle diagonal lines decoration */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 320,
            background:
              "repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(201,169,97,0.04) 20px, rgba(201,169,97,0.04) 21px)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Label */}
          <div
            style={{
              color: "#C9A961",
              fontSize: 14,
              letterSpacing: 4,
              fontFamily: "Arial, sans-serif",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {copy.label}
          </div>

          {/* Company name */}
          <div
            style={{
              color: "#F8F5EE",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 28,
              maxWidth: 800,
            }}
          >
            {copy.title}
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "rgba(248,245,238,0.75)",
              fontSize: 22,
              lineHeight: 1.5,
              maxWidth: 680,
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
            }}
          >
            {copy.tagline}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Services badges */}
          <div style={{ display: "flex", gap: 12 }}>
            {copy.services.map((s) => (
              <div
                key={s}
                style={{
                  background: "rgba(201,169,97,0.15)",
                  border: "1px solid rgba(201,169,97,0.4)",
                  color: "#C9A961",
                  padding: "8px 18px",
                  fontSize: 14,
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Domain + ports */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <div
              style={{
                color: "#C9A961",
                fontSize: 18,
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {copy.cta}
            </div>
            <div
              style={{
                color: "rgba(248,245,238,0.5)",
                fontSize: 13,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 2,
              }}
            >
              {copy.ports}
            </div>
          </div>
        </div>

        {/* Bottom gold bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(201,169,97,0.4)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
