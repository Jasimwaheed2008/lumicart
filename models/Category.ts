import { Schema, model, models } from "mongoose";
const schema = new Schema({
  name: { type: String, required: true, unique: true }, slug: { type: String, required: true, unique: true },
  image: String, description: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default models.Category || model("Category", schema);
