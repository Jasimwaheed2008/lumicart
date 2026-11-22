import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const secret = () => { const s = process.env.JWT_SECRET; if (!s || s.length < 16) throw new Error("JWT_SECRET missing/too short"); return s; };
export type Session = { sub: string; role: "customer" | "admin" };
export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);
export const signToken = (s: Session) => jwt.sign(s, secret(), { expiresIn: "7d" });
export function verifyToken(t: string): Session | null { try { return jwt.verify(t, secret()) as Session; } catch { return null; } }
export async function setSessionCookie(s: Session) {
  (await cookies()).set("token", signToken(s), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 604800 });
}
export async function clearSessionCookie() { (await cookies()).delete("token"); }
export async function getSession() { const t = (await cookies()).get("token")?.value; return t ? verifyToken(t) : null; }
export async function requireAdmin() { const s = await getSession(); if (!s || s.role !== "admin") throw new Error("FORBIDDEN"); return s; }
