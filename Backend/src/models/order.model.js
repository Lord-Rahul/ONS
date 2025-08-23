import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    address1: {
      type: String,
      lowercase: true,
      required: [true, "address is required"],
    },
    address2: {
      type: String,
      lowercase: true,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      lowercase: true,
      required: [true, "city is required"],
    },
    pincode: {
      type: Number,
      required: [true, "pincode is required"],
    },
    state: {
      type: String,
      required: [true, "state is required"],
      enum: [
        // States
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",

        // Union Territories
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry",
      ],
    },

    status: {
      type: String,
      required: [true, "Order status is required"],
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dateOrdered: {
      type: Date,
      default: Date.now,
    },
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
