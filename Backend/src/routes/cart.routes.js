import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateCartItem,clearCart } from "../Controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart);
router.route("/add").post(addToCart);
router.route("/item/:itemId").put(updateCartItem);
router.route("/item/:itemId").delete(removeFromCart);
router.route("/clear").delete(clearCart);

export default router;
