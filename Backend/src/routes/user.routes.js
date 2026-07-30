import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  update,
} from "../Controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter, passwordLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Register and login with strict rate limiting
router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changepassword").post(verifyJWT, passwordLimiter, changeUserPassword);
router.route("/update").patch(verifyJWT, update);

export default router;
