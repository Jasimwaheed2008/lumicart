"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
export default function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <ul className="space-y-3">{items.map(([q, a], i) => <li key={q} className="rounded-2xl bg-bg-alt"><button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left font-medium">{q}<ChevronDown className={`transition ${open === i ? "rotate-180" : ""}`} size={18} /></button>
    <AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm text-muted">{a}</p></motion.div>}</AnimatePresence></li>)}</ul>;
}
