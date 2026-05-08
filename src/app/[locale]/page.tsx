import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  ShieldCheck,
  Globe2,
  Clock,
  Trash2,
  Apple,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/sections/FadeIn";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const link = (path: string) => `/${locale}${path}`;

  const whyFeatures = [
    {
      icon: ShieldCheck,
      title: t("why1Title"),
      body: t("why1Body"),
    },
    {
      icon: Globe2,
      title: t("why2Title"),
      body: t("why2Body"),
    },
    {
      icon: Clock,
      title: t("why3Title"),
      body: t("why3Body"),
    },
  ];

  return (
    <>
      <Hero
        locale={locale}
        title={t("heroH1")}
        subtitle={t("heroSubtitle")}
        ctaPrimary={t("heroCtaPrimary")}
        ctaSecondary={t("heroCtaSecondary")}
        ctaPrimaryHref={link("/cotizar/provisiones")}
        ctaSecondaryHref={link("/puertos")}
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("whyKicker")}
              title={t("whyTitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <FeatureGrid features={whyFeatures} columns={3} />
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("servicesKicker")}
              title={t("servicesTitle")}
              align="center"
            />
          </FadeIn>
          <Stagger className="mt-16 grid gap-7 lg:grid-cols-2">
            <StaggerItem>
              <ServiceCard
                title={t("service1Title")}
                body={t("service1Body")}
                href={link("/servicios/gestion-desechos")}
                ctaLabel={t("ctaWaste")}
                imageSrc="https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1600&q=80"
                imageAlt="MARPOL waste management"
                icon={Trash2}
                tag="MARPOL"
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title={t("service2Title")}
                body={t("service2Body")}
                href={link("/servicios/provisiones")}
                ctaLabel={t("ctaProvisions")}
                imageSrc="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1600&q=80"
                imageAlt="Ship provisions onboard"
                icon={Apple}
                tag="Provisions"
              />
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <CTASection
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        buttons={[
          { label: t("ctaProvisions"), href: link("/cotizar/provisiones") },
          {
            label: t("ctaWaste"),
            href: link("/cotizar/desechos"),
            variant: "outline",
          },
        ]}
      />
    </>
  );
}
