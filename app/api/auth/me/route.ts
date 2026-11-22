import { handler, ok, fail, body, uid } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";
import User from "@/models/User";
const pub = (u: any) => ({ id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone });
export const GET = handler(async () => {
  const s = await getSession();
  const u = s && (await User.findById(s.sub));
  return ok({ user: u ? pub(u) : null });
});
export const PATCH = handler(async (req) => {
  const d = profileSchema.parse(await body(req));
  const u = await User.findByIdAndUpdate(await uid(), d, { new: true });
  return u ? ok({ user: pub(u) }) : fail("Not found", 404);
}, { auth: "user" });
