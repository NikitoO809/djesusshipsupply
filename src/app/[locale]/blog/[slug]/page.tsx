import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/seo";
import { articles, getArticle } from "@/lib/blog";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const locales = ["es", "en"];
  return locales.flatMap((locale) =>
    articles.map((a) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const lang = locale === "en" ? "en" : "es";
  const copy = article[lang];
  const url = `${SITE_URL}/${lang}/blog/${slug}`;

  return {
    title: copy.title,
    description: copy.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es/blog/${slug}`,
        en: `${SITE_URL}/en/blog/${slug}`,
        "x-default": `${SITE_URL}/es/blog/${slug}`,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      type: "article",
      publishedTime: article.datePublished,
      authors: [article.author],
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticle(slug);
  if (!article) notFound();

  const lang = locale === "en" ? "en" : "es";
  const copy = article[lang];
  const url = `${SITE_URL}/${lang}/blog/${slug}`;

  const date = new Date(article.datePublished).toLocaleDateString(
    lang === "es" ? "es-DO" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const paragraphs = copy.body.split("\n\n").filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    description: copy.description,
    image: article.imageUrl,
    author: {
      "@type": "Organization",
      name: "De Jesús Ship Supply",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: article.datePublished,
    url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "es" ? "Inicio" : "Home",
        item: `${SITE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: lang === "es" ? "Blog" : "Blog",
        item: `${SITE_URL}/${lang}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: copy.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-background min-h-screen">
        <div className="relative h-72 md:h-96 overflow-hidden bg-navy">
          <Image
            src={article.imageUrl}
            alt={copy.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto -mt-16 relative z-10">
            <div className="bg-white border border-navy/8 rounded-sm p-8 md:p-12 shadow-sm">
              <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-charcoal/50 mb-6">
                <Link href={`/${locale}`} className="hover:text-gold transition-colors">
                  {lang === "es" ? "Inicio" : "Home"}
                </Link>
                <span>/</span>
                <Link href={`/${locale}/blog`} className="hover:text-gold transition-colors">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-charcoal/70 truncate max-w-xs">{copy.title}</span>
              </nav>

              <time
                dateTime={article.datePublished}
                className="block text-[11px] uppercase tracking-[0.2em] text-gold font-medium mb-4"
              >
                {date}
              </time>

              <h1 className="font-serif text-3xl md:text-4xl text-navy leading-snug mb-8">
                {copy.title}
              </h1>

              <div className="prose-custom">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-charcoal/85 mb-5 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-navy/10">
                <p className="text-sm text-charcoal/60 mb-6">
                  {lang === "es"
                    ? "¿Necesita servicios de ship chandler en República Dominicana?"
                    : "Do you need ship chandler services in the Dominican Republic?"}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/${locale}/cotizar/provisiones`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-gold/90 transition-colors"
                  >
                    {lang === "es" ? "Cotizar provisiones" : "Request provisions quote"}
                  </Link>
                  <Link
                    href={`/${locale}/contacto`}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-navy text-navy text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-navy hover:text-cream transition-colors"
                  >
                    {lang === "es" ? "Contactar" : "Contact us"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 mb-16">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold hover:text-navy font-semibold transition-colors"
              >
                <span aria-hidden="true">←</span>
                {lang === "es" ? "Volver al blog" : "Back to blog"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
