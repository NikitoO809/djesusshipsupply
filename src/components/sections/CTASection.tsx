import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";

interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  imageSrc?: string;
}

export function CTASection({
  title,
  subtitle,
  buttons,
  imageSrc = "https://images.unsplash.com/photo-1566024287286-457247b70310?auto=format&fit=crop&w=2200&q=80",
}: CTASectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-dark text-cream">
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy/70" />
      </div>

      <div className="container mx-auto px-6 py-24 md:py-32">
        <FadeIn className="max-w-3xl">
          <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-[0.28em] mb-6">
            <span className="h-px w-8 bg-gold/60" />
            <span>24/7</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-cream">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 text-lg text-cream/75 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {buttons.map((b, i) => (
              <Link
                key={i}
                href={b.href}
                className={
                  b.variant === "outline"
                    ? "group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-sm border border-cream/30 text-cream hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-[0.22em] font-medium"
                    : "group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-xs uppercase tracking-[0.22em] font-semibold"
                }
              >
                {b.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
