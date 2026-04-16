"use client";

import { motion } from "framer-motion";
import { Telescope, Search } from "lucide-react";

export function SearchHeader({ query }: { query: string }) {
  return (
    <header className="flex flex-col gap-2 mt-40">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.2)]">
          {query ? (
            <Search className="size-5 text-primary" />
          ) : (
            <Telescope className="size-5 text-primary" />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            {query ? (
              <>
                SEARCH <span className="text-primary">RESULTS</span>
              </>
            ) : (
              <>
                COMMAND <span className="text-primary">DISCOVERY</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {query
              ? `Scanning the multiverse for "${query}"`
              : "Locating high-affinity cinematic transmissions."}
          </p>
        </div>
      </motion.div>
    </header>
  );
}
