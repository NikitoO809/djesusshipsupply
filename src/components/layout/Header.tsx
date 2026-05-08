import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("nav");

  const link = (path: string) => `/${locale}${path}`;

  const navItems = [
    { label: t("provisiones"), href: link("/servicios/provisiones") },
    { label: t("gestionDesechos"), href: link("/servicios/gestion-desechos") },
    { label: t("puertos"), href: link("/puertos") },
    { label: t("sobreNosotros"), href: link("/sobre-nosotros") },
    { label: t("contacto"), href: link("/contacto") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-navy/95 text-cream backdrop-blur supports-[backdrop-filter]:bg-navy/85 border-b border-cream/10">
      <div className="container mx-auto flex h-18 md:h-20 items-center justify-between px-6">
        <Link
          href={link("")}
          className="flex items-center gap-3 group"
          aria-label="De Jesús Ship Supply"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold/70 text-gold text-[10px] font-semibold tracking-[0.18em] group-hover:bg-gold group-hover:text-navy transition-colors">
            DJSS
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-[17px] text-cream tracking-wide">
              De Jesús
            </span>
            <span className="font-sans text-[10px] text-gold/90 uppercase tracking-[0.28em]">
              Ship Supply
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-cream/85 hover:text-gold transition-colors uppercase tracking-[0.18em] text-[11px] font-medium py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher />
          <Link
            href={link("/cotizar/provisiones")}
            className="group hidden lg:inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-[11px] uppercase tracking-[0.22em] font-semibold"
          >
            {t("cotizar")}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.6}
            />
          </Link>
          <MobileNav
            items={navItems}
            cotizarLabel={t("cotizar")}
            cotizarHref={link("/cotizar/provisiones")}
          />
        </div>
      </div>
    </header>
  );
}
