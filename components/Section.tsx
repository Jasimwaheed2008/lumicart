import Link from "next/link";
export default function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return <section className="mx-auto mt-20 max-w-7xl px-4"><div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>{href && <Link href={href} className="text-sm font-medium text-primary">View all →</Link>}</div>{children}</section>;
}
