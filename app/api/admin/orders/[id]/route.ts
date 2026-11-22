import { z } from "zod";
import { handler, ok, fail, body } from "@/lib/api";
import Order from "@/models/Order"; import Product from "@/models/Product";
export const PATCH = handler(async (req) => {
  const id = new URL(req.url).pathname.split("/")[4];
  const { status, note } = z.object({ status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]), note: z.string().max(200).optional() }).parse(await body(req));
  const o = await Order.findById(id); if (!o) return fail("Order not found", 404);
  if (o.status === "cancelled") return fail("Cancelled orders cannot be changed", 409);
  if (o.status === status) return ok({ item: o });
  if (status === "cancelled") for (const i of o.items) await Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity, sold: -i.quantity } });
  o.status = status; o.tracking.push({ status, note: note || `Status updated to ${status}` });
  if (status === "delivered" && o.paymentMethod === "cod") o.paymentStatus = "paid"; // cash collected on delivery
  await o.save(); return ok({ item: o });
}, { auth: "admin" });
