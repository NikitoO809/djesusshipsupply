import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/privacidad");
}

const CONTENT = {
  es: {
    kicker: "Legal",
    h1: "Política de Privacidad",
    updated: "Última actualización: mayo 2026",
    sections: [
      {
        title: "1. Responsable del tratamiento",
        body: "De Jesús Ship Supply, empresa de servicios marítimos con sede en Santo Domingo, República Dominicana, es responsable del tratamiento de los datos personales recopilados a través de este sitio web.",
      },
      {
        title: "2. Datos que recopilamos",
        body: "Al solicitar una cotización, recopilamos: nombre completo y cargo, correo electrónico y teléfono, nombre del buque, número IMO y bandera, puerto de escala y fechas estimadas, y detalles del servicio solicitado (provisiones o desechos MARPOL).",
      },
      {
        title: "3. Finalidad del tratamiento",
        body: "Los datos se usan exclusivamente para procesar cotizaciones y solicitudes de servicio, coordinar operaciones en puerto, emitir documentación MARPOL requerida, y responder consultas relacionadas con el servicio.",
      },
      {
        title: "4. Base legal",
        body: "El tratamiento se basa en el consentimiento explícito del usuario al enviar el formulario de cotización, y en la ejecución del contrato de servicio cuando aplique.",
      },
      {
        title: "5. Conservación de datos",
        body: "Los datos se conservan durante el tiempo necesario para gestionar la solicitud. La documentación MARPOL se conserva por el período mínimo exigido por la Autoridad Marítima Dominicana (mínimo 2 años).",
      },
      {
        title: "6. Terceros",
        body: "Utilizamos Resend (resend.com) exclusivamente para la entrega de correos electrónicos de confirmación. No vendemos, alquilamos ni compartimos sus datos con terceros comerciales.",
      },
      {
        title: "7. Sus derechos",
        body: "Puede solicitar en cualquier momento el acceso, rectificación, supresión o portabilidad de sus datos, así como la limitación del tratamiento. Envíe su solicitud a miguelcarmona809v@gmail.com.",
      },
      {
        title: "8. Cambios a esta política",
        body: "Nos reservamos el derecho de actualizar esta política. Los cambios se publicarán en esta página con la fecha de actualización correspondiente.",
      },
    ],
  },
  en: {
    kicker: "Legal",
    h1: "Privacy Policy",
    updated: "Last updated: May 2026",
    sections: [
      {
        title: "1. Data Controller",
        body: "De Jesús Ship Supply, a maritime services company based in Santo Domingo, Dominican Republic, is the controller of personal data collected through this website.",
      },
      {
        title: "2. Data We Collect",
        body: "When requesting a quote, we collect: full name and role, email and phone number, vessel name, IMO number and flag, port of call and estimated dates, and details of the requested service (provisions or MARPOL waste).",
      },
      {
        title: "3. Purpose",
        body: "Data is used exclusively to process quotations and service requests, coordinate port operations, issue required MARPOL documentation, and respond to service-related inquiries.",
      },
      {
        title: "4. Legal Basis",
        body: "Processing is based on the user's explicit consent when submitting the quote form, and on the performance of a service contract where applicable.",
      },
      {
        title: "5. Data Retention",
        body: "Data is retained for the time necessary to manage the request. MARPOL documentation is retained for the minimum period required by the Dominican Maritime Authority (minimum 2 years).",
      },
      {
        title: "6. Third Parties",
        body: "We use Resend (resend.com) exclusively for email delivery of confirmation messages. We do not sell, rent, or share your data with commercial third parties.",
      },
      {
        title: "7. Your Rights",
        body: "You may request access, rectification, erasure, portability, or restriction of processing at any time. Send your request to miguelcarmona809v@gmail.com.",
      },
      {
        title: "8. Changes to This Policy",
        body: "We reserve the right to update this policy. Changes will be published on this page with the corresponding update date.",
      },
    ],
  },
} as const;

export default async function PrivacidadPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = CONTENT[locale === "en" ? "en" : "es"];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ locale, path: "/privacidad" })) }} />
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
