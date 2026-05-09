import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://djesusshipsupply.com"
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
  "/privacidad",
  "/terminos",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.flatMap((locale) =>
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
}
