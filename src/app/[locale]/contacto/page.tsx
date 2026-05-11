import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Mail, MessageCircle, MapPin, Briefcase, ArrowRight } from "lucide-react";
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
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="max-w-3xl mb-14">
              <div className="flex items-center gap-3 text-gold-dark text-[11px] uppercase tracking-[0.22em] mb-5">
                <span className="h-px w-8 bg-gold-dark/50" />
                <span>{t("kicker")}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-navy leading-[1.15] tracking-tight">
                {t("channelsTitle")}
              </h2>
            </div>
          </FadeIn>

          <ContactChannels channels={channels} />

          <div className="mt-16 grid gap-4 sm:grid-cols-2 max-w-2xl">
            <Link
              href={link("/cotizar/provisiones")}
              className="group inline-flex items-center justify-center gap-2 h-13 py-4 px-7 rounded-sm bg-navy text-cream hover:bg-navy-dark transition-colors text-xs uppercase tracking-[0.22em] font-semibold"
            >
              {t("ctaProvisions")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </Link>
            <Link
              href={link("/cotizar/desechos")}
              className="group inline-flex items-center justify-center gap-2 h-13 py-4 px-7 rounded-sm border border-navy text-navy hover:bg-navy hover:text-cream transition-colors text-xs uppercase tracking-[0.22em] font-semibold"
            >
              {t("ctaWaste")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
