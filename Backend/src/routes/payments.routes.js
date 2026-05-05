import { Router } from "express";
import { 
  initiatePayment, 
  verifyPayment, 
  getPaymentStatus 
} from "../Controllers/payments.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { paymentLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/initiate/:orderId").post(verifyJWT, paymentLimiter, initiatePayment);
router.route("/verify").post(verifyJWT, paymentLimiter, verifyPayment);
router.route("/status/:orderId").get(verifyJWT, getPaymentStatus);

export default router;