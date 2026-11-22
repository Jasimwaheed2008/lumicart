import { Schema, model, models } from "mongoose";
const schema = new Schema({ email: { type: String, required: true, unique: true, lowercase: true, trim: true } }, { timestamps: true });
export default models.Newsletter || model("Newsletter", schema);
