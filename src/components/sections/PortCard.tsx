import { MapPin } from "lucide-react";

interface PortCardProps {
  index: number;
  name: string;
  body: string;
}

export function PortCard({ index, name, body }: PortCardProps) {
  return (
    <div className="group relative h-full flex flex-col p-7 md:p-8 rounded-sm bg-cream/40 border border-navy/8 hover:border-gold/50 hover:bg-cream/70 transition-all duration-300">
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
      <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
