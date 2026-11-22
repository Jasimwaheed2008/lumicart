"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Scale, ShoppingBag, Star } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useCompare } from "@/context/CompareContext";
import type { P } from "@/lib/products";
export default function ProductCard({ p }: { p: P }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { slugs, toggle } = useCompare();
  const [done, setDone] = useState(false);
  const price = p.discountPrice ?? p.price, off = p.discountPrice ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
  const hasVariants = !!p.variants?.length, liked = wishlist.includes(p._id);
  const add = async () => { await addToCart({ productId: p._id, name: p.name, slug: p.slug, image: p.images[0], price, stock: p.stock }); setDone(true); setTimeout(() => setDone(false), 1400); };
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="group rounded-3xl bg-white p-3 shadow-soft ring-1 ring-slate-100">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-alt">
        <Link href={`/product/${p.slug}`} aria-label={p.name}><Image src={p.images[0]} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-110" /></Link>
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">-{off}%</span>}
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleWishlist(p._id)} aria-label="Wishlist" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow">
          <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-muted"} /></motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggle(p.slug)} aria-label="Compare" className="absolute right-3 top-14 rounded-full bg-white/90 p-2 shadow"><Scale size={18} className={slugs.includes(p.slug) ? "text-primary" : "text-muted"} /></motion.button>
      </div>
      <div className="px-1 pb-1 pt-3">
        {p.brand && <div className="text-xs uppercase tracking-wide text-muted">{p.brand}</div>}
        <Link href={`/product/${p.slug}`} className="line-clamp-1 font-medium">{p.name}</Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted"><Star size={13} className="fill-amber-400 text-amber-400" />{p.rating.toFixed(1)} ({p.numReviews})</div>
        <div className="mt-2 flex items-center justify-between">
          <div><span className="font-semibold">${price}</span>{p.discountPrice && <span className="ml-2 text-sm text-muted line-through">${p.price}</span>}</div>
          {p.stock < 1 ? <span className="text-xs text-red-500">Out of stock</span> : hasVariants
            ? <Link href={`/product/${p.slug}`} className="rounded-full bg-bg-alt px-3 py-1.5 text-xs font-medium hover:bg-slate-200">Options</Link>
            : <motion.button whileTap={{ scale: 0.9 }} onClick={add} aria-label="Add to cart" className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white">
              <AnimatePresence mode="wait" initial={false}><motion.span key={String(done)} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>{done ? <Check size={16} /> : <ShoppingBag size={16} />}</motion.span></AnimatePresence></motion.button>}
        </div>
      </div>
    </motion.div>
  );
}
