"use client";

import { motion } from "framer-motion";

export default function GenreBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-primary shadow-[0_0_10px_rgba(225,29,72,0.5)]"
      />
    </div>
  );
}
