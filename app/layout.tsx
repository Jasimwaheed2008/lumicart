import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "LumiCart — Premium Shop", template: "%s | LumiCart" },
  description: "Thoughtfully curated products, delivered with care.",
  openGraph: { type: "website", siteName: "LumiCart" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased"><Providers><AnnouncementBar /><Navbar /><main className="min-h-[60vh]">{children}</main><Footer /><ScrollToTop /></Providers></body></html>;
}
