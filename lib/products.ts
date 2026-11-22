import { connectDB } from "./db";
import Product from "@/models/Product";
import Category from "@/models/Category";
export type P = { _id: string; name: string; slug: string; images: string[]; price: number; discountPrice?: number; stock: number; rating: number; numReviews: number; brand?: string; variants?: { name: string; options: string[] }[] };
export type Q = { q?: string; category?: string; min?: string; max?: string; sort?: string; page?: string };
export type Kind = "new" | "best" | "sale" | "featured";
const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const eff = { $ifNull: ["$discountPrice", "$price"] };
export async function getProducts(sp: Q = {}, kind?: Kind, limit = 12) {
  await connectDB();
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const match: any = { isActive: true };
  if (sp.q) { const rx = new RegExp(esc(sp.q.slice(0, 60)), "i"); match.$or = [{ name: rx }, { brand: rx }]; }
  if (sp.category) {
    const c: any = await Category.findOne({ slug: sp.category }).select("_id").lean();
    if (!c) return { products: [] as P[], total: 0, pages: 0, page };
    match.category = c._id;
  }
  const min = parseFloat(sp.min ?? ""), max = parseFloat(sp.max ?? "");
  const range: any[] = [];
  if (!isNaN(min)) range.push({ $gte: [eff, min] });
  if (!isNaN(max)) range.push({ $lte: [eff, max] });
  if (range.length) match.$expr = { $and: range };
  if (kind === "sale") match.discountPrice = { $gt: 0 };
  if (kind === "featured") match.featured = true;
  const sorts: Record<string, any> = { popular: { sold: -1 }, "price-asc": { eff: 1 }, "price-desc": { eff: -1 }, newest: { createdAt: -1 } };
  const sort = sorts[sp.sort ?? ""] ?? (kind === "best" ? sorts.popular : sorts.newest);
  const [products, total] = await Promise.all([
    Product.aggregate([{ $match: match }, { $addFields: { eff } }, { $sort: { ...sort, _id: 1 } }, { $skip: (page - 1) * limit }, { $limit: limit }]),
    Product.countDocuments(match),
  ]);
  return { products: plain(products) as P[], total, pages: Math.ceil(total / limit), page };
}
export async function getCategories() {
  await connectDB();
  return plain(await Category.find({ isActive: true }).sort({ name: 1 }).lean()) as unknown as { _id: string; name: string; slug: string; image?: string }[];
}
