"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

/** True when the user has requested reduced motion at the OS level. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  immediate?: boolean;
  style?: CSSProperties;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
  once = true,
  immediate = false,
  style,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — show immediately without animation.
    if (immediate || prefersReducedMotion()) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.transition = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          if (once) observer.disconnect();
        } else if (!once) {
          el.style.opacity = "0";
          el.style.transform = `translateY(${y}px)`;
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [y, once, immediate]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: immediate ? 1 : 0,
        transform: immediate ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function Stagger({ children, className, stagger = 0.08, delay = 0 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];

    // Respect prefers-reduced-motion — reveal all items immediately.
    if (prefersReducedMotion()) {
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
        item.style.transition = "none";
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => {
            const t = delay + i * stagger;
            item.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${t}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${t}s`;
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: 0,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}
