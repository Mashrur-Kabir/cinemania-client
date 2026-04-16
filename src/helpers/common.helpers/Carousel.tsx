import MediaCard from "@/components/modules/home/MediaCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TMediaPreview } from "@/types/media.types";

// 🎯 Reusable Carousel Helper
export function MediaCarousel({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: TMediaPreview[];
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5">
          {icon}
        </div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-6 pb-6">
          {items.map((item) => (
            <div key={item.id} className="w-[200px] shrink-0">
              {/* 🎯 FIXED: Changed 'item={item}' to 'media={item}' to match MediaCardProps */}
              <MediaCard media={item} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
