"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { P } from "@/lib/products";
export default function ProductView({ p }: { p: P }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [img, setImg] = useState(0), [qty, setQty] = useState(1), [sel, setSel] = useState<Record<string, string>>({}), [err, setErr] = useState("");
  const price = p.discountPrice ?? p.price;
  useEffect(() => { try { const r = JSON.parse(localStorage.getItem("recent") || "[]").filter((x: any) => x.slug !== p.slug); localStorage.setItem("recent", JSON.stringify([{ slug: p.slug, name: p.name, image: p.images[0], price }, ...r].slice(0, 8))); } catch {} }, [p.slug, p.name, p.images, price]);
  const add = async () => {
    const missing = p.variants?.find(v => !sel[v.name]); if (missing) return setErr(`Select ${missing.name}`);
    setErr(""); await addToCart({ productId: p._id, name: p.name, slug: p.slug, image: p.images[0], price, stock: p.stock, variant: sel }, qty);
  };
  return <div className="grid gap-10 md:grid-cols-2">
    <div><div className="relative aspect-square overflow-hidden rounded-3xl bg-bg-alt"><Image src={p.images[img]} alt={p.name} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" /></div>
      <div className="mt-3 flex gap-2">{p.images.map((s, i) => <button key={s} onClick={() => setImg(i)} className={`relative h-16 w-16 overflow-hidden rounded-xl ring-2 ${i === img ? "ring-primary" : "ring-transparent"}`}><Image src={s} alt="" fill sizes="64px" className="object-cover" /></button>)}</div></div>
    <div>
      <div className="text-sm uppercase tracking-wide text-muted">{p.brand}</div><h1 className="mt-1 text-3xl font-bold">{p.name}</h1>
      <div className="mt-4 text-3xl font-semibold">${price}{p.discountPrice && <span className="ml-3 text-lg text-muted line-through">${p.price}</span>}</div>
      <p className={`mt-2 text-sm ${p.stock ? "text-accent" : "text-red-500"}`}>{p.stock ? `${p.stock} in stock` : "Out of stock"}</p>
      {p.variants?.map(v => <div key={v.name} className="mt-5"><div className="mb-2 text-sm font-medium">{v.name}</div><div className="flex flex-wrap gap-2">{v.options.map(o => <button key={o} onClick={() => setSel({ ...sel, [v.name]: o })} className={`rounded-full px-4 py-1.5 text-sm ring-1 transition ${sel[v.name] === o ? "bg-primary text-white ring-primary" : "ring-slate-200 hover:bg-bg-alt"}`}>{o}</button>)}</div></div>)}
      {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-full bg-bg-alt px-3 py-2"><button aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button><span className="w-6 text-center">{qty}</span><button aria-label="More" onClick={() => setQty(Math.min(p.stock, qty + 1))}><Plus size={16} /></button></div>
        <motion.button whileTap={{ scale: 0.95 }} disabled={!p.stock} onClick={add} className="flex-1 rounded-full bg-primary py-3 font-medium text-white shadow-soft disabled:opacity-50">Add to cart</motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleWishlist(p._id)} aria-label="Wishlist" className="rounded-full bg-bg-alt p-3"><Heart className={wishlist.includes(p._id) ? "fill-red-500 text-red-500" : ""} /></motion.button>
      </div></div></div>;
}
