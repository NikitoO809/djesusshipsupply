import { Package } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/sections/FadeIn";

interface StatItem {
  value: string;
  label: string;
}

interface ProcurementHeroProps {
  badge: string;
  titleBefore: string;
  titleEm: string;
  titleAfter: string;
  description: string;
  stats: StatItem[];
}

export function ProcurementHero({
  badge,
  titleBefore,
  titleEm,
  titleAfter,
  description,
  stats,
}: ProcurementHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-cream">
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 100%, rgba(201,169,97,0.06) 0%, transparent 70%), linear-gradient(160deg, #051529 0%, #0A2540 55%, #0d2e50 100%)",
        }}
      />
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-3xl">
          <FadeIn delay={0}>
            <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-[0.28em] mb-7">
              <Package className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{badge}</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.06] tracking-tight text-cream">
              {titleBefore}
              {titleEm && (
                <em className="not-italic text-gold">{titleEm}</em>
              )}
              {titleAfter}
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-cream/70 max-w-[620px]">
              {description}
            </p>
          </FadeIn>

          <div className="mt-12 md:mt-14">
            <Stagger className="flex flex-wrap gap-6 md:gap-10" delay={0.24} stagger={0.1}>
              {stats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-3xl md:text-4xl text-gold leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-cream/50">
                      {stat.label}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
