import Image from "next/image";
import { HeroBackground } from "./HeroBackground";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrcMp4?: string;
  posterSrc?: string;
  /** "default" keeps the legacy header. "editorial" applies the v2 visual language. */
  variant?: "default" | "editorial";
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  imageSrc = "/images/posters/Port-ship.jpg",
  imageAlt = "Buque portacontenedores atracado en puerto",
  videoSrcMp4,
  posterSrc,
  variant = "default",
}: PageHeaderProps) {
  const isEditorial = variant === "editorial";

  return (
    <section className="relative isolate overflow-hidden bg-navy text-cream">
      <div className="absolute inset-0 -z-10">
        {videoSrcMp4 ? (
          <HeroBackground
            videoSrcMp4={videoSrcMp4}
            posterSrc={posterSrc ?? imageSrc}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/70 to-transparent" />
        {isEditorial && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_30%,rgba(201,169,97,0.18),transparent_60%)]" />
        )}
      </div>

      {isEditorial ? (
        <div className="container mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-36">
          <div className="max-w-4xl">
            {kicker && (
              <span className="inline-flex items-center gap-2 rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-cream/80 font-medium mb-8 backdrop-blur-sm">
                <span className="h-1 w-1 rounded-full bg-gold" />
                {kicker}
              </span>
            )}
            <h1 className="font-serif text-[44px] md:text-[68px] lg:text-[88px] leading-[0.95] tracking-[-0.02em] text-cream">
              {title}
              <span className="text-gold">.</span>
            </h1>
            {subtitle && (
              <p className="mt-8 text-lg md:text-xl leading-relaxed text-cream/75 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl">
            {kicker && (
              <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-[0.28em] mb-6">
                <span className="h-px w-8 bg-gold/60" />
                <span>{kicker}</span>
              </div>
            )}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-cream">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 text-lg md:text-xl leading-relaxed text-cream/80 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
