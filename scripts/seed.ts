import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User"; import Category from "../models/Category";
import Product from "../models/Product"; import Coupon from "../models/Coupon";
const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80`;
async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Promise.all([User, Category, Product, Coupon].map((m: any) => m.deleteMany({})));
  await User.create([
    { name: "Admin", email: "admin@shop.test", password: await bcrypt.hash("Admin123!", 12), role: "admin" },
    { name: "Demo Customer", email: "demo@shop.test", password: await bcrypt.hash("Demo123!", 12) },
  ]);
  const cats: any[] = await Category.create([
    { name: "Fashion", slug: "fashion" }, { name: "Electronics", slug: "electronics" }, { name: "Home", slug: "home" }, { name: "Beauty", slug: "beauty" },
  ]);
  const items: [string, number, number | undefined, number, string, boolean, string][] = [
    ["Classic Cotton Tee", 29, 24, 0, "Nova", true, "photo-1521572163474-6864f9cf17ab"],
    ["Wireless Headphones", 199, 159, 1, "Sonic", true, "photo-1505740420928-5e560c06d30e"],
    ["Minimal Desk Lamp", 59, undefined, 2, "Lumen", false, "photo-1507473885765-e6ed057f782c"],
    ["Hydrating Face Serum", 39, 32, 3, "Glow", true, "photo-1556228578-0d85b1a4d571"],
    ["Smart Watch", 249, 219, 1, "Chrono", true, "photo-1523275335684-37898b6baf30"],
    ["Linen Throw Pillow", 24, undefined, 2, "Nest", false, "photo-1584100936595-c0654b55a2e6"],
  ];
  await Product.create(items.map(([name, price, discountPrice, c, brand, featured, photo], i) => ({
    name, slug: name.toLowerCase().replace(/\s+/g, "-"), description: `${name} — premium quality, carefully made.`,
    images: [img(photo)], price, discountPrice, category: cats[c]._id, brand, stock: 25 + i * 5, sku: `SKU-${1000 + i}`,
    featured, sold: 100 - i * 11, rating: 4 + (i % 2) * 0.5, numReviews: 12 + i,
    variants: c === 0 ? [{ name: "Size", options: ["S", "M", "L"] }] : [],
  })));
  await Coupon.create([{ code: "WELCOME10", type: "percent", value: 10 }, { code: "SAVE20", type: "fixed", value: 20, minOrder: 100 }]);
  console.log("Seeded. admin@shop.test / Admin123!  |  demo@shop.test / Demo123!");
  await mongoose.disconnect();
}
main();
