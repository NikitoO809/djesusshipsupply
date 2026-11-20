import { ChevronDown } from "lucide-react";
import { FadeIn } from "./FadeIn";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Preguntas frecuentes visibles (<details>, sin JavaScript). El mismo arreglo
 * se usa para el JSON-LD FAQPage: el contenido estructurado debe coincidir con
 * lo que el visitante realmente ve en la página.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <FadeIn>
      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((it, i) => (
          <details
            key={i}
            className="group rounded-[1.5rem] bg-white ring-1 ring-navy/10 open:ring-gold/40 transition-shadow"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 md:px-8 [&::-webkit-details-marker]:hidden">
              <h3 className="font-serif text-lg md:text-xl text-navy leading-snug">
                {it.question}
              </h3>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-gold-dark transition-transform duration-300 group-open:rotate-180"
                strokeWidth={2}
                aria-hidden="true"
              />
            </summary>
            <div className="px-6 pb-6 md:px-8 text-[15px] leading-relaxed text-charcoal/75">
              {it.answer}
            </div>
          </details>
        ))}
      </div>
    </FadeIn>
  );
}
