import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
} from "../Controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);

router.route("/:id").delete(verifyJWT, verifyAdmin, deleteCategory);
router.post("/", verifyJWT, verifyAdmin, uploadSingle, addCategory);
router.put("/:id", verifyJWT, verifyAdmin, uploadSingle, updateCategory);

export default router;
