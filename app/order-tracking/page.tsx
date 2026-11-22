"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Tracking() {
  const [n, setN] = useState(""); const router = useRouter();
  return <div className="mx-auto max-w-md px-4 py-20 text-center"><h1 className="text-3xl font-bold">Track your order</h1><p className="mt-2 text-muted">Enter your order number (you must be logged in).</p>
    <form onSubmit={e => { e.preventDefault(); const v = n.trim().toUpperCase(); if (/^[A-Z0-9-]+$/.test(v)) router.push(`/order/${v}`); }} className="mt-6 flex gap-2"><input value={n} onChange={e => setN(e.target.value)} placeholder="ORD-XXXXXX" className="flex-1 rounded-full bg-bg-alt px-5 py-3 outline-none" /><button className="rounded-full bg-primary px-6 text-white">Track</button></form></div>;
}
