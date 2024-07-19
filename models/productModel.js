import mongoose from "mongoose";

// Review Model
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is require"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is require"],
    },
  },
  { timestamps: true }
);

// Product Model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is require"],
    },
    description: {
      type: String,
      required: [true, "description name is require"],
    },
    price: {
      type: String,
      required: [true, "price name is require"],
    },
    stock: {
      type: String,
      required: [true, "stock name is require"],
    },
    // quantity: {
    //   type: String,
    //   required: [true, "Product Quantity is require"],
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
