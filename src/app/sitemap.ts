import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://djesusshipsupply.com";

const PATHS = [
  "",
  "/servicios/provisiones",
  "/servicios/gestion-desechos",
  "/puertos",
  "/cotizar/provisiones",
  "/cotizar/desechos",
  "/contacto",
  "/sobre-nosotros",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    }))
  );
}
