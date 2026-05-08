import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
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

export const metadata: Metadata = {
  metadataBase: new URL("https://djesusshipsupply.com"),
  title: {
    default: "De Jesús Ship Supply",
    template: "%s | De Jesús Ship Supply",
  },
  description:
    "Servicios marítimos premium en República Dominicana — gestión de desechos MARPOL y provisiones para buques en 8 puertos. Premium maritime services in the Dominican Republic.",
  applicationName: "De Jesús Ship Supply",
  authors: [{ name: "De Jesús Ship Supply" }],
  keywords: [
    "ship supply",
    "MARPOL",
    "Dominican Republic",
    "Caucedo",
    "Río Haina",
    "ship provisions",
    "maritime waste management",
    "Anexo I",
    "Anexo V",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "De Jesús Ship Supply",
    title: "De Jesús Ship Supply",
    description:
      "Servicios marítimos premium en República Dominicana — gestión de desechos MARPOL y provisiones para buques.",
    locale: "es_DO",
    alternateLocale: ["en_US"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
