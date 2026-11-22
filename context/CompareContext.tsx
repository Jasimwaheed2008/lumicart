"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
const Ctx = createContext<{ slugs: string[]; toggle: (s: string) => void; clear: () => void }>({ slugs: [], toggle: () => {}, clear: () => {} });
export const useCompare = () => useContext(Ctx);
export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => { try { setSlugs(JSON.parse(localStorage.getItem("compare") || "[]")); } catch {} }, []);
  const save = (n: string[]) => { setSlugs(n); try { localStorage.setItem("compare", JSON.stringify(n)); } catch {} };
  const toggle = (s: string) => { if (slugs.includes(s)) return save(slugs.filter(x => x !== s)); if (slugs.length >= 3) return void toast.error("You can compare up to 3 products"); save([...slugs, s]); };
  return <Ctx.Provider value={{ slugs, toggle, clear: () => save([]) }}>{children}</Ctx.Provider>;
}
