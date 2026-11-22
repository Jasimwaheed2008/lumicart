import { handler, ok, fail, body, uid } from "@/lib/api";
import { changePasswordSchema } from "@/lib/validators";
import { hashPassword, verifyPassword } from "@/lib/auth";
import User from "@/models/User";
export const POST = handler(async (req) => {
  const d = changePasswordSchema.parse(await body(req));
  const u = await User.findById(await uid()).select("+password");
  if (!u || !(await verifyPassword(d.current, u.password))) return fail("Current password is incorrect", 400);
  u.password = await hashPassword(d.password); await u.save();
  return ok({ message: "Password changed" });
}, { auth: "user", limit: 5 });
