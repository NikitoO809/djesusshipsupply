import { Anchor } from "lucide-react";

interface SupplierBadgeProps {
  note: string;
}

export function SupplierBadge({ note }: SupplierBadgeProps) {
  return (
    <section className="bg-navy-dark/60 border-t border-cream/8 py-10">
      <div className="container mx-auto px-6">
        <div className="flex items-start gap-4 max-w-3xl mx-auto">
          <span className="mt-0.5 shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-sm border border-gold/30 text-gold/70">
            <Anchor className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <p className="text-[12px] text-cream/45 leading-relaxed tracking-wide">
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
