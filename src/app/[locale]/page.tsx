import type { Metadata } from "next";
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
import { ServiceCard } from "@/components/sections/ServiceCard";
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

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20 items-start">
            <div>
              <FadeIn>
                <SectionHeading
                  kicker={t("whyKicker")}
                  title={t("whyTitle")}
                  align="left"
                />
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="mt-10 p-8 rounded-sm bg-navy text-cream">
                  <div className="inline-flex items-center justify-center h-11 w-11 rounded-sm bg-cream/10 text-gold mb-5">
                    <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-serif text-xl md:text-[22px] text-cream mb-3 leading-snug">
                    {t("why1Title")}
                  </h3>
                  <p className="text-cream/70 text-[15px] leading-relaxed">
                    {t("why1Body")}
                  </p>
                </div>
              </FadeIn>
            </div>

            <Stagger className="divide-y divide-navy/8">
              <StaggerItem className="pb-10">
                <div className="group flex gap-5">
                  <div className="shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-sm bg-navy/5 text-navy group-hover:bg-gold/15 group-hover:text-gold-dark transition-colors">
                    <Globe2 className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-[22px] text-navy mb-2.5 leading-snug">
                      {t("why2Title")}
                    </h3>
                    <p className="text-charcoal/75 text-[15px] leading-relaxed">
                      {t("why2Body")}
                    </p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem className="pt-10">
                <div className="group flex gap-5">
                  <div className="shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-sm bg-navy/5 text-navy group-hover:bg-gold/15 group-hover:text-gold-dark transition-colors">
                    <Clock className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-[22px] text-navy mb-2.5 leading-snug">
                      {t("why3Title")}
                    </h3>
                    <p className="text-charcoal/75 text-[15px] leading-relaxed">
                      {t("why3Body")}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("servicesKicker")}
              title={t("servicesTitle")}
              align="left"
            />
          </FadeIn>
          <Stagger className="mt-16 grid gap-7 lg:grid-cols-2">
            <StaggerItem>
              <ServiceCard
                title={t("service1Title")}
                body={t("service1Body")}
                href={link("/servicios/gestion-desechos")}
                ctaLabel={t("ctaWaste")}
                imageSrc="https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1600&q=80&fm=avif"
                imageAlt="MARPOL waste management"
                icon={Trash2}
                tag="MARPOL"
                priority
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard
                title={t("service2Title")}
                body={t("service2Body")}
                href={link("/servicios/provisiones")}
                ctaLabel={t("ctaProvisions")}
                imageSrc="/images/provisiones.jpg"
                imageAlt="Ship provisions onboard"
                icon={Apple}
                tag="Provisions"
                priority
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
