import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("nav");

  const link = (path: string) => `/${locale}${path}`;

  const navItems = [
    { label: t("servicios"), href: link("/servicios/provisiones") },
    { label: t("puertos"), href: link("/puertos") },
    { label: t("sobreNosotros"), href: link("/sobre-nosotros") },
    { label: t("contacto"), href: link("/contacto") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-navy text-cream border-b border-navy-light/40 backdrop-blur supports-[backdrop-filter]:bg-navy/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href={link("")}
          className="flex items-center gap-2 font-serif text-xl tracking-wide text-cream"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-gold/60 text-gold text-[11px] font-semibold tracking-widest">
            DJSS
          </span>
          <span className="hidden sm:inline">De Jesús Ship Supply</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-cream/85 hover:text-gold transition-colors uppercase tracking-wider text-[11px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href={link("/cotizar/provisiones")}
            className="inline-flex items-center justify-center h-9 px-4 rounded-sm bg-gold text-navy hover:bg-gold-light hover:text-navy-dark text-xs uppercase tracking-widest font-medium transition-colors"
          >
            {t("cotizar")}
          </Link>
        </div>
      </div>
    </header>
  );
}
