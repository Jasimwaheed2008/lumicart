import Link from "next/link";
const cols: Record<string, [string, string][]> = {
  Shop: [["All Products", "/shop"], ["New Arrivals", "/new-arrivals"], ["Best Sellers", "/best-sellers"], ["Sale", "/sale"]],
  Help: [["Contact", "/contact"], ["FAQ", "/faq"], ["Track Order", "/order-tracking"], ["My Orders", "/orders"]],
  Company: [["About Us", "/about"], ["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"]],
};
export default function Footer() {
  return <footer className="mt-24 bg-bg-alt"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
    <div><div className="text-xl font-bold"><span className="text-primary">Lumi</span><span className="text-accent">Cart</span></div><p className="mt-3 text-sm text-muted">Thoughtfully curated products, delivered with care.</p></div>
    {Object.entries(cols).map(([t, ls]) => <div key={t}><h4 className="mb-3 font-semibold">{t}</h4><ul className="space-y-2 text-sm text-muted">{ls.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-ink">{l}</Link></li>)}</ul></div>)}
  </div><div className="border-t border-slate-200 py-5 text-center text-xs text-muted">© {new Date().getFullYear()} LumiCart. All rights reserved.</div></footer>;
}
