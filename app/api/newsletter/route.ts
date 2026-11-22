import { z } from "zod";
import { handler, ok, body } from "@/lib/api";
import Newsletter from "@/models/Newsletter";
export const POST = handler(async (req) => {
  const { email } = z.object({ email: z.string().email("Invalid email").transform(s => s.toLowerCase()) }).parse(await body(req));
  await Newsletter.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  return ok({ message: "Thanks for subscribing!" });
}, { limit: 5 });
