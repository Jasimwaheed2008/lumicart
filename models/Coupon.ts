import { Schema, model, models } from "mongoose";
const schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ["percent", "fixed"], required: true }, value: { type: Number, required: true, min: 0, validate: { validator(this: any, v: number) { return this.type !== "percent" || v <= 100; }, message: "Percent cannot exceed 100" } },
  minOrder: { type: Number, default: 0 }, maxUses: Number, used: { type: Number, default: 0 },
  expiresAt: Date, isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default models.Coupon || model("Coupon", schema);
