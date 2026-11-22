import { Schema, model, models } from "mongoose";
const schema = new Schema({ title: { type: String, required: true }, subtitle: String, image: { type: String, required: true }, link: { type: String, default: "/shop" }, order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export default models.Banner || model("Banner", schema);
