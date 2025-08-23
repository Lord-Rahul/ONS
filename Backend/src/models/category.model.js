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
    image: String,
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export { Category };
