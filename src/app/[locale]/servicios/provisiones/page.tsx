import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Apple,
  Snowflake,
  Package,
  Wine,
  Droplet,
  Flame,
  Sparkles,
  FileCheck,
  PackagePlus,
  Coins,
} from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/servicios/provisiones");
}

function faqProvisionesJsonLd(locale: string) {
  const es = locale !== "en";
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: es
          ? "¿Con cuánta anticipación debo solicitar las provisiones?"
          : "How far in advance should I order provisions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Recomendamos enviar la solicitud con al menos 24 horas de anticipación al arribo del buque. Para pedidos que incluyan bonded stores o productos especiales, el plazo mínimo es de 48 horas. Pedidos de último momento pueden atenderse con cargo adicional por servicio urgente, sujeto a disponibilidad."
            : "We recommend submitting the request at least 24 hours before the vessel's arrival. For orders that include bonded stores or special products, the minimum lead time is 48 hours. Last-minute orders can be accommodated with an additional urgent service charge, subject to availability.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Qué productos incluyen las provisiones marítimas?"
          : "What products are included in ship provisions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Las provisiones marítimas abarcan víveres frescos (frutas, verduras, lácteos, carnes), productos congelados, alimentos secos y enlatados, bebidas alcohólicas y no alcohólicas, agua potable, y gases técnicos como CO₂, nitrógeno y acetileno. También gestionamos bonded stores (provisiones libres de impuestos de importación) bajo control aduanal."
            : "Ship provisions include fresh stores (fruits, vegetables, dairy, meats), frozen products, dry and canned goods, alcoholic and non-alcoholic beverages, potable water, and technical gases such as CO₂, nitrogen, and acetylene. We also handle bonded stores (import duty-free provisions) under customs control.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Entregan a bordo en todos los puertos de RD?"
          : "Do you deliver onboard at all DR ports?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Sí, operamos en los 8 puertos principales de República Dominicana: Caucedo, Río Haina, Boca Chica, Puerto Plata, Samaná, La Romana, San Pedro de Macorís y Manzanillo. La entrega se realiza directamente al costado del buque. Los tiempos de entrega varían según el puerto, con mayor disponibilidad logística en Caucedo y Río Haina."
            : "Yes, we operate at all 8 main ports in the Dominican Republic: Caucedo, Río Haina, Boca Chica, Puerto Plata, Samaná, La Romana, San Pedro de Macorís, and Manzanillo. Delivery is made directly alongside the vessel. Delivery times vary by port, with greater logistical availability at Caucedo and Río Haina.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Aceptan listas en Excel o formato propio?"
          : "Do you accept Excel lists or custom formats?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Sí, aceptamos la lista de provisiones en cualquier formato: Excel, PDF, lista de texto por correo o WhatsApp, o directamente a través de nuestro formulario de cotización en línea. También ofrecemos una plantilla Excel estándar que puede descargarse desde nuestra página de cotización."
            : "Yes, we accept the provisions list in any format: Excel, PDF, plain text by email or WhatsApp, or directly through our online quotation form. We also offer a standard Excel template that can be downloaded from our quotation page.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Qué son los bonded stores y cómo pedirlos?"
          : "What are bonded stores and how do I order them?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Los bonded stores son provisiones (principalmente alcohol, tabaco y algunos productos de lujo) que se suministran al buque sin pagar impuestos de importación dominicanos, ya que el consumo se realiza fuera de aguas nacionales. Para pedirlos, envíe la lista con al menos 48 horas de anticipación. Gestionamos el trámite aduanal completo en coordinación con el despachante de aduanas del puerto."
            : "Bonded stores are provisions (mainly alcohol, tobacco, and some luxury goods) supplied to the vessel without paying Dominican import taxes, since consumption takes place outside national waters. To order them, send the list at least 48 hours in advance. We handle the complete customs process in coordination with the port customs broker.",
        },
      },
    ],
  };
}

export default async function ProvisionesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("provisions");

  const link = (path: string) => `/${locale}${path}`;

  const categories = [
    { icon: Apple, title: t("c1Title"), body: t("c1Body") },
    { icon: Snowflake, title: t("c2Title"), body: t("c2Body") },
    { icon: Package, title: t("c3Title"), body: t("c3Body") },
    { icon: Wine, title: t("c4Title"), body: t("c4Body") },
    { icon: Droplet, title: t("c5Title"), body: t("c5Body") },
    { icon: Flame, title: t("c6Title"), body: t("c6Body") },
  ];

  const why = [
    { icon: Sparkles, title: t("w1Title"), body: t("w1Body") },
    { icon: FileCheck, title: t("w2Title"), body: t("w2Body") },
    { icon: PackagePlus, title: t("w3Title"), body: t("w3Body") },
    { icon: Coins, title: t("w4Title"), body: t("w4Body") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ locale, serviceType: "provisions" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/servicios/provisiones" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqProvisionesJsonLd(locale)) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        imageSrc="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2200&q=80&fm=avif"
        imageAlt="Fresh produce market"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("categoriesKicker")}
              title={t("categoriesTitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <FeatureGrid features={categories} columns={3} />
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading title={t("whyTitle")} align="center" />
          </FadeIn>
          <div className="mt-16">
            <FeatureGrid features={why} columns={4} variant="minimal" />
          </div>
        </div>
      </section>

      <CTASection
        title={t("ctaText")}
        buttons={[{ label: t("ctaText"), href: link("/cotizar/provisiones") }]}
      />
    </>
  );
}
