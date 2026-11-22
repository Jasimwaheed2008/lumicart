import crypto from "crypto";
import { handler, ok, body } from "@/lib/api";
import { forgotSchema } from "@/lib/validators";
import User from "@/models/User";
export const POST = handler(async (req) => {
  const { email } = forgotSchema.parse(await body(req));
  const u = await User.findOne({ email });
  if (u) {
    const token = crypto.randomBytes(32).toString("hex");
    u.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    u.resetTokenExpires = new Date(Date.now() + 3600_000);
    await u.save();
    // TODO: send via an email provider. In dev the link is logged to the server console only.
    if (process.env.NODE_ENV !== "production") console.log(`[dev] reset link: ${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`);
  }
  return ok({ message: "If that email exists, a reset link has been sent." }); // same answer either way
}, { limit: 5 });
