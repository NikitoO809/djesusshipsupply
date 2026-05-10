"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/images/posters/Suministros.jpg", alt: "Suministros marítimos en puerto" },
  { src: "/images/posters/Suministros-2.jpg", alt: "Materiales industriales navales" },
];

const INTERVAL_MS = 9000;
const FADE_MS = 2000;

export function SuministroCarousel() {
  const [active, setActive] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reducedMotion.current) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  function goTo(index: number) {
    if (index === active) return;
    setActive(index);
  }

  return (
    <>
      {/* Images — all always mounted, opacity transition drives the crossfade */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
            style={{
              opacity: i === active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />
        ))}
      </div>

      {/* Dot indicators */}
      <div
        className="absolute bottom-6 left-1/2 flex gap-2"
        style={{ transform: "translateX(-50%)", zIndex: 2 }}
        aria-label="Imagen del carrusel"
        role="group"
      >
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-pressed={i === active}
            style={{
              width: i === active ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === active ? "#C9A961" : "rgba(255,255,255,0.35)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.4s ease, background 0.4s ease",
            }}
          />
        ))}
      </div>
    </>
  );
}
