import { Stagger, StaggerItem } from "./FadeIn";

export interface TimelineStep {
  title: string;
  body: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
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
