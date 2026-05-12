import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PORTS } from "@/lib/ports";
import { getAllSlugs } from "@/lib/blog";

const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://djshipsupply.com"
).replace(/\/$/, "");

const PATHS = [
  "",
  "/sobre-nosotros",
  "/servicios/provisiones",
  "/servicios/gestion-desechos",
  "/puertos",
  "/contacto",
  "/cotizar/provisiones",
  "/cotizar/desechos",
  "/procurement",
  "/suministro",
  "/privacidad",
  "/terminos",
] as const;

const PORT_PATHS = PORTS.map((p) => `/puertos/${p.slug}` as const);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = routing.locales.flatMap((locale) =>
    PATHS.map((path) => {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${SITE_URL}/${alt}${path}`;
      }
      languages["x-default"] = `${SITE_URL}/es${path}`;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: path === "" ? 1 : 0.7,
        alternates: { languages },
      };
    })
  );

  const portEntries = routing.locales.flatMap((locale) =>
    PORT_PATHS.map((path) => {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${SITE_URL}/${alt}${path}`;
      }
      languages["x-default"] = `${SITE_URL}/es${path}`;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages },
      };
    })
  );

  const blogIndexEntries = routing.locales.flatMap((locale) => {
    const languages: Record<string, string> = {};
    for (const alt of routing.locales) {
      languages[alt] = `${SITE_URL}/${alt}/blog`;
    }
    languages["x-default"] = `${SITE_URL}/es/blog`;
    return [
      {
        url: `${SITE_URL}/${locale}/blog`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        alternates: { languages },
      },
    ];
  });

  const blogSlugs = getAllSlugs();
  const blogArticleEntries = routing.locales.flatMap((locale) =>
    blogSlugs.map((slug) => {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${SITE_URL}/${alt}/blog/${slug}`;
      }
      languages["x-default"] = `${SITE_URL}/es/blog/${slug}`;
      return {
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages },
      };
    })
  );

  return [...staticEntries, ...portEntries, ...blogIndexEntries, ...blogArticleEntries];
}
