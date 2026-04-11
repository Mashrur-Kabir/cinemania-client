import { cn } from "@/lib/utils";

export default function DiaryTimelineSkeleton({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <div className="relative space-y-24 md:space-y-32">
      {/* 📍 The Central Line (Must match real component exactly) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-20" />

      {[...Array(count)].map((_, i) => {
        const isEven = i % 2 === 0;

        return (
          <div
            key={i}
            className="relative flex items-center justify-center w-full min-h-[300px]"
          >
            {/* 📍 Central Node Placeholder */}
            <div className="absolute left-1/2 -translate-x-1/2 z-20">
              <div className="size-4 rounded-full bg-white/5 border-4 border-[#030406] animate-pulse" />
            </div>

            {/* 🎥 Content Grid Placeholder */}
            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-6 items-center",
                isEven ? "md:text-right" : "md:text-left",
              )}
            >
              {/* 🖼️ Poster Skeleton */}
              <div
                className={cn(
                  "aspect-[2/3] w-full max-w-[240px] mx-auto rounded-[2rem] bg-white/[0.02] border border-white/5 animate-pulse",
                  isEven ? "md:ml-auto" : "md:mr-auto md:order-last",
                )}
              />

              {/* 📝 Details Skeleton */}
              <div className="flex flex-col gap-4">
                {/* Date bar */}
                <div
                  className={cn(
                    "flex",
                    isEven ? "md:justify-end" : "md:justify-start",
                  )}
                >
                  <div className="h-3 w-32 bg-white/5 rounded-full animate-pulse" />
                </div>

                {/* Title bars */}
                <div className="space-y-2">
                  <div
                    className={cn(
                      "h-10 w-full max-w-[300px] bg-white/5 rounded-xl animate-pulse",
                      isEven ? "md:ml-auto" : "",
                    )}
                  />
                  <div
                    className={cn(
                      "h-10 w-3/4 bg-white/5 rounded-xl animate-pulse",
                      isEven ? "md:ml-auto" : "",
                    )}
                  />
                </div>

                {/* Badges */}
                <div
                  className={cn(
                    "flex gap-2 mt-2",
                    isEven ? "md:justify-end" : "md:justify-start",
                  )}
                >
                  <div className="h-6 w-16 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                </div>

                {/* Note Box */}
                <div className="mt-6 p-10 h-32 w-full rounded-[1.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
