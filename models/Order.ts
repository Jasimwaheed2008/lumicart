import { Schema, model, models } from "mongoose";
const schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, name: String, image: String, price: Number, quantity: Number, variant: { type: Map, of: String } }],
  shippingAddress: { fullName: String, phone: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: String },
  shippingMethod: { type: String, enum: ["standard", "express"], default: "standard" },
  subtotal: Number, discount: { type: Number, default: 0 }, shippingCost: Number, total: Number, couponCode: String,
  paymentMethod: { type: String, enum: ["cod", "stripe"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" }, // "paid" only via verified gateway webhook
  paymentRef: String,
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending", index: true },
  tracking: [{ status: String, note: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
export default models.Order || model("Order", schema);
