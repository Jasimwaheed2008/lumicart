"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, useStore } from "@/context/StoreContext";
import { SHIPPING, couponDiscount, round2, shippingCost, type ShipMethod } from "@/lib/pricing";
const field = "w-full rounded-xl bg-bg-alt px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2";
export default function Checkout() {
  const { user, ready, items, subtotal, refresh } = useStore(); const router = useRouter();
  const [f, setF] = useState({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "" });
  const [ship, setShip] = useState<ShipMethod>("standard"), [pay, setPay] = useState("cod"), [code, setCode] = useState(""), [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null), [busy, setBusy] = useState(false);
  useEffect(() => { if (ready && !user) router.replace("/login?next=/checkout"); }, [ready, user, router]);
  useEffect(() => { if (user) setF(x => ({ ...x, fullName: x.fullName || user.name })); }, [user]);
  if (!ready || !user) return <div className="py-24 text-center text-muted">Loading…</div>;
  if (!items.length) return <div className="py-24 text-center"><p className="text-muted">Your cart is empty.</p><Link href="/shop" className="mt-4 inline-block text-primary">Continue shopping</Link></div>;
  const discount = coupon?.discount ?? 0, shipping = shippingCost(ship, subtotal), total = round2(subtotal - discount + shipping);
  const apply = async () => { try { const r = await api("/api/coupons/validate", "POST", { code, subtotal }); setCoupon(r); toast.success("Coupon applied"); } catch (e: any) { setCoupon(null); toast.error(e.message); } };
  const place = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { const r = await api("/api/orders", "POST", { address: f, shippingMethod: ship, paymentMethod: pay, couponCode: coupon?.code }); await refresh(); router.push(`/order/${r.orderNumber}`); }
    catch (err: any) { toast.error(err.message); setBusy(false); }
  };
  const inp = (k: keyof typeof f, label: string, req = true) => <input required={req} placeholder={label + (req ? "" : " (optional)")} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} className={field} />;
  return <form onSubmit={place} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
    <div className="space-y-8">
      <section><h2 className="mb-4 text-xl font-bold">Shipping address</h2><div className="grid gap-3 sm:grid-cols-2">{inp("fullName", "Full name")}{inp("phone", "Phone")}<div className="sm:col-span-2">{inp("line1", "Address line 1")}</div><div className="sm:col-span-2">{inp("line2", "Address line 2", false)}</div>{inp("city", "City")}{inp("state", "State / Province", false)}{inp("postalCode", "Postal code", false)}{inp("country", "Country")}</div></section>
      <section><h2 className="mb-4 text-xl font-bold">Shipping method</h2><div className="space-y-2">{(Object.keys(SHIPPING) as ShipMethod[]).map(m => <label key={m} className={`flex cursor-pointer justify-between rounded-2xl p-4 ring-1 ${ship === m ? "bg-blue-50 ring-primary" : "ring-slate-200"}`}><span><input type="radio" className="mr-3" checked={ship === m} onChange={() => setShip(m)} />{SHIPPING[m].label}</span><b>{shippingCost(m, subtotal) === 0 ? "Free" : `$${shippingCost(m, subtotal)}`}</b></label>)}</div></section>
      <section><h2 className="mb-4 text-xl font-bold">Payment</h2><div className="space-y-2">
        <label className={`flex cursor-pointer gap-3 rounded-2xl p-4 ring-1 ${pay === "cod" ? "bg-blue-50 ring-primary" : "ring-slate-200"}`}><input type="radio" checked={pay === "cod"} onChange={() => setPay("cod")} />Cash on Delivery</label>
        <label className="flex gap-3 rounded-2xl p-4 text-muted ring-1 ring-slate-200 opacity-60"><input type="radio" disabled />Card payment — coming soon</label></div></section>
    </div>
    <aside className="h-fit space-y-3 rounded-3xl bg-bg-alt p-6"><h2 className="text-lg font-semibold">Order summary</h2>
      <ul className="space-y-1 text-sm">{items.map(i => <li key={i.productId + JSON.stringify(i.variant)} className="flex justify-between"><span className="truncate pr-2">{i.name} × {i.quantity}</span><span>${(i.price * i.quantity).toFixed(2)}</span></li>)}</ul>
      <div className="flex gap-2 pt-2"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Coupon code" className={field} /><button type="button" onClick={apply} className="rounded-xl bg-ink px-4 text-sm text-white">Apply</button></div>
      <div className="space-y-1 border-t border-slate-200 pt-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        {discount > 0 && <div className="flex justify-between text-accent"><span>Discount ({coupon?.code})</span><span>-${discount.toFixed(2)}</span></div>}
        <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `$${shipping}` : "Free"}</span></div>
        <div className="flex justify-between pt-2 text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div></div>
      <button disabled={busy} className="mt-2 w-full rounded-full bg-primary py-3 font-medium text-white transition active:scale-95 disabled:opacity-60">{busy ? "Placing order…" : "Place order"}</button>
      <p className="text-center text-xs text-muted">Final prices are confirmed by the server.</p></aside></form>;
}
