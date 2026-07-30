import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Order } from '../models/order.model.js';
import { OrderItem } from '../models/orderItem.model.js';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { User } from '../models/user.model.js';
import { deleteFromCloudinary } from '../middlewares/upload.middleware.js';
import { sendOrderStatusEmail } from '../services/email.service.js';

const parseMaybeJson = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

const resolveCategory = async (categoryValue) => {
  if (!categoryValue) {
    return null;
  }

  const normalizedCategory = String(categoryValue).trim();
  if (!normalizedCategory) {
    return null;
  }

  const categoryById = await Category.findById(normalizedCategory);
  if (categoryById) {
    return categoryById;
  }

  return Category.findOne({
    name: { $regex: new RegExp(`^${normalizedCategory}$`, 'i') },
  });
};

const buildUploadedImages = (files = {}) => {
  const mainImageFile = files.image?.[0];
  const additionalImageFiles = files.images || [];

  return {
    mainImage: mainImageFile
      ? {
          url: mainImageFile.path,
          publicId: mainImageFile.filename,
          originalName: mainImageFile.originalname,
        }
      : null,
    additionalImages: additionalImageFiles.map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
    })),
  };
};

const getUserDisplayName = (user) =>
  user?.fullName || user?.name || user?.email || 'Unknown';

// Dashboard Stats
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Total Revenue
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'fullName email number')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Format recent orders
    const formattedOrders = recentOrders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: getUserDisplayName(order.user),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt
    }));

    const stats = {
      totalSales: totalRevenue[0]?.total || 0,
      totalOrders,
      totalUsers,
      totalProducts,
      salesChange: 12,
      usersChange: 8,
      ordersChange: 5,
      productsChange: 3,
      recentOrders: formattedOrders
    };

    res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
  } catch (error) {
    throw new ApiError(500, `Error fetching dashboard stats: ${error.message}`);
  }
});

// Get Products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  const query = search ? { name: { $regex: search, $options: 'i' } } : {};

  const products = await Product.find(query)
    .populate('category')
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(query);

  res.status(200).json(new ApiResponse(200, { products, total }, 'Products fetched successfully'));
});

// Input validation helpers
const validateProductInput = (data) => {
  const { name, description, price, category, clothingType } = data;

  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 3) {
    errors.push("Product name must be at least 3 characters");
  }

  if (!description || typeof description !== "string" || description.trim().length < 10) {
    errors.push("Product description must be at least 10 characters");
  }

  if (!price || Number(price) <= 0) {
    errors.push("Product price must be greater than 0");
  }

  if (!category) {
    errors.push("Category is required");
  }

  if (!clothingType) {
    errors.push("Clothing type is required");
  }

  return errors;
};

const validateImageCount = (mainImage, additionalImages = []) => {
  if (!mainImage) {
    throw new ApiError(400, "Main product image is required");
  }

  if (additionalImages.length > 4) {
    throw new ApiError(400, "Maximum 4 additional images allowed (5 total)");
  }

  return true;
};

const validateImageFiles = (files) => {
  const errors = [];

  // Validate main image
  if (files?.image?.length > 0) {
    const mainFile = files.image[0];
    if (mainFile.size > 5 * 1024 * 1024) {
      errors.push("Main image exceeds 5MB limit");
    }
  }

  // Validate additional images
  if (files?.images?.length > 0) {
    if (files.images.length > 4) {
      errors.push("Maximum 4 additional images allowed");
    }

    files.images.forEach((file, idx) => {
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`Additional image ${idx + 1} exceeds 5MB limit`);
      }
    });
  }

  return errors;
};

