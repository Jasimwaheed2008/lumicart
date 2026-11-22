import { handler, ok } from "@/lib/api";
import Order from "@/models/Order";
export const GET = handler(async () => ok({ items: await Order.find().sort({ createdAt: -1 }).limit(300).populate("user", "name email").lean() }), { auth: "admin" });
