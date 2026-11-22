import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db"; import Product from "@/models/Product";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/shop", "/categories", "/new-arrivals", "/best-sellers", "/sale", "/about", "/contact", "/faq", "/privacy", "/terms"].map(p => ({ url: base + p }));
  try { await connectDB(); const ps = await Product.find({ isActive: true }).select("slug updatedAt").lean<any[]>(); return [...pages, ...ps.map(p => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt }))]; } catch { return pages; }
}
