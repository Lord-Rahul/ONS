import { Router } from "express";
import { registerUser,loginUser } from "../Controllers/user.controller.js";

const router = Router();

//register user
router.route("/register").post(registerUser);
router.route('/login').post(loginUser)

export default router;
