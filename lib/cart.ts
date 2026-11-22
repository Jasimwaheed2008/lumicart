import Cart from "@/models/Cart";
export const vkey = (v: any) => JSON.stringify(v instanceof Map ? Object.fromEntries(v) : v ?? {});
export async function loadCart(userId: string) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product", "name slug images price discountPrice stock isActive");
  return cart;
}
export function serializeCart(cart: any) {
  if (!cart) return [];
  return cart.toObject({ flattenMaps: true }).items
    .filter((i: any) => i.product && i.product.isActive !== false)
    .map((i: any) => ({ productId: String(i.product._id), name: i.product.name, slug: i.product.slug, image: i.product.images?.[0] ?? "",
      price: i.product.discountPrice ?? i.product.price, stock: i.product.stock, quantity: Math.min(i.quantity, i.product.stock || i.quantity), variant: i.variant ?? {} }));
}
