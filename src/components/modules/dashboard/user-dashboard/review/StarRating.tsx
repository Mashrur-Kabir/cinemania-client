"use client";

import { Star, StarHalf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const displayValue = hover !== null ? hover : value;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 group/rating">
        {[...Array(10)].map((_, i) => {
          const starIndex = i + 1;

          const isFull = displayValue >= starIndex;
          const isHalf =
            displayValue >= starIndex - 0.5 && displayValue < starIndex;

          return (
            <div key={i} className="relative size-6">
              {/* ⭐ Base Star */}
              <Star
                className={cn(
                  "absolute inset-0 size-6 transition-colors",
                  isFull ? "text-yellow-500 fill-yellow-500" : "text-white/10",
                )}
              />

              {/* ⭐ Half Star */}
              <StarHalf
                className={cn(
                  "absolute inset-0 size-6 transition-colors",
                  isHalf
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-transparent",
                )}
              />

              {/* 🖱️ Hit Zones */}
              <div className="absolute inset-0 flex">
                <button
                  type="button"
                  onMouseEnter={() => setHover(starIndex - 0.5)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onChange(starIndex - 0.5)}
                  className="w-1/2 h-full z-10"
                />
                <button
                  type="button"
                  onMouseEnter={() => setHover(starIndex)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onChange(starIndex)}
                  className="w-1/2 h-full z-10"
                />
              </div>
            </div>
          );
        })}

        {/* 🎯 Score Display */}
        <div className="ml-4 flex flex-col">
          <span className="text-2xl font-black text-white italic tracking-tighter leading-none">
            {displayValue.toFixed(1)}
          </span>
          <span className="text-[8px] font-black text-primary uppercase tracking-widest">
            Score
          </span>
        </div>
      </div>
    </div>
  );
}
