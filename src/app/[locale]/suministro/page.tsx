import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Package, UtensilsCrossed, Waves, ArrowUpRight } from "lucide-react";
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
      <section className="relative bg-navy py-20 md:py-28 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 [background-image:radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,169,97,0.08),transparent_60%)]"
        />
        <div className="container mx-auto px-6 relative">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto" delay={0.08} stagger={0.12}>
            {LANES.map((lane) => {
              const Icon = lane.icon;
              return (
                <StaggerItem key={lane.key}>
                  <Link
                    href={lane.href(locale)}
                    className="group relative block h-full rounded-[2rem] p-1.5 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
                    style={{
                      background: `${lane.color}10`,
                      boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 50px -30px ${lane.color}40`,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: lane.colorBorder,
                    }}
                  >
                    <div
                      className="relative h-full flex flex-col rounded-[calc(2rem-0.375rem)] p-7 md:p-8 overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.10) 100%)",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)",
                      }}
                    >
                      <span
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full mb-6 ring-4 ring-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        style={{ background: lane.color, color: "#0A2540" }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                      </span>

                      <div
                        className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-3"
                        style={{ color: lane.color }}
                      >
                        {t(`${lane.key}Tag`)}
                      </div>

                      <h2 className="font-serif text-xl md:text-2xl text-cream leading-snug tracking-tight mb-3">
                        {t(`${lane.key}Title`)}
                      </h2>

                      <p className="text-[13.5px] text-cream/65 leading-relaxed flex-1">
                        {t(`${lane.key}Body`)}
                      </p>

                      <span
                        className="mt-7 inline-flex items-center gap-2.5 self-start rounded-full pl-4 pr-1 py-1 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          background: `${lane.color}14`,
                          color: lane.color,
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: `${lane.color}40`,
                        }}
                      >
                        {t(`${lane.key}Cta`)}
                        <span
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]"
                          style={{ background: lane.color, color: "#0A2540" }}
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                      </span>
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
