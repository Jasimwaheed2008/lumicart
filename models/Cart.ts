import { Schema, model, models } from "mongoose";
const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, min: 1, default: 1 }, variant: { type: Map, of: String } }],
}, { timestamps: true });
export default models.Cart || model("Cart", schema);
