"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { api, useStore } from "@/context/StoreContext";
export default function ReviewForm({ productId }: { productId: string }) {
  const { user } = useStore(), router = useRouter(); const [rating, setRating] = useState(5), [comment, setComment] = useState(""), [busy, setBusy] = useState(false);
  if (!user) return <p className="mt-6 text-sm text-muted">Log in to write a review.</p>;
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); try { toast.success((await api("/api/reviews", "POST", { productId, rating, comment })).message); setComment(""); router.refresh(); } catch (er: any) { toast.error(er.message); } setBusy(false); };
  return <form onSubmit={submit} className="mt-6 max-w-3xl space-y-3 rounded-3xl bg-bg-alt p-5"><h3 className="font-semibold">Write a review</h3>
    <div className="flex gap-1">{[1, 2, 3, 4, 5].map(n => <button type="button" key={n} aria-label={`${n} stars`} onClick={() => setRating(n)}><Star className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} /></button>)}</div>
    <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={1000} rows={3} placeholder="Share your experience" className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none" />
    <button disabled={busy} className="rounded-full bg-primary px-6 py-2.5 text-white disabled:opacity-60">{busy ? "Sending…" : "Submit review"}</button></form>;
}
