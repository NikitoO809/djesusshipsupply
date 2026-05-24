import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
  /** "default" keeps the legacy heading. "editorial" applies the v2 visual language. */
  variant?: "default" | "editorial";
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  className,
  invert = false,
  variant = "default",
}: SectionHeadingProps) {
  const isEditorial = variant === "editorial";

  if (isEditorial) {
    return (
      <div
        className={cn(
          "max-w-4xl",
          align === "center" && "mx-auto text-center",
          className
        )}
      >
        {kicker && (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em] font-medium mb-7 ring-1",
              invert
                ? "bg-cream/8 ring-cream/15 text-cream/80 backdrop-blur-sm"
                : "bg-navy/5 ring-navy/10 text-navy/70"
            )}
          >
            <span
              className={cn(
                "h-1 w-1 rounded-full",
                invert ? "bg-gold" : "bg-gold-dark"
              )}
            />
            {kicker}
          </span>
        )}
        <h2
          className={cn(
            "font-serif text-[40px] md:text-[56px] lg:text-[72px] leading-[0.95] tracking-[-0.02em]",
            invert ? "text-cream" : "text-navy"
          )}
        >
          {title}
          <span className="text-gold">.</span>
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-7 text-base md:text-lg leading-relaxed max-w-2xl",
              align === "center" && "mx-auto",
              invert ? "text-cream/75" : "text-charcoal/70"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }

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
