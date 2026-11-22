"use client";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/context/StoreContext";
export default function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", subject: "", message: "" }), [busy, setBusy] = useState(false); const cls = "w-full rounded-xl bg-bg-alt px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2";
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); try { toast.success((await api("/api/contact", "POST", v)).message); setV({ name: "", email: "", subject: "", message: "" }); } catch (er: any) { toast.error(er.message); } setBusy(false); };
  return <form onSubmit={submit} className="space-y-3"><input required placeholder="Name" className={cls} value={v.name} onChange={e => setV({ ...v, name: e.target.value })} /><input required type="email" placeholder="Email" className={cls} value={v.email} onChange={e => setV({ ...v, email: e.target.value })} /><input required placeholder="Subject" className={cls} value={v.subject} onChange={e => setV({ ...v, subject: e.target.value })} /><textarea required rows={5} placeholder="Message" className={cls} value={v.message} onChange={e => setV({ ...v, message: e.target.value })} /><button disabled={busy} className="rounded-full bg-primary px-7 py-3 font-medium text-white disabled:opacity-60">{busy ? "Sending…" : "Send message"}</button></form>;
}
