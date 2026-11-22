import { handler, ok } from "@/lib/api";
import Product from "@/models/Product";
export const GET = handler(async (req) => {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 2) return ok({ products: [] });
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const products = await Product.find({ isActive: true, $or: [{ name: rx }, { brand: rx }] }).select("name slug images price discountPrice").limit(6).lean();
  return ok({ products });
}, { limit: 60 });
