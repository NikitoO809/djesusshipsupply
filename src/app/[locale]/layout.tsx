import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { routing } from "@/i18n/routing";
import { localBusinessJsonLd, SITE_URL } from "@/lib/seo";
import { UnifiedCartProvider } from "@/components/unified-cart/UnifiedCartContext";
import { RfqProvider } from "@/components/procurement/rfq/RfqContext";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const COPY = {
  es: {
    title: "De Jesús Ship Supply — Servicios marítimos en RD",
    description:
      "Servicios marítimos premium en República Dominicana: gestión de desechos MARPOL y provisiones para buques en 8 puertos.",
    ogTitle: "De Jesús Ship Supply",
    ogDescription:
      "Gestión de desechos MARPOL y provisiones para buques en los principales puertos de la República Dominicana.",
    ogLocale: "es_DO",
    ogAltLocale: "en_US",
  },
  en: {
    title: "De Jesús Ship Supply — Maritime Services in the DR",
    description:
      "Premium maritime services in the Dominican Republic: MARPOL waste management and ship provisions across 8 ports.",
    ogTitle: "De Jesús Ship Supply",
    ogDescription:
      "MARPOL waste management and ship provisions across the major ports of the Dominican Republic.",
    ogLocale: "en_US",
    ogAltLocale: "es_DO",
  },
} as const;

type SupportedLocale = keyof typeof COPY;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const supported: SupportedLocale = (
    locale in COPY ? locale : routing.defaultLocale
  ) as SupportedLocale;
  const copy = COPY[supported];

  const ogImage = {
    url: `${SITE_URL}/api/og?locale=${supported}`,
    width: 1200,
    height: 630,
    alt: "De Jesús Ship Supply",
    type: "image/png",
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: copy.title,
      template: "%s | De Jesús Ship Supply",
    },
    description: copy.description,
    applicationName: "De Jesús Ship Supply",
    authors: [{ name: "De Jesús Ship Supply" }],
    keywords: [
      "ship supply",
      "MARPOL",
      "Dominican Republic",
      "República Dominicana",
      "Caucedo",
      "Río Haina",
      "ship provisions",
      "provisiones para buques",
      "maritime waste management",
      "gestión de desechos marítimos",
      "oily residues",
      "solid garbage",
    ],
    robots: { index: true, follow: true },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      type: "website",
      siteName: "De Jesús Ship Supply",
      title: copy.ogTitle,
      description: copy.ogDescription,
      locale: copy.ogLocale,
      alternateLocale: [copy.ogAltLocale],
      url: `${SITE_URL}/${supported}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.ogDescription,
      images: [ogImage.url],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd(locale)),
          }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <UnifiedCartProvider>
            <RfqProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-sm focus:bg-gold focus:text-navy focus:text-sm focus:font-semibold focus:shadow-lg"
              >
                {locale === "en" ? "Skip to main content" : "Saltar al contenido"}
              </a>
              <Header />
              <main id="main-content" className="flex-1">{children}</main>
              <Footer />
              <WhatsAppFloat />
              <Toaster />
            </RfqProvider>
          </UnifiedCartProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
