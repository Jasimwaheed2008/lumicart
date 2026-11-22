import { z } from "zod";
import Product from "@/models/Product"; import Category from "@/models/Category"; import Coupon from "@/models/Coupon";
import Banner from "@/models/Banner"; import Message from "@/models/Message"; import Review from "@/models/Review"; import User from "@/models/User";
export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const oid = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"), url = z.string().url("Must be a valid URL"), num = z.coerce.number();
const link = z.string().max(200).refine(v => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Link must start with / or https://");
export type Res = { model: any; schema: z.ZodObject<any>; filter?: any; select?: string; populate?: [string, string][]; ops: ("create" | "update" | "delete")[]; slug?: boolean; canDelete?: (id: string) => Promise<string | null> };
export const RESOURCES: Record<string, Res> = {
  products: { model: Product, populate: [["category", "name"]], ops: ["create", "update", "delete"], slug: true, schema: z.object({
    name: z.string().trim().min(2).max(150), description: z.string().trim().min(5), images: z.array(url).min(1, "At least one image URL"), price: num.min(0), discountPrice: num.min(0).nullable().optional(),
    category: oid, brand: z.string().trim().max(60).optional(), stock: num.int().min(0), sku: z.string().trim().min(2).max(40), featured: z.boolean().optional(), isActive: z.boolean().optional(),
    variants: z.array(z.object({ name: z.string().max(30), options: z.array(z.string().max(30)).min(1) })).optional() }) },
  categories: { model: Category, ops: ["create", "update", "delete"], slug: true, schema: z.object({ name: z.string().trim().min(2).max(60), image: url.optional().or(z.literal("")), description: z.string().max(300).optional(), isActive: z.boolean().optional() }),
    canDelete: async id => ((await Product.exists({ category: id })) ? "Category still has products" : null) },
  coupons: { model: Coupon, ops: ["create", "update", "delete"], schema: z.object({ code: z.string().trim().min(3).max(30), type: z.enum(["percent", "fixed"]), value: num.min(0), minOrder: num.min(0).optional(), maxUses: num.int().min(1).nullable().optional(), expiresAt: z.string().nullable().optional(), isActive: z.boolean().optional() }) },
  banners: { model: Banner, ops: ["create", "update", "delete"], schema: z.object({ title: z.string().trim().min(2).max(100), subtitle: z.string().max(200).optional(), image: url, link: link.optional(), order: num.optional(), isActive: z.boolean().optional() }) },
  reviews: { model: Review, ops: ["update", "delete"], populate: [["product", "name"], ["user", "name"]], schema: z.object({ approved: z.boolean() }) },
  messages: { model: Message, ops: ["update", "delete"], schema: z.object({ read: z.boolean() }) },
  users: { model: User, ops: [], filter: { role: "customer" }, select: "name email createdAt", schema: z.object({}) },
};
