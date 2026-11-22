import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ProfileForms from "@/components/ProfileForms";
export const metadata = { title: "My account" };
export default async function Page() { if (!(await getSession())) redirect("/login?next=/dashboard"); return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="mb-8 text-3xl font-bold">My account</h1><ProfileForms /></div>; }