// Add Product with validation
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

  // Validate input
  const inputErrors = validateProductInput({
    name,
    description,
    price,
    category,
    clothingType,
  });

  if (inputErrors.length > 0) {
    throw new ApiError(400, inputErrors.join("; "));
  }

  // Validate image files
  const imageErrors = validateImageFiles(req.files);
  if (imageErrors.length > 0) {
    throw new ApiError(400, imageErrors.join("; "));
  }

  // Validate image count
  validateImageCount(req.files?.image?.[0], req.files?.images);

  // Resolve category
  const categoryDoc = await resolveCategory(category);
  if (!categoryDoc) {
    throw new ApiError(404, "Category not found");
  }

  // Build image data
  const { mainImage, additionalImages } = buildUploadedImages(req.files);

  try {
    // Create product
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      mainImage,
      additionalImages,
      brand: brand ? brand.trim() : "ONS",
      price: Number(price),
      category: categoryDoc._id,
      clothingType,
      fabric: fabric ? fabric.trim() : undefined,
      occasion,
      sizes: parseMaybeJson(sizes, []) || [],
      colors: parseMaybeJson(colors, []) || [],
      countInStock: Math.max(0, Number(countInStock) || 0),
      workType,
      neckType,
      sleeveType,
    });

    await product.populate("category", "name color");

    res.status(201).json(
      new ApiResponse(201, product, "Product created successfully")
    );
  } catch (error) {
    // Cleanup uploaded images on failure
    if (req.files?.image?.[0]?.filename) {
      await deleteFromCloudinary(req.files.image[0].filename).catch((e) =>
        console.error("Cleanup failed:", e.message)
      );
    }

    if (req.files?.images?.length > 0) {
      for (const file of req.files.images) {
        await deleteFromCloudinary(file.filename).catch((e) =>
          console.error("Cleanup failed:", e.message)
        );
      }
    }

    throw new ApiError(
      500,
      `Failed to create product: ${error.message || "Unknown error"}`
    );
  }
});

