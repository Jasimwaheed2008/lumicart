import { Suspense } from "react";
import { getCategories, getProducts, type Kind, type Q } from "@/lib/products";
import ProductGrid from "./ProductGrid"; import Pagination from "./Pagination"; import ShopFilters from "./ShopFilters";
export default async function Listing({ title, subtitle, base, sp, kind }: { title: string; subtitle?: string; base: string; sp: Q; kind?: Kind }) {
  const [cats, { products, pages, page, total }] = await Promise.all([getCategories(), getProducts(sp, kind)]);
  return <div className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold tracking-tight">{sp.q ? `Results for “${sp.q}”` : title}</h1>
    <p className="mb-8 mt-1 text-muted">{subtitle ?? `${total} products`}</p>
    <Suspense><ShopFilters categories={cats} /></Suspense>
    <ProductGrid products={products} />
    <Pagination page={page} pages={pages} base={base} params={{ q: sp.q, category: sp.category, min: sp.min, max: sp.max, sort: sp.sort }} />
  </div>;
}
