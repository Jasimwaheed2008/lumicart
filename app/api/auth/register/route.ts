import { handler, ok, fail, body } from "@/lib/api";
import { registerSchema } from "@/lib/validators";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import User from "@/models/User";
export const POST = handler(async (req) => {
  const d = registerSchema.parse(await body(req));
  if (await User.exists({ email: d.email })) return fail("Email already registered", 409);
  const u = await User.create({ ...d, password: await hashPassword(d.password) });
  await setSessionCookie({ sub: String(u._id), role: u.role });
  return ok({ user: { id: u._id, name: u.name, email: u.email, role: u.role } }, 201);
}, { limit: 10 });
