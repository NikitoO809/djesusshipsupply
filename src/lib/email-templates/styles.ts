import type * as React from "react";

export const colors = {
  navy: "#0A2540",
  gold: "#C9A961",
  cream: "#F8F5EE",
  charcoal: "#1A1A1A",
  border: "#e7e1d4",
} as const;

export const containerStyle: React.CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: colors.charcoal,
  backgroundColor: colors.cream,
  margin: 0,
  padding: "24px",
};

export const headerStyle: React.CSSProperties = {
  backgroundColor: colors.navy,
  color: colors.cream,
  padding: "20px 24px",
  borderBottom: `3px solid ${colors.gold}`,
};

export const footerStyle: React.CSSProperties = {
  backgroundColor: colors.cream,
  color: colors.navy,
  padding: "16px 24px",
  fontSize: "12px",
  textAlign: "center",
  borderTop: `1px solid ${colors.border}`,
};
