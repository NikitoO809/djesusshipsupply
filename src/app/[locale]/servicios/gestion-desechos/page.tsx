import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Droplet, Recycle, Satellite, Zap, Snowflake } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { AnnexBlock } from "@/components/sections/AnnexBlock";
import { Timeline } from "@/components/sections/Timeline";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/servicios/gestion-desechos");
}

export default async function GestionDesechosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("waste");

  const link = (path: string) => `/${locale}${path}`;

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  const WA = "https://wa.me/18298563586";
  const waBtn = locale === "en" ? "Request service" : "Solicitar servicio";

  function waLink(service: string) {
    const msg = locale === "en"
      ? `Hello, I'm interested in the *${service}* service. Could you provide more details?`
      : `Hola, estoy interesado en el servicio de *${service}*. ¿Pueden darme más información?`;
    return `${WA}?text=${encodeURIComponent(msg)}`;
  }

  const techServices = [
    { icon: Recycle,   title: t("tech1Title"), body: t("tech1Body"), whatsappHref: waLink(t("tech1Title")), whatsappLabel: waBtn },
    { icon: Satellite, title: t("tech2Title"), body: t("tech2Body"), whatsappHref: waLink(t("tech2Title")), whatsappLabel: waBtn },
    { icon: Zap,       title: t("tech3Title"), body: t("tech3Body"), whatsappHref: waLink(t("tech3Title")), whatsappLabel: waBtn },
    { icon: Snowflake, title: t("tech4Title"), body: t("tech4Body"), whatsappHref: waLink(t("tech4Title")), whatsappLabel: waBtn },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ locale, serviceType: "marpol" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/servicios/gestion-desechos" })) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        videoSrcMp4="/videos/Servicios.mp4"
        posterSrc="/images/oleosos.jpg"
        imageAlt="Gestión de residuos oleosos MARPOL"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6 space-y-24 md:space-y-32">
          <AnnexBlock
            tag={t("annex1Tag")}
            title={t("annex1Title")}
            body={t("annex1Body")}
            includesLabel={t("annex1Includes")}
            items={[
              t("annex1Item1"),
              t("annex1Item2"),
              t("annex1Item3"),
            ]}
            icon={Droplet}
            imageSrc="/images/oleosos.jpg"
            imageAlt={t("annex1Title")}
          />

        </div>
      </section>

      <section className="bg-background py-24 md:py-32 border-t border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("techKicker")}
              title={t("techTitle")}
              subtitle={t("techSubtitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <FeatureGrid features={techServices} columns={4} />
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("howKicker")}
              title={t("howTitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <Timeline steps={steps} />
          </div>
        </div>
      </section>

      <CTASection
        title={t("ctaText")}
        buttons={[
          { label: t("ctaText"), href: link("/cotizar/desechos") },
        ]}
      />
    </>
  );
}
