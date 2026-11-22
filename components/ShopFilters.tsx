"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
export default function ShopFilters({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter(), path = usePathname(), sp = useSearchParams();
  const [min, setMin] = useState(sp.get("min") ?? ""), [max, setMax] = useState(sp.get("max") ?? "");
  const set = (k: string, v: string) => { const u = new URLSearchParams(sp.toString()); v ? u.set(k, v) : u.delete(k); u.delete("page"); router.push(`${path}?${u}`); };
  const cls = "rounded-xl bg-bg-alt px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2";
  return <div className="mb-8 flex flex-wrap items-end gap-3">
    <select value={sp.get("category") ?? ""} onChange={e => set("category", e.target.value)} className={cls}><option value="">All categories</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
    <select value={sp.get("sort") ?? ""} onChange={e => set("sort", e.target.value)} className={cls}><option value="">Sort: Default</option><option value="popular">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="newest">Newest</option></select>
    <input value={min} onChange={e => setMin(e.target.value)} placeholder="Min $" type="number" min={0} className={`${cls} w-24`} />
    <input value={max} onChange={e => setMax(e.target.value)} placeholder="Max $" type="number" min={0} className={`${cls} w-24`} />
    <button onClick={() => { const u = new URLSearchParams(sp.toString()); min ? u.set("min", min) : u.delete("min"); max ? u.set("max", max) : u.delete("max"); u.delete("page"); router.push(`${path}?${u}`); }} className="rounded-xl bg-primary px-4 py-2 text-sm text-white active:scale-95">Apply</button>
    <button onClick={() => { setMin(""); setMax(""); router.push(path); }} className="text-sm text-muted">Reset</button>
  </div>;
}
