"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

type NavItem = { label: string; href: string };

type MobileNavProps = {
  items: NavItem[];
  cotizarLabel: string;
  cotizarHref: string;
};

export function MobileNav({ items, cotizarLabel, cotizarHref }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-cream/20 text-cream hover:border-gold/60 hover:text-gold transition-colors"
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={1.8} />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-18 md:top-20 z-40 bg-navy/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 top-18 md:top-20 z-50 bg-navy text-cream border-b border-cream/10 shadow-2xl"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-4 border-b border-cream/10 text-cream/90 hover:text-gold transition-colors uppercase tracking-[0.18em] text-[12px] font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={cotizarHref}
                className="group mt-6 inline-flex items-center justify-center gap-1.5 h-12 px-5 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-[12px] uppercase tracking-[0.22em] font-semibold"
              >
                {cotizarLabel}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.6}
                />
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
