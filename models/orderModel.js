import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        price: {
          type: String,
          required: [true, "Product price is required"],
        },
        quantity: {
          type: String,
          required: [true, "Product quantity is required"],
        },
        image: {
          type: String,
          required: [true, "Product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "USer ID is required"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "Item price is required"],
    },
    tax: {
      type: Number,
      required: [true, "tax is required"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "shippingCharges is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "totalAmount is required"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "deliverd"],
      default: "processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
