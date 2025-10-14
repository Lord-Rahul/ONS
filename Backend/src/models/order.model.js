import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSnapshot: {
      name: { type: String, required: true },
      mainImage: {
        url: String,
        publicId: String,
      },
      clothingType: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
      required: true,
    },
    color: String,
    priceAtOrder: {
      type: Number,
      required: true,
      min: 0,
    },
    itemSubtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },

  { _id: true }
);

const shippingAddressSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      lowercase: true,
      required: [true, "address is required"],
    },
    address2: {
      type: String,
      lowercase: true,
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
  },
  { _id: false }
);

const paymentDetailsSchema = mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["PhonePe", "UPI", "Card", "Net Banking", "COD", "Wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: String,
    gatewayOrderId: String,
    gatewayPaymentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
  },
  { _id: false }
);

const orderSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    itemsSubtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCharges: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "cancellation_requested",
        "returned",
        "refunded",
      ],
      default: "pending",
    },
    trackingNumber: String,
    cancellationReason: String,

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Important timestamps
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ONS${timestamp.slice(-6)}${random}`;
  }
  next();
});

orderSchema.pre("save", function (next) {
  if (
    this.isModified("items") ||
    this.isModified("shippingCharges") ||
    this.isModified("taxAmount") ||
    this.isModified("discountAmount")
  ) {
    this.itemsSubtotal = this.items.reduce(
      (total, item) => total + item.itemSubtotal,
      0
    );
    this.totalAmount =
      this.itemsSubtotal +
      this.shippingCharges +
      this.taxAmount -
      this.discountAmount;
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);
