"use client";

import { ShoppingCart } from "lucide-react";
import { useRfq } from "./useRfq";

export function RfqFloatingButton() {
  const { count, openDrawer } = useRfq();

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Ver cotización (${count} ítems)`}
      style={{
        position: "fixed",
        bottom: "5rem",
        right: "1.5rem",
        zIndex: 40,
      }}
      className="motion-safe:animate-in motion-safe:fade-in inline-flex items-center gap-2 h-12 px-4 rounded-sm bg-gold text-navy shadow-lg hover:bg-gold-light transition-colors text-[11px] uppercase tracking-[0.2em] font-semibold"
    >
      <ShoppingCart className="h-4 w-4" strokeWidth={2} />
      <span>Cotización</span>
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-navy text-gold text-[10px] font-bold">
        {count}
      </span>
    </button>
  );
}
