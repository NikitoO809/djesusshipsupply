import Link from "next/link";
import { MapPin, ArrowUpRight, ArrowRight } from "lucide-react";

interface PortCardProps {
  index: number;
  name: string;
  body: string;
  href?: string;
  variant?: "default" | "editorial";
}

export function PortCard({
  index,
  name,
  body,
  href,
  variant = "default",
}: PortCardProps) {
  if (variant === "editorial") {
    const editorialInner = (
      <div className="relative h-full flex flex-col rounded-[calc(2rem-0.375rem)] bg-white p-7 md:p-8">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-mono text-[10px] text-gold-dark tracking-[0.2em]">
            {String(index).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-navy/8" />
          <MapPin
            className="h-4 w-4 text-navy/30 transition-colors duration-500 group-hover:text-gold-dark"
            strokeWidth={1.8}
          />
        </div>
        <h3 className="font-serif text-xl md:text-[22px] text-navy mb-3 leading-[1.15] tracking-tight">
          {name}
        </h3>
        <p className="text-charcoal/70 leading-relaxed text-[14.5px] flex-1">
          {body}
        </p>
        {href && (
          <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-navy/5 ring-1 ring-navy/10 pl-4 pr-1 py-1 text-[11px] uppercase tracking-[0.18em] font-medium text-navy transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:ring-gold group-hover:text-navy">
            Ver detalles
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gold text-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:bg-navy group-hover:text-cream">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </span>
        )}
      </div>
    );

    const editorialShell =
      "group relative block h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_50px_-30px_rgba(10,37,64,0.18)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_70px_-30px_rgba(10,37,64,0.28)]";

    if (href) {
      return (
        <Link href={href} className={editorialShell}>
          {editorialInner}
        </Link>
      );
    }

    return <div className={editorialShell}>{editorialInner}</div>;
  }

  const inner = (
    <>
      <div className="flex items-start justify-between mb-5">
        <span className="font-serif text-3xl text-gold-dark/80 group-hover:text-gold-dark transition-colors">
          {String(index).padStart(2, "0")}
        </span>
        <MapPin
          className="h-5 w-5 text-navy/50 group-hover:text-navy transition-colors"
          strokeWidth={1.8}
        />
      </div>
      <h3 className="font-serif text-xl text-navy mb-3 leading-snug">
        {name}
      </h3>
      <p className="text-charcoal/75 leading-relaxed text-[14.5px] flex-1">
        {body}
      </p>
      {href && (
        <div className="mt-5 flex items-center gap-1.5 text-gold-dark text-[11px] uppercase tracking-[0.2em] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Ver detalles</span>
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </div>
      )}
      <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group relative h-full flex flex-col p-7 md:p-8 rounded-sm bg-cream/40 border border-navy/8 hover:border-gold/50 hover:bg-cream/70 transition-all duration-300"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="group relative h-full flex flex-col p-7 md:p-8 rounded-sm bg-cream/40 border border-navy/8 hover:border-gold/50 hover:bg-cream/70 transition-all duration-300">
      {inner}
    </div>
  );
}
