import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const link = (path: string) => `/${locale}${path}`;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-cream/85 mt-24">
      <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-gold/60 text-gold text-[11px] font-semibold tracking-widest">
              DJSS
            </span>
            <span className="font-serif text-lg text-cream">
              De Jesús Ship Supply
            </span>
          </div>
          <p className="text-sm text-cream/70 max-w-xs leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h3 className="font-serif text-cream text-sm uppercase tracking-widest mb-4">
            {t("servicios")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={link("/servicios/provisiones")}
                className="hover:text-gold transition-colors"
              >
                {tNav("provisiones")}
              </Link>
            </li>
            <li>
              <Link
                href={link("/servicios/gestion-desechos")}
                className="hover:text-gold transition-colors"
              >
                {tNav("gestionDesechos")}
              </Link>
            </li>
            <li>
              <Link
                href={link("/puertos")}
                className="hover:text-gold transition-colors"
              >
                {tNav("puertos")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-cream text-sm uppercase tracking-widest mb-4">
            {t("contacto")}
          </h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>República Dominicana</li>
            <li>
              <Link
                href={link("/contacto")}
                className="hover:text-gold transition-colors"
              >
                {tNav("contacto")} →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/60">
          <p>
            © {year} De Jesús Ship Supply. {t("rights")}.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gold transition-colors">
              {t("privacidad")}
            </Link>
            <Link href="#" className="hover:text-gold transition-colors">
              {t("terminos")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
