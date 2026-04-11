/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Minus,
  Loader2,
  Film,
  Clapperboard,
  Check,
  Users,
  X,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { getAllMedia } from "@/services/media.services";
import { getWatchlist } from "@/services/user.services";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toggleWatchlistAction } from "@/app/_actions/watchlist.action";

export default function AddWatchlistModal() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(text, 400);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: mediaResponse, isLoading: isSearching } = useQuery({
    queryKey: ["media-search", debouncedSearch],
    queryFn: () => getAllMedia({ searchTerm: debouncedSearch, limit: 6 }),
    enabled: open,
  });

  const { data: currentWatchlist } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => getWatchlist(),
    enabled: open,
  });

  const isInWatchlist = (mediaId: string) => {
    return currentWatchlist?.data?.some(
      (item: any) => item.mediaId === mediaId,
    );
  };

  const {
    mutate: handleToggle,
    isPending,
    variables: actingId,
  } = useMutation({
    mutationFn: toggleWatchlistAction,
    onSuccess: (res: any, variables: string) => {
      if (res.success) {
        toast.success(res.message);

        // 🎯 LOGIC: Only show temporary Check icon if we actually ADDED it
        const isAdded = res.message.toLowerCase().includes("added");
        if (isAdded) {
          setSuccessId(variables);
          setTimeout(() => setSuccessId(null), 2000);
        }

        queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setText("");
      setSuccessId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)]">
          <Plus className="size-4" /> Add to Watchlist
        </button>
      </DialogTrigger>

      {/* 🎯 FIX 1: '[&>button]:hidden' hides the default Shadcn close button */}
      <DialogContent className="sm:max-w-[700px] bg-[#030406]/95 border-white/5 backdrop-blur-3xl p-0 overflow-hidden rounded-[2.5rem] shadow-2xl focus:outline-none [&>button]:hidden">
        {/* 🎯 FIX 1.1: Functional Manual Close Button */}
        <DialogClose className="absolute right-8 top-8 z-50 rounded-full p-2 text-white/30 hover:bg-white/10 hover:text-white transition-all outline-none border border-white/5 hover:border-white/20">
          <X className="size-5" />
        </DialogClose>

        <DialogHeader className="p-10 pb-6 relative z-10 border-b border-white/5">
          <DialogTitle className="text-3xl font-black text-white tracking-tighter italic uppercase">
            FIND YOUR <span className="text-primary">NEXT OBSESSION.</span>
          </DialogTitle>

          <div className="relative mt-8 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search by title, director, or cast..."
              className="pl-12 bg-white/5 border-white/10 focus-visible:ring-primary/40 h-14 rounded-2xl text-base font-medium transition-all"
            />
          </div>
        </DialogHeader>

        {/* 🎯 FIX 3: Fixed width (w-[700px]) and height container to stop resizing jitter */}
        <div className="min-h-[480px] max-h-[480px] w-full overflow-y-auto p-10 pt-6 space-y-4 custom-scrollbar relative">
          <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] mb-4">
            {debouncedSearch ? "Search Results" : "Recent Discoveries"}
          </p>

          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-24 opacity-20">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]">
                Syncing Multiverse...
              </p>
            </div>
          ) : mediaResponse?.data && mediaResponse.data.length > 0 ? (
            mediaResponse.data.map((media: any) => {
              const added = isInWatchlist(media.id);
              const isCurrentlyActing = isPending && actingId === media.id;
              const isSuccess = successId === media.id;

              return (
                <div
                  key={media.id}
                  className="group flex items-center gap-6 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                >
                  <div className="relative h-20 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                      src={media.posterUrl || ""}
                      alt={media.title}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-white truncate group-hover:text-primary transition-colors">
                        {media.title}
                      </h4>
                      <span className="text-[10px] font-bold text-muted-foreground/40">
                        {media.releaseYear}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 opacity-60">
                      <div className="flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-wider">
                        <Clapperboard className="size-3 text-primary/80" />
                        <span className="truncate">{media.director}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-medium">
                        <Users className="size-3" />
                        <span className="truncate">
                          {(media as any).cast?.join(", ") || "Cast unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🎯 FIX 2: Clear iconography for Toggle */}
                  <button
                    onClick={() => {
                      if (isSuccess || isCurrentlyActing) return;
                      handleToggle(media.id);
                    }}
                    disabled={isCurrentlyActing}
                    className={cn(
                      "size-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 border",
                      isSuccess
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        : added
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-primary hover:text-white",
                    )}
                  >
                    {isCurrentlyActing ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : isSuccess ? (
                      <Check className="size-6 animate-in zoom-in-50 duration-300" />
                    ) : added ? (
                      <Minus className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-24 text-center space-y-4 opacity-20">
              <Film className="size-12 mx-auto" />
              <p className="text-sm font-bold uppercase tracking-widest">
                No entries found
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
