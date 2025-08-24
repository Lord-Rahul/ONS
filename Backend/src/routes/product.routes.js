import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProoductById,
  updateProduct,
} from "../Controllers/product.controller.js";
import { Router } from "express";
import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/addproduct")
  .post(verifyJWT, verifyAdmin, uploadProductImages, addProduct);
router.route("/").get(getAllProducts);
router.route("/:id").get(getProoductById);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteProduct);
router
  .route("/:id")
  .put(verifyJWT, verifyAdmin, uploadProductImages, updateProduct);

export default router;
