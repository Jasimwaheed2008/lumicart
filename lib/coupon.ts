import Coupon from "@/models/Coupon";
import { couponDiscount } from "./pricing";
export async function checkCoupon(code: string, subtotal: number) {
  const c = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
  if (!c) throw new Error("Invalid coupon code");
  if (c.expiresAt && c.expiresAt < new Date()) throw new Error("This coupon has expired");
  if (c.maxUses != null && c.used >= c.maxUses) throw new Error("This coupon has reached its usage limit");
  if (subtotal < c.minOrder) throw new Error(`Minimum order for this coupon is $${c.minOrder}`);
  return { coupon: c, discount: couponDiscount(c, subtotal) };
}
