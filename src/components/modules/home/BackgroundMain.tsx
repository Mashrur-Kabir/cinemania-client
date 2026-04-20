"use client";

import { useEffect, useRef } from "react";

/**
 * BackgroundMain — Film Edition
 * ──────────────────────────────
 * Two-layer architecture:
 *
 * LAYER A — position:fixed   Ambient blobs + vignette. Always covers viewport.
 *                            Cursor-reactive via one slow lerp. GPU composited.
 *
 * LAYER B — position:absolute  Film SVG pattern. Scrolls with the page.
 *                               Browser reveals it natively — zero JS on scroll.
 *                               Single <svg> painted once, never repainted.
 *
 * Film elements (all SVG vector, zero images):
 *   Film strips with sprocket holes — left & right edges
 *   Reel circles with spokes        — scattered through page
 *   Diagonal projector light rays   — 3 sets across page height
 *   Lens flare crosses              — accent points
 *   Clapperboard blocks             — mid-page markers
 *   Film frame outlines             — scattered
 *   Sparse dot grid                 — structural texture
 */

export default function BackgroundMain() {
  const blobPlaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plane = blobPlaneRef.current;
    if (!plane) return;

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
      cx += (tx - cx) * 0.028;
      cy += (ty - cy) * 0.028;
      plane.style.transform = `translate3d(${(cx * 22).toFixed(3)}px, ${(cy * 22).toFixed(3)}px, 0)`;
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
    <>
      {/* ══ LAYER A: Fixed ambient ══ */}
      <div className="fixed inset-0 -z-20 overflow-hidden bg-[#030406]">
        <div
          ref={blobPlaneRef}
          className="absolute inset-[-4%] will-change-transform"
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 680,
              height: 680,
              top: "-8%",
              left: "-8%",
              background: "oklch(0.63 0.25 18 / 0.13)",
              filter: "blur(160px)",
              animation: "blobMove 22s ease-in-out infinite",
              willChange: "transform",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 520,
              height: 520,
              top: "18%",
              right: "-6%",
              background: "oklch(0.45 0.22 285 / 0.12)",
              filter: "blur(140px)",
              animation: "blobMove 28s ease-in-out infinite reverse",
              animationDelay: "5s",
              willChange: "transform",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 600,
              height: 600,
              bottom: "-10%",
              left: "22%",
              background: "oklch(0.7 0.18 340 / 0.07)",
              filter: "blur(180px)",
              animation: "blobMove 34s ease-in-out infinite",
              animationDelay: "11s",
              willChange: "transform",
            }}
          />
        </div>
        {/* Static vignette — painted once, never recalculated */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 40%, transparent 20%, #030406 92%), linear-gradient(to bottom, #030406 0%, transparent 10%, transparent 85%, #030406 100%)",
          }}
        />
      </div>

      {/* ══ LAYER B: Absolute film pattern (scrolls with page) ══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <FilmPatternSVG />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FilmPatternSVG
// Single SVG covering the full document height.
// viewBox="0 0 1440 4000" — tall enough for any landing page.
// preserveAspectRatio="xMidYMin slice" — pins to top, slices width.
// ─────────────────────────────────────────────────────────────────────────────
function FilmPatternSVG() {
  // Base styles — kept very faint so they support content, never fight it
  const base = {
    stroke: "rgba(255,255,255,0.055)",
    strokeWidth: 1,
    fill: "none",
  };

  const red = {
    stroke: "rgba(225,29,72,0.11)",
    strokeWidth: 1,
    fill: "none",
  };

  const pur = {
    stroke: "rgba(168,85,247,0.09)",
    strokeWidth: 1,
    fill: "none",
  };

  const dim = {
    stroke: "rgba(255,255,255,0.035)",
    strokeWidth: 1,
    fill: "none",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 4000"
      preserveAspectRatio="xMidYMin slice"
    >
      {/* ─── 1. FILM STRIPS ─── */}
      <FilmStrip x={0} y={0} totalHeight={4000} {...base} />
      <FilmStrip x={1388} y={300} totalHeight={3400} {...dim} />

      {/* ─── 2. REEL CIRCLES ─── */}
      <ReelCircle cx={1260} cy={310} r={175} {...red} />
      <ReelCircle cx={170} cy={1580} r={135} {...pur} />
      <ReelCircle cx={1310} cy={2880} r={195} {...red} />
      <ReelCircle cx={210} cy={3480} r={105} {...pur} />

      {/* ─── 3. PROJECTOR LIGHT RAYS ─── */}
      {/* Top-right source */}
      <line x1={1440} y1={0} x2={680} y2={620} {...red} strokeWidth="0.8" />
      <line x1={1440} y1={30} x2={720} y2={640} {...base} strokeWidth="0.5" />
      <line x1={1440} y1={60} x2={760} y2={660} {...dim} strokeWidth="0.5" />

      {/* Mid-left source */}
      <line x1={0} y1={1820} x2={680} y2={2180} {...pur} strokeWidth="0.8" />
      <line x1={0} y1={1860} x2={700} y2={2210} {...dim} strokeWidth="0.5" />

      {/* Lower-right source */}
      <line x1={1440} y1={3180} x2={700} y2={3680} {...red} strokeWidth="0.7" />
      <line x1={1440} y1={3210} x2={720} y2={3700} {...dim} strokeWidth="0.4" />

      {/* ─── 4. LENS FLARE CROSSES ─── */}
      <LensCross cx={1310} cy={70} size={26} {...red} strokeWidth="0.8" />
      <LensCross cx={130} cy={880} size={17} {...pur} strokeWidth="0.7" />
      <LensCross cx={720} cy={1380} size={21} {...base} strokeWidth="0.6" />
      <LensCross cx={1340} cy={2180} size={23} {...red} strokeWidth="0.7" />
      <LensCross cx={95} cy={2820} size={15} {...pur} strokeWidth="0.6" />
      <LensCross cx={780} cy={3580} size={19} {...base} strokeWidth="0.6" />

      {/* ─── 5. CLAPPERBOARDS ─── */}
      <Clapperboard x={880} y={680} w={118} h={68} {...red} strokeWidth="0.9" />
      <Clapperboard x={75} y={1180} w={98} h={58} {...pur} strokeWidth="0.9" />
      <Clapperboard
        x={1090}
        y={2080}
        w={128}
        h={73}
        {...red}
        strokeWidth="0.9"
      />
      <Clapperboard
        x={290}
        y={3080}
        w={108}
        h={63}
        {...pur}
        strokeWidth="0.9"
      />

      {/* ─── 6. FILM FRAME OUTLINES ─── */}
      <FrameRect x={800} y={180} w={78} h={54} {...dim} />
      <FrameRect x={340} y={560} w={58} h={40} {...red} strokeWidth="0.7" />
      <FrameRect x={1180} y={1080} w={88} h={60} {...pur} strokeWidth="0.7" />
      <FrameRect x={170} y={1880} w={68} h={47} {...dim} />
      <FrameRect x={940} y={2380} w={83} h={57} {...red} strokeWidth="0.7" />
      <FrameRect x={440} y={2980} w={73} h={51} {...pur} strokeWidth="0.7" />
      <FrameRect x={1080} y={3680} w={93} h={63} {...dim} />

      {/* ─── 7. SPARSE DOT GRID ─── */}
      <DotGrid />
    </svg>
  );
}

