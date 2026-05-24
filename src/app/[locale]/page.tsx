import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  ShieldCheck,
  Globe2,
  Clock,
  Trash2,
  Apple,
  Wrench,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { BentoServiceCard } from "@/components/sections/BentoServiceCard";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/sections/FadeIn";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const link = (path: string) => `/${locale}${path}`;

  const advantages = [
    { icon: ShieldCheck, title: t("why1Title"), body: t("why1Body") },
    { icon: Globe2, title: t("why2Title"), body: t("why2Body") },
    { icon: Clock, title: t("why3Title"), body: t("why3Body") },
  ];

  return (
    <>
      <Hero
        locale={locale}
        title={t("heroH1")}
        subtitle={t("heroSubtitle")}
        ctaPrimary={t("heroCtaPrimary")}
        ctaPrimaryHref={link("/cotizar/provisiones")}
        ctaExtra={t("heroCtaDesechos")}
        ctaExtraHref={link("/cotizar/desechos")}
        ctaSecondary={t("heroCtaSecondary")}
        ctaSecondaryHref={link("/puertos")}
      />

      {/* ── ADVANTAGES — Editorial split: massive serif left, numbered pills right ── */}
      <section className="relative isolate bg-background py-28 md:py-40 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,97,0.10),transparent_60%)]"
        />

        <div className="container mx-auto px-6">
          <div className="grid gap-16 lg:gap-24 lg:grid-cols-[5fr_7fr] items-start">
            <div className="lg:sticky lg:top-32">
              <FadeIn>
                <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 ring-1 ring-navy/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-navy/70 font-medium mb-8">
                  <span className="h-1 w-1 rounded-full bg-gold-dark" />
                  {t("whyKicker")}
                </span>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="font-serif text-[44px] md:text-[64px] lg:text-[80px] leading-[0.95] tracking-[-0.02em] text-navy">
                  {t("whyTitle")}
                  <span className="text-gold">.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-10 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-charcoal/60">
                  <span className="h-px w-10 bg-navy/20" />
                  <span>RD · 8 puertos · 24/7</span>
                </div>
              </FadeIn>
            </div>

            <Stagger className="space-y-5">
              {advantages.map((a, i) => (
                <StaggerItem key={a.title}>
                  <div
                    className="group relative rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                  >
                    <div className="relative rounded-[calc(2rem-0.375rem)] bg-white p-8 md:p-10">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <div className="relative">
                            <span className="absolute -inset-1 rounded-full bg-gold/0 group-hover:bg-gold/15 blur-md transition-colors duration-700" />
                            <div className="relative inline-flex items-center justify-center h-12 w-12 rounded-full bg-navy text-cream ring-4 ring-cream transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy">
                              <a.icon className="h-5 w-5" strokeWidth={1.6} />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3 mb-3">
                            <span className="font-mono text-[11px] text-gold-dark tracking-[0.2em]">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="h-px flex-1 bg-navy/10" />
                          </div>
                          <h3 className="font-serif text-2xl md:text-[26px] text-navy leading-[1.15] mb-3">
                            {a.title}
                          </h3>
                          <p className="text-charcoal/70 text-[15px] leading-relaxed">
                            {a.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── SERVICES — Asymmetrical bento with double-bezel cards ── */}
      <section className="relative isolate bg-cream/40 py-28 md:py-40 border-y border-navy/8 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [background-image:radial-gradient(ellipse_60%_40%_at_85%_15%,rgba(10,37,64,0.07),transparent_60%)]"
        />

        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
            <div className="max-w-2xl">
              <FadeIn>
                <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 ring-1 ring-navy/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-navy/70 font-medium mb-7">
                  <span className="h-1 w-1 rounded-full bg-gold-dark" />
                  {t("servicesKicker")}
                </span>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="font-serif text-[44px] md:text-[60px] lg:text-[76px] leading-[0.95] tracking-[-0.02em] text-navy">
                  {t("servicesTitle")}
                  <span className="text-gold">.</span>
                </h2>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <div className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
                <span>03</span>
                <span className="h-px w-12 bg-navy/15" />
                <span>servicios</span>
              </div>
            </FadeIn>
          </div>

          <Stagger className="grid gap-6 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            <StaggerItem className="lg:col-span-7 lg:row-span-2">
              <BentoServiceCard
                size="hero"
                title={t("service1Title")}
                body={t("service1Body")}
                href={link("/servicios/gestion-desechos")}
                ctaLabel={t("ctaWaste")}
                imageSrc="https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1600&q=80&fm=avif"
                imageAlt="MARPOL waste management"
                icon={Trash2}
                tag="MARPOL · Anexos I–V"
                priority
                className="h-full"
              />
            </StaggerItem>
            <StaggerItem className="lg:col-span-5">
              <BentoServiceCard
                title={t("service2Title")}
                body={t("service2Body")}
                href={link("/servicios/provisiones")}
                ctaLabel={t("ctaProvisions")}
                imageSrc="/images/provisiones.jpg"
                imageAlt="Ship provisions onboard"
                icon={Apple}
                tag="Provisions"
                priority
                className="h-full"
              />
            </StaggerItem>
            <StaggerItem className="lg:col-span-5">
              <BentoServiceCard
                title={t("service3Title")}
                body={t("service3Body")}
                href={link("/procurement")}
                ctaLabel={t("ctaSupplies")}
                imageSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80&fm=avif"
                imageAlt="Marine technical supplies"
                icon={Wrench}
                tag="Technical"
                className="h-full"
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
