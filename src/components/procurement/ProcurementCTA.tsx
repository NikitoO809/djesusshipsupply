import Link from "next/link";
import { Ship, ArrowRight, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/sections/FadeIn";

interface ProcurementCTAProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  whatsappLabel: string;
}

export function ProcurementCTA({
  title,
  description,
  ctaLabel,
  ctaHref,
  whatsappLabel,
}: ProcurementCTAProps) {
  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="relative rounded-sm border border-gold/20 bg-gradient-to-br from-navy-light/40 to-navy-dark/60 p-8 md:p-12 max-w-3xl mx-auto text-center overflow-hidden">
            <div
              className="absolute inset-0 -z-10 opacity-40"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(201,169,97,0.12) 0%, transparent 70%)",
              }}
            />

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-gold/30 text-gold mb-6 mx-auto">
              <Ship className="h-6 w-6" strokeWidth={1.5} />
            </span>

            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-snug mb-4">
              {title}
            </h2>
            <p className="text-sm md:text-base text-cream/65 leading-relaxed max-w-lg mx-auto mb-8">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={ctaHref}
                className="group inline-flex items-center justify-center gap-2 h-11 px-7 rounded-sm bg-gold text-navy hover:bg-gold-light transition-colors text-[11px] uppercase tracking-[0.22em] font-semibold w-full sm:w-auto"
              >
                {ctaLabel}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.6}
                />
              </Link>
              <a
                href="https://wa.me/18298563586"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-11 px-7 rounded-sm border border-gold/50 text-gold hover:border-gold hover:bg-gold/8 transition-colors text-[11px] uppercase tracking-[0.22em] font-semibold w-full sm:w-auto"
              >
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                {whatsappLabel}
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
