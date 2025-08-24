import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
      required: true,
    },
    priceAtTime: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.pre('save',function (next){
    this.totalItems= this.items.reduce((total,item)=>total+item.quantity,0);
    this.totalAmount=this.items.reduce((total,item)=>total+(item.priceAtTime*item.quantity),0);
    next();
})

export const Cart = mongoose.model("Cart", cartSchema);
