import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Droplet, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { AnnexBlock } from "@/components/sections/AnnexBlock";
import { Timeline } from "@/components/sections/Timeline";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, serviceJsonLd } from "@/lib/seo";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({ locale, serviceType: "marpol" })
          ),
        }}
      />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        imageSrc="https://images.unsplash.com/photo-1513436539083-9d2127e742f1?auto=format&fit=crop&w=2200&q=80"
        imageAlt="Industrial port operations"
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

          <AnnexBlock
            tag={t("annex5Tag")}
            title={t("annex5Title")}
            body={t("annex5Body")}
            includesLabel={t("annex1Includes")}
            items={[
              t("annex5Item1"),
              t("annex5Item2"),
              t("annex5Item3"),
            ]}
            icon={Trash2}
            imageSrc="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1600&q=80"
            imageAlt={t("annex5Title")}
            reverse
          />
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
