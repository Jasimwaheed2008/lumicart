"use client";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/context/StoreContext";
export default function Newsletter() {
  const [email, setEmail] = useState(""), [busy, setBusy] = useState(false);
  const submit = async () => { setBusy(true); try { toast.success((await api("/api/newsletter", "POST", { email })).message); setEmail(""); } catch (e: any) { toast.error(e.message); } setBusy(false); };
  return <div className="flex w-full max-w-md gap-2"><input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="you@email.com" className="flex-1 rounded-full px-5 py-3 text-ink outline-none" />
    <button disabled={busy} onClick={submit} className="rounded-full bg-ink px-6 py-3 font-medium text-white transition active:scale-95 disabled:opacity-60">{busy ? "…" : "Subscribe"}</button></div>;
}
