import Link from "next/link";
import { Ship, ArrowUpRight, MessageCircle } from "lucide-react";
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
    <section className="relative bg-navy py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(201,169,97,0.18),transparent_70%)]"
      />
      <div className="container mx-auto px-6 relative">
        <FadeIn>
          <div className="relative rounded-[2rem] p-1.5 bg-gold/10 ring-1 ring-gold/25 max-w-3xl mx-auto shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]">
            <div className="relative rounded-[calc(2rem-0.375rem)] bg-gradient-to-br from-navy-light/40 to-navy-dark/70 px-8 py-12 md:px-14 md:py-16 text-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy ring-4 ring-navy mb-7 mx-auto">
                <Ship className="h-5 w-5" strokeWidth={1.6} />
              </span>

              <h2 className="font-serif text-3xl md:text-[44px] lg:text-[52px] text-cream leading-[1.05] tracking-[-0.01em] mb-5">
                {title}
                <span className="text-gold">.</span>
              </h2>
              <p className="text-base md:text-[17px] text-cream/70 leading-[1.7] max-w-lg mx-auto mb-10">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold text-navy pl-6 pr-2 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold w-full sm:w-auto transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-cream"
                >
                  {ctaLabel}
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-navy text-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </Link>
                <a
                  href="https://wa.me/18298563586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-cream/5 ring-1 ring-gold/40 text-gold px-7 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold w-full sm:w-auto transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-gold/10 hover:ring-gold backdrop-blur-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                  {whatsappLabel}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
