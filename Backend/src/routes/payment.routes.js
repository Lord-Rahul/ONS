import { Router } from "express";
import {
  initiatePayment,
  handlePaymentCallback,
  getPaymentStatus,
} from "../Controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { paymentLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/initiate/:orderId").post(verifyJWT, paymentLimiter, initiatePayment);
router.route("/callback").post(paymentLimiter, handlePaymentCallback);
router.route("/status/:orderId").get(verifyJWT, getPaymentStatus);

export default router;
