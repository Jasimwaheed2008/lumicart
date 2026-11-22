"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { api, useStore } from "@/context/StoreContext";
const links = [["Shop", "/shop"], ["Categories", "/categories"], ["New Arrivals", "/new-arrivals"], ["Best Sellers", "/best-sellers"], ["Sale", "/sale"]];
type Hit = { _id: string; name: string; slug: string; images: string[]; price: number; discountPrice?: number };
export default function Navbar() {
  const { cartCount, wishlist, user, logout } = useStore();
  const [open, setOpen] = useState(false); const [q, setQ] = useState(""); const [hits, setHits] = useState<Hit[]>([]);
  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const t = setTimeout(() => api(`/api/products/search?q=${encodeURIComponent(q)}`).then(d => setHits(d.products)).catch(() => setHits([])), 250);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(true)}><Menu /></button>
        <Link href="/" className="text-xl font-bold tracking-tight"><span className="text-primary">Lumi</span><span className="text-accent">Cart</span></Link>
        <nav className="ml-6 hidden gap-6 text-sm font-medium text-muted lg:flex">{links.map(([l, h]) => <Link key={h} href={h} className="transition hover:text-ink">{l}</Link>)}</nav>
        <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <Search className="absolute left-3 top-2.5 text-muted" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…" className="w-full rounded-full bg-bg-alt py-2 pl-10 pr-4 text-sm outline-none ring-primary/30 focus:ring-2" />
          <AnimatePresence>{hits.length > 0 && <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
            {hits.map(h => <li key={h._id}><Link href={`/product/${h.slug}`} onClick={() => { setQ(""); setHits([]); }} className="flex items-center gap-3 p-3 text-sm hover:bg-bg-alt">
              <Image src={h.images[0]} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" /><span className="flex-1 truncate">{h.name}</span><b>${h.discountPrice ?? h.price}</b></Link></li>)}
          </motion.ul>}</AnimatePresence>
        </div>
        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <Link href="/wishlist" aria-label="Wishlist" className="relative"><Heart size={22} />{wishlist.length > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] text-white">{wishlist.length}</span>}</Link>
          <Link href="/cart" aria-label="Cart" className="relative"><ShoppingBag size={22} />
            <AnimatePresence mode="popLayout"><motion.span key={cartCount} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute -right-2 -top-2 rounded-full bg-primary px-1.5 text-[10px] text-white">{cartCount}</motion.span></AnimatePresence></Link>
          {user ? <div className="flex items-center gap-3 text-sm"><Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-1"><UserIcon size={20} /><span className="hidden sm:inline">{user.name.split(" ")[0]}</span></Link>
            <button onClick={logout} className="text-muted hover:text-ink">Logout</button></div>
            : <Link href="/login" className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95">Login</Link>}
        </div>
      </div>
      <AnimatePresence>{open && <>
        <motion.div className="fixed inset-0 bg-black/30 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
        <motion.aside className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-soft lg:hidden" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}>
          <button className="mb-6" aria-label="Close" onClick={() => setOpen(false)}><X /></button>
          <nav className="flex flex-col gap-4 text-lg">{[["Home", "/"], ...links].map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>)}</nav>
        </motion.aside></>}</AnimatePresence>
    </header>
  );
}
