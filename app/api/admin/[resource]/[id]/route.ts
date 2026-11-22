import { handler, ok, fail, body } from "@/lib/api";
import { RESOURCES } from "@/lib/admin";
const parts = (req: Request) => { const s = new URL(req.url).pathname.split("/"); return { r: RESOURCES[s[3]], id: s[4] }; };
const valid = (id: string) => /^[a-f\d]{24}$/i.test(id);
export const PATCH = handler(async (req) => {
  const { r, id } = parts(req); if (!r || !r.ops.includes("update") || !valid(id)) return fail("Not allowed", 405);
  const doc = await r.model.findById(id); if (!doc) return fail("Not found", 404);
  doc.set(r.schema.partial().parse(await body(req))); await doc.save(); // save() so document validators (e.g. discount < price) run
  return ok({ item: doc });
}, { auth: "admin" });
export const DELETE = handler(async (req) => {
  const { r, id } = parts(req); if (!r || !r.ops.includes("delete") || !valid(id)) return fail("Not allowed", 405);
  const block = await r.canDelete?.(id); if (block) return fail(block, 409);
  await r.model.findByIdAndDelete(id); return ok({ ok: true });
}, { auth: "admin" });
