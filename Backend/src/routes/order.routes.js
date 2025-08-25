import { Router } from "express";
import {
  getOrderById,
  getUserOrders,
  placeOrder,
} from "../Controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/place").post(placeOrder);
router.route("/").get(getUserOrders);
router.route("/:id").get(getOrderById);

export default router;
