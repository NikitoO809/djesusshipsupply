"use client";

import {
  Zap,
  Wrench,
  Shield,
  Paintbrush,
  Snowflake,
  Droplets,
  Lightbulb,
  Sparkles,
  Hammer,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { CatalogCategory, CatalogItem } from "@/data/procurement-catalog";
import { ProductList } from "./ProductList";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Wrench,
  Shield,
  Paintbrush,
  Snowflake,
  Droplets,
  Lightbulb,
  Sparkles,
  Hammer,
};

interface CategoryCardProps {
  category: CatalogCategory;
  filteredItems: CatalogItem[];
  isOpen: boolean;
  onToggle: () => void;
  locale: string;
  itemCountLabel: string;
}

export function CategoryCard({
  category,
  filteredItems,
  isOpen,
  onToggle,
  locale,
  itemCountLabel,
}: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] ?? Wrench;
  const primaryTitle = locale === "en" ? category.titleEn : category.titleEs;
  const secondaryTitle = locale === "en" ? category.titleEs : category.titleEn;

  return (
    <div className="rounded-sm border border-cream/8 bg-navy-light/20 overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream/3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
      >
        <span
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-sm"
          style={{ backgroundColor: `${category.color}18`, color: category.color }}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
        </span>

        <div className="flex-1 min-w-0 text-left">
          <div className="text-[13px] font-medium text-cream leading-tight truncate">
            {primaryTitle}
          </div>
          <div className="text-[11px] text-cream/45 mt-0.5 truncate">
            {secondaryTitle}
          </div>
        </div>

        <span
          className="shrink-0 text-[11px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
          style={{ backgroundColor: `${category.color}18`, color: category.color }}
        >
          {filteredItems.length} {itemCountLabel}
        </span>

        <ChevronDown
          className="shrink-0 h-4 w-4 text-cream/40 transition-transform duration-300"
          strokeWidth={2}
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden min-h-0">
          {filteredItems.length > 0 && (
            <div className="border-t border-cream/6 pt-3">
              <ProductList
                items={filteredItems}
                color={category.color}
                categoryId={category.id}
                categoryTitleEs={category.titleEs}
                categoryTitleEn={category.titleEn}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
