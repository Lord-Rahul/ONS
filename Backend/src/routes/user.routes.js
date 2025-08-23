import { Router } from "express";
import { registerUser } from "../Controllers/user.controller.js";

const router = Router();

//register user
router.route("/register").post(registerUser);

export default router;
