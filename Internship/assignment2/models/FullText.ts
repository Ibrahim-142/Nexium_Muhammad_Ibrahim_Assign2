import mongoose from "mongoose";
const FullTextSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    fullText: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.models.FullText || mongoose.model("FullText", FullTextSchema);
