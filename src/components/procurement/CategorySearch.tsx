"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, ChevronsUpDown, Minimize2, PlusCircle } from "lucide-react";
import { catalogCategories } from "@/data/procurement-catalog";
import { CategoryCard } from "./CategoryCard";
import { FadeIn } from "@/components/sections/FadeIn";
import { useRfq } from "@/components/procurement/rfq/useRfq";

export function CategorySearch() {
  const t = useTranslations("procurement");
  const locale = useLocale();
  const { openDrawer } = useRfq();

  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set([catalogCategories[0].id])
  );

  const normalized = searchQuery.toLowerCase().trim();

  const filtered = useMemo(() => {
    return catalogCategories
      .map((cat) => {
        if (!normalized) return { ...cat, filteredItems: cat.items };
        const matchTitle =
          cat.titleEn.toLowerCase().includes(normalized) ||
          cat.titleEs.toLowerCase().includes(normalized);
        const filteredItems = matchTitle
          ? cat.items
          : cat.items.filter((item) =>
              item.name.toLowerCase().includes(normalized)
            );
        return { ...cat, filteredItems };
      })
      .filter((cat) => !normalized || cat.filteredItems.length > 0);
  }, [normalized]);

  function toggleCategory(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function expandAll() {
    setOpenIds(new Set(filtered.map((c) => c.id)));
  }

  function collapseAll() {
    setOpenIds(new Set());
  }

  const allExpanded =
    filtered.length > 0 && filtered.every((c) => openIds.has(c.id));

  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/35 pointer-events-none"
                strokeWidth={2}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="w-full h-11 pl-10 pr-4 rounded-sm bg-navy-light/50 border border-cream/12 text-cream text-sm placeholder:text-cream/35 focus:outline-none focus:border-gold/40 focus:bg-navy-light/70 transition-colors"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={allExpanded ? collapseAll : expandAll}
                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-sm border border-cream/12 text-cream/65 hover:border-gold/40 hover:text-cream/90 transition-colors text-[11px] uppercase tracking-[0.18em] font-medium whitespace-nowrap"
              >
                {allExpanded ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" strokeWidth={2} />
                    {t("collapseAll")}
                  </>
                ) : (
                  <>
                    <ChevronsUpDown className="h-3.5 w-3.5" strokeWidth={2} />
                    {t("expandAll")}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* "Can't find it?" — always visible, opens drawer to custom items */}
          <button
            type="button"
            onClick={openDrawer}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-sm border border-gold/25 bg-gold/5 hover:border-gold/50 hover:bg-gold/10 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-gold shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-semibold text-cream/90 group-hover:text-cream transition-colors">
                  {locale === "en" ? "Can't find what you need?" : "¿No encuentras lo que necesitas?"}
                </div>
                <div className="text-xs text-cream/45 mt-0.5">
                  {locale === "en" ? "Describe it and we'll quote it." : "Descríbelo y lo cotizamos."}
                </div>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-sm bg-gold/15 border border-gold/30 text-gold text-[11px] uppercase tracking-[0.15em] font-semibold group-hover:bg-gold group-hover:text-navy transition-all whitespace-nowrap">
              + {locale === "en" ? "Add" : "Agregar"}
            </span>
          </button>

          {filtered.length === 0 && normalized && (
            <FadeIn>
              <p className="text-center text-cream/50 py-12 text-sm">
                {t("noResults")}{" "}
                <span className="text-gold">&ldquo;{searchQuery}&rdquo;</span>
              </p>
            </FadeIn>
          )}

          <div className="space-y-2">
            {filtered.map((cat, i) => {
              const isOpen = normalized ? true : openIds.has(cat.id);
              return (
                <FadeIn key={cat.id} delay={i * 0.04}>
                  <CategoryCard
                    category={cat}
                    filteredItems={cat.filteredItems}
                    isOpen={isOpen}
                    onToggle={() => toggleCategory(cat.id)}
                    locale={locale}
                    itemCountLabel={t("itemCount")}
                  />
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
