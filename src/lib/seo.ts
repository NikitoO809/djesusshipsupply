import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://djshipsupply.com"
).replace(/\/$/, "");

type Locale = "es" | "en";
type Copy = { title: string; description: string };

export const PAGE_SEO: Record<string, Record<Locale, Copy>> = {
  "/": {
    es: {
      title: "Ship Chandler en RD — Provisiones y MARPOL en 8 puertos",
      description:
        "Ship chandler dominicano: gestión de desechos MARPOL y provisiones marítimas en Caucedo, Río Haina, Punta Caucedo y los 8 puertos principales de RD. Respuesta 24/7.",
    },
    en: {
      title: "Ship Chandler in DR — Provisions & MARPOL in 8 ports",
      description:
        "Dominican ship chandler: MARPOL waste management and ship provisions across Caucedo, Río Haina and the 8 main ports of the Dominican Republic. 24/7 response.",
    },
  },
  "/sobre-nosotros": {
    es: {
      title: "Sobre nosotros — Operadores marítimos en República Dominicana",
      description:
        "De Jesús Ship Supply: operadores marítimos dominicanos especializados en MARPOL y provisiones. Documentación impecable, atención bilingüe y cobertura nacional.",
    },
    en: {
      title: "About us — Maritime operators in the Dominican Republic",
      description:
        "De Jesús Ship Supply: Dominican maritime operators specialized in MARPOL and provisions. Impeccable documentation, bilingual service, nationwide coverage.",
    },
  },
  "/servicios/provisiones": {
    es: {
      title: "Provisiones marítimas — Víveres, bonded stores y gases técnicos",
      description:
        "Suministro de víveres frescos, congelados, secos, bonded stores, agua potable y gases técnicos a bordo en los 8 puertos de RD. Cotización en menos de 2 horas.",
    },
    en: {
      title: "Ship provisions — Fresh, frozen, bonded stores & technical gases",
      description:
        "Fresh, frozen and dry provisions, bonded stores, potable water and technical gases delivered onboard at the 8 main DR ports. Quote in under 2 hours.",
    },
  },
  "/servicios/gestion-desechos": {
    es: {
      title: "Gestión de residuos oleosos MARPOL y servicios técnicos navales en RD",
      description:
        "Recolección y disposición de residuos oleosos con cumplimiento MARPOL Anexo I. Servicios técnicos a bordo: chatarra naval, electrónica de navegación, sistemas eléctricos y refrigeración. 8 puertos en RD.",
    },
    en: {
      title: "MARPOL oily waste management & marine technical services in DR",
      description:
        "Certified oily residue collection and MARPOL Annex I compliance. Onboard technical services: marine scrap, navigation electronics, electrical systems and refrigeration. 8 ports in the DR.",
    },
  },
  "/puertos": {
    es: {
      title: "Puertos de cobertura — Caucedo, Río Haina y 6 más",
      description:
        "Operamos en los 8 puertos principales de República Dominicana: Caucedo, Río Haina, Boca Chica, Puerto Plata, Samaná, La Romana, San Pedro de Macorís y Manzanillo.",
    },
    en: {
      title: "Ports we serve — Caucedo, Río Haina and 6 more",
      description:
        "We operate at the 8 main Dominican Republic ports: Caucedo, Río Haina, Boca Chica, Puerto Plata, Samaná, La Romana, San Pedro de Macorís and Manzanillo.",
    },
  },
  "/contacto": {
    es: {
      title: "Contacto — WhatsApp 24/7 y correo de operaciones",
      description:
        "Contacte De Jesús Ship Supply: WhatsApp 24/7, correo de operaciones y formulario directo. Respuesta a solicitudes en menos de 2 horas.",
    },
    en: {
      title: "Contact — 24/7 WhatsApp and operations email",
      description:
        "Reach De Jesús Ship Supply: 24/7 WhatsApp, operations email and direct form. Quote responses in under 2 hours.",
    },
  },
  "/cotizar/provisiones": {
    es: {
      title: "Cotizar provisiones marítimas — Solicitud directa",
      description:
        "Solicite cotización de provisiones para su buque. Suba lista en Excel, escriba a mano o use nuestra plantilla. Respuesta en menos de 2 horas.",
    },
    en: {
      title: "Request a provisions quote — Direct submission",
      description:
        "Request a ship provisions quote: upload Excel, free text, or use our template. Response in under 2 hours.",
    },
  },
  "/cotizar/desechos": {
    es: {
      title: "Cotizar gestión de desechos MARPOL — Solicitud directa",
      description:
        "Solicite cotización de gestión MARPOL: anexo, volumen estimado y puerto. Coordinamos atención al buque con documentación completa.",
    },
    en: {
      title: "Request a MARPOL waste quote — Direct submission",
      description:
        "Request a MARPOL waste management quote: annex, estimated volume and port. We coordinate vessel service with complete documentation.",
    },
  },
  "/procurement": {
    es: {
      title: "Marine Procurement — Suministros industriales y navales en RD",
      description:
        "Catálogo de suministros industriales y navales: eléctricos, ferretería, seguridad, pintura, refrigeración y más. Entrega directa al buque en los 8 puertos de RD. Cotización en 2 horas.",
    },
    en: {
      title: "Marine Procurement — Industrial & naval supplies in DR",
      description:
        "Industrial and marine supply catalog: electrical, hardware, safety, coatings, refrigeration and more. Direct delivery to your vessel at all 8 DR ports. Quote in 2 hours.",
    },
  },
  "/suministro": {
    es: {
      title: "Suministro marítimo — Técnicos, Provisiones y MARPOL en RD",
      description:
        "Plataforma de suministro marítimo integral: suministros técnicos industriales, provisiones a bordo y gestión de desechos MARPOL en los 8 puertos de República Dominicana.",
    },
    en: {
      title: "Maritime supply — Technical, Provisions & MARPOL in DR",
      description:
        "Integrated maritime supply platform: industrial technical supplies, onboard provisions and MARPOL waste management across the 8 main ports of the Dominican Republic.",
    },
  },
  "/privacidad": {
    es: {
      title: "Política de Privacidad — De Jesús Ship Supply",
      description:
        "Cómo De Jesús Ship Supply recopila, usa y protege sus datos personales al solicitar servicios marítimos en República Dominicana.",
    },
    en: {
      title: "Privacy Policy — De Jesús Ship Supply",
      description:
        "How De Jesús Ship Supply collects, uses and protects your personal data when requesting maritime services in the Dominican Republic.",
    },
  },
  "/terminos": {
    es: {
      title: "Términos de Servicio — De Jesús Ship Supply",
      description:
        "Términos y condiciones aplicables a los servicios de aprovisionamiento marítimo y gestión de desechos MARPOL en República Dominicana.",
    },
    en: {
      title: "Terms of Service — De Jesús Ship Supply",
      description:
        "Terms and conditions applicable to ship provisioning and MARPOL waste management services in the Dominican Republic.",
    },
  },
};

