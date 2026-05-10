"use client";

import type { CatalogItem } from "@/data/procurement-catalog";
import { AddToRfqButton } from "./rfq/AddToRfqButton";

interface ProductListProps {
  items: CatalogItem[];
  color: string;
  categoryId: string;
  categoryTitleEs: string;
  categoryTitleEn: string;
}

export function ProductList({ items, color, categoryId, categoryTitleEs, categoryTitleEn }: ProductListProps) {
  return (
    <div className="flex flex-col gap-0 px-4 pb-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-sm bg-navy/40 border border-cream/5 mb-1.5"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="mt-[1px] h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[13px] text-cream/80 leading-snug">{item.name}</span>
          </div>

          <AddToRfqButton
            item={item}
            categoryId={categoryId}
            categoryTitleEs={categoryTitleEs}
            categoryTitleEn={categoryTitleEn}
            color={color}
          />
        </div>
      ))}
    </div>
  );
}
