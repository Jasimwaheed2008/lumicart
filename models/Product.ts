import { Schema, model, models } from "mongoose";
const schema = new Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true },
  description: { type: String, required: true }, images: { type: [String], validate: (v: string[]) => v.length > 0 },
  price: { type: Number, required: true, min: 0 }, discountPrice: { type: Number, min: 0,
    validate: { validator(this: any, v: number) { return v == null || v < this.price; }, message: "discountPrice must be below price" } },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  brand: { type: String, index: true }, stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, required: true, unique: true },
  variants: [{ name: String, options: [String] }], // e.g. {name:"Size",options:["S","M"]}
  featured: { type: Boolean, default: false, index: true },
  rating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 }, sold: { type: Number, default: 0, index: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
schema.index({ name: "text", description: "text", brand: "text" });
export default models.Product || model("Product", schema);
