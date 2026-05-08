import type { LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "./FadeIn";
import { cn } from "@/lib/utils";

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: "card" | "minimal";
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
            <div className="group relative h-full p-8 md:p-9 rounded-sm bg-cream/40 border border-navy/8 hover:border-gold/50 hover:bg-cream/70 transition-all duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-navy text-gold mb-6 group-hover:bg-navy-dark transition-colors">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl md:text-[22px] text-navy mb-3 leading-snug">
                {f.title}
              </h3>
              <p className="text-charcoal/75 leading-relaxed text-[15px]">
                {f.body}
              </p>
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
