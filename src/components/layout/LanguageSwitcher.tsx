"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  const stripLocale = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0 && routing.locales.includes(segments[0] as never)) {
      segments.shift();
    }
    return "/" + segments.join("/");
  };

  const rest = stripLocale(pathname || "/");

  return (
    <div className="flex items-center gap-1 text-xs tracking-wider">
      {routing.locales.map((locale, idx) => {
        const href = `/${locale}${rest === "/" ? "" : rest}`;
        const isActive = locale === currentLocale;
        return (
          <span key={locale} className="flex items-center gap-1">
            <Link
              href={href}
              className={cn(
                "uppercase px-1 transition-colors",
                isActive
                  ? "text-gold font-medium"
                  : "text-cream/70 hover:text-cream"
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {locale}
            </Link>
            {idx < routing.locales.length - 1 && (
              <span className="text-cream/30">/</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
