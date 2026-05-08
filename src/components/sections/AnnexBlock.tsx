import Image from "next/image";
import { Check, type LucideIcon } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { cn } from "@/lib/utils";

interface AnnexBlockProps {
  tag: string;
  title: string;
  body: string;
  includesLabel: string;
  items: string[];
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export function AnnexBlock({
  tag,
  title,
  body,
  includesLabel,
  items,
  icon: Icon,
  imageSrc,
  imageAlt,
  reverse = false,
}: AnnexBlockProps) {
  return (
    <div
      className={cn(
        "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
        reverse && "lg:[&>*:first-child]:order-2"
      )}
    >
      <FadeIn>
        <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy/30 via-transparent to-transparent" />
          <span className="absolute top-5 left-5 inline-flex items-center px-3 py-1 rounded-sm bg-gold text-navy text-[10px] uppercase tracking-[0.22em] font-semibold">
            {tag}
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div>
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-navy text-gold mb-6">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-navy leading-[1.15] tracking-tight mb-5">
            {title}
          </h2>
          <p className="text-charcoal/80 leading-relaxed text-base md:text-lg mb-8">
            {body}
          </p>

          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-dark font-medium mb-4">
            {includesLabel}
          </p>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-gold/20 text-gold-dark shrink-0">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-charcoal/85 text-[15px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}
