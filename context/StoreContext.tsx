"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
export type CartItem = { productId: string; name: string; slug: string; image: string; price: number; stock: number; quantity: number; variant?: Record<string, string> };
export type User = { id: string; name: string; email: string; role: string; phone?: string } | null;
type Store = {
  user: User; ready: boolean; items: CartItem[]; wishlist: string[]; cartCount: number; subtotal: number;
  refresh: () => Promise<void>; logout: () => Promise<void>;
  addToCart: (p: Omit<CartItem, "quantity">, qty?: number) => Promise<void>;
  setQty: (p: CartItem, qty: number) => Promise<void>; clearCart: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
};
const Ctx = createContext<Store | null>(null);
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error("useStore outside StoreProvider"); return c; };
export async function api<T = any>(url: string, method = "GET", body?: unknown): Promise<T> {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}
const same = (a: CartItem, b: CartItem) => a.productId === b.productId && JSON.stringify(a.variant ?? {}) === JSON.stringify(b.variant ?? {});
const readLocal = (): CartItem[] => { try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; } };
const writeLocal = (i: CartItem[]) => { try { localStorage.setItem("cart", JSON.stringify(i)); } catch {} };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const run = async (fn: () => Promise<void>) => { try { await fn(); } catch (e: any) { toast.error(e.message); } };

  const refresh = useCallback(async () => {
    const { user: u } = await api("/api/auth/me");
    setUser(u);
    if (u) {
      for (const g of readLocal()) { try { await api("/api/cart", "POST", { productId: g.productId, quantity: g.quantity, variant: g.variant }); } catch {} }
      writeLocal([]);
      setItems((await api("/api/cart")).items);
      setWishlist((await api("/api/wishlist")).products.map((p: any) => String(p._id)));
    } else { setItems(readLocal()); setWishlist([]); }
    setReady(true);
  }, []);
  useEffect(() => { refresh().catch(() => setReady(true)); }, [refresh]);

  const addToCart: Store["addToCart"] = (p, qty = 1) => run(async () => {
    if (p.stock < 1) throw new Error("Out of stock");
    if (user) setItems((await api("/api/cart", "POST", { productId: p.productId, quantity: qty, variant: p.variant })).items);
    else {
      const cur = readLocal(), line = { ...p, quantity: qty }, ex = cur.find(i => same(i, line));
      if (ex) { if (ex.quantity + qty > p.stock) throw new Error(`Only ${p.stock} in stock`); ex.quantity += qty; } else cur.push(line);
      writeLocal(cur); setItems(cur);
    }
    toast.success("Added to cart");
  });
  const setQty: Store["setQty"] = (p, qty) => run(async () => {
    if (user) setItems((await api("/api/cart", "PATCH", { productId: p.productId, quantity: qty, variant: p.variant })).items);
    else {
      if (qty > p.stock) throw new Error(`Only ${p.stock} in stock`);
      const next = readLocal().map(i => (same(i, p) ? { ...i, quantity: qty } : i)).filter(i => i.quantity > 0);
      writeLocal(next); setItems(next);
    }
  });
  const clearCart = () => run(async () => { if (user) await api("/api/cart", "DELETE"); writeLocal([]); setItems([]); });
  const toggleWishlist = (id: string) => run(async () => {
    if (!user) throw new Error("Please log in to use your wishlist");
    const r = await api("/api/wishlist", "POST", { productId: id }); setWishlist(r.ids);
    toast.success(r.added ? "Saved to wishlist" : "Removed from wishlist");
  });
  const logout = async () => { await api("/api/auth/logout", "POST"); setUser(null); setItems([]); setWishlist([]); };

  const cartCount = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);
  return <Ctx.Provider value={{ user, ready, items, wishlist, cartCount, subtotal, refresh, logout, addToCart, setQty, clearCart, toggleWishlist }}>{children}</Ctx.Provider>;
}
