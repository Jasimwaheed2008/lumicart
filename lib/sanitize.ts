export const clean = (s: string) => s.replace(/[<>]/g, "").trim();
// Block Mongo operator injection in user-supplied objects
export function stripOperators<T>(v: T): T {
  if (Array.isArray(v)) return v.map(stripOperators) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith("$") && !k.includes(".")).map(([k, x]) => [k, stripOperators(x)])) as T;
  return v;
}
