import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { getSession } from "@/lib/auth"; import { connectDB } from "@/lib/db"; import Order from "@/models/Order";
export const metadata = { title: "Order details" };
const steps = ["pending", "processing", "shipped", "delivered"];
export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params; const s = await getSession(); if (!s) redirect(`/login?next=/order/${number}`);
  await connectDB();
  const o = await Order.findOne({ orderNumber: number, ...(s.role === "admin" ? {} : { user: s.sub }) }).lean<any>(); if (!o) notFound();
  const at = steps.indexOf(o.status), a = o.shippingAddress;
  return <div className="mx-auto max-w-3xl px-4 py-10">
    <div className="rounded-3xl bg-bg-alt p-8 text-center"><CheckCircle2 className="mx-auto text-accent" size={40} /><h1 className="mt-3 text-2xl font-bold">Order {o.orderNumber}</h1><p className="mt-1 text-muted">Placed {new Date(o.createdAt).toLocaleString()} · Payment: {o.paymentMethod === "cod" ? "Cash on Delivery" : o.paymentMethod} ({o.paymentStatus})</p></div>
    {o.status === "cancelled" ? <p className="mt-8 text-center font-medium text-red-500">This order was cancelled.</p> :
      <ol className="mt-8 grid grid-cols-4 gap-2 text-center text-xs">{steps.map((st, i) => <li key={st} className={i <= at ? "text-primary" : "text-muted"}>{i <= at ? <CheckCircle2 className="mx-auto" /> : <Circle className="mx-auto" />}<div className="mt-1 capitalize">{st}</div></li>)}</ol>}
    <section className="mt-8"><h2 className="mb-3 font-semibold">Items</h2><ul className="divide-y divide-slate-100">{o.items.map((i: any, k: number) => <li key={k} className="flex justify-between py-3 text-sm"><span>{i.name} × {i.quantity}{i.variant && Object.keys(i.variant).length ? ` (${Object.values(i.variant).join(", ")})` : ""}</span><span>${(i.price * i.quantity).toFixed(2)}</span></li>)}</ul>
      <div className="mt-3 space-y-1 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>${o.subtotal.toFixed(2)}</span></div>{o.discount > 0 && <div className="flex justify-between text-accent"><span>Discount ({o.couponCode})</span><span>-${o.discount.toFixed(2)}</span></div>}<div className="flex justify-between"><span>Shipping</span><span>${o.shippingCost.toFixed(2)}</span></div><div className="flex justify-between text-lg font-bold"><span>Total</span><span>${o.total.toFixed(2)}</span></div></div></section>
    <section className="mt-8 text-sm"><h2 className="mb-2 font-semibold">Shipping to</h2><p className="text-muted">{a.fullName}, {a.phone}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city} {a.postalCode}, {a.country}</p></section>
    <section className="mt-8"><h2 className="mb-3 font-semibold">Tracking history</h2><ul className="space-y-2 text-sm">{[...o.tracking].reverse().map((t: any, k: number) => <li key={k} className="rounded-xl bg-bg-alt p-3"><b className="capitalize">{t.status}</b> — {t.note} <span className="text-xs text-muted">({new Date(t.at).toLocaleString()})</span></li>)}</ul></section></div>;
}
