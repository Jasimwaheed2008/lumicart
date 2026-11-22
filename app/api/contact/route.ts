import { z } from "zod";
import { handler, ok, body } from "@/lib/api";
import { clean } from "@/lib/sanitize";
import Message from "@/models/Message";
export const POST = handler(async (req) => {
  const d = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email().max(120), subject: z.string().trim().min(2).max(120), message: z.string().trim().min(10, "Message is too short").max(3000) }).parse(await body(req));
  await Message.create({ name: clean(d.name), email: d.email, subject: clean(d.subject), message: clean(d.message) });
  return ok({ message: "Thanks! We'll get back to you soon." }, 201);
}, { limit: 5 });
