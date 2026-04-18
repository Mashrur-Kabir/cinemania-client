import Link from "next/link";
import Image from "next/image";
import { IWatchlistItem } from "@/types/dashboard.types";
import { ChevronRight } from "lucide-react";

export default function WatchlistPreview({
  items,
}: {
  items: IWatchlistItem[];
}) {
  if (!items.length)
    return (
      <p className="text-xs text-muted-foreground italic">
        Your watchlist is empty. Start exploring!
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-widest text-primary">
          Quick Watchlist
        </h2>
        <Link
          href="/dashboard/watchlist"
          className="text-[10px] font-bold text-muted-foreground hover:text-white flex items-center transition-colors"
        >
          VIEW ALL <ChevronRight className="ml-1 size-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <Link
            key={item.id}
            href={`/media/${item.media.slug}`}
            className="flex items-center gap-3 group p-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <div className="relative size-12 rounded-lg overflow-hidden border border-white/10">
              <Image
                src={item.media.posterUrl || "..."}
                alt={item.media.title}
                fill
                sizes="..."
                // 🎯 THE FIX: Add these utilities to stabilize the sub-pixel scaling
                className="object-cover transition-transform duration-500 ease-out transform-gpu will-change-transform [backface-visibility:hidden] group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                {item.media.title}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {item.media.releaseYear}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
