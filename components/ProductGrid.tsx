import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { P } from "@/lib/products";
export default function ProductGrid({ products }: { products: P[] }) {
  if (!products.length) return <div className="rounded-3xl bg-bg-alt py-16 text-center text-muted">No products found.</div>;
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.map((p, i) => <Reveal key={p._id} delay={(i % 4) * 0.06}><ProductCard p={p} /></Reveal>)}</div>;
}
