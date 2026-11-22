import Link from "next/link";
export default function Pagination({ page, pages, base, params }: { page: number; pages: number; base: string; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (n: number) => { const u = new URLSearchParams(); Object.entries({ ...params, page: String(n) }).forEach(([k, v]) => v && u.set(k, v)); return `${base}?${u}`; };
  return <nav className="mt-10 flex justify-center gap-2">{Array.from({ length: pages }, (_, i) => i + 1).map(n =>
    <Link key={n} href={href(n)} className={`grid h-10 w-10 place-items-center rounded-full text-sm transition ${n === page ? "bg-primary text-white" : "bg-bg-alt hover:bg-slate-200"}`}>{n}</Link>)}</nav>;
}
