"use client";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Skeleton } from "@/components/Skeleton";
import { FREE_SHIPPING_OVER } from "@/lib/pricing";
export default function CartPage() {
  const { items, ready, setQty, subtotal } = useStore();
  if (!ready) return <div className="mx-auto max-w-5xl space-y-4 px-4 py-10"><Skeleton className="h-28" /><Skeleton className="h-28" /></div>;
  if (!items.length) return <div className="mx-auto max-w-md px-4 py-24 text-center"><h1 className="text-2xl font-bold">Your cart is empty</h1><p className="mt-2 text-muted">Find something you love.</p><Link href="/shop" className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-white">Start shopping</Link></div>;
  return <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px]">
    <div><h1 className="mb-6 text-3xl font-bold">Shopping cart</h1><ul className="space-y-4"><AnimatePresence>{items.map(i => <motion.li layout key={i.productId + JSON.stringify(i.variant)} exit={{ opacity: 0, x: -40 }} className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <Link href={`/product/${i.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-bg-alt"><Image src={i.image} alt={i.name} fill sizes="96px" className="object-cover" /></Link>
      <div className="flex-1"><Link href={`/product/${i.slug}`} className="font-medium">{i.name}</Link>
        {i.variant && Object.keys(i.variant).length > 0 && <div className="text-xs text-muted">{Object.entries(i.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}</div>}
        <div className="mt-1 font-semibold">${i.price}</div>
        <div className="mt-3 flex items-center gap-3"><div className="flex items-center gap-3 rounded-full bg-bg-alt px-3 py-1.5"><button aria-label="Less" onClick={() => setQty(i, i.quantity - 1)}><Minus size={14} /></button><span className="w-5 text-center text-sm">{i.quantity}</span><button aria-label="More" onClick={() => setQty(i, i.quantity + 1)}><Plus size={14} /></button></div>
          <button aria-label="Remove" onClick={() => setQty(i, 0)} className="text-muted hover:text-red-500"><Trash2 size={18} /></button></div></div>
      <div className="font-semibold">${(i.price * i.quantity).toFixed(2)}</div></motion.li>)}</AnimatePresence></ul></div>
    <aside className="h-fit rounded-3xl bg-bg-alt p-6"><h2 className="text-lg font-semibold">Summary</h2>
      <div className="mt-4 flex justify-between"><span className="text-muted">Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
      <p className="mt-2 text-xs text-muted">{subtotal >= FREE_SHIPPING_OVER ? "You qualify for free standard shipping." : `Add $${(FREE_SHIPPING_OVER - subtotal).toFixed(2)} more for free standard shipping.`} Coupons and shipping are applied at checkout.</p>
      <Link href="/checkout" className="mt-5 block rounded-full bg-primary py-3 text-center font-medium text-white transition active:scale-95">Proceed to checkout</Link></aside></div>;
}
