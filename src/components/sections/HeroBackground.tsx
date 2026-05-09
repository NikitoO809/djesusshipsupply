"use client";

import { useEffect, useRef, useState } from "react";

interface HeroBackgroundProps {
  videoSrcMp4: string;
  videoSrcWebm?: string;
  posterSrc: string;
  posterAlt?: string;
  priority?: boolean;
}

export function HeroBackground({
  videoSrcMp4,
  videoSrcWebm,
  posterSrc,
  posterAlt = "",
  priority = false,
}: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(2g|slow-2g|3g)$/.test(conn.effectiveType)) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <img
        src={posterSrc}
        alt={posterAlt}
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />

      {loadVideo && (
        <video
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            videoReady ? "opacity-90" : "opacity-0",
          ].join(" ")}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={posterSrc}
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
        >
          {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
          <source src={videoSrcMp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
