"use client";

import { useEffect, useRef } from "react";
import { X, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useRfq } from "./useRfq";
import type { RfqEntry, RfqCustomItem } from "./RfqContext";
import { useUnifiedCart } from "@/components/unified-cart/UnifiedCartContext";

export function RfqDrawer() {
  const { entries, drawerOpen, closeDrawer, openContact, updateQty, updateNote, remove, customItems, setCustomItems } = useRfq();
  const { provisionsCount } = useUnifiedCart();
  const locale = useLocale();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const entriesList = Object.values(entries);

  const grouped = entriesList.reduce<Record<string, { titleEs: string; titleEn: string; items: RfqEntry[] }>>(
    (acc, entry) => {
      if (!acc[entry.categoryId]) {
        acc[entry.categoryId] = {
          titleEs: entry.categoryTitleEs,
          titleEn: entry.categoryTitleEn,
          items: [],
        };
      }
      acc[entry.categoryId].items.push(entry);
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          role="presentation"
          onClick={closeDrawer}
          style={{ position: "fixed", inset: 0, zIndex: 48, background: "rgba(5,21,41,0.7)" }}
          className="motion-safe:animate-in motion-safe:fade-in"
        />
      )}

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mi cotización"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 49,
          width: "min(420px, 100vw)",
          background: "#071e38",
          borderLeft: "1px solid rgba(201,169,97,0.15)",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A961", marginBottom: "2px" }}>
              Mi cotización
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
              {entriesList.length === 0
                ? "Sin ítems"
                : `${entriesList.length} ${entriesList.length === 1 ? "ítem" : "ítems"}`}
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Cerrar"
            style={{ color: "rgba(255,255,255,0.5)", padding: "4px" }}
            className="hover:text-cream transition-colors"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Custom items — always visible at the top */}
          <CustomItemsDrawer items={customItems} onUpdate={setCustomItems} locale={locale as "es" | "en"} />

          {/* Catalog items */}
          {entriesList.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "2rem" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
                Tu lista de cotización está vacía.
              </p>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "6px" }}>
                Agrega productos del catálogo con el botón &ldquo;+ Agregar&rdquo;.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {Object.entries(grouped).map(([catId, group]) => (
                <div key={catId}>
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#C9A961",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {group.titleEs}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {group.items.map((entry) => (
                      <DrawerItem
                        key={entry.item.id}
                        entry={entry}
                        onUpdateQty={updateQty}
                        onUpdateNote={updateNote}
                        onRemove={remove}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {(entriesList.length > 0 || customItems.filter(i => i.name.trim()).length > 0) && (
          <div
            style={{
              padding: "1rem 1.5rem 1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Provisions cross-sell */}
            {provisionsCount > 0 ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "4px",
                background: "rgba(20,160,100,0.12)",
                border: "1px solid rgba(20,160,100,0.25)",
              }}>
                <span style={{ color: "#34d399", fontSize: "11px" }}>✓</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  {provisionsCount} {provisionsCount === 1 ? "producto de provisiones" : "productos de provisiones"} incluido{provisionsCount !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <a
                href={`/${locale}/cotizar/provisiones`}
                onClick={closeDrawer}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "4px",
                  background: "rgba(201,169,97,0.06)",
                  border: "1px solid rgba(201,169,97,0.18)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
                  ¿También necesitas <strong style={{ color: "#C9A961" }}>provisiones</strong>?
                </span>
                <ArrowRight className="h-3 w-3 text-gold shrink-0" strokeWidth={2} />
              </a>
            )}

            <button
              type="button"
              onClick={() => { closeDrawer(); openContact(); }}
              className="group w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-[11px] uppercase tracking-[0.22em] font-semibold"
            >
              {provisionsCount > 0 ? "Solicitar cotización combinada" : "Solicitar cotización"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
            </button>
            <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
              Sin precio — recibirás cotización en &lt; 2 horas
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function DrawerItem({
  entry,
  onUpdateQty,
  onUpdateNote,
  onRemove,
}: {
  entry: RfqEntry;
  onUpdateQty: (id: string, qty: number) => void;
  onUpdateNote: (id: string, note: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
        padding: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "1.35", flex: 1 }}>
          {entry.item.name}
        </span>
        <button
          type="button"
          onClick={() => onRemove(entry.item.id)}
          aria-label="Eliminar ítem"
          style={{ color: "rgba(255,255,255,0.3)", padding: "2px", flexShrink: 0 }}
          className="hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => onUpdateQty(entry.item.id, entry.qty - 1)}
            aria-label="Reducir cantidad"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "26px",
              width: "26px",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Minus className="h-3 w-3" strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", minWidth: "1.5rem", textAlign: "center" }}>
            {entry.qty}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQty(entry.item.id, entry.qty + 1)}
            aria-label="Aumentar cantidad"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "26px",
              width: "26px",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginLeft: "2px" }}>
            {entry.item.unit}
          </span>
        </div>
      </div>

      <input
        type="text"
        value={entry.note}
        onChange={(e) => onUpdateNote(entry.item.id, e.target.value)}
        placeholder="Nota: marca, medida, especificación..."
        style={{
          width: "100%",
          marginTop: "0.5rem",
          padding: "0.35rem 0.5rem",
          fontSize: "11px",
          color: "rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "3px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function CustomItemsDrawer({
  items,
  onUpdate,
  locale,
}: {
  items: RfqCustomItem[];
  onUpdate: (items: RfqCustomItem[]) => void;
  locale: "es" | "en";
}) {
  const addItem = () => {
    if (items.length >= 20) return;
    onUpdate([...items, { id: `c-${Date.now()}`, name: "", qty: 1, unit: "" }]);
  };
  const removeItem = (id: string) => onUpdate(items.filter((i) => i.id !== id));
  const updateItem = (id: string, field: keyof Omit<RfqCustomItem, "id">, value: string | number) =>
    onUpdate(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const inputStyle: React.CSSProperties = {
    height: "32px", padding: "0 0.5rem", fontSize: "12px",
    color: "#f5f0e8", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div
      style={{
        border: "1px dashed rgba(201,169,97,0.35)",
        borderRadius: "6px",
        padding: "0.875rem",
        background: "rgba(201,169,97,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: items.length > 0 ? "0.75rem" : 0 }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#C9A961", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {locale === "es" ? "¿No encuentras un producto?" : "Can't find a product?"}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px", lineHeight: 1.4 }}>
            {locale === "es"
              ? "Agrégalo directamente — lo cotizamos igual."
              : "Add it directly — we'll quote it too."}
          </div>
        </div>
        <button
          type="button"
          onClick={addItem}
          disabled={items.length >= 20}
          style={{
            height: "28px", padding: "0 0.625rem", fontSize: "11px", whiteSpace: "nowrap",
            background: "transparent", border: "1px solid rgba(201,169,97,0.45)",
            borderRadius: "4px", color: "#C9A961", cursor: "pointer", flexShrink: 0,
            opacity: items.length >= 20 ? 0.4 : 1,
          }}
        >
          + {locale === "es" ? "Agregar" : "Add"}
        </button>
      </div>

      {items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder={locale === "es" ? "Descripción…" : "Description…"}
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 1)}
                style={{ ...inputStyle, width: "52px", textAlign: "center" }}
              />
              <input
                type="text"
                value={item.unit}
                onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                placeholder="ud"
                style={{ ...inputStyle, width: "52px" }}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={locale === "es" ? "Eliminar" : "Remove"}
                style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: "3px", flexShrink: 0, fontSize: "14px" }}
                className="hover:!text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
