import { Schema, model, models } from "mongoose";
const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fullName: { type: String, required: true }, phone: { type: String, required: true },
  line1: { type: String, required: true }, line2: String, city: { type: String, required: true },
  state: String, postalCode: String, country: { type: String, required: true }, isDefault: { type: Boolean, default: false },
}, { timestamps: true });
export default models.Address || model("Address", schema);
