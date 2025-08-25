import { Router } from "express";
import {
  getOrderById,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../Controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/place").post(placeOrder);
router.route("/").get(getUserOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(verifyAdmin,updateOrderStatus)

export default router;
