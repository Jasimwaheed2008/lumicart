import ContactForm from "@/components/ContactForm";
export const metadata = { title: "Contact us" };
export default function Page() { return <div className="mx-auto max-w-xl px-4 py-14"><h1 className="mb-2 text-4xl font-bold tracking-tight">Contact us</h1><p className="mb-8 text-muted">Questions about an order or a product? Send us a message.</p><ContactForm /></div>; }
