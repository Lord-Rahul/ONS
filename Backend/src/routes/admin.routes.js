import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyAdmin } from '../middlewares/admin.middleware.js';
import { uploadProductImages as uploadProductImagesMiddleware } from '../middlewares/upload.middleware.js';
import {
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
} from '../Controllers/admin.controller.js';

const router = express.Router();

// All admin routes require auth and admin status
router.use(verifyJWT, verifyAdmin);

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Products Management
router.get('/products', getProducts);
router.post('/products', uploadProductImagesMiddleware, addProduct);
router.put('/products/:id', uploadProductImagesMiddleware, updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders Management
router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Users Management
router.get('/users', getUsers);

// Categories Management
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.delete('/categories/:id', deleteCategory);

// Reports
router.get('/reports/sales', getSalesReport);
router.get('/analytics/products/:id', getProductAnalytics);

export default router;