// Update Product with validation
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
    removeImages,
  } = req.body;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  // Fetch existing product
  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  // Validate input if provided
  if (name || description || price || clothingType) {
    const inputErrors = validateProductInput({
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price || existingProduct.price,
      category: category || existingProduct.category,
      clothingType: clothingType || existingProduct.clothingType,
    });

    if (inputErrors.length > 0) {
      throw new ApiError(400, inputErrors.join("; "));
    }
  }

  // Validate image files if provided
  if (req.files && Object.keys(req.files).length > 0) {
    const imageErrors = validateImageFiles(req.files);
    if (imageErrors.length > 0) {
      throw new ApiError(400, imageErrors.join("; "));
    }
  }

  // Resolve category
  const categoryDoc = category
    ? await resolveCategory(category)
    : await Category.findById(existingProduct.category);

  if (category && !categoryDoc) {
    throw new ApiError(404, "Category not found");
  }

  try {
    // Initialize image tracking
    let updatedMainImage = existingProduct.mainImage;
    let updatedAdditionalImages = [...(existingProduct.additionalImages || [])];
    const cleanupQueue = []; // Track images for cleanup

    // Handle image removal
    const removeImageIds = parseMaybeJson(removeImages, []);
    if (Array.isArray(removeImageIds) && removeImageIds.length > 0) {
      for (const publicId of removeImageIds) {
        if (!publicId) continue;

        try {
          cleanupQueue.push(publicId); // Queue for deletion
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.warn(`Failed to delete image ${publicId}:`, error.message);
          // Continue despite failure
        }

        // Remove from product
        if (updatedMainImage?.publicId === publicId) {
          updatedMainImage = null;
        }

        updatedAdditionalImages = updatedAdditionalImages.filter(
          (image) => image.publicId !== publicId
        );
      }
    }

    // Handle main image replacement
    if (req.files?.image?.[0]) {
      if (existingProduct.mainImage?.publicId) {
        try {
          cleanupQueue.push(existingProduct.mainImage.publicId);
          await deleteFromCloudinary(existingProduct.mainImage.publicId);
        } catch (error) {
          console.warn(
            `Failed to delete old main image:`,
            error.message
          );
        }
      }

      updatedMainImage = {
        url: req.files.image[0].path,
        publicId: req.files.image[0].filename,
        originalName: req.files.image[0].originalname,
      };
    }

    // Handle additional images (with limit)
    if (req.files?.images?.length > 0) {
      const totalImages =
        updatedAdditionalImages.length + req.files.images.length;

      if (totalImages > 4) {
        throw new ApiError(
          400,
          `Maximum 4 additional images allowed. Current: ${updatedAdditionalImages.length}, Adding: ${req.files.images.length}`
        );
      }

      updatedAdditionalImages.push(
        ...req.files.images.map((file) => ({
          url: file.path,
          publicId: file.filename,
          originalName: file.originalname,
        }))
      );
    }

    // Update product
    const updateData = {
      name: name ? name.trim() : existingProduct.name,
      description: description
        ? description.trim()
        : existingProduct.description,
      additionalImages: updatedAdditionalImages,
      brand: brand ? brand.trim() : existingProduct.brand,
      price:
        price !== undefined ? Number(price) : existingProduct.price,
      category: categoryDoc?._id || existingProduct.category,
      clothingType: clothingType || existingProduct.clothingType,
      fabric: fabric ? fabric.trim() : existingProduct.fabric,
      occasion: occasion || existingProduct.occasion,
      sizes:
        parseMaybeJson(sizes, existingProduct.sizes) ||
        existingProduct.sizes,
      colors:
        parseMaybeJson(colors, existingProduct.colors) ||
        existingProduct.colors,
      countInStock:
        countInStock !== undefined
          ? Math.max(0, Number(countInStock))
          : existingProduct.countInStock,
      workType: workType || existingProduct.workType,
      neckType: neckType || existingProduct.neckType,
      sleeveType: sleeveType || existingProduct.sleeveType,
    };

    if (req.files?.image?.[0]) {
      updateData.mainImage = updatedMainImage;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category", "name color");

    res.status(200).json(
      new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
  } catch (error) {
    // Clean up newly uploaded images on failure
    if (req.files?.image?.[0]?.filename) {
      await deleteFromCloudinary(req.files.image[0].filename).catch(
        (e) => console.error("Cleanup failed:", e.message)
      );
    }

    if (req.files?.images?.length > 0) {
      for (const file of req.files.images) {
        await deleteFromCloudinary(file.filename).catch((e) =>
          console.error("Cleanup failed:", e.message)
        );
      }
    }

    // Re-throw with context
    if (error.statusCode) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to update product: ${error.message || "Unknown error"}`
    );
  }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const imagesToDelete = [];

  if (product.mainImage?.publicId) {
    imagesToDelete.push(product.mainImage.publicId);
  }

  if (Array.isArray(product.additionalImages)) {
    product.additionalImages.forEach((image) => {
      if (image?.publicId) {
        imagesToDelete.push(image.publicId);
      }
    });
  }

  await Promise.allSettled(
    imagesToDelete.map((publicId) => deleteFromCloudinary(publicId))
  );

  await Product.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

// Get Orders
const getOrders = asyncHandler(async (req, res) => {
  const status = req.query.status || '';
  const search = req.query.search || '';

  const query = {};
  if (status) query.status = status;
  if (search) query.orderNumber = { $regex: search, $options: 'i' };

  const orders = await Order.find(query)
    .populate('user', 'fullName email number')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

// Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  const validStatuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'cancellation_requested',
    'returned',
    'refunded'
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    throw new ApiError(404, 'Order not found');
  }

  const updateData = { status };

  switch (status) {
    case 'confirmed':
      updateData.confirmedAt = new Date();
      break;
    case 'shipped':
      updateData.shippedAt = new Date();
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      break;
    case 'delivered':
      updateData.deliveredAt = new Date();
      break;
    case 'cancelled':
      updateData.cancelledAt = new Date();
      break;
  }

  // Stock Restoration Logic: If order is transitioning to cancelled or returned for the first time
  const isNowCancelledOrReturned = status === 'cancelled' || status === 'returned';
  const wasNotCancelledOrReturned = existingOrder.status !== 'cancelled' && existingOrder.status !== 'returned';

  if (isNowCancelledOrReturned && wasNotCancelledOrReturned) {
    for (const item of existingOrder.items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
          if (sizeIndex !== -1) {
            product.sizes[sizeIndex].stock += item.quantity;
            product.countInStock = product.sizes.reduce(
              (total, size) => total + size.stock,
              0
            );
            await product.save();
          }
        }
      }
    }
  }

  const order = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('user', 'fullName email number')
    .populate('items.product', 'name mainImage clothingType');

  // Trigger email notification asynchronously
  sendOrderStatusEmail(order, status).catch((err) =>
    console.error(`Failed to send order status email for order ${id}:`, err)
  );

  res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
});

// Get Users
const getUsers = asyncHandler(async (req, res) => {
  const search = req.query.search || '';

  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const users = await User.find(query)
    .select('-password')
    .lean();

  // Add order count for each user
  const usersWithOrders = await Promise.all(
    users.map(async (user) => {
      const ordersCount = await Order.countDocuments({ user: user._id });
      return { ...user, ordersCount };
    })
  );

  res.status(200).json(new ApiResponse(200, usersWithOrders, 'Users fetched successfully'));
});

// Get Categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();

  // Add product count for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const productsCount = await Product.countDocuments({ category: category._id });
      return { ...category, productsCount };
    })
  );

  res.status(200).json(new ApiResponse(200, categoriesWithCount, 'Categories fetched successfully'));
});

// Add Category
const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, 'Category already exists');
  }

  const category = await Category.create({ name });

  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});

// Get Sales Report
const getSalesReport = asyncHandler(async (req, res) => {
  const { type = 'monthly', startDate, endDate } = req.query;

  // Build date range query
  let dateFilter = {};
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  if (startDate && endDate) {
    dateFilter = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  } else {
    dateFilter = { $gte: oneYearAgo };
  }

  // Get completed orders for revenue calculation
  const orders = await Order.find({
    status: { $in: ['confirmed', 'completed'] },
    createdAt: dateFilter
  }).lean();

  // Calculate report data based on type
  let groupedData = {};
  
  orders.forEach(order => {
    let key;
    const date = new Date(order.createdAt);
    
    if (type === 'daily') {
      key = date.toISOString().split('T')[0];
    } else if (type === 'weekly') {
      const weekNumber = Math.ceil((date.getDate()) / 7);
      key = `Week ${weekNumber} - ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } else if (type === 'yearly') {
      key = date.getFullYear().toString();
    } else { // monthly
      key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    if (!groupedData[key]) {
      groupedData[key] = {
        period: key,
        revenue: 0,
        orders: 0,
        avgOrderValue: 0,
        growth: 0
      };
    }

    groupedData[key].revenue += order.totalAmount;
    groupedData[key].orders += 1;
  });

  // Calculate average order value
  Object.keys(groupedData).forEach(key => {
    groupedData[key].avgOrderValue = Math.round(groupedData[key].revenue / groupedData[key].orders);
  });

  // Get top products
  const topProducts = await OrderItem.aggregate([
    {
      $match: { createdAt: dateFilter }
    },
    {
      $group: {
        _id: '$product',
        quantity: { $sum: '$quantity' },
        totalSales: { $sum: { $multiply: ['$price', '$quantity'] } }
      }
    },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo'
      }
    }
  ]);

  const formattedTopProducts = topProducts.map(item => ({
    name: item.productInfo[0]?.name || 'Unknown Product',
    quantity: item.quantity,
    totalSales: item.totalSales,
    contribution: Math.round((item.totalSales / Object.values(groupedData).reduce((sum, d) => sum + d.revenue, 0)) * 100) || 0
  }));

  const report = {
    totalRevenue: Object.values(groupedData).reduce((sum, d) => sum + d.revenue, 0),
    totalOrders: orders.length,
    avgOrderValue: orders.length > 0 ? Math.round(Object.values(groupedData).reduce((sum, d) => sum + d.revenue, 0) / orders.length) : 0,
    conversionRate: 2.5, // Placeholder - calculate based on your metrics
    data: Object.values(groupedData),
    topProducts: formattedTopProducts
  };

  res.status(200).json(new ApiResponse(200, report, 'Sales report fetched successfully'));
});

const getProductAnalytics = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const product = await Product.findById(id).populate('category', 'name');
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const orderItems = await OrderItem.find({ product: id }).lean();
  const totalSold = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalRevenue = orderItems.reduce(
    (sum, item) => sum + ((item.price || 0) * (item.quantity || 0)),
    0
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product: {
          _id: product._id,
          name: product.name,
          category: product.category?.name || 'Unknown',
          price: product.price,
          countInStock: product.countInStock,
        },
        totalSold,
        totalRevenue,
        averageOrderValue: totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0,
      },
      'Product analytics fetched successfully'
    )
  );
});

export {
  getDashboardStats,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getUsers,
  getCategories,
  addCategory,
  deleteCategory,
  getSalesReport,
  getProductAnalytics,
};
