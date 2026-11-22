"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/context/StoreContext";
export type Field = { key: string; label: string; type: "text" | "number" | "textarea" | "checkbox" | "select" | "lines" | "variants" | "date"; options?: string[]; optionsFrom?: string };
export type Col = { key: string; label: string; render?: (r: any) => React.ReactNode };
const toForm = (fields: Field[], it: any) => Object.fromEntries(fields.map(f => { const v = it?.[f.key]; return [f.key,
  f.type === "checkbox" ? (it ? !!v : f.key === "isActive") : f.type === "lines" ? (v ?? []).join("\n") : f.type === "variants" ? (v ?? []).map((x: any) => `${x.name}:${x.options.join(",")}`).join("; ")
  : f.type === "date" ? (v ? String(v).slice(0, 10) : "") : f.type === "select" ? (v?._id ?? v ?? "") : (v ?? "")]; }));
const toBody = (fields: Field[], form: any, editing: boolean) => Object.fromEntries(fields.map(f => { const v = form[f.key]; let out: any = v;
  if (f.type === "number") out = v === "" ? (editing ? null : undefined) : Number(v);
  if (f.type === "lines") out = String(v).split("\n").map(s => s.trim()).filter(Boolean);
  if (f.type === "variants") out = String(v).split(";").map(s => s.trim()).filter(Boolean).map(s => { const [n, o = ""] = s.split(":"); return { name: n.trim(), options: o.split(",").map(x => x.trim()).filter(Boolean) }; });
  if (f.type === "date") out = v || (editing ? null : undefined);
  return [f.key, out]; }));
export default function AdminResource({ resource, title, columns, fields, ops = ["create", "update", "delete"] }: { resource: string; title: string; columns: Col[]; fields: Field[]; ops?: string[] }) {
  const [items, setItems] = useState<any[] | null>(null), [edit, setEdit] = useState<any | null>(null), [open, setOpen] = useState(false), [form, setForm] = useState<any>({}), [opts, setOpts] = useState<Record<string, any[]>>({}), [busy, setBusy] = useState(false);
  const load = useCallback(() => api(`/api/admin/${resource}`).then(d => setItems(d.items)).catch(e => toast.error(e.message)), [resource]);
  useEffect(() => { load(); fields.filter(f => f.optionsFrom).forEach(f => api(`/api/admin/${f.optionsFrom}`).then(d => setOpts(o => ({ ...o, [f.key]: d.items })))); }, [load]); // eslint-disable-line
  const show = (it: any) => { setEdit(it); setForm(toForm(fields, it)); setOpen(true); };
  const save = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true);
    try { const b = toBody(fields, form, !!edit); edit ? await api(`/api/admin/${resource}/${edit._id}`, "PATCH", b) : await api(`/api/admin/${resource}`, "POST", b); toast.success("Saved"); setOpen(false); load(); } catch (er: any) { toast.error(er.message); } setBusy(false); };
  const del = async (it: any) => { if (!confirm("Delete this item?")) return; try { await api(`/api/admin/${resource}/${it._id}`, "DELETE"); load(); } catch (e: any) { toast.error(e.message); } };
  const cls = "w-full rounded-xl bg-bg-alt px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2";
  return <div><div className="mb-5 flex items-center justify-between"><h1 className="text-2xl font-bold">{title}</h1>{ops.includes("create") && <button onClick={() => show(null)} className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-white"><Plus size={16} />Add</button>}</div>
    <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100"><table className="w-full text-left text-sm"><thead className="bg-bg-alt text-muted"><tr>{columns.map(c => <th key={c.key} className="p-3 font-medium">{c.label}</th>)}<th /></tr></thead>
      <tbody>{items === null ? <tr><td className="p-6 text-muted" colSpan={9}>Loading…</td></tr> : !items.length ? <tr><td className="p-6 text-muted" colSpan={9}>Nothing here yet.</td></tr> : items.map(it => <tr key={it._id} className="border-t border-slate-100">
        {columns.map(c => <td key={c.key} className="p-3">{c.render ? c.render(it) : String(it[c.key] ?? "—")}</td>)}
        <td className="flex gap-2 p-3">{ops.includes("update") && fields.length > 0 && <button aria-label="Edit" onClick={() => show(it)}><Pencil size={16} /></button>}{ops.includes("delete") && <button aria-label="Delete" onClick={() => del(it)} className="text-red-500"><Trash2 size={16} /></button>}</td></tr>)}</tbody></table></div>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4">
      <motion.form onSubmit={save} initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30 }} className="w-full max-w-lg space-y-3 rounded-3xl bg-white p-6"><div className="flex justify-between"><h2 className="font-semibold">{edit ? "Edit" : "New"} item</h2><button type="button" aria-label="Close" onClick={() => setOpen(false)}><X /></button></div>
        {fields.map(f => <label key={f.key} className="block text-xs text-muted">{f.label}
          {f.type === "textarea" || f.type === "lines" ? <textarea rows={3} className={cls} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            : f.type === "checkbox" ? <input type="checkbox" className="ml-2" checked={!!form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.checked })} />
            : f.type === "select" ? <select className={cls} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}><option value="">Select…</option>{f.options?.map(o => <option key={o}>{o}</option>)}{opts[f.key]?.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}</select>
            : <input className={cls} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} step="any" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />}</label>)}
        <button disabled={busy} className="w-full rounded-full bg-primary py-2.5 text-white disabled:opacity-60">{busy ? "Saving…" : "Save"}</button></motion.form></motion.div>}</AnimatePresence></div>;
}
