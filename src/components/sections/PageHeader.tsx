import Image from "next/image";
import { FadeIn } from "./FadeIn";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  imageSrc = "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=2200&q=80",
  imageAlt = "Port at dawn",
}: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-cream">
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/90 via-navy/80 to-navy/70" />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <FadeIn className="max-w-3xl" immediate>
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
        </FadeIn>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
