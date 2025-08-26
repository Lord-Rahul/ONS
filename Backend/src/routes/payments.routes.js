import { Router } from "express";
import { 
  initiatePayment, 
  verifyPayment, 
  getPaymentStatus 
} from "../Controllers/payments.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/initiate/:orderId").post(verifyJWT, initiatePayment);
router.route("/verify").post(verifyJWT, verifyPayment);
router.route("/status/:orderId").get(verifyJWT, getPaymentStatus);

export default router;