// In-memory limiter: fine for one instance; swap for Redis when scaling horizontally.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now(), arr = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length <= limit;
}
