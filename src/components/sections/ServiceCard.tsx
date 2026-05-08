import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
  tag?: string;
}

export function ServiceCard({
  title,
  body,
  href,
  ctaLabel,
  imageSrc,
  imageAlt,
  icon: Icon,
  tag,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-navy text-cream transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/40 to-transparent" />
        {tag && (
          <span className="absolute top-5 left-5 inline-flex items-center px-3 py-1 rounded-sm bg-gold/95 text-navy text-[10px] uppercase tracking-[0.22em] font-semibold">
            {tag}
          </span>
        )}
      </div>

      <div className="relative flex flex-col flex-1 p-8 md:p-9">
        <div className="inline-flex items-center justify-center h-11 w-11 rounded-sm bg-cream/8 text-gold mb-5 group-hover:bg-gold group-hover:text-navy transition-colors">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="font-serif text-2xl md:text-[26px] leading-snug text-cream mb-4">
          {title}
        </h3>
        <p className="text-cream/75 leading-relaxed text-[15px] mb-8 flex-1">
          {body}
        </p>
        <span className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.22em] font-medium">
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  );
}
