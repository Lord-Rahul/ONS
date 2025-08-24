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

const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    clothingType,
    fabric,
    occasion,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const categoryDoc = await Category.findOne({
        name: {
          $regex: new RegExp(`^${category}$`, "i"),
        },
      });

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }
  }

  if (clothingType) filter.clothingType = clothingType;
  if (fabric) filter.fabric = fabric;
  if (occasion) filter.occasion = occasion;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const products = await Product.find(filter)
    .populate("category", "name color")
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / Number(limit));

  const paginationInfo = {
    currentPage: Number(page),
    totalPages,
    totalProducts,
    hasNextPage: Number(page) < totalPages,
    hasPrevPage: Number(page) > 1,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products, pagination: paginationInfo },
        "Product fetched successfully "
      )
    );
});

export { addProduct, getAllProducts };
