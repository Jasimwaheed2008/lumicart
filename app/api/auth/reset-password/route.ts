import crypto from "crypto";
import { handler, ok, fail, body } from "@/lib/api";
import { resetSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth";
import User from "@/models/User";
export const POST = handler(async (req) => {
  const d = resetSchema.parse(await body(req));
  const hash = crypto.createHash("sha256").update(d.token).digest("hex");
  const u = await User.findOne({ resetTokenHash: hash, resetTokenExpires: { $gt: new Date() } }).select("+resetTokenHash +resetTokenExpires");
  if (!u) return fail("Reset link is invalid or expired", 400);
  u.password = await hashPassword(d.password);
  u.resetTokenHash = undefined; u.resetTokenExpires = undefined;
  await u.save();
  return ok({ message: "Password updated" });
}, { limit: 5 });
