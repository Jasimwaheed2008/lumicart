import { handler, ok, fail, body, uid } from "@/lib/api";
import { cartAddSchema, cartSetSchema } from "@/lib/validators";
import { loadCart, serializeCart, vkey } from "@/lib/cart";
import Cart from "@/models/Cart"; import Product from "@/models/Product";
const respond = async (u: string) => ok({ items: serializeCart(await loadCart(u)) });
export const GET = handler(async () => respond(await uid()), { auth: "user" });
export const POST = handler(async (req) => {
  const d = cartAddSchema.parse(await body(req)); const u = await uid();
  const p = await Product.findOne({ _id: d.productId, isActive: true });
  if (!p) return fail("Product not found", 404);
  const cart = (await Cart.findOne({ user: u })) ?? new Cart({ user: u, items: [] });
  const ex = cart.items.find((i: any) => String(i.product) === d.productId && vkey(i.variant) === vkey(d.variant));
  const qty = (ex?.quantity ?? 0) + d.quantity;
  if (qty > p.stock) return fail(`Only ${p.stock} in stock`, 409);
  if (ex) ex.quantity = qty; else cart.items.push({ product: p._id, quantity: d.quantity, variant: d.variant });
  await cart.save();
  return respond(u);
}, { auth: "user" });
export const PATCH = handler(async (req) => {
  const d = cartSetSchema.parse(await body(req)); const u = await uid();
  const cart = await Cart.findOne({ user: u });
  if (!cart) return ok({ items: [] });
  const idx = cart.items.findIndex((i: any) => String(i.product) === d.productId && vkey(i.variant) === vkey(d.variant));
  if (idx >= 0) {
    if (d.quantity === 0) cart.items.splice(idx, 1);
    else {
      const p = await Product.findById(d.productId);
      if (!p || d.quantity > p.stock) return fail(`Only ${p?.stock ?? 0} in stock`, 409);
      cart.items[idx].quantity = d.quantity;
    }
    await cart.save();
  }
  return respond(u);
}, { auth: "user" });
export const DELETE = handler(async () => {
  await Cart.updateOne({ user: await uid() }, { $set: { items: [] } });
  return ok({ items: [] });
}, { auth: "user" });
