"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ArchiveNotFoundRedirect() {
  const router = useRouter();
  // 🎯 THE FIX: Use a ref to act as an execution latch
  const hasFired = useRef(false);

  useEffect(() => {
    // If it has already fired, abort immediately
    if (hasFired.current) return;
    hasFired.current = true;

    // Fire the toast with a unique ID to prevent Sonner duplication
    toast.error(
      "No post found in archive. Redirecting to your active reviews...",
      { id: "archive-not-found-toast" },
    );

    // Push the router back to the main reviews page
    router.push("/dashboard/my-reviews");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-in fade-in duration-500">
      <Loader2 className="size-8 text-rose-500 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
        Rerouting Connection...
      </p>
    </div>
  );
}
