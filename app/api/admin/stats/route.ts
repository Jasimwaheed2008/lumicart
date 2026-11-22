import { handler, ok } from "@/lib/api";
import Order from "@/models/Order"; import User from "@/models/User"; import Product from "@/models/Product";
export const GET = handler(async () => {
  const since = new Date(Date.now() - 14 * 864e5); const live = { status: { $ne: "cancelled" } };
  const [rev, orders, customers, products, byDay, byStatus, low, top] = await Promise.all([
    Order.aggregate([{ $match: live }, { $group: { _id: null, revenue: { $sum: "$total" } } }]), Order.countDocuments(), User.countDocuments({ role: "customer" }), Product.countDocuments(),
    Order.aggregate([{ $match: { ...live, createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } }, revenue: { $sum: "$total" } } }, { $sort: { _id: 1 } }]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(8).select("name stock sku").lean(), Product.find().sort({ sold: -1 }).limit(5).select("name sold").lean(),
  ]);
  return ok({ revenue: rev[0]?.revenue ?? 0, orders, customers, products, byDay: byDay.map(d => ({ day: d._id, revenue: d.revenue })), byStatus: byStatus.map(s => ({ status: s._id, count: s.count })), low, top });
}, { auth: "admin" });
