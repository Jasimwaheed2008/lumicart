"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function RecentlyViewed({ exclude }: { exclude: string }) {
  const [items, setItems] = useState<{ slug: string; name: string; image: string; price: number }[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("recent") || "[]").filter((x: any) => x.slug !== exclude).slice(0, 4)); } catch {} }, [exclude]);
  if (!items.length) return null;
  return <section className="mt-16"><h2 className="mb-4 text-2xl font-bold">Recently viewed</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map(i => <Link key={i.slug} href={`/product/${i.slug}`}><div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-alt"><Image src={i.image} alt={i.name} fill sizes="25vw" className="object-cover" /></div><div className="mt-2 text-sm">{i.name}</div><div className="text-sm font-semibold">${i.price}</div></Link>)}</div></section>;
}
