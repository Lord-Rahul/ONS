import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Category } from "../models/category.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const addCategory = asyncHandler(async (req, res) => {
  const { name, color, icon, image } = req.body;

  if (!name) {
    throw new ApiError(400, "category name is required ");
  }

  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({
    name: name.trim(),
    color,
    icon,
    image,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "category created sucessfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAT: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched sucessfully "));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }
  const category = await Category.findById(id);

  if (id != category._id) {
    throw new ApiError(500, "category not found");
  }

  if (!category) {
    throw new ApiError(404, "category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "category fetched sucessfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, color, icon, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "category not found ");
  }

  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`${name}$`, "i") },
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new ApiError(409, "category name already exist ");
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      ...(name && { name: name.trim() }),
      ...(color && { color }),
      ...(icon && { icon }),
      ...(image && { image }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "category updated sucessfully ")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "category not found ");
  }

  await Category.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "category deleted sucessfully "));
});

export {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
