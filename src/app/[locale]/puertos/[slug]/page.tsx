import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn, Stagger, StaggerItem } from "@/components/sections/FadeIn";
import { buildPageMetadata, breadcrumbJsonLd, faqJsonLd, SITE_URL } from "@/lib/seo";
import { PORTS, getPort } from "@/lib/ports";
import { routing } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PORTS.map((port) => ({ locale, slug: port.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const path = `/puertos/${slug}` as Parameters<typeof buildPageMetadata>[1];
  return buildPageMetadata(locale, path);
}

function portPlaceJsonLd(port: ReturnType<typeof getPort>, locale: string) {
  if (!port) return null;
  const supported = locale === "en" ? "en" : "es";
  const name = supported === "es" ? port.nameEs : port.nameEn;
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    geo: {
      "@type": "GeoCoordinates",
      latitude: port.lat,
      longitude: port.lon,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "DO",
    },
    containedInPlace: {
      "@type": "Country",
      name: "Dominican Republic",
    },
  };
}

function portServiceJsonLd(
  port: ReturnType<typeof getPort>,
  locale: string,
  slug: string
) {
  if (!port) return null;
  const supported = locale === "en" ? "en" : "es";
  const portName = supported === "es" ? port.nameEs : port.nameEn;
  const name =
    supported === "es"
      ? `Servicios de ship chandler en ${portName}`
      : `Ship chandler services at ${portName}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "Place",
      name: portName,
      geo: {
        "@type": "GeoCoordinates",
        latitude: port.lat,
        longitude: port.lon,
      },
    },
    url: `${SITE_URL}/${supported}/puertos/${slug}`,
  };
}

export default async function PortDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const port = getPort(slug);
  if (!port) notFound();

  const t = await getTranslations("ports_detail");
  const link = (path: string) => `/${locale}${path}`;

  const portCopy = t.raw(slug as Parameters<typeof t.raw>[0]) as {
    h1: string;
    subtitle: string;
    body: string;
    ctaTitle: string;
  };

  const portName = locale === "es" ? port.nameEs : port.nameEn;

  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    question: t(`faq.q${n}.question`, { port: portName }),
    answer: t(`faq.q${n}.answer`, { port: portName }),
  }));

  const nearbyPorts = PORTS.filter((p) => p.slug !== slug).map((p) => ({
    name: locale === "es" ? p.nameEs : p.nameEn,
    href: link(`/puertos/${p.slug}`),
  }));

  const breadcrumb = breadcrumbJsonLd({ locale, path: `/puertos/${slug}` });
  const place = portPlaceJsonLd(port, locale);
  const service = portServiceJsonLd(port, locale, slug);
  const faq = faqJsonLd(faqs);

  const steps = [
    { title: t("step1Title"), body: t("step1Body"), num: "01" },
    { title: t("step2Title"), body: t("step2Body"), num: "02" },
    { title: t("step3Title"), body: t("step3Body"), num: "03" },
    { title: t("step4Title"), body: t("step4Body"), num: "04" },
  ];

  const services = [
    {
      title: t("serviceProvisiones"),
      body: t("serviceProvisionesBody"),
      href: link("/servicios/provisiones"),
      cta: link("/cotizar/provisiones"),
    },
    {
      title: t("serviceDesechos"),
      body: t("serviceDesechosBody"),
      href: link("/servicios/gestion-desechos"),
      cta: link("/cotizar/desechos"),
    },
    {
      title: t("serviceTecnico"),
      body: t("serviceTecnicoBody"),
      href: link("/procurement"),
      cta: link("/cotizar/provisiones"),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {place && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(place) }}
        />
      )}
      {service && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <PageHeader
        kicker={`${t("kicker")} ${locale === "es" ? port.nameEs : port.nameEn}`}
        title={portCopy.h1}
        subtitle={portCopy.subtitle}
      />

      <section className="bg-cream/40 py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("servicesKicker")}
              title={t("servicesTitle")}
            />
          </FadeIn>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <StaggerItem key={i}>
                <div className="group h-full flex flex-col p-7 md:p-8 rounded-sm bg-white border border-navy/8 hover:border-gold/50 transition-all duration-300">
                  <h3 className="font-serif text-xl text-navy mb-3 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-charcoal/75 leading-relaxed text-[14.5px] flex-1 mb-6">
                    {s.body}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href={s.cta}
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-[11px] uppercase tracking-[0.2em] font-semibold"
                    >
                      {locale === "es" ? "Cotizar" : "Get a quote"}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </Link>
                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-sm border border-navy/20 text-navy hover:border-gold hover:text-gold-dark transition-colors text-[11px] uppercase tracking-[0.2em] font-medium"
                    >
                      {locale === "es" ? "Ver servicio" : "Learn more"}
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("processKicker")}
              title={t("processTitle")}
            />
          </FadeIn>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="flex flex-col h-full">
                  <span className="font-serif text-3xl text-gold-dark/80 mb-4">
                    {step.num}
                  </span>
                  <h3 className="font-serif text-lg text-navy mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-charcoal/75 leading-relaxed text-[14.5px]">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream/40 py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("aboutKicker")}
              title={t("aboutTitle", { port: portName })}
            />
          </FadeIn>
          <FadeIn>
            <p className="mt-10 text-base md:text-lg text-charcoal/80 leading-relaxed max-w-3xl">
              {portCopy.body}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("faqKicker")}
              title={t("faqTitle", { port: portName })}
            />
          </FadeIn>
          <Stagger className="mt-14 max-w-3xl divide-y divide-navy/10 border-y border-navy/10">
            {faqs.map((item, i) => (
              <StaggerItem key={i}>
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <h3 className="font-serif text-lg md:text-xl text-navy leading-snug">
                      {item.question}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 text-gold-dark text-2xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-charcoal/75 leading-relaxed text-[15px] max-w-2xl">
                    {item.answer}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream/40 py-20 md:py-24">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("nearbyKicker")}
              title={t("nearbyTitle")}
            />
          </FadeIn>
          <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nearbyPorts.map((p, i) => (
              <StaggerItem key={i}>
                <Link
                  href={p.href}
                  className="group flex items-center justify-between gap-3 px-5 py-4 rounded-sm bg-white border border-navy/8 hover:border-gold/50 transition-colors"
                >
                  <span className="font-serif text-base text-navy leading-snug">
                    {p.name}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-navy/40 group-hover:text-gold-dark transition-colors flex-shrink-0"
                    strokeWidth={2}
                  />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title={portCopy.ctaTitle}
        buttons={[
          {
            label: locale === "es" ? "Cotizar provisiones" : "Quote provisions",
            href: link("/cotizar/provisiones"),
          },
          {
            label:
              locale === "es"
                ? "Gestión de desechos MARPOL"
                : "MARPOL waste management",
            href: link("/cotizar/desechos"),
            variant: "outline",
          },
        ]}
      />
    </>
  );
}
