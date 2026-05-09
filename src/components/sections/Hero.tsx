import Link from "next/link";
import { ArrowRight, Anchor } from "lucide-react";
import { HeroBackground } from "./HeroBackground";

interface HeroProps {
  locale: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
  kicker?: string;
}

export function Hero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  ctaPrimaryHref,
  ctaSecondaryHref,
  kicker = "De Jesús Ship Supply",
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-cream min-h-[100dvh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <HeroBackground videoSrcMp4="/videos/hero-ship.mp4" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,169,97,0.12),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 py-28 md:py-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-[0.28em] mb-8">
            <Anchor className="h-3.5 w-3.5" strokeWidth={2.4} />
            <span>{kicker}</span>
            <span className="h-px w-12 bg-gold/60" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-cream">
            {title}
          </h1>

          <p className="mt-7 text-lg md:text-xl leading-relaxed text-cream/80 max-w-2xl">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href={ctaPrimaryHref}
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-xs uppercase tracking-[0.22em] font-semibold"
            >
              {ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-sm border border-cream/30 text-cream hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-[0.22em] font-medium"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
