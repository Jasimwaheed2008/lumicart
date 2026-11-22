export const SHIPPING = { standard: { label: "Standard (3–5 days)", cost: 5 }, express: { label: "Express (1–2 days)", cost: 15 } } as const;
export type ShipMethod = keyof typeof SHIPPING;
export const FREE_SHIPPING_OVER = 100;
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const shippingCost = (m: ShipMethod, subtotal: number) => (m === "standard" && subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING[m].cost);
export const couponDiscount = (c: { type: "percent" | "fixed"; value: number }, subtotal: number) => round2(Math.min(c.type === "percent" ? (subtotal * c.value) / 100 : c.value, subtotal));
