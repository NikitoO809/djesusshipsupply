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
        variant="editorial"
      />

      <section className="relative bg-background py-28 md:py-40 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,97,0.10),transparent_60%)]"
        />
        <div className="container mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const copy = article[lang];
              const date = new Date(article.datePublished).toLocaleDateString(
                lang === "es" ? "es-DO" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              );
              return (
                <Link
                  key={article.slug}
                  href={`/${locale}/blog/${article.slug}`}
                  className="group block h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_50px_-30px_rgba(10,37,64,0.18)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_70px_-30px_rgba(10,37,64,0.28)]"
                >
                  <article className="flex flex-col h-full bg-white rounded-[calc(2rem-0.375rem)] overflow-hidden">
                    <div className="relative h-52 overflow-hidden shrink-0">
                      <Image
                        src={article.imageUrl}
                        alt={copy.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-col flex-1 p-7 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <time
                          dateTime={article.datePublished}
                          className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark"
                        >
                          {date}
                        </time>
                        <span className="h-px flex-1 bg-navy/8" />
                      </div>
                      <h2 className="font-serif text-lg md:text-xl text-navy leading-snug tracking-tight mb-3 line-clamp-3">
                        {copy.title}
                      </h2>
                      <p className="text-[14.5px] text-charcoal/70 leading-relaxed line-clamp-3 flex-1">
                        {copy.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-navy/5 ring-1 ring-navy/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-navy font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:ring-gold group-hover:text-navy">
                        {lang === "es" ? "Leer artículo" : "Read article"}
                        <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
