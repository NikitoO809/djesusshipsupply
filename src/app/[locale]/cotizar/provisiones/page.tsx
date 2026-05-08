import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ProvisionsQuoteFlow } from "@/components/forms/provisions-flow/ProvisionsQuoteFlow";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/cotizar/provisiones");
}

export default async function CotizarProvisionesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("forms.provisiones");
  const tBanner = await getTranslations("forms.provisiones.flow");

  return (
    <>
      <div className="bg-gradient-to-r from-navy to-navy-light text-cream text-center text-xs font-medium px-6 py-3 border-b border-gold">
        <strong className="text-gold-light mr-1.5">⚓ {tBanner("bannerTip")}:</strong>
        {tBanner("banner")}
      </div>
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <header className="mb-10 space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-navy tracking-tight">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-charcoal/70 font-light">
            {t("subtitle")}
          </p>
        </header>
        <ProvisionsQuoteFlow />
      </section>
    </>
  );
}
