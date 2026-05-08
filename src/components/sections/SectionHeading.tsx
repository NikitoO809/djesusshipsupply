import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  className,
  invert = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker && (
        <div
          className={cn(
            "flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] mb-5",
            align === "center" && "justify-center",
            invert ? "text-gold" : "text-gold-dark"
          )}
        >
          <span
            className={cn(
              "h-px w-8",
              invert ? "bg-gold/60" : "bg-gold-dark/50"
            )}
          />
          <span className="font-medium">{kicker}</span>
        </div>
      )}
      <h2
        className={cn(
          "font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight",
          invert ? "text-cream" : "text-navy"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
            invert ? "text-cream/80" : "text-charcoal/75"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
