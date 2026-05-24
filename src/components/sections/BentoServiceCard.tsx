import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoServiceCardProps {
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
  tag?: string;
  priority?: boolean;
  size?: "hero" | "compact";
  className?: string;
}

/**
 * Premium service card built on the double-bezel (Doppelrand) pattern:
 * outer cream shell with hairline border, inner navy core with concentric
 * radius and inner highlight. Magnetic button-in-button CTA.
 */
export function BentoServiceCard({
  title,
  body,
  href,
  ctaLabel,
  imageSrc,
  imageAlt,
  icon: Icon,
  tag,
  priority = false,
  size = "compact",
  className,
}: BentoServiceCardProps) {
  const isHero = size === "hero";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block",
        "rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10",
        "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_60px_-30px_rgba(10,37,64,0.18)]",
        "transition-[transform,box-shadow] duration-700 motion-safe:will-change-transform",
        "ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_40px_90px_-30px_rgba(10,37,64,0.28)]",
        className
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden bg-navy text-cream",
          "rounded-[calc(2rem-0.375rem)]",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isHero ? "h-72 md:h-[420px]" : "h-56 md:h-64"
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes={isHero ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
            priority={priority}
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/40 to-transparent" />

          {tag && (
            <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-cream/95 text-navy px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-semibold">
              <span className="h-1 w-1 rounded-full bg-gold-dark" />
              {tag}
            </span>
          )}

          <div className="absolute top-5 right-5 inline-flex items-center justify-center h-11 w-11 rounded-full bg-cream/10 text-cream ring-1 ring-cream/20 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy group-hover:ring-gold">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
        </div>

        <div className={cn("relative flex flex-col flex-1", isHero ? "p-9 md:p-12" : "p-8 md:p-9")}>
          <h3
            className={cn(
              "font-serif leading-[1.08] tracking-tight text-cream",
              isHero ? "text-3xl md:text-4xl lg:text-[42px] mb-5" : "text-2xl md:text-[26px] mb-4"
            )}
          >
            {title}
          </h3>
          <p className={cn("text-cream/70 leading-relaxed flex-1", isHero ? "text-[16px] md:text-[17px] mb-10 max-w-xl" : "text-[14.5px] mb-8")}>
            {body}
          </p>

          <span className="inline-flex items-center gap-3 self-start rounded-full bg-cream/8 ring-1 ring-cream/15 pl-5 pr-1.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-cream font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:ring-gold group-hover:text-navy">
            {ctaLabel}
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gold text-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:bg-navy group-hover:text-cream">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
