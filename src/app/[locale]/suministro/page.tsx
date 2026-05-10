import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Package, UtensilsCrossed, Waves, ArrowRight } from "lucide-react";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { FadeIn, Stagger, StaggerItem } from "@/components/sections/FadeIn";
import { SuministroCarousel } from "@/components/suministro/SuministroCarousel";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/suministro");
}

const LANES = [
  {
    key: "tecnicos",
    icon: Package,
    color: "#C9A961",
    colorBg: "rgba(201,169,97,0.08)",
    colorBorder: "rgba(201,169,97,0.25)",
    href: (locale: string) => `/${locale}/procurement`,
  },
  {
    key: "provisiones",
    icon: UtensilsCrossed,
    color: "#10B981",
    colorBg: "rgba(16,185,129,0.08)",
    colorBorder: "rgba(16,185,129,0.2)",
    href: (locale: string) => `/${locale}/cotizar/provisiones`,
  },
  {
    key: "desechos",
    icon: Waves,
    color: "#3B82F6",
    colorBg: "rgba(59,130,246,0.08)",
    colorBorder: "rgba(59,130,246,0.2)",
    href: (locale: string) => `/${locale}/servicios/gestion-desechos`,
  },
] as const;

export default async function SuministroPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("suministro");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd({ locale, path: "/suministro" })
          ),
        }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-cream min-h-[480px] md:min-h-[560px]">
        {/* Carousel images (behind everything) */}
        <SuministroCarousel />

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,21,41,0.88) 0%, rgba(5,21,41,0.70) 50%, rgba(5,21,41,0.40) 100%)",
          }}
        />
        {/* Subtle gold vignette bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 -z-10"
          aria-hidden="true"
          style={{
            background: "linear-gradient(to top, rgba(5,21,41,0.7) 0%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-6 pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-2xl">
            <FadeIn delay={0}>
              <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-[0.28em] mb-7">
                <Package className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <span>{t("badge")}</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.06] tracking-tight text-cream">
                {t("titleBefore")}
                <em className="not-italic text-gold">{t("titleEm")}</em>
                {t("titleAfter")}
              </h1>
            </FadeIn>

            <FadeIn delay={0.16}>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-cream/70 max-w-[560px]">
                {t("description")}
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </section>

      {/* 3 lanes */}
      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-6">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto" delay={0.08} stagger={0.12}>
            {LANES.map((lane) => {
              const Icon = lane.icon;
              return (
                <StaggerItem key={lane.key}>
                  <Link
                    href={lane.href(locale)}
                    className="group relative flex flex-col h-full rounded-sm border overflow-hidden transition-colors"
                    style={{
                      background: lane.colorBg,
                      borderColor: lane.colorBorder,
                    }}
                  >
                    <div className="p-7 flex-1 flex flex-col">
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center rounded-sm mb-5"
                        style={{ background: `${lane.color}18`, color: lane.color }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                      </span>

                      <div
                        className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-2"
                        style={{ color: lane.color }}
                      >
                        {t(`${lane.key}Tag`)}
                      </div>

                      <h2 className="font-serif text-xl md:text-2xl text-cream leading-snug mb-3">
                        {t(`${lane.key}Title`)}
                      </h2>

                      <p className="text-[13px] text-cream/60 leading-relaxed flex-1">
                        {t(`${lane.key}Body`)}
                      </p>

                      <div
                        className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium transition-gap"
                        style={{ color: lane.color }}
                      >
                        {t(`${lane.key}Cta`)}
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
