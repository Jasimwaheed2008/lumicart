import Link from "next/link";
import { getCategories } from "@/lib/products";
import Reveal from "@/components/Reveal";
export const metadata = { title: "Categories" };
export const dynamic = "force-dynamic";
export default async function Page() {
  const cats = await getCategories();
  return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="mb-8 text-3xl font-bold">Categories</h1>
    {!cats.length ? <div className="rounded-3xl bg-bg-alt py-16 text-center text-muted">No categories yet.</div> :
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cats.map((c, i) => <Reveal key={c._id} delay={i * 0.05}><Link href={`/shop?category=${c.slug}`} className="block rounded-3xl bg-bg-alt p-10 text-xl font-semibold shadow-soft transition hover:-translate-y-1 hover:bg-primary hover:text-white">{c.name}</Link></Reveal>)}</div>}</div>;
}
