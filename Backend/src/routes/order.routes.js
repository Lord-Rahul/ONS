import { Router } from "express";
import { placeOrder } from "../Controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/place").post(placeOrder);

export default router;
