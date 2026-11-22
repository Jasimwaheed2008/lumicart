"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/context/StoreContext";
const ST = ["pending", "processing", "shipped", "delivered", "cancelled"];
export default function Page() {
  const [items, setItems] = useState<any[] | null>(null);
  useEffect(() => { api("/api/admin/orders").then(d => setItems(d.items)).catch(e => toast.error(e.message)); }, []);
  const change = async (o: any, status: string) => { try { const r = await api(`/api/admin/orders/${o._id}`, "PATCH", { status }); setItems(items!.map(x => (x._id === o._id ? { ...x, status: r.item.status, paymentStatus: r.item.paymentStatus } : x))); toast.success("Order updated"); } catch (e: any) { toast.error(e.message); } };
  return <div><h1 className="mb-5 text-2xl font-bold">Orders</h1><div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100"><table className="w-full text-left text-sm"><thead className="bg-bg-alt text-muted"><tr>{["Order", "Customer", "Total", "Payment", "Status"].map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
    <tbody>{!items ? <tr><td className="p-6 text-muted" colSpan={5}>Loading…</td></tr> : !items.length ? <tr><td className="p-6 text-muted" colSpan={5}>No orders yet.</td></tr> : items.map(o => <tr key={o._id} className="border-t border-slate-100"><td className="p-3 font-medium">{o.orderNumber}</td><td className="p-3">{o.user?.name}<div className="text-xs text-muted">{o.user?.email}</div></td><td className="p-3">${o.total.toFixed(2)}</td><td className="p-3">{o.paymentMethod.toUpperCase()} · {o.paymentStatus}</td>
      <td className="p-3"><select disabled={o.status === "cancelled"} value={o.status} onChange={e => change(o, e.target.value)} className="rounded-lg bg-bg-alt px-2 py-1">{ST.map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></div>;
}
