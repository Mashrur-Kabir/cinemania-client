// src/components/modules/home/HeroPosterStage.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroPosterStage({ posters }: { posters: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % posters.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, [posters.length]);

  return (
    <div className="absolute top-0 left-0 w-full aspect-video -z-10 pointer-events-none overflow-hidden">
      {/* 🎭 The Poster Layer */}
      {posters.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${
            /* 🎯 FIX 2: Increased opacity from 30 to 50 for better visibility */
            i === index ? "opacity-50" : "opacity-0"
          }`}
        >
          <Image
            src={url}
            alt="background"
            fill
            className="object-cover animate-poster-drift"
            priority={i === 0}
          />
        </div>
      ))}

      {/* 🌫️ The Atmosphere (Refined for visibility) */}
      {/* We lightened the 'via' step to let the posters show through more clearly */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030406]/40 to-[#030406]" />

      {/* We widened the transparent center of the radial mask (0% -> 20%) to let more of the poster be seen */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030406_95%)]" />
    </div>
  );
}
