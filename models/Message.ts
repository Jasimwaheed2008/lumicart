import { Schema, model, models } from "mongoose";
const schema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true }, subject: { type: String, required: true }, message: { type: String, required: true, maxlength: 3000 }, read: { type: Boolean, default: false } }, { timestamps: true });
export default models.Message || model("Message", schema);
