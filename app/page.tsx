import Link from "next/link";
import Hero from "@/components/Hero"; import Section from "@/components/Section"; import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal"; import Newsletter from "@/components/Newsletter";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import { getCategories, getProducts } from "@/lib/products";
const reviews = [["Aisha K.", "Fast delivery and the quality is exactly as shown. Will order again."], ["Daniel R.", "Smooth checkout and great customer support."], ["Sara M.", "Beautiful products at fair prices. My new favourite store."]]; // sample copy: replace with real reviews
export const dynamic = "force-dynamic";
export default async function Home() {
  await connectDB();
  const banners: any[] = JSON.parse(JSON.stringify(await Banner.find({ isActive: true }).sort({ order: 1 }).limit(3).lean()));
  const [cats, featured, fresh, best, sale] = await Promise.all([getCategories(), getProducts({}, "featured", 4), getProducts({ sort: "newest" }, undefined, 4), getProducts({}, "best", 4), getProducts({}, "sale", 1)]);
  return <>
    <Hero />
    {banners.length > 0 && <Section title="Offers for you"><div className="grid gap-4 md:grid-cols-3">{banners.map((b, i) => <Reveal key={b._id} delay={i * 0.08}><Link href={b.link || "/shop"} className="group relative block aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.image} alt={b.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-5 text-white"><b className="text-lg">{b.title}</b>{b.subtitle && <span className="text-sm opacity-90">{b.subtitle}</span>}</div></Link></Reveal>)}</div></Section>}
    {cats.length > 0 && <Section title="Shop by category"><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{cats.slice(0, 4).map((c, i) => <Reveal key={c._id} delay={i * 0.06}><Link href={`/shop?category=${c.slug}`} className="block rounded-3xl bg-bg-alt py-10 text-center font-semibold shadow-soft transition hover:-translate-y-1 hover:bg-primary hover:text-white">{c.name}</Link></Reveal>)}</div></Section>}
    <Section title="Trending now" href="/shop?sort=popular"><ProductGrid products={featured.products} /></Section>
    <Section title="New arrivals" href="/new-arrivals"><ProductGrid products={fresh.products} /></Section>
    {sale.total > 0 && <Reveal className="mx-auto mt-20 max-w-7xl px-4"><div className="rounded-[2rem] bg-gradient-to-r from-primary to-accent p-10 text-white md:p-16"><h2 className="text-3xl font-bold md:text-4xl">{sale.total} products on sale</h2><p className="mt-2 opacity-90">Limited-time offers on customer favourites.</p><Link href="/sale" className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-medium text-primary transition active:scale-95">See offers</Link></div></Reveal>}
    <Section title="Best sellers" href="/best-sellers"><ProductGrid products={best.products} /></Section>
    {cats.length > 1 && <Section title="Collections"><div className="grid gap-4 md:grid-cols-2">{cats.slice(0, 2).map((c, i) => <Reveal key={c._id} delay={i * 0.1}><Link href={`/shop?category=${c.slug}`} className="block rounded-3xl bg-ink p-12 text-2xl font-bold text-white shadow-soft transition hover:scale-[1.02]">Explore {c.name} →</Link></Reveal>)}</div></Section>}
    <Section title="What customers say"><div className="grid gap-4 md:grid-cols-3">{reviews.map(([n, t], i) => <Reveal key={n} delay={i * 0.08}><figure className="rounded-3xl bg-bg-alt p-6"><blockquote className="text-muted">“{t}”</blockquote><figcaption className="mt-4 font-medium">{n}</figcaption></figure></Reveal>)}</div></Section>
    <Reveal className="mx-auto mt-20 max-w-7xl px-4"><div className="flex flex-col items-center gap-5 rounded-[2rem] bg-primary p-10 text-center text-white md:p-14"><h2 className="text-3xl font-bold">Join our newsletter</h2><p className="opacity-90">Get early access to offers and new arrivals.</p><Newsletter /></div></Reveal>
  </>;
}
