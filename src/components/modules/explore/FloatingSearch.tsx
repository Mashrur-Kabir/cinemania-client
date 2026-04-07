"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react"; // 🎯 Loader2 is here
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export default function FloatingSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("searchTerm") || "");
  const debouncedText = useDebounce(text, 500);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const currentSearch = searchParams.get("searchTerm") || "";
    if (debouncedText === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedText) {
      params.set("searchTerm", debouncedText);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedText, router, searchParams]);

  return (
    <div className="sticky top-24 z-40 flex flex-col items-center w-full px-6 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto relative flex items-center w-full max-w-2xl gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 bg-black/40 backdrop-blur-2xl shadow-2xl",
          isPending
            ? "border-primary/50 shadow-[0_0_20px_rgba(225,29,72,0.2)]"
            : "border-white/10",
        )}
      >
        {/* 🎯 Icon Swap: Search transitions into a spinning Loader2 */}
        <div className="relative size-5 flex items-center justify-center">
          {isPending ? (
            <Loader2 className="size-5 text-primary animate-spin" />
          ) : (
            <Search className="size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
        </div>

        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search the multiverse..."
          className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground/50 font-medium"
        />

        {/* 🔦 The "Scan-line" Loader remains for extra cinematic flair */}
        {isPending && (
          <div className="absolute bottom-0 left-0 h-[1px] w-full overflow-hidden rounded-full">
            <div className="h-full w-24 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
          </div>
        )}

        {/* 🎯 Clear Button: Only shows when NOT loading to avoid UI clutter */}
        {text && !isPending && (
          <button
            onClick={() => setText("")}
            className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <X className="size-4 text-muted-foreground hover:text-white" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary transition-opacity duration-300",
          isPending ? "opacity-100" : "opacity-0",
        )}
      >
        Scanning Multiverse...
      </div>
    </div>
  );
}
