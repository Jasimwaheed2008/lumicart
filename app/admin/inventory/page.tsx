"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/context/StoreContext";
export default function Page() {
  const [items, setItems] = useState<any[] | null>(null);
  useEffect(() => { api("/api/admin/products").then(d => setItems(d.items)).catch(e => toast.error(e.message)); }, []);
  const save = async (p: any, v: string) => { const stock = Number(v); if (v === "" || isNaN(stock) || stock < 0 || stock === p.stock) return; try { await api(`/api/admin/products/${p._id}`, "PATCH", { stock }); setItems(items!.map(x => (x._id === p._id ? { ...x, stock } : x))); toast.success("Stock updated"); } catch (e: any) { toast.error(e.message); } };
  return <div><h1 className="mb-1 text-2xl font-bold">Inventory</h1><p className="mb-5 text-sm text-muted">Edit a quantity and click away to save.</p><div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100"><table className="w-full text-left text-sm"><thead className="bg-bg-alt text-muted"><tr><th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Sold</th><th className="p-3">Stock</th></tr></thead>
    <tbody>{!items ? <tr><td className="p-6 text-muted" colSpan={4}>Loading…</td></tr> : items.map(p => <tr key={p._id} className="border-t border-slate-100"><td className="p-3">{p.name}</td><td className="p-3">{p.sku}</td><td className="p-3">{p.sold}</td><td className="p-3"><input key={p.stock} type="number" min={0} defaultValue={p.stock} onBlur={e => save(p, e.target.value)} className={`w-24 rounded-lg px-2 py-1 ${p.stock <= 5 ? "bg-red-50 text-red-600" : "bg-bg-alt"}`} /></td></tr>)}</tbody></table></div></div>;
}
