import { Router } from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  requestCancellation
} from "../Controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes
router.use(verifyJWT);

// ✅ ADD the /place route that frontend is calling
router.route("/place").post(placeOrder);

// Keep existing routes
router.route("/").post(placeOrder); // Keep this for backwards compatibility
router.route("/").get(getUserOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(updateOrderStatus);
router.route("/:id/cancel").post(requestCancellation);

export default router;