// ─── Primitive components ────────────────────────────────────────────────────

type GProps = React.SVGProps<SVGGElement>;

function FilmStrip({
  x,
  y,
  totalHeight,
  ...style
}: { x: number; y: number; totalHeight: number } & GProps) {
  const W = 50;
  const holeW = 15;
  const holeH = 10;
  const spacing = 30;
  const count = Math.floor(totalHeight / spacing);

  return (
    <g {...style}>
      <rect x={x} y={y} width={W} height={totalHeight} />
      <line x1={x + 20} y1={y} x2={x + 20} y2={y + totalHeight} />
      {Array.from({ length: count }).map((_, i) => (
        <rect
          key={i}
          x={x + 3}
          y={y + i * spacing + 5}
          width={holeW}
          height={holeH}
          rx={2}
        />
      ))}
    </g>
  );
}

// 🎯 UPDATE THIS COMPONENT
function ReelCircle({
  cx,
  cy,
  r,
  ...style
}: { cx: number; cy: number; r: number } & GProps) {
  return (
    <g {...style}>
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r * 0.62} />
      <circle cx={cx} cy={cy} r={r * 0.22} />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;

        // 🎯 THE FIX: Use .toFixed(3) to ensure string parity between Server & Client
        return (
          <line
            key={i}
            x1={(cx + Math.cos(a) * r * 0.25).toFixed(3)}
            y1={(cy + Math.sin(a) * r * 0.25).toFixed(3)}
            x2={(cx + Math.cos(a) * r * 0.59).toFixed(3)}
            y2={(cy + Math.sin(a) * r * 0.59).toFixed(3)}
          />
        );
      })}
    </g>
  );
}

