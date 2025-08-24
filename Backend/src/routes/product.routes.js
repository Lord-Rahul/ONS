import { addProduct } from "../Controllers/product.controller.js";
import { Router } from "express";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addproduct").post(verifyJWT, verifyAdmin, addProduct);

export default router;
