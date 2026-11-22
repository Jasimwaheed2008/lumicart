import { handler, ok } from "@/lib/api";
import Product from "@/models/Product";
export const GET = handler(async (req) => {
  const slugs = (new URL(req.url).searchParams.get("slugs") ?? "").split(",").filter(s => /^[a-z0-9-]+$/.test(s)).slice(0, 3);
  const products = await Product.find({ slug: { $in: slugs }, isActive: true }).populate("category", "name").lean();
  return ok({ products });
});
