import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  ShieldCheck,
  FileCheck,
  Leaf,
  Languages,
} from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/sobre-nosotros");
}

export default async function SobreNosotrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHome = await getTranslations("home");

  const link = (path: string) => `/${locale}${path}`;

  const values = [
    { icon: ShieldCheck, title: t("v1Title"), body: t("v1Body") },
    { icon: FileCheck, title: t("v2Title"), body: t("v2Body") },
    { icon: Leaf, title: t("v3Title"), body: t("v3Body") },
    { icon: Languages, title: t("v4Title"), body: t("v4Body") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/sobre-nosotros" })) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        imageSrc="https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?auto=format&fit=crop&w=2200&q=80&fm=avif"
        imageAlt="Dominican Republic port skyline"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <p className="text-lg md:text-xl leading-relaxed text-charcoal/85 mb-8 first-letter:font-serif first-letter:text-5xl first-letter:text-gold-dark first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
                {t("p1")}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg md:text-xl leading-relaxed text-charcoal/80">
                {t("p2")}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading title={t("valuesTitle")} align="center" />
          </FadeIn>
          <div className="mt-16">
            <FeatureGrid features={values} columns={4} variant="minimal" />
          </div>
        </div>
      </section>

      <CTASection
        title={tHome("ctaTitle")}
        subtitle={tHome("ctaSubtitle")}
        buttons={[
          {
            label: tHome("ctaProvisions"),
            href: link("/cotizar/provisiones"),
          },
          {
            label: tHome("ctaWaste"),
            href: link("/cotizar/desechos"),
            variant: "outline",
          },
        ]}
      />
    </>
  );
}
