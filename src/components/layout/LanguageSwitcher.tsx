"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
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
    <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase">
      <Globe className="h-3.5 w-3.5 text-cream/50" strokeWidth={1.8} />
      {routing.locales.map((locale, idx) => {
        const href = `/${locale}${rest === "/" ? "" : rest}`;
        const isActive = locale === currentLocale;
        return (
          <span key={locale} className="flex items-center gap-2">
            <Link
              href={href}
              className={cn(
                "transition-colors font-medium",
                isActive
                  ? "text-gold"
                  : "text-cream/55 hover:text-cream"
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {locale}
            </Link>
            {idx < routing.locales.length - 1 && (
              <span className="text-cream/25">|</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
