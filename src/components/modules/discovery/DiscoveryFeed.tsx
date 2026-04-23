"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Users, Flame, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IDiscoveryData } from "@/types/discovery.types";
import { MediaCarousel } from "@/helpers/common.helpers/Carousel";

export default function DiscoveryFeed({ data }: { data: IDiscoveryData }) {
  const {
    continueWatching = [],
    socialWatchParty = [],
    trending = [],
    recommendations = [],
  } = data;

  return (
    <div className={cn("space-y-16 mt-20")}>
      {/* 🚀 1. Continue Watching */}
      {continueWatching?.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Play className="size-4 text-primary fill-current" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
              Resume Session
            </h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <ScrollArea>
            <div className="flex gap-6 pb-4">
              {continueWatching.map((item) => (
                <div
                  key={item.id}
                  className="w-[300px] shrink-0 group cursor-pointer"
                >
                  <div
                    className={cn(
                      "relative aspect-video rounded-2xl overflow-hidden border border-white/5 mb-3 transition-all",
                      "group-hover:border-primary/30 group-hover:shadow-[0_0_30px_-10px_rgba(225,29,72,0.3)]",
                      // 🎯 THE FIX: Force the GPU to handle the clipping of the child image
                      "isolate transform-gpu [backface-visibility:hidden]",
                    )}
                  >
                    <Image
                      src={item.media.posterUrl || "/placeholder-poster.jpg"}
                      alt={item.media.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className={cn(
                        "object-cover transition-transform duration-700 ease-out",
                        "group-hover:scale-105",
                        // 🎯 THE FIX: Kept these, but removed preserve-3d as it sometimes conflicts with isolated parents
                        "transform-gpu will-change-transform [backface-visibility:hidden]",
                      )}
                    />

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-10">
                      <div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(225,29,72,1)]"
                        style={{
                          width: `${(item.lastPosition / item.duration) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors duration-300">
                    {item.media.title}
                  </h4>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}

      {/* 🔮 2. Social Watch Party */}
      {socialWatchParty?.length > 0 && (
        <section
          className={cn(
            "p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5",
            "shadow-[inset_0_0_40px_rgba(225,29,72,0.02)]",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="size-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Live Transmissions
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {socialWatchParty.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "flex items-center gap-3 p-2 pr-4 rounded-full bg-black/40 border border-white/5",
                  "hover:border-primary/30 hover:bg-white/[0.03] transition-all cursor-pointer group",
                )}
              >
                <Avatar className="size-8 border border-primary/20 group-hover:border-primary/50 transition-colors">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                    {session.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-[10px] font-bold">
                  <p className="text-white/60 line-clamp-1 group-hover:text-white transition-colors">
                    {session.user.name}{" "}
                    <span className="text-muted-foreground font-medium italic">
                      is watching
                    </span>
                  </p>
                  <p className="text-primary truncate max-w-[120px]">
                    {session.media.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 📈 3. Trending */}
      <MediaCarousel
        title="Hot Transmissions"
        icon={<Flame className="size-4 text-orange-500" />}
        items={trending}
      />

      {/* ✨ 4. Recommendations */}
      <MediaCarousel
        title="Aura Alignment"
        icon={<Sparkles className="size-4 text-indigo-400" />}
        items={recommendations}
      />
    </div>
  );
}