export function buildPageMetadata(
  locale: string,
  path: keyof typeof PAGE_SEO
): Metadata {
  const supported: Locale = (locale === "en" ? "en" : "es") as Locale;
  const copy = PAGE_SEO[path][supported];

  const languages: Record<string, string> = {};
  for (const alt of routing.locales) {
    languages[alt] = `${SITE_URL}/${alt}${path === "/" ? "" : path}`;
  }
  languages["x-default"] = `${SITE_URL}/es${path === "/" ? "" : path}`;

  const url = `${SITE_URL}/${supported}${path === "/" ? "" : path}`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      locale: supported === "es" ? "es_DO" : "en_US",
      alternateLocale: [supported === "es" ? "en_US" : "es_DO"],
    },
    twitter: {
      title: copy.title,
      description: copy.description,
    },
  };
}

const PHONE = "+1-829-856-3586";
const EMAIL = "info@djshipsupply.com";

export function localBusinessJsonLd(locale: string) {
  const supported: Locale = locale === "en" ? "en" : "es";
  const description =
    supported === "es"
      ? "Ship chandler dominicano: gestión de desechos MARPOL y provisiones marítimas en los 8 puertos principales de República Dominicana."
      : "Dominican ship chandler: MARPOL waste management and ship provisions across the 8 main ports of the Dominican Republic.";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "De Jesús Ship Supply",
    url: `${SITE_URL}/${supported}`,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/og-image.svg`,
    description,
    telephone: PHONE,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressCountry: "DO",
      addressRegion: "Distrito Nacional",
      addressLocality: "Santo Domingo",
    },
    areaServed: [
      { "@type": "Place", name: "Puerto de Caucedo" },
      { "@type": "Place", name: "Puerto de Río Haina" },
      { "@type": "Place", name: "Puerto de Boca Chica" },
      { "@type": "Place", name: "Puerto Plata" },
      { "@type": "Place", name: "Puerto de Samaná" },
      { "@type": "Place", name: "Puerto de La Romana" },
      { "@type": "Place", name: "Puerto de San Pedro de Macorís" },
      { "@type": "Place", name: "Puerto de Manzanillo" },
    ],
    knowsLanguage: ["es", "en"],
    sameAs: [],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };
}

const BREADCRUMB_STEPS: Record<string, Array<{ es: string; en: string; path?: string }>> = {
  "/sobre-nosotros": [{ es: "Sobre nosotros", en: "About us", path: "/sobre-nosotros" }],
  "/servicios/provisiones": [
    { es: "Servicios", en: "Services" },
    { es: "Provisiones marítimas", en: "Ship provisions", path: "/servicios/provisiones" },
  ],
  "/servicios/gestion-desechos": [
    { es: "Servicios", en: "Services" },
    { es: "Gestión de desechos MARPOL", en: "MARPOL waste management", path: "/servicios/gestion-desechos" },
  ],
  "/suministro": [{ es: "Suministro", en: "Supply", path: "/suministro" }],
  "/procurement": [
    { es: "Suministro", en: "Supply", path: "/suministro" },
    { es: "Suministros técnicos", en: "Technical supplies", path: "/procurement" },
  ],
  "/puertos": [{ es: "Puertos", en: "Ports", path: "/puertos" }],
  "/contacto": [{ es: "Contacto", en: "Contact", path: "/contacto" }],
  "/cotizar/provisiones": [
    { es: "Cotizar", en: "Request quote" },
    { es: "Provisiones", en: "Provisions", path: "/cotizar/provisiones" },
  ],
  "/cotizar/desechos": [
    { es: "Cotizar", en: "Request quote" },
    { es: "Gestión de desechos", en: "Waste management", path: "/cotizar/desechos" },
  ],
  "/privacidad": [{ es: "Privacidad", en: "Privacy", path: "/privacidad" }],
  "/terminos": [{ es: "Términos", en: "Terms", path: "/terminos" }],
};

export function breadcrumbJsonLd({ locale, path }: { locale: string; path: string }) {
  const supported: Locale = locale === "en" ? "en" : "es";
  const base = `${SITE_URL}/${supported}`;
  const steps = BREADCRUMB_STEPS[path] ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: supported === "es" ? "Inicio" : "Home", item: base },
      ...steps.map((step, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: step[supported],
        ...(step.path ? { item: `${base}${step.path}` } : {}),
      })),
    ],
  };
}

export function serviceJsonLd({
  locale,
  serviceType,
}: {
  locale: string;
  serviceType: "provisions" | "marpol";
}) {
  const supported: Locale = locale === "en" ? "en" : "es";
  const path =
    serviceType === "provisions"
      ? "/servicios/provisiones"
      : "/servicios/gestion-desechos";

  const name =
    serviceType === "provisions"
      ? supported === "es"
        ? "Provisiones marítimas"
        : "Ship provisions"
      : supported === "es"
        ? "Gestión de desechos MARPOL"
        : "MARPOL waste management";

  const description = PAGE_SEO[path][supported].description;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Dominican Republic" },
    url: `${SITE_URL}/${supported}${path}`,
  };
}
