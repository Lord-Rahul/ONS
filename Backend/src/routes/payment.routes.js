import { Router } from "express";
import {
  initiatePayment,
  handlePaymentCallback,
  getPaymentStatus,
} from "../Controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/initiate/:orderId").post(verifyJWT, initiatePayment);
router.route("/callback").post(handlePaymentCallback);
router.route("/status/:orderId").get(verifyJWT, getPaymentStatus);

export default router;
