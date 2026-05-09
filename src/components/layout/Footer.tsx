import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MessageCircle, MapPin, ArrowRight } from "lucide-react";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const link = (path: string) => `/${locale}${path}`;

  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-dark text-cream/85 mt-0">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container mx-auto px-6 py-20 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5 space-y-5">
          <Link href={link("")} className="inline-flex items-center gap-3 group">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-gold/70 text-gold text-[10px] font-semibold tracking-[0.18em]">
              DJSS
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-xl text-cream tracking-wide">
                De Jesús Ship Supply
              </span>
              <span className="font-sans text-[10px] text-gold/90 uppercase tracking-[0.28em]">
                Maritime Services · RD
              </span>
            </span>
          </Link>
          <p className="text-sm text-cream/65 max-w-md leading-relaxed">
            {t("tagline")}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-gold/90">
              {t("whatsapp")}
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="font-sans font-medium text-cream text-[11px] uppercase tracking-[0.22em] mb-5">
            {t("headingServicios")}
          </h3>
          <ul className="space-y-3 text-sm text-cream/75">
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
            <li>
              <Link
                href={link("/sobre-nosotros")}
                className="hover:text-gold transition-colors"
              >
                {tNav("sobreNosotros")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="font-sans font-medium text-cream text-[11px] uppercase tracking-[0.22em] mb-5">
            {t("headingContacto")}
          </h3>
          <ul className="space-y-4 text-sm text-cream/75">
            <li className="flex items-start gap-3">
              <Mail
                className="h-4 w-4 text-gold mt-0.5 shrink-0"
                strokeWidth={1.8}
              />
              <a
                href="mailto:miguelcarmona809v@gmail.com"
                className="hover:text-gold transition-colors break-all"
              >
                miguelcarmona809v@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle
                className="h-4 w-4 text-gold mt-0.5 shrink-0"
                strokeWidth={1.8}
              />
              <a
                href="https://wa.me/18492762491"
                className="hover:text-gold transition-colors"
              >
                +1 849 276 2491
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin
                className="h-4 w-4 text-gold mt-0.5 shrink-0"
                strokeWidth={1.8}
              />
              <span>{t("officeValue")}</span>
            </li>
          </ul>
          <Link
            href={link("/contacto")}
            className="group inline-flex items-center gap-1.5 mt-6 text-[11px] uppercase tracking-[0.22em] text-gold hover:text-gold-light transition-colors font-medium"
          >
            {tNav("contacto")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/55">
          <p>
            © {year} De Jesús Ship Supply. {t("rights")}.
          </p>
          <div className="flex items-center gap-6">
            <Link href={link("/privacidad")} className="hover:text-gold transition-colors">
              {t("privacidad")}
            </Link>
            <Link href={link("/terminos")} className="hover:text-gold transition-colors">
              {t("terminos")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
