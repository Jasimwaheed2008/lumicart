import { z } from "zod";
import { handler, ok, fail, body } from "@/lib/api";
import { checkCoupon } from "@/lib/coupon";
export const POST = handler(async (req) => {
  const d = z.object({ code: z.string().min(1).max(30), subtotal: z.number().min(0) }).parse(await body(req));
  try { const { coupon, discount } = await checkCoupon(d.code, d.subtotal); return ok({ code: coupon.code, discount }); }
  catch (e: any) { return fail(e.message, 400); }
}, { limit: 20 });
