import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { PortCard } from "@/components/sections/PortCard";
import { CTASection } from "@/components/sections/CTASection";
import { Stagger, StaggerItem } from "@/components/sections/FadeIn";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PORTS } from "@/lib/ports";

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
  const td = await getTranslations("ports_detail");

  const link = (path: string) => `/${locale}${path}`;

  const ports = PORTS.map((port) => {
    const portCopy = td.raw(port.slug as Parameters<typeof td.raw>[0]) as {
      subtitle: string;
    };
    return {
      name: locale === "es" ? port.nameEs : port.nameEn,
      body: portCopy.subtitle,
      slug: port.slug,
    };
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/puertos" })) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        videoSrcMp4="/videos/Port-ships.mp4"
        posterSrc="/images/posters/Port-ships.jpg"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ports.map((p, i) => (
              <StaggerItem key={i}>
                <PortCard
                  index={i + 1}
                  name={p.name}
                  body={p.body}
                  href={link(`/puertos/${p.slug}`)}
                />
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
