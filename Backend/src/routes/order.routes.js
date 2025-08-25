import { Router } from "express";
import { getUserOrders, placeOrder } from "../Controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/place").post(placeOrder);
router.route("/").get(getUserOrders);

export default router;
