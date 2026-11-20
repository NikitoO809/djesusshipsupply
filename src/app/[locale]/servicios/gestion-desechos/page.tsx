import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Droplet,
  Waves,
  Trash2,
  Recycle,
  Satellite,
  Zap,
  Snowflake,
  Check,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Timeline } from "@/components/sections/Timeline";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { FaqList } from "@/components/sections/FaqList";
import { FadeIn } from "@/components/sections/FadeIn";
import {
  buildPageMetadata,
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { PORTS } from "@/lib/ports";
import { mailtoUrl } from "@/lib/contact";

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
  const tc = await getTranslations("contact");

  const link = (path: string) => `/${locale}${path}`;
  const mailtoQuote = mailtoUrl(tc("mailSubject"), tc("mailBody"));

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  const WA = "https://wa.me/18298563586";
  const waBtn = locale === "en" ? "Request service" : "Solicitar servicio";

  function waLink(service: string) {
    const msg =
      locale === "en"
        ? `Hello, I'm interested in the *${service}* service. Could you provide more details?`
        : `Hola, estoy interesado en el servicio de *${service}*. ¿Pueden darme más información?`;
    return `${WA}?text=${encodeURIComponent(msg)}`;
  }

  const otherAnnexes = [
    {
      icon: Waves,
      title: t("annex4Title"),
      body: t("annex4Body"),
      whatsappHref: waLink(t("annex4Title")),
      whatsappLabel: waBtn,
    },
    {
      icon: Trash2,
      title: t("annex5Title"),
      body: t("annex5Body"),
      whatsappHref: waLink(t("annex5Title")),
      whatsappLabel: waBtn,
    },
  ];

  const techServices = [
    { icon: Recycle, title: t("tech1Title"), body: t("tech1Body"), whatsappHref: waLink(t("tech1Title")), whatsappLabel: waBtn },
    { icon: Satellite, title: t("tech2Title"), body: t("tech2Body"), whatsappHref: waLink(t("tech2Title")), whatsappLabel: waBtn },
    { icon: Zap, title: t("tech3Title"), body: t("tech3Body"), whatsappHref: waLink(t("tech3Title")), whatsappLabel: waBtn },
    { icon: Snowflake, title: t("tech4Title"), body: t("tech4Body"), whatsappHref: waLink(t("tech4Title")), whatsappLabel: waBtn },
  ];

  // Las mismas preguntas se muestran en pantalla y se publican como FAQPage.
  const faqs = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    question: t(`faqQ${n}`),
    answer: t(`faqA${n}`),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd({ locale, serviceType: "marpol" })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd({ locale, path: "/servicios/gestion-desechos" })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        videoSrcMp4="/videos/Servicios.mp4"
        posterSrc="/images/oleosos.jpg"
        imageAlt="Gestión de desechos MARPOL en buques"
        variant="editorial"
      />

      {/* ── Anexo I — servicio principal ── */}
      <section className="relative bg-navy text-cream py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 30%, var(--gold) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-6 relative">
          <FadeIn>
            <div className="text-center mb-14 md:mb-16">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold font-semibold mb-4">
                <span className="h-px w-8 bg-gold/60" />
                {locale === "en" ? "Core service" : "Servicio principal"}
                <span className="h-px w-8 bg-gold/60" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-cream leading-[1.08] tracking-tight max-w-3xl mx-auto">
                {t("annex1Title")}
              </h2>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-gold/20 shadow-2xl">
                <Image
                  src="/images/oleosos.jpg"
                  alt={t("annex1Title")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 via-navy/10 to-transparent" />
                <span className="absolute top-5 left-5 inline-flex items-center px-3 py-1.5 rounded-sm bg-gold text-navy text-[10px] uppercase tracking-[0.22em] font-semibold">
                  {t("annex1Tag")}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-gold text-navy mb-6">
                  <Droplet className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <p className="text-cream/80 leading-relaxed text-base md:text-lg mb-8">
                  {t("annex1Body")}
                </p>

                <p className="text-[11px] uppercase tracking-[0.22em] text-gold font-medium mb-4">
                  {t("annex1Includes")}
                </p>
                <ul className="space-y-3 mb-10">
                  {[t("annex1Item1"), t("annex1Item2"), t("annex1Item3")].map(
                    (item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-gold/20 text-gold shrink-0">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-cream/85 text-[15px]">{item}</span>
                      </li>
                    )
                  )}
                </ul>

                <a
                  href={mailtoQuote}
                  className="group inline-flex items-center gap-3 h-12 px-7 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-[12px] uppercase tracking-[0.18em] font-semibold"
                >
                  {t("ctaEmail")}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Anexos IV y V ── */}
      <section className="relative bg-background py-28 md:py-40 border-t border-navy/8 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,97,0.10),transparent_60%)]"
        />
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("annexesKicker")}
              title={t("annexesTitle")}
              subtitle={t("annexesSubtitle")}
              align="center"
              variant="editorial"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
            <FeatureGrid features={otherAnnexes} columns={2} variant="editorial" />
          </div>
        </div>
      </section>

      {/* ── Proceso ── */}
      <section className="bg-cream/40 py-28 md:py-40 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("howKicker")}
              title={t("howTitle")}
              align="center"
              variant="editorial"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <Timeline steps={steps} variant="editorial" />
          </div>
        </div>
      </section>

      {/* ── Cobertura: enlaces internos a cada puerto ── */}
      <section className="relative bg-background py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("portsKicker")}
              title={t("portsTitle")}
              subtitle={t("portsSubtitle")}
              align="center"
              variant="editorial"
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <ul className="mt-12 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {PORTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={link(`/puertos/${p.slug}`)}
                    className="group inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-navy/15 px-5 py-2.5 text-[13px] text-navy transition-colors duration-500 hover:bg-navy hover:text-cream hover:ring-navy"
                  >
                    <MapPin
                      className="h-3.5 w-3.5 text-gold-dark group-hover:text-gold"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {locale === "en" ? p.nameEn : p.nameEs}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ── Preguntas frecuentes (visibles) ── */}
      <section className="bg-cream/40 py-28 md:py-40 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("faqKicker")}
              title={t("faqTitle")}
              align="center"
              variant="editorial"
            />
          </FadeIn>
          <div className="mt-14 md:mt-16">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>

      {/* ── Servicios técnicos (secundario) ── */}
      <section className="relative bg-background py-28 md:py-40 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("techKicker")}
              title={t("techTitle")}
              subtitle={t("techSubtitle")}
              align="center"
              variant="editorial"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <FeatureGrid features={techServices} columns={4} variant="editorial" />
          </div>
        </div>
      </section>

      <CTASection
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        buttons={[
          { label: t("ctaEmail"), href: mailtoQuote },
          { label: t("ctaWhatsapp"), href: WA, variant: "outline" },
        ]}
      />
    </>
  );
}
