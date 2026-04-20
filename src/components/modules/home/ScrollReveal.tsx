"use client";

/**
 * ScrollReveal
 * ─────────────
 * Wraps any children and plays a 3D entrance animation when they enter
 * the viewport. Uses IntersectionObserver (no scroll listener overhead).
 *
 * Props:
 *   delay   — ms stagger delay (default 0)
 *   y       — translateY start offset in px (default 40)
 *   rotateX — 3D tilt on entry (default 8, set 0 to disable)
 *   once    — only animate once (default true)
 *
 * Example:
 *   <ScrollReveal delay={100}>
 *     <FeatureCard … />
 *   </ScrollReveal>
 */

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // ms
  y?: number; // px translateY start
  rotateX?: number; // deg 3D tilt
  scale?: number; // start scale (e.g. 0.92)
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  y = 44,
  rotateX = 8,
  scale = 0.94,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial hidden state — set inline so no flash
    el.style.opacity = "0";
    el.style.transform = `perspective(900px) translate3d(0,${y}px,0) rotateX(${rotateX}deg) scale(${scale})`;
    el.style.filter = "blur(3px)";
    el.style.transition = [
      `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      `transform 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      `filter 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    ].join(", ");
    el.style.willChange = "transform, opacity, filter";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform =
              "perspective(900px) translate3d(0,0,0) rotateX(0deg) scale(1)";
            el.style.filter = "blur(0px)";
            if (once) observer.disconnect();
          } else if (!once) {
            el.style.opacity = "0";
            el.style.transform = `perspective(900px) translate3d(0,${y}px,0) rotateX(${rotateX}deg) scale(${scale})`;
            el.style.filter = "blur(3px)";
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, y, rotateX, scale, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
