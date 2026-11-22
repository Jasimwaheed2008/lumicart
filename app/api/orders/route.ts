import { z } from "zod";
import { handler, ok, fail, body, uid } from "@/lib/api";
import { loadCart } from "@/lib/cart";
import { checkCoupon } from "@/lib/coupon";
import { round2, shippingCost } from "@/lib/pricing";
import Order from "@/models/Order"; import Product from "@/models/Product"; import Cart from "@/models/Cart"; import Coupon from "@/models/Coupon"; import Address from "@/models/Address";
const s = (n: number) => z.string().trim().min(1, "Required").max(n);
const schema = z.object({
  address: z.object({ fullName: s(80), phone: s(30), line1: s(150), line2: z.string().trim().max(150).optional(), city: s(60), state: z.string().trim().max(60).optional(), postalCode: z.string().trim().max(20).optional(), country: s(60) }),
  shippingMethod: z.enum(["standard", "express"]), paymentMethod: z.enum(["cod", "stripe"]), couponCode: z.string().max(30).optional(),
});
export const GET = handler(async () => ok({ orders: await Order.find({ user: await uid() }).sort({ createdAt: -1 }).select("orderNumber total status createdAt items").lean() }), { auth: "user" });
export const POST = handler(async (req) => {
  const d = schema.parse(await body(req)); const user = await uid();
  if (d.paymentMethod !== "cod") return fail("Online payments are not enabled yet. Please choose Cash on Delivery.", 501);
  const cart = await loadCart(user);
  const lines = (cart?.items ?? []).filter((i: any) => i.product?.isActive !== false && i.product);
  if (!lines.length) return fail("Your cart is empty", 400);
  // Prices always come from the database, never from the client.
  const items = lines.map((i: any) => ({ product: i.product._id, name: i.product.name, image: i.product.images?.[0], price: i.product.discountPrice ?? i.product.price, quantity: i.quantity, variant: i.variant }));
  const subtotal = round2(items.reduce((n: number, i: any) => n + i.price * i.quantity, 0));
  let discount = 0, coupon: any = null;
  if (d.couponCode) { try { ({ coupon, discount } = await checkCoupon(d.couponCode, subtotal)); } catch (e: any) { return fail(e.message, 400); } }
  const shipping = shippingCost(d.shippingMethod, subtotal), total = round2(subtotal - discount + shipping);
  const taken: any[] = [];
  for (const i of items) { // atomic per-item stock reservation with manual rollback
    const r = await Product.updateOne({ _id: i.product, stock: { $gte: i.quantity } }, { $inc: { stock: -i.quantity, sold: i.quantity } });
    if (!r.modifiedCount) { for (const t of taken) await Product.updateOne({ _id: t.product }, { $inc: { stock: t.quantity, sold: -t.quantity } }); return fail(`“${i.name}” is out of stock or has limited stock`, 409); }
    taken.push(i);
  }
  if (coupon) {
    const r = await Coupon.updateOne({ _id: coupon._id, ...(coupon.maxUses != null ? { used: { $lt: coupon.maxUses } } : {}) }, { $inc: { used: 1 } });
    if (!r.modifiedCount) { for (const t of taken) await Product.updateOne({ _id: t.product }, { $inc: { stock: t.quantity, sold: -t.quantity } }); return fail("This coupon is no longer available", 409); }
  }
  const order = await Order.create({ orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36 ** 2).toString(36).toUpperCase().padStart(2, "0")}`,
    user, items, shippingAddress: d.address, shippingMethod: d.shippingMethod, subtotal, discount, shippingCost: shipping, total, couponCode: coupon?.code,
    paymentMethod: "cod", paymentStatus: "pending", status: "pending", tracking: [{ status: "pending", note: "Order placed" }] });
  await Cart.updateOne({ user }, { $set: { items: [] } });
  if (!(await Address.exists({ user }))) await Address.create({ user, ...d.address, country: d.address.country, isDefault: true });
  return ok({ orderNumber: order.orderNumber }, 201);
}, { auth: "user", limit: 10 });
