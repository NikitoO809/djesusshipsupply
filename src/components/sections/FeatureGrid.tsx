import type { LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "./FadeIn";
import { cn } from "@/lib/utils";

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  whatsappHref?: string;
  whatsappLabel?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: "card" | "minimal" | "editorial";
  className?: string;
}

export function FeatureGrid({
  features,
  columns = 3,
  variant = "card",
  className,
}: FeatureGridProps) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <Stagger className={cn("grid gap-6 md:gap-7", cols, className)}>
      {features.map((f, i) => {
        const Icon = f.icon;

        if (variant === "editorial") {
          return (
            <StaggerItem key={i}>
              <div className="group relative h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_50px_-30px_rgba(10,37,64,0.18)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_70px_-30px_rgba(10,37,64,0.28)]">
                <div className="relative h-full flex flex-col rounded-[calc(2rem-0.375rem)] bg-white p-7 md:p-8">
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="font-mono text-[10px] text-gold-dark tracking-[0.2em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-navy/8" />
                  </div>
                  <div className="relative inline-flex items-center justify-center h-12 w-12 rounded-full bg-navy text-cream ring-4 ring-cream mb-6 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-serif text-xl md:text-[22px] text-navy mb-3 leading-[1.15] tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed text-[14.5px] flex-1">
                    {f.body}
                  </p>
                  {f.whatsappHref && (
                    <a
                      href={f.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-navy/5 ring-1 ring-navy/10 pl-4 pr-1 py-1 text-[11px] uppercase tracking-[0.18em] font-medium text-navy transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#25D366] hover:ring-[#25D366] hover:text-white"
                    >
                      {f.whatsappLabel ?? "Solicitar"}
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#25D366] text-white">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        }

        if (variant === "minimal") {
          return (
            <StaggerItem key={i}>
              <div className="group h-full">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-navy/5 text-navy mb-5 group-hover:bg-gold/15 group-hover:text-gold-dark transition-colors">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-serif text-xl text-navy mb-2.5 leading-snug">
                  {f.title}
                </h3>
                <p className="text-charcoal/75 leading-relaxed text-[15px]">
                  {f.body}
                </p>
              </div>
            </StaggerItem>
          );
        }
        return (
          <StaggerItem key={i}>
            <div className="group relative h-full flex flex-col p-8 md:p-9 rounded-sm bg-cream/40 border border-navy/8 hover:border-gold/50 hover:bg-cream/70 transition-all duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-navy text-gold mb-6 group-hover:bg-navy-dark transition-colors">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl md:text-[22px] text-navy mb-3 leading-snug">
                {f.title}
              </h3>
              <p className="text-charcoal/75 leading-relaxed text-[15px] flex-1">
                {f.body}
              </p>
              {f.whatsappHref && (
                <a
                  href={f.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 h-9 px-4 rounded-sm border border-navy/20 text-navy hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all text-[11px] uppercase tracking-[0.15em] font-semibold self-start"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.5l5.797-1.52A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 0 1-5.031-1.378l-.361-.214-3.741.981 1-3.641-.235-.374A9.861 9.861 0 0 1 2.106 12C2.106 6.534 6.534 2.106 12 2.106c5.466 0 9.894 4.428 9.894 9.894 0 5.466-4.428 9.894-9.894 9.894z"/>
                  </svg>
                  {f.whatsappLabel ?? "Solicitar"}
                </a>
              )}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
