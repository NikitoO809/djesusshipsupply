import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { PortCard } from "@/components/sections/PortCard";
import { CTASection } from "@/components/sections/CTASection";
import { Stagger, StaggerItem } from "@/components/sections/FadeIn";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/puertos");
}

export default async function PuertosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ports");

  const link = (path: string) => `/${locale}${path}`;

  const ports = [
    { name: t("p1Name"), body: t("p1Body") },
    { name: t("p2Name"), body: t("p2Body") },
    { name: t("p3Name"), body: t("p3Body") },
    { name: t("p4Name"), body: t("p4Body") },
    { name: t("p5Name"), body: t("p5Body") },
    { name: t("p6Name"), body: t("p6Body") },
    { name: t("p7Name"), body: t("p7Body") },
    { name: t("p8Name"), body: t("p8Body") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/puertos" })) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        videoSrcMp4="/videos/Port-ships.mp4"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ports.map((p, i) => (
              <StaggerItem key={i}>
                <PortCard index={i + 1} name={p.name} body={p.body} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title={t("ctaTitle")}
        buttons={[
          { label: t("ctaText"), href: link("/cotizar/provisiones") },
        ]}
      />
    </>
  );
}
