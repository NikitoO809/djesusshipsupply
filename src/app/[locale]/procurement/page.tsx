import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { ProcurementHero } from "@/components/procurement/ProcurementHero";
import { CategorySearch } from "@/components/procurement/CategorySearch";
import { ProcurementCTA } from "@/components/procurement/ProcurementCTA";
import { SupplierBadge } from "@/components/procurement/SupplierBadge";
import { catalogCategories, TOTAL_PRODUCTS } from "@/data/procurement-catalog";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/procurement");
}

export default async function ProcurementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("procurement");

  const link = (path: string) => `/${locale}${path}`;

  const titleFull = t("title");
  const titleEm = t("titleEm");
  const [titleBefore, titleAfter] = titleFull.split(titleEm);

  const stats = [
    { value: String(catalogCategories.length), label: t("categories") },
    { value: `${TOTAL_PRODUCTS}+`, label: t("products") },
    { value: t("deliveryTime"), label: t("delivery") },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd({ locale, path: "/procurement" })
          ),
        }}
      />

      <ProcurementHero
        badge={t("badge")}
        titleBefore={titleBefore ?? ""}
        titleEm={titleEm}
        titleAfter={titleAfter ?? ""}
        description={t("description")}
        stats={stats}
      />

      <CategorySearch />

      <ProcurementCTA
        title={t("ctaTitle")}
        description={t("ctaDescription")}
        ctaLabel={t("ctaButton")}
        ctaHref={link("/cotizar/provisiones")}
        whatsappLabel={t("ctaWhatsapp")}
      />

      <SupplierBadge note={t("supplierNote")} />
    </>
  );
}
