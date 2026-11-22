"use client";
import { Toaster } from "sonner";
import { CompareProvider } from "@/context/CompareContext";
import CompareBar from "./CompareBar";
import { StoreProvider } from "@/context/StoreContext";
export default function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider><CompareProvider>{children}<CompareBar /></CompareProvider><Toaster position="top-right" richColors /></StoreProvider>;
}
