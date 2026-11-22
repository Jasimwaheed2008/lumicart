"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/context/StoreContext";
export default function AdminDashboard() {
  const [s, setS] = useState<any>(null), [err, setErr] = useState("");
  useEffect(() => { api("/api/admin/stats").then(setS).catch(e => setErr(e.message)); }, []);
  if (err) return <p className="text-red-500">{err}</p>; if (!s) return <p className="text-muted">Loading…</p>;
  const cards = [["Revenue", `$${s.revenue.toFixed(2)}`], ["Orders", s.orders], ["Customers", s.customers], ["Products", s.products]];
  return <div className="space-y-8"><h1 className="text-2xl font-bold">Dashboard</h1>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([l, v]) => <div key={l} className="rounded-3xl bg-bg-alt p-5"><div className="text-sm text-muted">{l}</div><div className="mt-1 text-2xl font-bold">{v}</div></div>)}</div>
    <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl p-4 ring-1 ring-slate-100"><h2 className="mb-3 font-semibold">Revenue — last 14 days</h2><div className="h-64">{s.byDay.length ? <ResponsiveContainer><LineChart data={s.byDay}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer> : <p className="pt-20 text-center text-muted">No orders yet.</p>}</div></div>
      <div className="rounded-3xl p-4 ring-1 ring-slate-100"><h2 className="mb-3 font-semibold">Orders by status</h2><div className="h-64">{s.byStatus.length ? <ResponsiveContainer><BarChart data={s.byStatus}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="status" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#14B8A6" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="pt-20 text-center text-muted">No orders yet.</p>}</div></div></div>
    <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl bg-bg-alt p-5"><h2 className="mb-2 font-semibold">Low stock</h2>{s.low.length ? s.low.map((p: any) => <div key={p._id} className="flex justify-between py-1 text-sm"><span>{p.name}</span><b className="text-red-500">{p.stock}</b></div>) : <p className="text-sm text-muted">All products well stocked.</p>}</div>
      <div className="rounded-3xl bg-bg-alt p-5"><h2 className="mb-2 font-semibold">Top sellers</h2>{s.top.map((p: any) => <div key={p._id} className="flex justify-between py-1 text-sm"><span>{p.name}</span><b>{p.sold} sold</b></div>)}</div></div></div>;
}
