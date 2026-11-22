"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/context/StoreContext";
import { useCompare } from "@/context/CompareContext";
export default function ComparePage() {
  const { slugs, toggle } = useCompare(); const [ps, setPs] = useState<any[]>([]);
  useEffect(() => { if (slugs.length) api(`/api/products/compare?slugs=${slugs.join(",")}`).then(d => setPs(d.products)); else setPs([]); }, [slugs]);
  if (!slugs.length) return <div className="py-24 text-center text-muted">Pick up to 3 products with the compare icon. <Link href="/shop" className="text-primary">Browse shop</Link></div>;
  const rows: [string, (p: any) => React.ReactNode][] = [["Price", p => `$${p.discountPrice ?? p.price}`], ["Brand", p => p.brand ?? "—"], ["Category", p => p.category?.name ?? "—"], ["Rating", p => `${p.rating.toFixed(1)} (${p.numReviews})`], ["Availability", p => (p.stock ? "In stock" : "Out of stock")], ["Options", p => p.variants?.map((v: any) => `${v.name}: ${v.options.join(", ")}`).join(" | ") || "—"]];
  return <div className="mx-auto max-w-5xl overflow-x-auto px-4 py-10"><h1 className="mb-6 text-3xl font-bold">Compare products</h1>
    <table className="w-full min-w-[560px] text-sm"><thead><tr><th className="w-32" />{ps.map(p => <th key={p._id} className="p-3 text-left align-top"><Link href={`/product/${p.slug}`}><div className="relative mb-2 aspect-square w-40 overflow-hidden rounded-2xl bg-bg-alt"><Image src={p.images[0]} alt={p.name} fill sizes="160px" className="object-cover" /></div>{p.name}</Link><button onClick={() => toggle(p.slug)} className="mt-1 text-xs text-muted hover:text-red-500">Remove</button></th>)}</tr></thead>
      <tbody>{rows.map(([l, fn]) => <tr key={l} className="border-t border-slate-100"><td className="p-3 font-medium text-muted">{l}</td>{ps.map(p => <td key={p._id} className="p-3">{fn(p)}</td>)}</tr>)}</tbody></table></div>;
}
