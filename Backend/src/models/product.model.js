import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required "],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      maxLength: [2000, "Description length cannot exceed 1000 characters"],
    },
    mainImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      originalName: { type: String },
    },

    additionalImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        originalName: { type: String },
      },
    ],

    brand: { type: String, trim: true, default: "ONS" },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required "],
    },

    clothingType: {
      type: String,
      required: true,
      enum: [
        "Saree",
        "Lehenga",
        "Kurti",
        "Salwar Suit",
        "Anarkali",
        "Palazzo Set",
        "Sharara",
        "Gharara",
        "Indo-Western",
        "Blouse",
        "Dupatta",
        "Ethnic Dress",
      ],
    },
    occasion: {
      type: String,
      enum: [
        "Casual",
        "Party",
        "Wedding",
        "Festival",
        "Office",
        "Traditional",
        "Formal",
        "Bridal",
      ],
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
      },
    ],

    colors: [String],
    countInStock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: 0,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    workType: {
      type: String,
      enum: [
        "Embroidered",
        "Printed",
        "Plain",
        "Hand Work",
        "Machine Work",
        "Block Print",
        "Digital Print",
        "Mirror Work",
        "Sequin Work",
        "Zari Work",
      ],
    },
    neckType: {
      type: String,
      enum: [
        "Round Neck",
        "V-Neck",
        "Boat Neck",
        "High Neck",
        "Off Shoulder",
        "Halter Neck",
        "Square Neck",
      ],
    },
    sleeveType: {
      type: String,
      enum: [
        "Full Sleeve",
        "Half Sleeve",
        "3/4 Sleeve",
        "Sleeveless",
        "Cap Sleeve",
      ],
    },

    fabric: {
      type: String,
      enum: [
        "Cotton",
        "Silk",
        "Chiffon",
        "Georgette",
        "Crepe",
        "Net",
        "Velvet",
        "Satin",
        "Organza",
        "Banarasi",
        "Chanderi",
        "Linen",
        "Rayon",
        "Polyester",
        "Art Silk",
      ],
    },
  },

  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ clothingType: 1 });

export const Product = mongoose.model("Product", productSchema);
