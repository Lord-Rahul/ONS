import { Router } from "express";
import { getCart } from "../Controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart);

export default router;
