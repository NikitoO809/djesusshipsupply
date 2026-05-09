import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/terminos");
}

const CONTENT = {
  es: {
    kicker: "Legal",
    h1: "Términos de Servicio",
    updated: "Última actualización: mayo 2026",
    sections: [
      {
        title: "1. Descripción del servicio",
        body: "De Jesús Ship Supply ofrece servicios de aprovisionamiento marítimo (víveres, agua, gases técnicos y bonded stores) y gestión de desechos MARPOL (Anexos I, IV, V y VI) en los principales puertos de la República Dominicana.",
      },
      {
        title: "2. Cotizaciones",
        body: "Las cotizaciones generadas a través de este sitio son ofertas indicativas. Los precios y disponibilidad definitivos dependen de las condiciones en puerto, fechas de escala y stock al momento de la confirmación. Una cotización aceptada por ambas partes constituye un acuerdo de servicio.",
      },
      {
        title: "3. Obligaciones del cliente",
        body: "El cliente se compromete a proporcionar información precisa sobre el buque y los requerimientos, confirmar o cancelar la solicitud con la antelación acordada, y cumplir con las regulaciones MARPOL y las normativas de la Autoridad Marítima Dominicana aplicables al buque.",
      },
      {
        title: "4. Limitación de responsabilidad",
        body: "De Jesús Ship Supply no se responsabiliza por demoras causadas por condiciones portuarias ajenas a su control, decisiones de autoridades portuarias o marítimas, condiciones meteorológicas adversas, o causas de fuerza mayor.",
      },
      {
        title: "5. Documentación MARPOL",
        body: "La emisión de documentación oficial (Libro de Registro de Hidrocarburos, Garbage Record Book) está sujeta a la normativa vigente de la Autoridad Marítima Dominicana. De Jesús Ship Supply gestiona la documentación conforme a los protocolos establecidos.",
      },
      {
        title: "6. Ley aplicable",
        body: "Estos términos se rigen por las leyes de la República Dominicana. Cualquier controversia se someterá a la jurisdicción de los tribunales competentes de Santo Domingo.",
      },
      {
        title: "7. Contacto",
        body: "Para consultas sobre estos términos: miguelcarmona809v@gmail.com | +1 849 276 2491.",
      },
    ],
  },
  en: {
    kicker: "Legal",
    h1: "Terms of Service",
    updated: "Last updated: May 2026",
    sections: [
      {
        title: "1. Service Description",
        body: "De Jesús Ship Supply provides ship provisioning services (fresh provisions, water, technical gases and bonded stores) and MARPOL waste management (Annexes I, IV, V and VI) at the main ports of the Dominican Republic.",
      },
      {
        title: "2. Quotations",
        body: "Quotations generated through this site are indicative offers. Final prices and availability depend on port conditions, dates of call, and stock at the time of confirmation. A quotation accepted by both parties constitutes a service agreement.",
      },
      {
        title: "3. Client Obligations",
        body: "The client agrees to provide accurate information about the vessel and requirements, to confirm or cancel the request with the agreed notice, and to comply with MARPOL regulations and Dominican Maritime Authority rules applicable to the vessel.",
      },
      {
        title: "4. Limitation of Liability",
        body: "De Jesús Ship Supply is not liable for delays caused by port conditions beyond its control, decisions of port or maritime authorities, adverse weather conditions, or force majeure events.",
      },
      {
        title: "5. MARPOL Documentation",
        body: "The issuance of official documentation (Oil Record Book, Garbage Record Book) is subject to the current regulations of the Dominican Maritime Authority. De Jesús Ship Supply handles documentation in accordance with established protocols.",
      },
      {
        title: "6. Governing Law",
        body: "These terms are governed by the laws of the Dominican Republic. Any dispute shall be submitted to the competent courts of Santo Domingo.",
      },
      {
        title: "7. Contact",
        body: "For inquiries about these terms: miguelcarmona809v@gmail.com | +1 849 276 2491.",
      },
    ],
  },
} as const;

export default async function TerminosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = CONTENT[locale === "en" ? "en" : "es"];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/terminos" })) }} />
      <PageHeader kicker={c.kicker} title={c.h1} />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-charcoal/50 mb-14 uppercase tracking-[0.18em]">{c.updated}</p>
            <div className="space-y-12">
              {c.sections.map((section) => (
                <div key={section.title}>
                  <h2 className="font-serif text-xl md:text-2xl text-navy mb-3 leading-snug">
                    {section.title}
                  </h2>
                  <p className="text-charcoal/75 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
