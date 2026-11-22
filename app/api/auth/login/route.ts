import { handler, ok, fail, body } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import User from "@/models/User";
export const POST = handler(async (req) => {
  const d = loginSchema.parse(await body(req));
  const u = await User.findOne({ email: d.email }).select("+password");
  if (!u || !(await verifyPassword(d.password, u.password))) return fail("Invalid email or password", 401);
  await setSessionCookie({ sub: String(u._id), role: u.role });
  return ok({ user: { id: u._id, name: u.name, email: u.email, role: u.role } });
}, { limit: 10 });
