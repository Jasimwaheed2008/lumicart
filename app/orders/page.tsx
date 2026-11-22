import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth"; import { connectDB } from "@/lib/db"; import Order from "@/models/Order";
export const metadata = { title: "My orders" };
export default async function Page() {
  const s = await getSession(); if (!s) redirect("/login?next=/orders");
  await connectDB(); const orders = await Order.find({ user: s.sub }).sort({ createdAt: -1 }).lean<any[]>();
  return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="mb-6 text-3xl font-bold">My orders</h1>
    {!orders.length ? <div className="rounded-3xl bg-bg-alt py-16 text-center text-muted">No orders yet. <Link href="/shop" className="text-primary">Start shopping</Link></div> :
      <ul className="space-y-3">{orders.map(o => <li key={o.orderNumber}><Link href={`/order/${o.orderNumber}`} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-0.5">
        <div><div className="font-semibold">{o.orderNumber}</div><div className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</div></div>
        <div className="text-right"><div className="font-semibold">${o.total.toFixed(2)}</div><div className="text-xs capitalize text-accent">{o.status}</div></div></Link></li>)}</ul>}</div>;
}
