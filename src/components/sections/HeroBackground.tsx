"use client";

import { useEffect, useState } from "react";

interface HeroBackgroundProps {
  videoSrcMp4: string;
  videoSrcWebm?: string;
}

export function HeroBackground({ videoSrcMp4, videoSrcWebm }: HeroBackgroundProps) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let cancel: () => void;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setShowVideo(true), { timeout: 2000 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setShowVideo(true), 600);
      cancel = () => clearTimeout(id);
    }

    return () => cancel();
  }, []);

  if (!showVideo) return null;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover opacity-90"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
    >
      {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
      <source src={videoSrcMp4} type="video/mp4" />
    </video>
  );
}