function LensCross({
  cx,
  cy,
  size,
  ...style
}: { cx: number; cy: number; size: number } & GProps) {
  return (
    <g {...style}>
      <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} />
      <line x1={cx} y1={cy - size} x2={cx} y2={cy + size} />
      <line
        x1={cx - size * 0.55}
        y1={cy - size * 0.55}
        x2={cx + size * 0.55}
        y2={cy + size * 0.55}
        strokeOpacity={0.45}
      />
      <line
        x1={cx + size * 0.55}
        y1={cy - size * 0.55}
        x2={cx - size * 0.55}
        y2={cy + size * 0.55}
        strokeOpacity={0.45}
      />
    </g>
  );
}

function Clapperboard({
  x,
  y,
  w,
  h,
  ...style
}: { x: number; y: number; w: number; h: number } & GProps) {
  const barH = h * 0.38;
  const bodyY = y + barH + 2;
  const stripes = 5;
  const sw = w / stripes;

  return (
    <g {...style}>
      {/* Body */}
      <rect x={x} y={bodyY} width={w} height={h - barH - 2} rx={2} />
      {/* Top bar */}
      <rect x={x} y={y} width={w} height={barH} rx={2} />
      {/* Diagonal stripes on bar */}
      {Array.from({ length: stripes }).map((_, i) => (
        <line
          key={i}
          x1={x + i * sw}
          y1={y}
          x2={x + i * sw + barH}
          y2={y + barH}
          strokeOpacity={i % 2 === 0 ? 0.45 : 1}
        />
      ))}
      {/* Hinge */}
      <line x1={x} y1={y + barH + 1} x2={x + w} y2={y + barH + 1} />
      {/* Label lines inside body */}
      <line
        x1={x + 8}
        y1={bodyY + 14}
        x2={x + w - 8}
        y2={bodyY + 14}
        strokeOpacity={0.4}
      />
      <line
        x1={x + 8}
        y1={bodyY + 24}
        x2={x + w * 0.6}
        y2={bodyY + 24}
        strokeOpacity={0.25}
      />
    </g>
  );
}

function FrameRect({
  x,
  y,
  w,
  h,
  ...style
}: { x: number; y: number; w: number; h: number } & GProps) {
  return (
    <g {...style}>
      <rect x={x} y={y} width={w} height={h} rx={3} />
      <rect x={x + 5} y={y + 4} width={w - 10} height={h - 8} rx={2} />
    </g>
  );
}

function DotGrid() {
  const dots: React.ReactElement[] = [];
  const gx = 120,
    gy = 120;
  const cols = Math.ceil(1440 / gx);
  const rows = Math.ceil(4000 / gy);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c <= 1 || c >= cols - 2) continue; // skip film strip columns
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gx + (r % 2 ? gx / 2 : 0)}
          cy={r * gy}
          r={0.75}
          fill="rgba(255,255,255,0.038)"
        />,
      );
    }
  }
  return <>{dots}</>;
}
