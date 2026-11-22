import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
const nav = [["Dashboard", ""], ["Orders", "/orders"], ["Products", "/products"], ["Inventory", "/inventory"], ["Categories", "/categories"], ["Coupons", "/coupons"], ["Banners", "/banners"], ["Reviews", "/reviews"], ["Customers", "/customers"], ["Messages", "/messages"]];
export const metadata = { title: "Admin", robots: { index: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession(); if (!s) redirect("/login?next=/admin"); if (s.role !== "admin") redirect("/");
  return <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row"><aside className="md:w-48"><nav className="flex gap-2 overflow-x-auto md:flex-col">{nav.map(([l, h]) => <Link key={l} href={`/admin${h}`} className="whitespace-nowrap rounded-xl bg-bg-alt px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white">{l}</Link>)}</nav></aside><div className="min-w-0 flex-1">{children}</div></div>;
}
