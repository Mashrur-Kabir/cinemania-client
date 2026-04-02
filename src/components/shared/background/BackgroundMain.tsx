"use client";

import { useEffect, useRef } from "react";

const BackgroundMain = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const loop = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      root.style.setProperty("--px", cx.toFixed(4));
      root.style.setProperty("--py", cy.toFixed(4));
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden bg-[#030406] [--px:0] [--py:0]"
    >
      {/* 1. The Mesh Glows (Brighter, more depth) */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-primary/20 blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/20 blur-[100px] animate-blob [animation-delay:4s]" />
      </div>

      {/* 2. Moving Technical Pattern (The "Really Cool" Part) */}
      <div
        className="absolute inset-0 opacity-[0.08] bg-connective-pattern animate-pattern-scroll"
        style={{
          transform:
            "translate3d(calc(var(--px)*10px), calc(var(--py)*10px), 0)",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      />

      {/* 3. The Grid (Sharper) */}
      <div
        className="absolute inset-0 opacity-[0.12] bg-grid-pattern"
        style={{
          transform: "translate3d(calc(var(--px)*5px), calc(var(--py)*5px), 0)",
        }}
      />

      {/* 4. Film Noise (Gives it that cinematic texture) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-noise" />

      {/* 5. Atmosphere Mask (Subtle, not black) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030406_100%)]" />
    </div>
  );
};

export default BackgroundMain;
