import { Schema, model, models } from "mongoose";
const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });
export default models.Wishlist || model("Wishlist", schema);
