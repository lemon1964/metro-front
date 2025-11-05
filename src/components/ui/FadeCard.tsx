"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function FadeCard({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-black/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5 shadow-lg"
    >
      {children}
    </motion.div>
  );
}
