import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SectionSkeletonProps {
  count?: number;
  className?: string;
}

export default function SectionSkeleton({
  count = 6,
  className,
}: SectionSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full space-y-8 animate-in fade-in duration-500",
        className,
      )}
    >
      {/* Title & Subtitle Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-48 bg-white/5" />
        <Skeleton className="h-4 w-72 bg-white/5" />
      </div>

      {/* Grid of Card Skeletons */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-4">
            {/* Poster Shape */}
            <Skeleton className="aspect-2/3 w-full rounded-2xl bg-white/[0.03]" />
            {/* Title Line */}
            <Skeleton className="h-4 w-3/4 bg-white/5" />
            {/* Metadata Line */}
            <Skeleton className="h-3 w-1/2 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
