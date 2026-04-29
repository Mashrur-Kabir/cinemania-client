"use client";

/**
 * KineticHero
 * ─────────────
 * Full-viewport hero with:
 * - Kinetic word-by-word reveal (stagger via CSS animation-delay)
 * - Cursor-tracking card tilt on the stat pills
 * - Scroll fade-out on the entire hero block
 * - Zero images, zero libraries, pure CSS + rAF
 *
 * Replaces both HeroPosterStage and ParallaxHero.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Star, Users, TrendingUp, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Film, value: "50K+", label: "Titles" },
  { icon: Users, value: "120K+", label: "Members" },
  { icon: Star, value: "4.8", label: "Avg Rating" },
  { icon: TrendingUp, value: "2M+", label: "Reviews" },
];

// Headline split into words for kinetic stagger
const HEADLINE_WORDS = ["YOUR", "UNIVERSE.", "ONE", "SCREEN."];
const ACCENT_START = 2; // words from index 2 onward get accent color

export default function KineticHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Trigger entrance after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Scroll-driven fade-out for the whole hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let raf = 0;
    let cur = 0,
      tgt = 0;
    const onScroll = () => {
      tgt = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const loop = () => {
      cur += (tgt - cur) * 0.09;
      const opacity = Math.max(0, 1 - cur / 420);
      const y = cur * 0.18;
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Cursor tilt on stat pills
  useEffect(() => {
    const container = statsRef.current;
    if (!container) return;
    const pills = Array.from(
      container.querySelectorAll<HTMLElement>(".stat-pill"),
    );

    const onMove = (e: MouseEvent) => {
      pills.forEach((pill) => {
        const r = pill.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        pill.style.transform = `perspective(400px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(8px)`;
      });
    };
    const onLeave = () => {
      pills.forEach((pill) => {
        pill.style.transform = "";
      });
    };
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative z-10 flex min-h-[100svh] w-full mt-20 flex-col items-center justify-center text-center px-6 will-change-transform"
      style={{ opacity: 0 }} // JS controls this after mount
    >
      {/* Kicker */}
      <div
        className="hero-kicker mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition:
            "opacity 600ms cubic-bezier(0.22,1,0.36,1) 60ms, transform 600ms cubic-bezier(0.22,1,0.36,1) 60ms",
        }}
      >
        <Star className="size-3 fill-current" />
        The Social Streaming Revolution
      </div>

      {/* Kinetic Headline */}
      <h1 className="font-heading font-black leading-[0.88] tracking-tighter text-white mb-8 overflow-hidden">
        {HEADLINE_WORDS.map((word, i) => {
          const isAccent = i >= ACCENT_START;
          const delay = 120 + i * 110;
          return (
            <span
              key={word}
              className="kinetic-word inline-block mr-[0.22em] last:mr-0"
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translate3d(0,0,0) rotateX(0deg)"
                  : "translate3d(0,60px,0) rotateX(-30deg)",
                transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                // 3D flip needs perspective on parent — we add it inline
                perspective: "600px",
              }}
            >
              <span
                className={
                  isAccent
                    ? "bg-gradient-to-r from-primary via-rose-400 to-accent bg-clip-text text-transparent"
                    : ""
                }
                style={{
                  fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </h1>

      {/* Description */}
      <p
        className="mx-auto max-w-xl text-lg font-medium leading-relaxed text-muted-foreground/85 mb-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          filter: visible ? "blur(0)" : "blur(4px)",
          transition:
            "opacity 700ms cubic-bezier(0.22,1,0.36,1) 560ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 560ms, filter 600ms cubic-bezier(0.22,1,0.36,1) 560ms",
        }}
      >
        Aggregating all your favorite streaming services into a single social
        ecosystem. Review, discuss, and earn achievements while you watch.
      </p>

      {/* CTA Buttons */}
      <div
        className="flex flex-col items-center gap-4 sm:flex-row mb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 700ms cubic-bezier(0.22,1,0.36,1) 680ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 680ms",
        }}
      >
        <Button
          asChild
          size="lg"
          className="neo-button-primary h-14 px-10 text-base"
        >
          <Link href="/media">
            <Play className="mr-2 size-5 fill-current" />
            Start Watching
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="neo-button-secondary h-14 px-10 text-base"
        >
          <Link href="/community">Browse Community</Link>
        </Button>
      </div>

      {/* Stat pills — cursor-tilt enabled */}
      <div
        ref={statsRef}
        className="flex flex-wrap items-center justify-center gap-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 700ms cubic-bezier(0.22,1,0.36,1) 800ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 800ms",
        }}
      >
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="stat-pill flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl"
            style={{
              transition: "transform 200ms cubic-bezier(0.22,1,0.36,1)",
              willChange: "transform",
            }}
          >
            <Icon className="size-3.5 text-primary" />
            <span className="text-sm font-black text-white">{value}</span>
            <span className="text-xs text-muted-foreground font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: visible ? 0.4 : 0,
          transition: "opacity 700ms 1200ms",
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
