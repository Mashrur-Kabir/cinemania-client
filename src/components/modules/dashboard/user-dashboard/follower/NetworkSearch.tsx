"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NetworkSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(initialSearch);
  const [isPending, setIsPending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Simple debounce logic to prevent spamming the URL state
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (inputValue.trim()) {
        params.set("search", inputValue.trim());
        params.set("page", "1"); // Always reset to page 1 on new search
      } else {
        params.delete("search");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (newUrl !== currentUrl) {
        router.push(newUrl, { scroll: false });
      }
      setIsPending(false);
    }, 400); // 400ms delay

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inputValue, pathname, router]);

  return (
    <div className="relative w-full max-w-md mx-auto mb-10 group">
      {/* Ambient Focus Glow */}
      <div
        className={cn(
          "absolute inset-0 bg-primary/20 blur-2xl rounded-full transition-opacity duration-700 pointer-events-none",
          isFocused ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "relative flex items-center h-14 bg-white/[0.02] border rounded-2xl overflow-hidden transition-all duration-500 transform-gpu", // 🎯 Added transform-gpu
          isFocused
            ? "border-primary/50 shadow-[0_0_20px_rgba(225,29,72,0.15)]"
            : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]",
        )}
      >
        <div className="pl-5 pr-3 text-muted-foreground transition-colors group-focus-within:text-primary">
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Search className="size-5" />
          )}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setIsPending(true);
            setInputValue(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search network by name..."
          // 🎯 Removed cursor-pointer
          className="flex-1 h-full bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20"
        />

        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className="p-3 text-muted-foreground hover:text-white transition-colors active:scale-95"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
