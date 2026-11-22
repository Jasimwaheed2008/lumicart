import { handler, ok, fail, body } from "@/lib/api";
import { RESOURCES, slugify } from "@/lib/admin";
const key = (req: Request) => new URL(req.url).pathname.split("/")[3];
export const GET = handler(async (req) => {
  const r = RESOURCES[key(req)]; if (!r) return fail("Unknown resource", 404);
  let q = r.model.find(r.filter ?? {}).sort({ createdAt: -1 }).limit(300); if (r.select) q = q.select(r.select);
  for (const [p, s] of r.populate ?? []) q = q.populate(p, s);
  return ok({ items: await q.lean() });
}, { auth: "admin" });
export const POST = handler(async (req) => {
  const r = RESOURCES[key(req)]; if (!r || !r.ops.includes("create")) return fail("Not allowed", 405);
  const d: any = r.schema.parse(await body(req)); if (r.slug) d.slug = slugify(d.name);
  return ok({ item: await r.model.create(d) }, 201);
}, { auth: "admin" });
