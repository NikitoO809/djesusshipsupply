import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { buildPageMetadata, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { articles } from "@/lib/blog";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/blog");
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const lang = locale === "en" ? "en" : "es";

  const breadcrumb = breadcrumbJsonLd({ locale, path: "/blog" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        title={lang === "es" ? "Blog Marítimo" : "Maritime Blog"}
        subtitle={
          lang === "es"
            ? "Guías técnicas y recursos prácticos para capitanes, jefes de máquinas y agentes navieros en República Dominicana."
            : "Technical guides and practical resources for masters, chief engineers, and port agents in the Dominican Republic."
        }
        imageSrc="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2200&q=80"
        imageAlt={lang === "es" ? "Puerto marítimo" : "Maritime port"}
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const copy = article[lang];
              const date = new Date(article.datePublished).toLocaleDateString(
                lang === "es" ? "es-DO" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              );
              return (
                <article
                  key={article.slug}
                  className="group flex flex-col bg-white border border-navy/8 rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <Image
                      src={article.imageUrl}
                      alt={copy.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <time
                      dateTime={article.datePublished}
                      className="text-[11px] uppercase tracking-[0.2em] text-gold font-medium mb-3"
                    >
                      {date}
                    </time>
                    <h2 className="font-serif text-lg text-navy leading-snug mb-3 line-clamp-3">
                      {copy.title}
                    </h2>
                    <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-3 flex-1">
                      {copy.description}
                    </p>
                    <Link
                      href={`/${locale}/blog/${article.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-gold hover:text-navy font-semibold transition-colors"
                    >
                      {lang === "es" ? "Leer más" : "Read more"}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
