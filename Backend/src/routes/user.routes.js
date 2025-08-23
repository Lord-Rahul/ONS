import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  changeUserPassword,
  update,
} from "../Controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//register user
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changepassword").post(verifyJWT, changeUserPassword);
router.route("/update").patch(verifyJWT,update)



export default router;
