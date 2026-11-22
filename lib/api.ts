import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "./db";
import { getSession } from "./auth";
import { rateLimit } from "./rate-limit";
export const ok = (d: unknown, status = 200) => NextResponse.json(d, { status });
export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
type Opts = { auth?: "user" | "admin"; limit?: number };
export function handler(fn: (req: Request) => Promise<Response>, opts: Opts = {}) {
  return async (req: Request) => {
    try {
      if (opts.limit) {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
        if (!rateLimit(`${new URL(req.url).pathname}:${ip}`, opts.limit)) return fail("Too many requests, try again soon", 429);
      }
      await connectDB();
      if (opts.auth) {
        const s = await getSession();
        if (!s) return fail("Please log in", 401);
        if (opts.auth === "admin" && s.role !== "admin") return fail("Forbidden", 403);
      }
      return await fn(req);
    } catch (e) {
      if (e instanceof ZodError) return fail(e.issues[0]?.message ?? "Invalid input", 422);
      if ((e as any)?.code === 11000) return fail("That value already exists (name, code, email or SKU)", 409);
      console.error(e);
      return fail("Something went wrong", 500);
    }
  };
}
export const uid = async () => (await getSession())!.sub;
export const body = (req: Request) => req.json().catch(() => ({}));
