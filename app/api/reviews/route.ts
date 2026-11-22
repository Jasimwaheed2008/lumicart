import { z } from "zod";
import { handler, ok, fail, body, uid } from "@/lib/api";
import { clean } from "@/lib/sanitize";
import Review from "@/models/Review"; import Order from "@/models/Order"; import Product from "@/models/Product";
export const POST = handler(async (req) => {
  const d = z.object({ productId: z.string().regex(/^[a-f\d]{24}$/i), rating: z.number().int().min(1).max(5), comment: z.string().trim().max(1000).optional() }).parse(await body(req));
  const user = await uid();
  if (!(await Order.exists({ user, status: "delivered", "items.product": d.productId }))) return fail("You can review a product once your order has been delivered.", 403);
  await Review.updateOne({ product: d.productId, user }, { $set: { rating: d.rating, comment: clean(d.comment ?? ""), approved: true } }, { upsert: true });
  const [a] = await Review.aggregate([{ $match: { product: new (await import("mongoose")).Types.ObjectId(d.productId), approved: true } }, { $group: { _id: null, avg: { $avg: "$rating" }, n: { $sum: 1 } } }]);
  await Product.updateOne({ _id: d.productId }, { rating: Math.round((a?.avg ?? 0) * 10) / 10, numReviews: a?.n ?? 0 });
  return ok({ message: "Thanks for your review!" });
}, { auth: "user", limit: 10 });
