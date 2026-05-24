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
import { ArrowUpRight } from "lucide-react";

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
        variant="editorial"
      />

      <section className="relative bg-cream/40 py-28 md:py-40 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [background-image:radial-gradient(ellipse_60%_40%_at_15%_15%,rgba(201,169,97,0.10),transparent_60%)]"
        />
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("servicesKicker")}
              title={t("servicesTitle")}
              variant="editorial"
            />
          </FadeIn>
          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <StaggerItem key={i}>
                <div className="group relative h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_50px_-30px_rgba(10,37,64,0.18)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_70px_-30px_rgba(10,37,64,0.28)]">
                  <div className="relative h-full flex flex-col rounded-[calc(2rem-0.375rem)] bg-white p-7 md:p-8">
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-mono text-[10px] text-gold-dark tracking-[0.2em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-navy/8" />
                    </div>
                    <h3 className="font-serif text-xl md:text-[22px] text-navy mb-3 leading-[1.15] tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed text-[14.5px] flex-1 mb-7">
                      {s.body}
                    </p>
                    <div className="flex gap-2.5 flex-wrap">
                      <Link
                        href={s.cta}
                        className="inline-flex items-center gap-2 rounded-full bg-navy text-cream pl-4 pr-1 py-1 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-gold hover:text-navy"
                      >
                        {locale === "es" ? "Cotizar" : "Get a quote"}
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gold text-navy">
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                      </Link>
                      <Link
                        href={s.href}
                        className="inline-flex items-center px-4 h-9 rounded-full ring-1 ring-navy/15 text-navy text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-navy hover:text-cream hover:ring-navy"
                      >
                        {locale === "es" ? "Ver servicio" : "Learn more"}
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative bg-background py-28 md:py-40 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(201,169,97,0.08),transparent_60%)]"
        />
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("processKicker")}
              title={t("processTitle")}
              variant="editorial"
            />
          </FadeIn>
          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="group relative h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5">
                  <div className="relative h-full rounded-[calc(2rem-0.375rem)] bg-white p-7 md:p-8">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-navy text-gold font-serif text-xl ring-4 ring-cream mb-5 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy">
                      {step.num}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl text-navy mb-2.5 leading-snug tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed text-[14.5px]">
                      {step.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream/40 py-28 md:py-40 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("aboutKicker")}
              title={t("aboutTitle", { port: portName })}
              variant="editorial"
            />
          </FadeIn>
          <FadeIn>
            <div className="mt-12 max-w-3xl">
              <div className="rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white p-9 md:p-12">
                  <p className="text-base md:text-[17px] text-charcoal/80 leading-[1.7]">
                    {portCopy.body}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-background py-28 md:py-40">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("faqKicker")}
              title={t("faqTitle", { port: portName })}
              variant="editorial"
            />
          </FadeIn>
          <Stagger className="mt-14 max-w-3xl space-y-3">
            {faqs.map((item, i) => (
              <StaggerItem key={i}>
                <details className="group rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition-colors duration-500 hover:bg-cream/80">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none rounded-[calc(2rem-0.375rem)] bg-white px-7 md:px-8 py-6">
                    <h3 className="font-serif text-lg md:text-xl text-navy leading-snug tracking-tight">
                      {item.question}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-navy/5 ring-1 ring-navy/10 text-navy text-lg leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45 group-open:bg-gold group-open:text-navy group-open:ring-gold"
                    >
                      +
                    </span>
                  </summary>
                  <div className="rounded-[calc(2rem-0.375rem)] bg-white px-7 md:px-8 pb-7 -mt-2">
                    <p className="text-charcoal/70 leading-relaxed text-[15px] max-w-2xl">
                      {item.answer}
                    </p>
                  </div>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream/40 py-24 md:py-32 border-t border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("nearbyKicker")}
              title={t("nearbyTitle")}
              variant="editorial"
            />
          </FadeIn>
          <Stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nearbyPorts.map((p, i) => (
              <StaggerItem key={i}>
                <Link
                  href={p.href}
                  className="group flex items-center justify-between gap-3 rounded-full bg-white ring-1 ring-navy/10 pl-5 pr-2 py-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-navy hover:ring-navy"
                >
                  <span className="font-serif text-[15px] text-navy leading-snug transition-colors duration-500 group-hover:text-cream">
                    {p.name}
                  </span>
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-navy/5 text-navy transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
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
