import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    images,
    brand,
    price,
    category,
    clothingType,
    fabric,
    occasion,
    sizes,
    colors,
    countInStock,
    workType,
    neckType,
    sleeveType,
  } = req.body;

  if (!name || !description || !image || !price || !category || !clothingType) {
    throw new ApiError(
      400,
      "Name, descreption , image , price , category and clothing type is needed"
    );
  }

  let categoryDoc;
  if (mongoose.Types.ObjectId.isValid(category)) {
    categoryDoc = await Category.findById(category);
  } else {
    categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${category}$`, "i") },
    });
  }

  if (!categoryDoc) {
    throw new ApiError(404, "Category not found");
  }

  

  const product = await Product.create({
    name: name.trim(),
    description,
    image,
    images: images || [],
    brand,
    price,
    category: categoryDoc._id,
    clothingType,
    fabric,
    occasion,
    sizes: sizes || [],
    colors: colors || [],
    countInStock: countInStock || 0,
    workType,
    neckType,
    sleeveType,
  });

  await product.populate("category", "name");

  return res
    .status(201)
    .json(new ApiResponse(201, product, " Product is created successfully "));
});

export { addProduct };
