import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/cotizar/desechos");
}

export default async function CotizarDesechosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("forms.desechos");

  return (
    <section className="container mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-10 space-y-3 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-navy tracking-tight">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-2xl text-charcoal/70">{t("subtitle")}</p>
      </header>
      <QuoteForm type="marpol" />
    </section>
  );
}
