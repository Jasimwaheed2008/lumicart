"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, useStore } from "@/context/StoreContext";
type Mode = "login" | "register" | "forgot" | "reset";
const copy = { login: ["Welcome back", "Login"], register: ["Create your account", "Register"], forgot: ["Forgot password", "Send reset link"], reset: ["Choose a new password", "Update password"] } as const;
export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter(), sp = useSearchParams(), { refresh } = useStore();
  const [v, setV] = useState({ name: "", email: "", password: "" }), [busy, setBusy] = useState(false);
  const next = sp.get("next"), safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      if (mode === "login" || mode === "register") {
        const r = await api(`/api/auth/${mode}`, "POST", mode === "login" ? { email: v.email, password: v.password } : v);
        await refresh(); router.push(safeNext ?? (r.user.role === "admin" ? "/admin" : "/dashboard"));
      } else if (mode === "forgot") toast.success((await api("/api/auth/forgot-password", "POST", { email: v.email })).message);
      else { await api("/api/auth/reset-password", "POST", { token: sp.get("token") ?? "", password: v.password }); toast.success("Password updated. Please log in."); router.push("/login"); }
    } catch (err: any) { toast.error(err.message); }
    setBusy(false);
  };
  const cls = "w-full rounded-xl bg-bg-alt px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2";
  return <div className="mx-auto max-w-md px-4 py-16"><h1 className="mb-6 text-3xl font-bold">{copy[mode][0]}</h1>
    <form onSubmit={submit} className="space-y-3">
      {mode === "register" && <input required placeholder="Full name" value={v.name} onChange={e => setV({ ...v, name: e.target.value })} className={cls} />}
      {mode !== "reset" && <input required type="email" placeholder="Email" value={v.email} onChange={e => setV({ ...v, email: e.target.value })} className={cls} />}
      {mode !== "forgot" && <input required type="password" minLength={mode === "login" ? 1 : 8} placeholder={mode === "login" ? "Password" : "Password (min 8 characters)"} value={v.password} onChange={e => setV({ ...v, password: e.target.value })} className={cls} />}
      <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-medium text-white transition active:scale-95 disabled:opacity-60">{busy ? "Please wait…" : copy[mode][1]}</button></form>
    <div className="mt-5 flex justify-between text-sm text-primary">
      {mode === "login" && <><Link href="/forgot-password">Forgot password?</Link><Link href="/register">Create account</Link></>}
      {mode === "register" && <Link href="/login">Already have an account?</Link>}{mode === "forgot" && <Link href="/login">Back to login</Link>}</div></div>;
}
