import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../middlewares/upload.middleware.js";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
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

  // Validate required fields
  if (!name || !description || !price || !category || !clothingType) {
    throw new ApiError(
      400,
      "Name, description, price, category and clothing type are required"
    );
  }

  // Validate that at least main image is uploaded
  if (!req.files || !req.files.image || !req.files.image[0]) {
    throw new ApiError(400, "Main product image is required");
  }

  // Find category
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

  // Prepare image data
  const mainImage = {
    url: req.files.image[0].path,
    publicId: req.files.image[0].filename,
    originalName: req.files.image[0].originalname,
  };

  const additionalImages = req.files.images
    ? req.files.images.map((file) => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
      }))
    : [];

  // Parse sizes if it's a string (from form-data)
  let parsedSizes = sizes;
  if (typeof sizes === "string") {
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (error) {
      parsedSizes = [];
    }
  }

  // Parse colors if it's a string (from form-data)
  let parsedColors = colors;
  if (typeof colors === "string") {
    try {
      parsedColors = JSON.parse(colors);
    } catch (error) {
      parsedColors = [];
    }
  }

  // Create product
  const product = await Product.create({
    name: name.trim(),
    description,
    mainImage,
    additionalImages,
    brand: brand || "ONS",
    price: Number(price),
    category: categoryDoc._id,
    clothingType,
    fabric,
    occasion,
    sizes: parsedSizes || [],
    colors: parsedColors || [],
    countInStock: Number(countInStock) || 0,
    workType,
    neckType,
    sleeveType,
  });

  await product.populate("category", "name color");

  return res
    .status(201)
    .json(
      new ApiResponse(201, product, "Product created successfully with images")
    );
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

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product Id");
  }

  const product = await Product.findById(id).populate(
    "category",
    "name color icon "
  );

  if (!product) {
    throw new ApiError(404, "Product not found ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "product not found");
  }

  const imagesToDelete = [];

  if (product.mainImage && product.mainImage.publicId) {
    imagesToDelete.push(product.mainImage.publicId);
  }

  if (product.additionalImages && product.additionalImages.publicId) {
    product.additionalImages.forEach((img) => {
      if (img.publicId) {
        imagesToDelete.push(img.publicId);
      }
    });
  }

  await Promise.allSettled(
    imagesToDelete.map((publicId) => deleteFromCloudinary(publicId))
  );

  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedProductId: id },
        "Product deleted successfully"
      )
    );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
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
    removeImages, // Array of public IDs to remove
  } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Find existing product
  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  // Handle category update
  let categoryDoc = existingProduct.category;
  if (category) {
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
  }

  // Handle image removal
  if (removeImages && Array.isArray(removeImages)) {
    for (const publicId of removeImages) {
      try {
        await deleteFromCloudinary(publicId);

        // Remove from mainImage if it matches
        if (
          existingProduct.mainImage &&
          existingProduct.mainImage.publicId === publicId
        ) {
          existingProduct.mainImage = null;
        }

        // Remove from additionalImages
        existingProduct.additionalImages =
          existingProduct.additionalImages.filter(
            (img) => img.publicId !== publicId
          );
      } catch (error) {
        console.log(`Failed to delete image ${publicId}:`, error);
      }
    }
  }

  // Handle new image uploads
  let updatedMainImage = existingProduct.mainImage;
  let updatedAdditionalImages = [...existingProduct.additionalImages];

  if (req.files) {
    // Replace main image if uploaded
    if (req.files.image && req.files.image[0]) {
      // Delete old main image if exists
      if (existingProduct.mainImage && existingProduct.mainImage.publicId) {
        try {
          await deleteFromCloudinary(existingProduct.mainImage.publicId);
        } catch (error) {
          console.log("Failed to delete old main image:", error);
        }
      }

      // Set new main image
      updatedMainImage = {
        url: req.files.image[0].path,
        publicId: req.files.image[0].filename,
        originalName: req.files.image[0].originalname,
      };
    }

    // Add new additional images
    if (req.files.images && req.files.images.length > 0) {
      const newAdditionalImages = req.files.images.map((file) => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
      }));
      updatedAdditionalImages.push(...newAdditionalImages);
    }
  }

  // Parse sizes and colors if they're strings
  let parsedSizes = sizes;
  if (typeof sizes === "string") {
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (error) {
      parsedSizes = existingProduct.sizes;
    }
  }

  let parsedColors = colors;
  if (typeof colors === "string") {
    try {
      parsedColors = JSON.parse(colors);
    } catch (error) {
      parsedColors = existingProduct.colors;
    }
  }

  // Update product
  const updateData = {
    name: name?.trim() || existingProduct.name,
    description: description || existingProduct.description,
    mainImage: updatedMainImage,
    additionalImages: updatedAdditionalImages,
    brand: brand || existingProduct.brand,
    price: price ? Number(price) : existingProduct.price,
    category: categoryDoc._id,
    clothingType: clothingType || existingProduct.clothingType,
    fabric: fabric || existingProduct.fabric,
    occasion: occasion || existingProduct.occasion,
    sizes: parsedSizes || existingProduct.sizes,
    colors: parsedColors || existingProduct.colors,
    countInStock:
      countInStock !== undefined
        ? Number(countInStock)
        : existingProduct.countInStock,
    workType: workType || existingProduct.workType,
    neckType: neckType || existingProduct.neckType,
    sleeveType: sleeveType || existingProduct.sleeveType,
  };

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category", "name color");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

export {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
