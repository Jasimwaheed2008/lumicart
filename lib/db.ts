import mongoose from "mongoose";
const g = globalThis as unknown as { _m?: { c?: typeof mongoose; p?: Promise<typeof mongoose> } };
const cache = (g._m ??= {});
export async function connectDB() {
  if (cache.c) return cache.c;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  cache.p ??= mongoose.connect(uri, { bufferCommands: false });
  cache.c = await cache.p;
  return cache.c;
}
