"use client";

import { useState } from "react";
import { Plus, Check, Minus } from "lucide-react";
import type { CatalogItem } from "@/data/procurement-catalog";
import { useRfq } from "./useRfq";

interface AddToRfqButtonProps {
  item: CatalogItem;
  categoryId: string;
  categoryTitleEs: string;
  categoryTitleEn: string;
  color: string;
}

export function AddToRfqButton({
  item,
  categoryId,
  categoryTitleEs,
  categoryTitleEn,
  color,
}: AddToRfqButtonProps) {
  const { entries, add, updateQty, openDrawer } = useRfq();
  const entry = entries[item.id];
  const inCart = !!entry;
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(item, categoryId, categoryTitleEs, categoryTitleEn);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  if (!inCart) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Agregar ${item.name} a la cotización`}
        className="shrink-0 inline-flex items-center gap-1 h-7 px-2.5 rounded-sm text-[10px] font-medium uppercase tracking-[0.14em] border transition-colors"
        style={{
          borderColor: justAdded ? color : `${color}50`,
          color: justAdded ? color : `${color}80`,
          backgroundColor: justAdded ? `${color}18` : "transparent",
        }}
      >
        {justAdded ? (
          <Check className="h-3 w-3" strokeWidth={2.5} />
        ) : (
          <Plus className="h-3 w-3" strokeWidth={2.5} />
        )}
        {justAdded ? "Agregado" : "Agregar"}
      </button>
    );
  }

  return (
    <div className="shrink-0 flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => updateQty(item.id, entry.qty - 1)}
        aria-label="Quitar uno"
        className="inline-flex items-center justify-center h-7 w-7 rounded-sm border transition-colors"
        style={{ borderColor: `${color}50`, color: `${color}80` }}
      >
        <Minus className="h-3 w-3" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={openDrawer}
        className="inline-flex items-center gap-1 h-7 px-2 rounded-sm text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors"
        style={{ backgroundColor: `${color}20`, color }}
        aria-label="Ver cotización"
      >
        <Check className="h-3 w-3" strokeWidth={2.5} />
        {entry.qty} {item.unit}
      </button>

      <button
        type="button"
        onClick={() => updateQty(item.id, entry.qty + 1)}
        aria-label="Agregar uno más"
        className="inline-flex items-center justify-center h-7 w-7 rounded-sm border transition-colors"
        style={{ borderColor: `${color}50`, color: `${color}80` }}
      >
        <Plus className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
