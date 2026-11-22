import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product"; import Review from "@/models/Review";
import ReviewForm from "@/components/ReviewForm";
import ProductView from "@/components/ProductView"; import ProductGrid from "@/components/ProductGrid"; import RecentlyViewed from "@/components/RecentlyViewed";
import type { P } from "@/lib/products";
const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const load = async (slug: string) => { await connectDB(); return Product.findOne({ slug, isActive: true }).lean<any>(); };
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await load((await params).slug); if (!p) return { title: "Product not found" };
  return { title: p.name, description: p.description.slice(0, 155), openGraph: { title: p.name, description: p.description.slice(0, 155), images: p.images.slice(0, 1) } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const raw = await load((await params).slug); if (!raw) notFound();
  const p = plain(raw) as P & { description: string; sku: string; category: string };
  const [related, reviews] = await Promise.all([
    Product.find({ category: raw.category, _id: { $ne: raw._id }, isActive: true }).limit(4).lean(),
    Review.find({ product: raw._id, approved: true }).sort({ createdAt: -1 }).limit(20).populate("user", "name").lean<any[]>(),
  ]);
  return <div className="mx-auto max-w-7xl px-4 py-10">
    <ProductView p={p} />
    <section className="mt-12 max-w-3xl"><h2 className="mb-2 text-xl font-bold">Description</h2><p className="text-muted">{p.description}</p><p className="mt-3 text-xs text-muted">SKU: {p.sku}</p></section>
    <section className="mt-12 max-w-3xl"><h2 className="mb-4 text-xl font-bold">Reviews ({reviews.length})</h2>
      {!reviews.length ? <p className="text-muted">No reviews yet.</p> : <ul className="space-y-4">{reviews.map(r => <li key={String(r._id)} className="rounded-2xl bg-bg-alt p-4"><div className="flex items-center gap-2 text-sm"><b>{r.user?.name ?? "Customer"}</b><span className="flex">{Array.from({ length: r.rating }, (_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}</span></div><p className="mt-1 text-sm text-muted">{r.comment}</p></li>)}</ul>}</section>
    <ReviewForm productId={String(p._id)} />
    {related.length > 0 && <section className="mt-16"><h2 className="mb-4 text-2xl font-bold">Related products</h2><ProductGrid products={plain(related) as unknown as P[]} /></section>}
    <RecentlyViewed exclude={p.slug} />
  </div>;
}
