import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "category is require"],
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
