import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Apple,
  Snowflake,
  Package,
  Wine,
  Droplet,
  Flame,
  Sparkles,
  FileCheck,
  PackagePlus,
  Coins,
} from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/servicios/provisiones");
}

export default async function ProvisionesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("provisions");

  const link = (path: string) => `/${locale}${path}`;

  const categories = [
    { icon: Apple, title: t("c1Title"), body: t("c1Body") },
    { icon: Snowflake, title: t("c2Title"), body: t("c2Body") },
    { icon: Package, title: t("c3Title"), body: t("c3Body") },
    { icon: Wine, title: t("c4Title"), body: t("c4Body") },
    { icon: Droplet, title: t("c5Title"), body: t("c5Body") },
    { icon: Flame, title: t("c6Title"), body: t("c6Body") },
  ];

  const why = [
    { icon: Sparkles, title: t("w1Title"), body: t("w1Body") },
    { icon: FileCheck, title: t("w2Title"), body: t("w2Body") },
    { icon: PackagePlus, title: t("w3Title"), body: t("w3Body") },
    { icon: Coins, title: t("w4Title"), body: t("w4Body") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ locale, serviceType: "provisions" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/servicios/provisiones" })) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        imageSrc="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2200&q=80&fm=avif"
        imageAlt="Fresh produce market"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("categoriesKicker")}
              title={t("categoriesTitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <FeatureGrid features={categories} columns={3} />
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading title={t("whyTitle")} align="center" />
          </FadeIn>
          <div className="mt-16">
            <FeatureGrid features={why} columns={4} variant="minimal" />
          </div>
        </div>
      </section>

      <CTASection
        title={t("ctaText")}
        buttons={[{ label: t("ctaText"), href: link("/cotizar/provisiones") }]}
      />
    </>
  );
}
