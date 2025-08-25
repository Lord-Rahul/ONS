import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: String,
    icon: String,
    image: {
      url: { type: String },
      publicId: { type: String },
      originalName: { type: String },
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export { Category };
