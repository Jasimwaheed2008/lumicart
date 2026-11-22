import { handler, ok, body, uid } from "@/lib/api";
import { wishlistSchema } from "@/lib/validators";
import Wishlist from "@/models/Wishlist";
export const GET = handler(async () => {
  const w = await Wishlist.findOne({ user: await uid() }).populate("products", "name slug images price discountPrice stock rating numReviews brand variants");
  return ok({ products: w?.products ?? [] });
}, { auth: "user" });
export const POST = handler(async (req) => { // toggle
  const { productId } = wishlistSchema.parse(await body(req)); const u = await uid();
  const w = (await Wishlist.findOne({ user: u })) ?? new Wishlist({ user: u, products: [] });
  const i = w.products.findIndex((p: any) => String(p) === productId);
  if (i >= 0) w.products.splice(i, 1); else w.products.push(productId);
  await w.save();
  return ok({ ids: w.products.map(String), added: i < 0 });
}, { auth: "user" });
