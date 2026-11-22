"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Truck } from "lucide-react";
export default function Hero() {
  return <section className="relative overflow-hidden bg-gradient-to-br from-bg-alt via-white to-blue-50">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm text-primary shadow-soft"><Sparkles size={14} />New season collection</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Everything you love, <span className="text-primary">beautifully</span> delivered.</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-5 max-w-md text-lg text-muted">Premium products, honest prices and a shopping experience designed to feel effortless.</motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-full bg-primary px-7 py-3 font-medium text-white shadow-soft transition hover:opacity-90 active:scale-95">Shop Now</Link>
          <Link href="/categories" className="rounded-full bg-white px-7 py-3 font-medium shadow-soft ring-1 ring-slate-200 transition hover:bg-bg-alt active:scale-95">Explore Collections</Link>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft"><Image priority src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80" alt="Store" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" /></div>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -left-4 bottom-8 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm shadow-soft"><Truck className="text-accent" size={18} />Free shipping $100+</motion.div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute -right-3 top-8 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft">WELCOME10 · 10% off</motion.div>
      </motion.div>
    </div></section>;
}
