import { Stagger, StaggerItem } from "./FadeIn";

export interface TimelineStep {
  title: string;
  body: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  variant?: "default" | "editorial";
}

export function Timeline({ steps, variant = "default" }: TimelineProps) {
  if (variant === "editorial") {
    return (
      <Stagger className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <StaggerItem key={i}>
            <div className="group relative h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5">
              <div className="relative h-full rounded-[calc(2rem-0.375rem)] bg-white p-7 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-navy text-gold font-serif text-xl ring-4 ring-cream transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="hidden md:block flex-1 h-px bg-gradient-to-r from-navy/15 to-transparent" />
                  )}
                </div>
                <h3 className="font-serif text-xl md:text-[22px] text-navy mb-3 leading-[1.15] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed text-[14.5px]">
                  {step.body}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    );
  }

  return (
    <Stagger className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <StaggerItem key={i}>
          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-navy text-gold font-serif text-xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < steps.length - 1 && (
                <span className="hidden md:block flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent" />
              )}
            </div>
            <h3 className="font-serif text-xl text-navy mb-2.5 leading-snug">
              {step.title}
            </h3>
            <p className="text-charcoal/75 leading-relaxed text-[15px]">
              {step.body}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
