import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Droplet, Recycle, Satellite, Zap, Snowflake } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { AnnexBlock } from "@/components/sections/AnnexBlock";
import { Timeline } from "@/components/sections/Timeline";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { FadeIn } from "@/components/sections/FadeIn";
import { buildPageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/servicios/gestion-desechos");
}

function faqDesechosJsonLd(locale: string) {
  const es = locale !== "en";
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: es
          ? "¿Qué residuos cubre el servicio MARPOL?"
          : "What waste types does the MARPOL service cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Nuestro servicio cubre los residuos oleosos regulados por MARPOL Anexo I: lodos de depuradora (sludge), aguas de sentina con mezcla oleosa, aceites usados de lubricación, hidráulica y refrigeración, y trapos y filtros contaminados. También gestionamos residuos de lastre con trazas de hidrocarburos según la normativa local aplicable."
            : "Our service covers oily residues regulated by MARPOL Annex I: purifier sludge, oily bilge water mixtures, used lubricating, hydraulic, and refrigeration oils, and contaminated rags and filters. We also manage ballast residues with hydrocarbon traces in accordance with applicable local regulations.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Emiten certificado de disposición final?"
          : "Do you issue a final disposal certificate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Sí. Emitimos un certificado de recepción y disposición final conforme a los formularios exigidos por el Convenio MARPOL, que el capitán añade al Oil Record Book como comprobante de entrega legal. El certificado incluye: fecha y hora de recepción, tipo y volumen de residuo recibido, nombre y bandera del buque, y la cadena de custodia hasta la instalación de disposición final autorizada."
            : "Yes. We issue a reception and final disposal certificate in the forms required by the MARPOL Convention, which the master adds to the Oil Record Book as proof of legal delivery. The certificate includes: date and time of reception, type and volume of waste received, vessel name and flag, and the chain of custody to the authorized final disposal facility.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Cuánto tiempo tarda la operación de recolección?"
          : "How long does the waste collection operation take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "El tiempo de la operación varía según el volumen a recolectar y el tipo de residuo. Para volúmenes estándar (3-10 m³), la operación completa — incluyendo conexión de mangueras, bombeo y documentación a bordo — toma entre 2 y 4 horas. Volúmenes superiores a 15 m³ pueden requerir hasta 6-8 horas. La coordinación previa de 12 horas garantiza que el equipo y el camión cisterna estén disponibles dentro de la ventana operativa del buque."
            : "Operation time varies by volume and waste type. For standard volumes (3-10 m³), the complete operation — including hose connection, pumping, and onboard documentation — takes 2 to 4 hours. Volumes exceeding 15 m³ may require up to 6-8 hours. Advance coordination of 12 hours ensures that the equipment and tanker truck are available within the vessel's operational window.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿El servicio cumple con MARPOL Anexo I?"
          : "Is the service compliant with MARPOL Annex I?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "Sí. Operamos con los permisos de la Autoridad Portuaria Dominicana (APORDOM) y el Ministerio de Medio Ambiente bajo la Ley 64-00. La cadena de disposición desde la recepción a bordo hasta la instalación de tratamiento final está documentada y cumple con los requisitos del Anexo I de MARPOL y la normativa nacional dominicana sobre residuos peligrosos."
            : "Yes. We operate with permits from the Dominican Port Authority (APORDOM) and the Ministry of Environment under Law 64-00. The disposal chain from onboard reception to the final treatment facility is documented and complies with MARPOL Annex I requirements and Dominican national regulations on hazardous waste.",
        },
      },
      {
        "@type": "Question",
        name: es
          ? "¿Cómo coordino el servicio desde otro país?"
          : "How do I coordinate the service from abroad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: es
            ? "La coordinación es sencilla y puede realizarse 100% de forma remota. Envíe por correo electrónico o WhatsApp el nombre del buque, número IMO, puerto de escala, ETA, tipo de residuo y volumen estimado. En menos de 2 horas recibirá confirmación de disponibilidad y cotización. El agente naviero en el puerto dominicano puede actuar como enlace, o el capitán puede contactarnos directamente."
            : "Coordination is straightforward and can be done 100% remotely. Send by email or WhatsApp the vessel name, IMO number, port of call, ETA, waste type, and estimated volume. Within 2 hours you will receive availability confirmation and a quote. The port agent at the Dominican port can act as liaison, or the master can contact us directly.",
        },
      },
    ],
  };
}

export default async function GestionDesechosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("waste");

  const link = (path: string) => `/${locale}${path}`;

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  const WA = "https://wa.me/18298563586";
  const waBtn = locale === "en" ? "Request service" : "Solicitar servicio";

  function waLink(service: string) {
    const msg = locale === "en"
      ? `Hello, I'm interested in the *${service}* service. Could you provide more details?`
      : `Hola, estoy interesado en el servicio de *${service}*. ¿Pueden darme más información?`;
    return `${WA}?text=${encodeURIComponent(msg)}`;
  }

  const techServices = [
    { icon: Recycle,   title: t("tech1Title"), body: t("tech1Body"), whatsappHref: waLink(t("tech1Title")), whatsappLabel: waBtn },
    { icon: Satellite, title: t("tech2Title"), body: t("tech2Body"), whatsappHref: waLink(t("tech2Title")), whatsappLabel: waBtn },
    { icon: Zap,       title: t("tech3Title"), body: t("tech3Body"), whatsappHref: waLink(t("tech3Title")), whatsappLabel: waBtn },
    { icon: Snowflake, title: t("tech4Title"), body: t("tech4Body"), whatsappHref: waLink(t("tech4Title")), whatsappLabel: waBtn },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ locale, serviceType: "marpol" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/servicios/gestion-desechos" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqDesechosJsonLd(locale)) }} />
      <PageHeader
        kicker={t("kicker")}
        title={t("h1")}
        subtitle={t("subtitle")}
        videoSrcMp4="/videos/Servicios.mp4"
        posterSrc="/images/oleosos.jpg"
        imageAlt="Gestión de residuos oleosos MARPOL"
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6 space-y-24 md:space-y-32">
          <AnnexBlock
            tag={t("annex1Tag")}
            title={t("annex1Title")}
            body={t("annex1Body")}
            includesLabel={t("annex1Includes")}
            items={[
              t("annex1Item1"),
              t("annex1Item2"),
              t("annex1Item3"),
            ]}
            icon={Droplet}
            imageSrc="/images/oleosos.jpg"
            imageAlt={t("annex1Title")}
          />

        </div>
      </section>

      <section className="bg-background py-24 md:py-32 border-t border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("techKicker")}
              title={t("techTitle")}
              subtitle={t("techSubtitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <FeatureGrid features={techServices} columns={4} />
          </div>
        </div>
      </section>

      <section className="bg-cream/30 py-24 md:py-32 border-y border-navy/8">
        <div className="container mx-auto px-6">
          <FadeIn>
            <SectionHeading
              kicker={t("howKicker")}
              title={t("howTitle")}
              align="center"
            />
          </FadeIn>
          <div className="mt-16 md:mt-20">
            <Timeline steps={steps} />
          </div>
        </div>
      </section>

      <CTASection
        title={t("ctaText")}
        buttons={[
          { label: t("ctaText"), href: link("/cotizar/desechos") },
        ]}
      />
    </>
  );
}
