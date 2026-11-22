"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api, useStore } from "@/context/StoreContext";
export default function ProfileForms() {
  const { user, refresh } = useStore(); const [p, setP] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" }), [pw, setPw] = useState({ current: "", password: "" });
  const cls = "w-full rounded-xl bg-bg-alt px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2", run = async (fn: () => Promise<any>, msg: string) => { try { await fn(); toast.success(msg); } catch (e: any) { toast.error(e.message); } };
  if (!user) return <div className="py-10 text-center text-muted">Loading…</div>;
  return <div className="grid gap-8 md:grid-cols-2">
    <form onSubmit={e => { e.preventDefault(); run(async () => { await api("/api/auth/me", "PATCH", p); await refresh(); }, "Profile saved"); }} className="space-y-3 rounded-3xl bg-bg-alt p-6"><h2 className="font-semibold">Profile</h2>
      <input className={cls} value={user.email} disabled /><input required className={cls} value={p.name} onChange={e => setP({ ...p, name: e.target.value })} placeholder="Name" /><input className={cls} value={p.phone} onChange={e => setP({ ...p, phone: e.target.value })} placeholder="Phone" /><button className="rounded-full bg-primary px-6 py-2.5 text-white">Save</button></form>
    <form onSubmit={e => { e.preventDefault(); run(async () => { await api("/api/auth/change-password", "POST", pw); setPw({ current: "", password: "" }); }, "Password changed"); }} className="space-y-3 rounded-3xl bg-bg-alt p-6"><h2 className="font-semibold">Change password</h2>
      <input required type="password" className={cls} value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} placeholder="Current password" /><input required minLength={8} type="password" className={cls} value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })} placeholder="New password (min 8)" /><button className="rounded-full bg-primary px-6 py-2.5 text-white">Update</button></form>
    <div className="flex gap-3 md:col-span-2"><Link href="/orders" className="rounded-full bg-ink px-6 py-2.5 text-white">My orders</Link><Link href="/wishlist" className="rounded-full bg-bg-alt px-6 py-2.5">Wishlist</Link></div></div>;
}
