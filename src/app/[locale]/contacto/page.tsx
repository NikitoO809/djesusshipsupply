import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Mail, MessageCircle, MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/contacto");
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const link = (path: string) => `/${locale}${path}`;

  const channels = [
    {
      icon: Mail,
      label: t("labelOpsEmail"),
      value: "ops@djshipsupply.com",
      href: "mailto:ops@djshipsupply.com",
    },
    {
      icon: Briefcase,
      label: t("labelInfoEmail"),
      value: "info@djshipsupply.com",
      href: "mailto:info@djshipsupply.com",
    },
    {
      icon: MessageCircle,
      label: t("labelWhatsapp"),
      value: "+1 829 856 3586",
      href: "https://wa.me/18298563586",
    },
    {
      icon: MapPin,
      label: t("labelOffice"),
      value: t("valueOfficeText"),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/contacto" })) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("intro")}
        imageSrc="/images/Contactanos.jpg"
        imageAlt="Maritime port with vessels"
        variant="editorial"
      />

      <section className="relative bg-background py-28 md:py-40 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,97,0.10),transparent_60%)]"
        />
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 ring-1 ring-navy/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-navy/70 font-medium mb-7">
                <span className="h-1 w-1 rounded-full bg-gold-dark" />
                {t("kicker")}
              </span>
              <h2 className="font-serif text-[40px] md:text-[56px] lg:text-[72px] leading-[0.95] tracking-[-0.02em] text-navy">
                {t("channelsTitle")}
                <span className="text-gold">.</span>
              </h2>
            </div>
          </FadeIn>

          <ContactChannels channels={channels} variant="editorial" />

          <div className="mt-16 grid gap-4 sm:grid-cols-2 max-w-2xl">
            <Link
              href={link("/cotizar/provisiones")}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-navy text-cream pl-7 pr-2 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-gold hover:text-navy"
            >
              {t("ctaProvisions")}
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gold text-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px] group-hover:bg-navy group-hover:text-cream">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </Link>
            <Link
              href={link("/cotizar/desechos")}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white ring-1 ring-navy/20 text-navy pl-7 pr-2 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-navy hover:text-cream hover:ring-navy"
            >
              {t("ctaWaste")}
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-navy text-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px] group-hover:bg-gold group-hover:text-navy">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
