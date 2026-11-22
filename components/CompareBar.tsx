"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCompare } from "@/context/CompareContext";
export default function CompareBar() {
  const { slugs, clear } = useCompare();
  return <AnimatePresence>{slugs.length > 0 && <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-6 py-3 text-sm text-white shadow-soft">
    <span>{slugs.length} selected</span><Link href="/compare" className="font-semibold text-accent">Compare →</Link><button onClick={clear} className="text-white/60">Clear</button></motion.div>}</AnimatePresence>;
}
