"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import type { P } from "@/lib/products";
export default function WishlistPage() {
  const { user, ready, wishlist } = useStore(); const [all, setAll] = useState<P[] | null>(null);
  useEffect(() => { if (user) api("/api/wishlist").then(d => setAll(d.products)).catch(() => setAll([])); }, [user]);
  if (!ready) return <div className="py-24 text-center text-muted">Loading…</div>;
  if (!user) return <div className="py-24 text-center"><p className="text-muted">Log in to see your wishlist.</p><Link href="/login?next=/wishlist" className="mt-4 inline-block rounded-full bg-primary px-7 py-3 text-white">Login</Link></div>;
  const shown = (all ?? []).filter(p => wishlist.includes(String(p._id)));
  return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="mb-8 text-3xl font-bold">Wishlist</h1>
    {all && !shown.length ? <div className="rounded-3xl bg-bg-alt py-16 text-center text-muted">Nothing saved yet. Tap the heart on any product.</div> :
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{shown.map(p => <ProductCard key={p._id} p={p} />)}</div>}</div>;
}
